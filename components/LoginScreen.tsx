"use client";

import { signIn } from "next-auth/react";

export default function LoginScreen() {
  return (
    <main className="min-h-screen bg-gray-950 flex items-center justify-center p-6">
      <div className="flex flex-col items-center gap-8 text-center max-w-md">
        {/* Spotify icon */}
        <div className="flex flex-col items-center gap-4">
          <svg viewBox="0 0 24 24" className="w-20 h-20 fill-[#1DB954]">
            <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z" />
          </svg>
          <div>
            <h1 className="text-3xl font-bold text-white">Playlist Builder</h1>
            <p className="text-gray-400 mt-2">
              Create Spotify playlists by language, tempo, danceability &amp;
              genre
            </p>
          </div>
        </div>

        {/* Features */}
        <ul className="text-left space-y-3 text-gray-400 text-sm w-full">
          {[
            "🌍 Filter songs by spoken language (15+ languages)",
            "🥁 Set a target tempo range (BPM)",
            "💃 Control minimum danceability",
            "🎸 Multi-select genre seeds",
            "🎵 Preview tracks before saving",
            "✅ Save directly to your Spotify account",
          ].map((f) => (
            <li key={f} className="flex items-start gap-2">
              <span>{f}</span>
            </li>
          ))}
        </ul>

        {/* CTA */}
        <button
          onClick={() => signIn("spotify")}
          className="flex items-center gap-3 bg-[#1DB954] hover:bg-[#1ed760] text-black font-bold px-8 py-4 rounded-full text-lg transition-colors shadow-lg shadow-[#1DB954]/20"
        >
          <svg viewBox="0 0 24 24" className="w-6 h-6 fill-black">
            <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z" />
          </svg>
          Login with Spotify
        </button>

        <p className="text-gray-600 text-xs">
          This app requests permission to read your profile and create playlists.
          No data is stored beyond your session.
        </p>
      </div>
    </main>
  );
}
