import { useState } from "react";
import { FilterState, TrackWithFeatures } from "@/lib/types";

export function useSpotifyTracks() {
  const [tracks, setTracks] = useState<TrackWithFeatures[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function fetchTracks(filters: FilterState) {
    setLoading(true);
    setError(null);

    const qs = new URLSearchParams({
      language: filters.language,
      tempoMin: String(filters.tempoMin),
      tempoMax: String(filters.tempoMax),
      danceabilityMin: String(filters.danceabilityMin),
      genres: filters.genres.join(","),
    });

    try {
      const res = await fetch(`/api/spotify/recommendations?${qs}`);
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Failed to fetch tracks");
      setTracks(data.tracks as TrackWithFeatures[]);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
      setTracks([]);
    } finally {
      setLoading(false);
    }
  }

  function removeTrack(id: string) {
    setTracks((prev) => prev.filter((t) => t.id !== id));
  }

  return { tracks, loading, error, fetchTracks, removeTrack, setTracks };
}
