"use client";

import { useEffect, useState } from "react";
import { LANGUAGES } from "@/lib/languageMap";
import { FilterState } from "@/lib/types";

interface FilterPanelProps {
  filters: FilterState;
  onChange: (f: FilterState) => void;
  availableGenres: string[];
}

function danceabilityLabel(v: number): string {
  if (v < 0.34) return "Low";
  if (v < 0.67) return "Medium";
  return "High";
}

export default function FilterPanel({
  filters,
  onChange,
  availableGenres,
}: FilterPanelProps) {
  const [genreSearch, setGenreSearch] = useState("");
  const [genreOpen, setGenreOpen] = useState(false);

  // Suggested genres for the selected language
  const langConfig = LANGUAGES.find((l) => l.code === filters.language);
  const suggestedGenres = langConfig?.genreSeeds ?? [];

  const filteredGenres = availableGenres.filter((g) =>
    g.toLowerCase().includes(genreSearch.toLowerCase())
  );

  function toggleGenre(genre: string) {
    const current = filters.genres;
    if (current.includes(genre)) {
      onChange({ ...filters, genres: current.filter((g) => g !== genre) });
    } else if (current.length < 5) {
      onChange({ ...filters, genres: [...current, genre] });
    }
  }

  // Close genre dropdown when clicking outside
  useEffect(() => {
    function handler(e: MouseEvent) {
      const target = e.target as HTMLElement;
      if (!target.closest("#genre-dropdown")) setGenreOpen(false);
    }
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <aside className="w-80 shrink-0 bg-gray-900 rounded-xl p-6 flex flex-col gap-6 self-start sticky top-6">
      <h2 className="text-white font-semibold text-lg">Filters</h2>

      {/* Language */}
      <div className="flex flex-col gap-2">
        <label className="text-gray-400 text-sm font-medium">Language</label>
        <select
          value={filters.language}
          onChange={(e) =>
            onChange({ ...filters, language: e.target.value, genres: [] })
          }
          className="bg-gray-800 text-white rounded-lg px-3 py-2 text-sm border border-gray-700 focus:outline-none focus:border-[#1DB954]"
        >
          {LANGUAGES.map((l) => (
            <option key={l.code} value={l.code}>
              {l.label}
            </option>
          ))}
        </select>
        <p className="text-gray-500 text-xs">
          Language matching is best-effort via genre &amp; market targeting.
        </p>
      </div>

      {/* Tempo */}
      <div className="flex flex-col gap-3">
        <label className="text-gray-400 text-sm font-medium">
          Tempo (BPM)
          <span className="text-white ml-2 font-semibold">
            {filters.tempoMin}–{filters.tempoMax}
          </span>
        </label>
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-3">
            <span className="text-gray-500 text-xs w-7">Min</span>
            <input
              type="range"
              min={40}
              max={filters.tempoMax - 1}
              value={filters.tempoMin}
              onChange={(e) =>
                onChange({ ...filters, tempoMin: Number(e.target.value) })
              }
              className="flex-1 accent-[#1DB954]"
            />
            <span className="text-gray-300 text-xs w-8 text-right">
              {filters.tempoMin}
            </span>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-gray-500 text-xs w-7">Max</span>
            <input
              type="range"
              min={filters.tempoMin + 1}
              max={200}
              value={filters.tempoMax}
              onChange={(e) =>
                onChange({ ...filters, tempoMax: Number(e.target.value) })
              }
              className="flex-1 accent-[#1DB954]"
            />
            <span className="text-gray-300 text-xs w-8 text-right">
              {filters.tempoMax}
            </span>
          </div>
        </div>
      </div>

      {/* Danceability */}
      <div className="flex flex-col gap-2">
        <label className="text-gray-400 text-sm font-medium">
          Min Danceability
          <span className="text-white ml-2 font-semibold">
            {Math.round(filters.danceabilityMin * 100)}%{" "}
            <span className="text-gray-400 font-normal">
              ({danceabilityLabel(filters.danceabilityMin)})
            </span>
          </span>
        </label>
        <input
          type="range"
          min={0}
          max={100}
          value={Math.round(filters.danceabilityMin * 100)}
          onChange={(e) =>
            onChange({
              ...filters,
              danceabilityMin: Number(e.target.value) / 100,
            })
          }
          className="accent-[#1DB954]"
        />
        <div className="flex justify-between text-gray-600 text-xs">
          <span>0% Low</span>
          <span>100% High</span>
        </div>
      </div>

      {/* Genre */}
      <div className="flex flex-col gap-2" id="genre-dropdown">
        <label className="text-gray-400 text-sm font-medium">
          Genres{" "}
          <span className="text-gray-500 font-normal">
            ({filters.genres.length}/5 selected)
          </span>
        </label>

        {/* Selected genre chips */}
        {filters.genres.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {filters.genres.map((g) => (
              <button
                key={g}
                onClick={() => toggleGenre(g)}
                className="text-xs bg-[#1DB954] text-black px-2 py-0.5 rounded-full hover:bg-[#1ed760] flex items-center gap-1"
              >
                {g}
                <span className="text-black/60">×</span>
              </button>
            ))}
          </div>
        )}

        {/* Dropdown trigger */}
        <button
          onClick={() => setGenreOpen((o) => !o)}
          disabled={filters.genres.length >= 5}
          className="bg-gray-800 text-gray-300 rounded-lg px-3 py-2 text-sm border border-gray-700 text-left hover:border-gray-500 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {filters.genres.length >= 5
            ? "Max 5 genres selected"
            : "Add a genre…"}
        </button>

        {genreOpen && (
          <div className="bg-gray-800 border border-gray-700 rounded-lg p-2 flex flex-col gap-1 max-h-56 overflow-y-auto">
            <input
              autoFocus
              placeholder="Search genres…"
              value={genreSearch}
              onChange={(e) => setGenreSearch(e.target.value)}
              className="bg-gray-900 text-white text-sm rounded px-2 py-1 mb-1 border border-gray-700 focus:outline-none focus:border-[#1DB954]"
            />
            {filteredGenres.length === 0 && (
              <p className="text-gray-500 text-xs px-1">No genres found</p>
            )}
            {filteredGenres.map((g) => {
              const selected = filters.genres.includes(g);
              const suggested = suggestedGenres.includes(g);
              return (
                <button
                  key={g}
                  onClick={() => toggleGenre(g)}
                  className={`text-left text-sm px-2 py-1 rounded flex items-center justify-between gap-2 ${
                    selected
                      ? "bg-[#1DB954]/20 text-[#1DB954]"
                      : "text-gray-300 hover:bg-gray-700"
                  }`}
                >
                  <span>{g}</span>
                  <span className="flex gap-1 shrink-0">
                    {suggested && (
                      <span className="text-xs bg-[#1DB954]/10 text-[#1DB954] px-1 rounded">
                        suggested
                      </span>
                    )}
                    {selected && <span className="text-[#1DB954]">✓</span>}
                  </span>
                </button>
              );
            })}
          </div>
        )}
      </div>
    </aside>
  );
}
