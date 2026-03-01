import { SpotifyTrack, AudioFeatures, SpotifyUser } from "./types";

const BASE = "https://api.spotify.com/v1";

async function spotifyFetch<T>(
  path: string,
  accessToken: string,
  options?: RequestInit
): Promise<T> {
  const res = await fetch(`${BASE}${path}`, {
    ...options,
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
      ...options?.headers,
    },
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Spotify API error ${res.status}: ${err}`);
  }

  return res.json() as Promise<T>;
}

export async function getMe(accessToken: string): Promise<SpotifyUser> {
  return spotifyFetch<SpotifyUser>("/me", accessToken);
}

export async function getAvailableGenreSeeds(
  accessToken: string
): Promise<string[]> {
  const data = await spotifyFetch<{ genres: string[] }>(
    "/recommendations/available-genre-seeds",
    accessToken
  );
  return data.genres;
}

export interface RecommendationParams {
  seedGenres: string[];
  market?: string;
  targetTempo?: number;
  minTempo?: number;
  maxTempo?: number;
  minDanceability?: number;
  limit?: number;
}

export async function getRecommendations(
  accessToken: string,
  params: RecommendationParams
): Promise<SpotifyTrack[]> {
  const qs = new URLSearchParams();

  // Spotify allows max 5 seed genres
  const seeds = params.seedGenres.slice(0, 5);
  qs.set("seed_genres", seeds.join(","));
  qs.set("limit", String(params.limit ?? 50));

  if (params.market) qs.set("market", params.market);
  if (params.targetTempo != null)
    qs.set("target_tempo", String(Math.round(params.targetTempo)));
  if (params.minTempo != null)
    qs.set("min_tempo", String(Math.round(params.minTempo)));
  if (params.maxTempo != null)
    qs.set("max_tempo", String(Math.round(params.maxTempo)));
  if (params.minDanceability != null)
    qs.set("min_danceability", String(params.minDanceability));

  const data = await spotifyFetch<{ tracks: SpotifyTrack[] }>(
    `/recommendations?${qs}`,
    accessToken
  );
  return data.tracks;
}

export async function getAudioFeatures(
  accessToken: string,
  trackIds: string[]
): Promise<AudioFeatures[]> {
  if (trackIds.length === 0) return [];

  // API allows max 100 ids per request
  const chunks: string[][] = [];
  for (let i = 0; i < trackIds.length; i += 100) {
    chunks.push(trackIds.slice(i, i + 100));
  }

  const results: AudioFeatures[] = [];
  for (const chunk of chunks) {
    const data = await spotifyFetch<{ audio_features: (AudioFeatures | null)[] }>(
      `/audio-features?ids=${chunk.join(",")}`,
      accessToken
    );
    results.push(...data.audio_features.filter(Boolean) as AudioFeatures[]);
  }
  return results;
}

export async function createPlaylist(
  accessToken: string,
  userId: string,
  name: string,
  description: string,
  isPublic: boolean
): Promise<{ id: string; external_urls: { spotify: string } }> {
  return spotifyFetch(`/users/${userId}/playlists`, accessToken, {
    method: "POST",
    body: JSON.stringify({ name, description, public: isPublic }),
  });
}

export async function addTracksToPlaylist(
  accessToken: string,
  playlistId: string,
  trackUris: string[]
): Promise<void> {
  // Spotify allows max 100 tracks per request
  for (let i = 0; i < trackUris.length; i += 100) {
    await spotifyFetch(`/playlists/${playlistId}/tracks`, accessToken, {
      method: "POST",
      body: JSON.stringify({ uris: trackUris.slice(i, i + 100) }),
    });
  }
}
