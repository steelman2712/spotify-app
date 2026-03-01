"use client";

import { TrackWithFeatures } from "@/lib/types";
import TrackCard from "./TrackCard";

interface TrackListProps {
  tracks: TrackWithFeatures[];
  loading: boolean;
  onRemove: (id: string) => void;
  onFindTracks: () => void;
  onCreatePlaylist: () => void;
}

function SkeletonCard() {
  return (
    <div className="flex items-center gap-4 bg-gray-900 rounded-xl p-3 animate-pulse">
      <div className="w-14 h-14 bg-gray-700 rounded-lg shrink-0" />
      <div className="flex-1 flex flex-col gap-2">
        <div className="h-3 bg-gray-700 rounded w-3/4" />
        <div className="h-3 bg-gray-700 rounded w-1/2" />
        <div className="h-3 bg-gray-700 rounded w-1/3" />
      </div>
      <div className="flex flex-col gap-1 shrink-0">
        <div className="h-5 w-16 bg-gray-700 rounded-full" />
        <div className="h-5 w-16 bg-gray-700 rounded-full" />
      </div>
    </div>
  );
}

export default function TrackList({
  tracks,
  loading,
  onRemove,
  onFindTracks,
  onCreatePlaylist,
}: TrackListProps) {
  return (
    <div className="flex-1 flex flex-col gap-4 min-w-0">
      {/* Actions bar */}
      <div className="flex items-center justify-between">
        <h2 className="text-white font-semibold text-lg">
          Tracks{" "}
          {tracks.length > 0 && (
            <span className="text-gray-400 font-normal text-base">
              ({tracks.length})
            </span>
          )}
        </h2>
        <div className="flex gap-3">
          <button
            onClick={onFindTracks}
            disabled={loading}
            className="bg-[#1DB954] hover:bg-[#1ed760] disabled:opacity-60 text-black font-semibold px-5 py-2 rounded-full transition-colors text-sm"
          >
            {loading ? "Searching…" : "Find Tracks"}
          </button>
          <button
            onClick={onCreatePlaylist}
            disabled={tracks.length === 0 || loading}
            className="border border-[#1DB954] text-[#1DB954] hover:bg-[#1DB954]/10 disabled:opacity-40 disabled:cursor-not-allowed font-semibold px-5 py-2 rounded-full transition-colors text-sm"
          >
            Create Playlist
          </button>
        </div>
      </div>

      {/* Track items */}
      {loading ? (
        <div className="flex flex-col gap-2">
          {Array.from({ length: 8 }).map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      ) : tracks.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <div className="text-5xl mb-4">🎵</div>
          <p className="text-gray-400 text-lg font-medium">No tracks yet</p>
          <p className="text-gray-600 text-sm mt-2 max-w-xs">
            Set your filters and click{" "}
            <span className="text-[#1DB954]">Find Tracks</span> to discover
            matching songs. Try broadening your BPM range or lowering the
            minimum danceability if results are empty.
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-2">
          {tracks.map((track) => (
            <TrackCard
              key={track.id}
              track={track}
              onRemove={() => onRemove(track.id)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
