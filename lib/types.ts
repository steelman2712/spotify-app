export interface SpotifyTrack {
  id: string;
  name: string;
  artists: { id: string; name: string }[];
  album: {
    id: string;
    name: string;
    images: { url: string; width: number; height: number }[];
  };
  preview_url: string | null;
  external_urls: { spotify: string };
  duration_ms: number;
}

export interface AudioFeatures {
  id: string;
  tempo: number;
  danceability: number;
  energy: number;
  valence: number;
  key: number;
  mode: number;
}

export interface TrackWithFeatures extends SpotifyTrack {
  features: AudioFeatures;
}

export interface FilterState {
  language: string;
  tempoMin: number;
  tempoMax: number;
  danceabilityMin: number;
  genres: string[];
}

export interface Preset {
  name: string;
  filters: FilterState;
}

export interface SpotifyUser {
  id: string;
  display_name: string;
  email: string;
  images: { url: string }[];
}

export interface SpotifyPlaylist {
  id: string;
  name: string;
  external_urls: { spotify: string };
}
