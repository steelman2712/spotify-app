"use client";

import { useRef, useState } from "react";

interface AudioPreviewProps {
  previewUrl: string;
}

export default function AudioPreview({ previewUrl }: AudioPreviewProps) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [playing, setPlaying] = useState(false);
  const [progress, setProgress] = useState(0);

  function toggle() {
    const audio = audioRef.current;
    if (!audio) return;
    if (playing) {
      audio.pause();
    } else {
      // Pause all other previews
      document
        .querySelectorAll<HTMLAudioElement>("audio[data-preview]")
        .forEach((a) => {
          if (a !== audio) a.pause();
        });
      audio.play();
    }
    setPlaying(!playing);
  }

  return (
    <div className="flex items-center gap-2">
      <audio
        ref={audioRef}
        src={previewUrl}
        data-preview
        onTimeUpdate={() => {
          const a = audioRef.current;
          if (a) setProgress((a.currentTime / a.duration) * 100);
        }}
        onEnded={() => {
          setPlaying(false);
          setProgress(0);
        }}
        onPause={() => setPlaying(false)}
        onPlay={() => setPlaying(true)}
      />
      <button
        onClick={toggle}
        className="w-8 h-8 rounded-full bg-[#1DB954] hover:bg-[#1ed760] flex items-center justify-center shrink-0 transition-colors"
        aria-label={playing ? "Pause preview" : "Play preview"}
      >
        {playing ? (
          <svg className="w-3 h-3 fill-black" viewBox="0 0 24 24">
            <rect x="6" y="4" width="4" height="16" />
            <rect x="14" y="4" width="4" height="16" />
          </svg>
        ) : (
          <svg className="w-3 h-3 fill-black ml-0.5" viewBox="0 0 24 24">
            <polygon points="5,3 19,12 5,21" />
          </svg>
        )}
      </button>
      <div className="flex-1 h-1 bg-gray-700 rounded-full overflow-hidden min-w-0">
        <div
          className="h-full bg-[#1DB954] transition-all"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
}
