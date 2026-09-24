"use client";

import { createContext, useCallback, useContext, useEffect, useRef, useState, useSyncExternalStore } from "react";

/** Ambient sounds, looped, at the Volume slider's level. */
const SOUNDS = {
  fire: "/sounds/fireplace.mp3",
  wind: "/sounds/wind.mp3",
} as const;

export type SoundKey = keyof typeof SOUNDS;

type Sounds = {
  playing: Record<SoundKey, boolean>;
  toggle: (key: SoundKey) => void;
  anyPlaying: boolean;
  stopAll: () => void;
  volume: number;
  setVolume: (volume: number) => void;
  /** Keep the sounds going after the paper is picked back up. */
  keepPlaying: boolean;
  setKeepPlaying: (keep: boolean) => void;
};

const SoundsContext = createContext<Sounds | null>(null);

function useStoredKeepPlaying(): [boolean, (keep: boolean) => void] {
  const value = useSyncExternalStore(
    (callback) => {
      window.addEventListener("storage", callback);
      return () => window.removeEventListener("storage", callback);
    },
    () => {
      try {
        return localStorage.getItem("soundsKeepPlaying") === "true";
      } catch {
        return false;
      }
    },
    () => false,
  );
  const set = useCallback((keep: boolean) => {
    try {
      localStorage.setItem("soundsKeepPlaying", String(keep));
    } catch {
      // Storage unavailable: the choice just won't stick.
    }
    window.dispatchEvent(new Event("storage"));
  }, []);
  return [value, set];
}

/** Owns the audio, so sounds can carry on while the paper is up and pages change. */
export function SoundsProvider({ children }: { children: React.ReactNode }) {
  const [playing, setPlaying] = useState<Record<SoundKey, boolean>>({ fire: false, wind: false });
  // Starts silent: nothing is heard until the volume is turned up.
  const [volume, setVolume] = useState(0);
  const [keepPlaying, setKeepPlaying] = useStoredKeepPlaying();
  const audio = useRef<Partial<Record<SoundKey, HTMLAudioElement>>>({});

  // Keep every sound at the right loudness as the controls change.
  useEffect(() => {
    for (const key of Object.keys(SOUNDS) as SoundKey[]) {
      const level = playing[key] ? volume : 0;
      let el = audio.current[key];
      if (!el && level === 0) continue;
      if (!el) {
        el = new Audio(SOUNDS[key]);
        el.loop = true;
        audio.current[key] = el;
      }
      el.volume = Math.min(1, Math.max(0, level));
      if (level > 0 && el.paused) el.play().catch(() => {});
      if (level === 0 && !el.paused) el.pause();
    }
  }, [playing, volume]);

  useEffect(() => {
    const sounds = audio.current;
    return () => {
      for (const el of Object.values(sounds)) el?.pause();
    };
  }, []);

  const toggle = useCallback((key: SoundKey) => setPlaying((p) => ({ ...p, [key]: !p[key] })), []);
  const stopAll = useCallback(() => setPlaying({ fire: false, wind: false }), []);
  const anyPlaying = volume > 0 && Object.values(playing).some(Boolean);

  return (
    <SoundsContext.Provider value={{ playing, toggle, anyPlaying, stopAll, volume, setVolume, keepPlaying, setKeepPlaying }}>
      {children}
    </SoundsContext.Provider>
  );
}

export function useSounds(): Sounds {
  const sounds = useContext(SoundsContext);
  if (!sounds) throw new Error("useSounds must be used inside SoundsProvider");
  return sounds;
}
