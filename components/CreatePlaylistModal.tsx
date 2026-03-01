"use client";

import { useState } from "react";
import { TrackWithFeatures } from "@/lib/types";

interface CreatePlaylistModalProps {
  tracks: TrackWithFeatures[];
  onClose: () => void;
  onSuccess: (spotifyUrl: string) => void;
}

export default function CreatePlaylistModal({
  tracks,
  onClose,
  onSuccess,
}: CreatePlaylistModalProps) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [isPublic, setIsPublic] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim() || submitting) return;

    setSubmitting(true);
    setError("");

    try {
      const res = await fetch("/api/spotify/playlists", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          description,
          isPublic,
          trackUris: tracks.map((t) => `spotify:track:${t.id}`),
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Failed to create playlist");
      onSuccess(data.spotifyUrl);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div
      className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="bg-gray-900 rounded-2xl p-6 w-full max-w-md shadow-2xl border border-gray-800">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-white text-xl font-bold">Create Playlist</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white text-2xl leading-none"
            aria-label="Close"
          >
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {/* Name */}
          <div className="flex flex-col gap-1">
            <label className="text-gray-400 text-sm font-medium">
              Name <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value.slice(0, 100))}
              placeholder="My Playlist"
              required
              className="bg-gray-800 text-white rounded-lg px-3 py-2 text-sm border border-gray-700 focus:outline-none focus:border-[#1DB954]"
            />
            <span className="text-gray-600 text-xs text-right">
              {name.length}/100
            </span>
          </div>

          {/* Description */}
          <div className="flex flex-col gap-1">
            <label className="text-gray-400 text-sm font-medium">
              Description
            </label>
            <textarea
              value={description}
              onChange={(e) =>
                setDescription(e.target.value.slice(0, 300))
              }
              placeholder="Add an optional description…"
              rows={3}
              className="bg-gray-800 text-white rounded-lg px-3 py-2 text-sm border border-gray-700 focus:outline-none focus:border-[#1DB954] resize-none"
            />
            <span className="text-gray-600 text-xs text-right">
              {description.length}/300
            </span>
          </div>

          {/* Visibility */}
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-300 text-sm font-medium">
                {isPublic ? "Public" : "Private"}
              </p>
              <p className="text-gray-600 text-xs">
                {isPublic
                  ? "Anyone can find this playlist"
                  : "Only you can see this playlist"}
              </p>
            </div>
            <button
              type="button"
              role="switch"
              aria-checked={isPublic}
              onClick={() => setIsPublic((p) => !p)}
              className={`relative w-12 h-6 rounded-full transition-colors ${
                isPublic ? "bg-[#1DB954]" : "bg-gray-600"
              }`}
            >
              <span
                className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full shadow transition-transform ${
                  isPublic ? "translate-x-6" : ""
                }`}
              />
            </button>
          </div>

          {/* Track count summary */}
          <p className="text-gray-500 text-sm">
            {tracks.length} track{tracks.length !== 1 ? "s" : ""} will be added
          </p>

          {/* Error */}
          {error && (
            <p className="text-red-400 text-sm bg-red-400/10 rounded-lg px-3 py-2">
              {error}
            </p>
          )}

          {/* Submit */}
          <button
            type="submit"
            disabled={!name.trim() || submitting}
            className="bg-[#1DB954] hover:bg-[#1ed760] disabled:opacity-50 disabled:cursor-not-allowed text-black font-bold py-3 rounded-full transition-colors"
          >
            {submitting ? "Creating…" : "Create Playlist"}
          </button>
        </form>
      </div>
    </div>
  );
}
