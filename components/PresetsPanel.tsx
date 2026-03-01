"use client";

import { useEffect, useState } from "react";
import { FilterState, Preset } from "@/lib/types";

const STORAGE_KEY = "spotify-playlist-builder-presets";

interface PresetsPanelProps {
  currentFilters: FilterState;
  onLoad: (filters: FilterState) => void;
}

export default function PresetsPanel({ currentFilters, onLoad }: PresetsPanelProps) {
  const [presets, setPresets] = useState<Preset[]>([]);
  const [saveName, setSaveName] = useState("");
  const [open, setOpen] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) setPresets(JSON.parse(stored));
    } catch {}
  }, []);

  function savePresets(next: Preset[]) {
    setPresets(next);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  }

  function handleSave() {
    if (!saveName.trim()) return;
    const next = [
      ...presets.filter((p) => p.name !== saveName.trim()),
      { name: saveName.trim(), filters: currentFilters },
    ];
    savePresets(next);
    setSaveName("");
  }

  function handleDelete(name: string) {
    savePresets(presets.filter((p) => p.name !== name));
  }

  return (
    <div className="bg-gray-900 rounded-xl border border-gray-800">
      <button
        onClick={() => setOpen((o) => !o)}
        className="w-full flex items-center justify-between px-4 py-3 text-gray-400 hover:text-white text-sm font-medium transition-colors"
      >
        <span>Filter Presets</span>
        <span className="text-gray-600">{open ? "▲" : "▼"}</span>
      </button>

      {open && (
        <div className="px-4 pb-4 flex flex-col gap-3">
          {/* Save current */}
          <div className="flex gap-2">
            <input
              type="text"
              value={saveName}
              onChange={(e) => setSaveName(e.target.value)}
              placeholder="Preset name…"
              className="flex-1 bg-gray-800 text-white text-sm rounded-lg px-3 py-1.5 border border-gray-700 focus:outline-none focus:border-[#1DB954]"
            />
            <button
              onClick={handleSave}
              disabled={!saveName.trim()}
              className="bg-[#1DB954] disabled:opacity-40 text-black text-sm font-semibold px-3 py-1.5 rounded-lg"
            >
              Save
            </button>
          </div>

          {/* Preset list */}
          {presets.length === 0 ? (
            <p className="text-gray-600 text-xs">No presets saved yet.</p>
          ) : (
            <ul className="flex flex-col gap-1">
              {presets.map((preset) => (
                <li
                  key={preset.name}
                  className="flex items-center justify-between gap-2 bg-gray-800 rounded-lg px-3 py-2"
                >
                  <button
                    onClick={() => onLoad(preset.filters)}
                    className="text-gray-300 hover:text-white text-sm text-left flex-1 truncate"
                  >
                    {preset.name}
                  </button>
                  <button
                    onClick={() => handleDelete(preset.name)}
                    className="text-gray-600 hover:text-red-400 text-xs shrink-0"
                  >
                    Delete
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}
