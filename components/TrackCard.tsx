"use client";

import Image from "next/image";
import { TrackWithFeatures } from "@/lib/types";
import AudioPreview from "./AudioPreview";

interface TrackCardProps {
  track: TrackWithFeatures;
  onRemove: () => void;
}

export default function TrackCard({ track, onRemove }: TrackCardProps) {
  const albumArt = track.album.images[2]?.url ?? track.album.images[0]?.url;
  const artists = track.artists.map((a) => a.name).join(", ");
  const bpm = Math.round(track.features.tempo);
  const danceability = Math.round(track.features.danceability * 100);

  return (
    <div className="flex items-center gap-4 bg-gray-900 hover:bg-gray-800 rounded-xl p-3 transition-colors group">
      {/* Album art */}
      <div className="relative w-14 h-14 shrink-0 rounded-lg overflow-hidden bg-gray-800">
        {albumArt ? (
          <Image src={albumArt} alt={track.album.name} fill className="object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-600">
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z" />
            </svg>
          </div>
        )}
      </div>

      {/* Track info */}
      <div className="flex-1 min-w-0">
        <a
          href={track.external_urls.spotify}
          target="_blank"
          rel="noopener noreferrer"
          className="text-white font-medium text-sm truncate block hover:underline"
        >
          {track.name}
        </a>
        <p className="text-gray-400 text-xs truncate">{artists}</p>
        <p className="text-gray-600 text-xs truncate">{track.album.name}</p>
      </div>

      {/* Stats */}
      <div className="flex flex-col items-end gap-1 shrink-0 text-xs">
        <span className="bg-gray-700 text-gray-300 px-2 py-0.5 rounded-full">
          {bpm} BPM
        </span>
        <span className="bg-gray-700 text-gray-300 px-2 py-0.5 rounded-full">
          💃 {danceability}%
        </span>
      </div>

      {/* Preview + remove */}
      <div className="flex flex-col items-end gap-2 shrink-0 w-28">
        {track.preview_url ? (
          <AudioPreview previewUrl={track.preview_url} />
        ) : (
          <span className="text-gray-600 text-xs">No preview</span>
        )}
        <button
          onClick={onRemove}
          className="text-gray-600 hover:text-red-400 text-xs opacity-0 group-hover:opacity-100 transition-opacity"
          aria-label="Remove track"
        >
          Remove
        </button>
      </div>
    </div>
  );
}
