"use client";

import { createContext, useCallback, useContext, useEffect, useRef, useState } from "react";

/** Ambient sounds, looped, at the Volume slider's level. */
const SOUNDS = {
  fire: "/sounds/fireplace.mp3",
  wind: "/sounds/wind.mp3",
} as const;

export type SoundKey = keyof typeof SOUNDS;
type Playing = Record<SoundKey, boolean>;

const NONE: Playing = { fire: false, wind: false };

type Sounds = {
  playing: Playing;
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

/**
 * Owns the audio, so sounds can carry on while the paper is up and pages change.
 * Unlike the other settings, sound settings are deliberately not remembered: every visit
 * starts silent, so coming back to the site never surprises anyone with noise.
 */
export function SoundsProvider({ children }: { children: React.ReactNode }) {
  const [playing, setPlaying] = useState<Playing>(NONE);
  // Volume starts at zero, so nothing is ever heard until it's turned up.
  const [volume, setVolume] = useState(0);
  const [keepPlaying, setKeepPlaying] = useState(true);
  const audio = useRef<Partial<Record<SoundKey, HTMLAudioElement>>>({});

  // Keep every sound at the right loudness as the controls change.
  useEffect(() => {
    let blocked = false;
    const apply = () => {
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
        if (level > 0 && el.paused) {
          el.play().catch(() => {
            // Blocked until the visitor interacts with the page: try again then.
            if (!blocked) {
              blocked = true;
              window.addEventListener("pointerdown", retry, { once: true });
              window.addEventListener("keydown", retry, { once: true });
            }
          });
        }
        if (level === 0 && !el.paused) el.pause();
      }
    };
    const retry = () => {
      blocked = false;
      window.removeEventListener("pointerdown", retry);
      window.removeEventListener("keydown", retry);
      apply();
    };
    apply();
    return () => {
      window.removeEventListener("pointerdown", retry);
      window.removeEventListener("keydown", retry);
    };
  }, [playing, volume]);

  useEffect(() => {
    const sounds = audio.current;
    return () => {
      for (const el of Object.values(sounds)) el?.pause();
    };
  }, []);

  const toggle = useCallback((key: SoundKey) => setPlaying({ ...playing, [key]: !playing[key] }), [playing, setPlaying]);
  const stopAll = useCallback(() => setPlaying(NONE), [setPlaying]);
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
