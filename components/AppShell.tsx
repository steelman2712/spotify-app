"use client";

import { useEffect, useState } from "react";
import { Session } from "next-auth";
import { FilterState } from "@/lib/types";
import FilterPanel from "./FilterPanel";
import TrackList from "./TrackList";
import CreatePlaylistModal from "./CreatePlaylistModal";
import PresetsPanel from "./PresetsPanel";
import { useFilters } from "@/hooks/useFilters";
import { useSpotifyTracks } from "@/hooks/useSpotifyTracks";

interface AppShellProps {
  session: Session;
}

export default function AppShell({ session }: AppShellProps) {
  const { filters, setFilters } = useFilters();
  const { tracks, loading, error, fetchTracks, removeTrack } = useSpotifyTracks();
  const [availableGenres, setAvailableGenres] = useState<string[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [successUrl, setSuccessUrl] = useState<string | null>(null);

  // Load genre seeds once on mount
  useEffect(() => {
    fetch("/api/spotify/genre-seeds")
      .then((r) => r.json())
      .then((d) => {
        if (d.genres) setAvailableGenres(d.genres);
      })
      .catch(() => {});
  }, []);

  // Dismiss success banner when filters change
  useEffect(() => {
    setSuccessUrl(null);
  }, [filters]);

  function handleSuccess(url: string) {
    setShowModal(false);
    setSuccessUrl(url);
  }

  function handleLoadPreset(f: FilterState) {
    setFilters(f);
    setSuccessUrl(null);
  }

  return (
    <main className="min-h-screen bg-gray-950 p-6">
      <div className="max-w-6xl mx-auto flex flex-col gap-6">
        {/* Welcome bar */}
        <div className="bg-gradient-to-r from-[#1DB954]/20 to-transparent border border-[#1DB954]/20 rounded-xl px-5 py-3 flex items-center justify-between">
          <p className="text-gray-300 text-sm">
            Welcome back,{" "}
            <span className="text-white font-semibold">{session.user?.name}</span>!
            Configure your filters and find your perfect playlist.
          </p>
        </div>

        {/* Success banner */}
        {successUrl && (
          <div className="bg-[#1DB954]/10 border border-[#1DB954]/30 rounded-xl px-5 py-3 flex items-center justify-between">
            <p className="text-[#1DB954] text-sm font-medium">
              🎉 Playlist created successfully!
            </p>
            <a
              href={successUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-[#1DB954] hover:bg-[#1ed760] text-black font-semibold text-sm px-4 py-1.5 rounded-full transition-colors"
            >
              Open in Spotify
            </a>
          </div>
        )}

        {/* Error banner */}
        {error && (
          <div className="bg-red-500/10 border border-red-500/30 rounded-xl px-5 py-3">
            <p className="text-red-400 text-sm">{error}</p>
          </div>
        )}

        {/* Main layout */}
        <div className="flex gap-6 items-start">
          {/* Left: filters + presets */}
          <div className="flex flex-col gap-4 w-80 shrink-0">
            <FilterPanel
              filters={filters}
              onChange={setFilters}
              availableGenres={availableGenres}
            />
            <PresetsPanel
              currentFilters={filters}
              onLoad={handleLoadPreset}
            />
          </div>

          {/* Right: track list */}
          <TrackList
            tracks={tracks}
            loading={loading}
            onRemove={removeTrack}
            onFindTracks={() => fetchTracks(filters)}
            onCreatePlaylist={() => setShowModal(true)}
          />
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <CreatePlaylistModal
          tracks={tracks}
          onClose={() => setShowModal(false)}
          onSuccess={handleSuccess}
        />
      )}
    </main>
  );
}
