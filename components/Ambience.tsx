"use client";

import { useEffect, useRef, useState } from "react";
import { useSitePrefs } from "./SitePrefs";

/**
 * Ambient sounds. Drop looping audio files at these paths in /public and they start
 * working; until then a missing file just stays silent. Wind's loudness follows the
 * Wind slider, so the sound matches what the snow is doing.
 */
const SOUNDS = {
  fire: "/sounds/fire.mp3",
  rain: "/sounds/rain.mp3",
  wind: "/sounds/wind.mp3",
} as const;

type SoundKey = keyof typeof SOUNDS;

function SoundButton({ label, pressed, onClick }: { label: string; pressed: boolean; onClick: () => void }) {
  return (
    <button
      type="button"
      aria-pressed={pressed}
      onClick={onClick}
      className="group sc flex min-h-11 items-center justify-center gap-2.5 border border-[var(--rule-soft)] px-3.5 text-[18px] text-[var(--ink-soft)] aria-pressed:border-[var(--rule)] aria-pressed:text-[var(--ink)] sm:border-0 sm:px-2"
    >
      <span className="size-[9px] shrink-0 rounded-full border-[1.5px] border-current group-aria-pressed:border-[var(--accent)] group-aria-pressed:bg-[var(--accent)]" />
      {label}
    </button>
  );
}

function Slider({ label, value, onChange }: { label: string; value: number; onChange: (value: number) => void }) {
  return (
    <label className="sc flex min-h-10 items-center gap-3 text-[17px] text-[var(--ink-soft)]">
      <span className="w-24 shrink-0 sm:w-auto">{label}</span>
      <input
        type="range"
        min={0}
        max={1}
        step={0.05}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="grow accent-[var(--ink)] sm:w-28 sm:grow-0"
      />
    </label>
  );
}

function Choice({ label, pressed, onClick }: { label: string; pressed: boolean; onClick: () => void }) {
  return (
    <button type="button" aria-pressed={pressed} onClick={onClick} className="text-toggle min-h-10 px-1">
      {label}
    </button>
  );
}

function Pair({ label, a, b, isA, setA }: { label: string; a: string; b: string; isA: boolean; setA: (isA: boolean) => void }) {
  return (
    <div role="group" aria-label={label} className="sc flex items-center gap-1.5 text-[17px] text-[var(--ink-soft)]">
      <span className="w-24 shrink-0 sm:w-auto">{label}:</span>
      <Choice label={a} pressed={isA} onClick={() => setA(true)} />
      <span aria-hidden="true">/</span>
      <Choice label={b} pressed={!isA} onClick={() => setA(false)} />
    </div>
  );
}

/** The paper folded down to a strip: sounds, weather, edition, and a way back. */
export function AmbienceControls({ onPickUp }: { onPickUp: () => void }) {
  const prefs = useSitePrefs();
  const { snow, snowAmount, wind, setWind, evening, setEvening, snowOverPaper, setSnowOverPaper } = prefs;
  const [playing, setPlaying] = useState({ fire: false, rain: false });
  // Starts silent: nothing is heard until the volume is turned up.
  const [volume, setVolume] = useState(0);
  const audio = useRef<Partial<Record<SoundKey, HTMLAudioElement>>>({});

  const element = (key: SoundKey) => {
    let el = audio.current[key];
    if (!el) {
      el = new Audio(SOUNDS[key]);
      el.loop = true;
      audio.current[key] = el;
    }
    return el;
  };

  const setSound = (key: SoundKey, level: number) => {
    const el = element(key);
    el.volume = Math.min(1, Math.max(0, level));
    if (level > 0 && el.paused) el.play().catch(() => {});
    if (level === 0 && !el.paused) el.pause();
  };

  // Keep every sound at the right loudness as the controls change.
  useEffect(() => {
    if (playing.fire || audio.current.fire) setSound("fire", playing.fire ? volume : 0);
    if (playing.rain || audio.current.rain) setSound("rain", playing.rain ? volume : 0);
    if (wind > 0 || audio.current.wind) setSound("wind", volume * wind);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [playing, volume, wind]);

  // Sounds stop when the paper is picked back up (the snow and wind carry on).
  useEffect(() => {
    const sounds = audio.current;
    return () => {
      for (const el of Object.values(sounds)) el?.pause();
    };
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onPickUp();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onPickUp]);

  const setSnowLevel = (value: number) => {
    prefs.setSnow(value > 0);
    if (value > 0) prefs.setSnowAmount(value);
  };

  return (
    <div
      role="region"
      aria-label="Ambience"
      // Positioned against the full window width (vw), so it doesn't shift when the scrollbar goes away.
      className="rise-in fixed inset-x-0 bottom-0 z-20 w-full sm:right-auto sm:left-[calc(50vw-min(520px,50vw-24px))] sm:w-[min(1040px,calc(100vw-48px))]"
    >
      {/* The tab sits behind the strip, like the one on the paper. */}
      <button type="button" className="paper-tab sc" onClick={onPickUp}>
        Pick the paper up
      </button>
      <div className="paper relative">
        <div className="ribbon !h-1.5" />
        <div className="flex flex-col gap-x-8 gap-y-1 px-4 pt-3 pb-[max(20px,env(safe-area-inset-bottom))] sm:px-7 sm:pt-2.5 sm:pb-3">
          <div className="flex flex-col gap-x-8 gap-y-2 sm:flex-row sm:flex-wrap sm:items-center">
            <span className="sc hidden w-[88px] text-[15px] font-bold sm:block">Sounds</span>
            <div role="group" aria-label="Sounds" className="grid grid-cols-2 gap-2 sm:flex sm:gap-3">
              <SoundButton label="Fire" pressed={playing.fire} onClick={() => setPlaying((p) => ({ ...p, fire: !p.fire }))} />
              <SoundButton label="Rain" pressed={playing.rain} onClick={() => setPlaying((p) => ({ ...p, rain: !p.rain }))} />
            </div>
            <Slider label="Volume" value={volume} onChange={setVolume} />
            <div className="sm:ml-auto">
              <Pair label="Edition" a="Morning" b="Evening" isA={!evening} setA={(morning) => setEvening(!morning)} />
            </div>
          </div>
          <div className="flex flex-col gap-x-8 gap-y-1 border-t border-[var(--rule-soft)] pt-1 sm:flex-row sm:flex-wrap sm:items-center">
            <span className="sc hidden w-[88px] text-[15px] font-bold sm:block">Scene</span>
            <Slider label="Snow" value={snow ? snowAmount : 0} onChange={setSnowLevel} />
            <Slider label="Wind" value={wind} onChange={setWind} />
            <Pair label="Snow falls" a="Behind" b="In front" isA={!snowOverPaper} setA={(behind) => setSnowOverPaper(!behind)} />
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * The scene with the paper put down. On phones the art is taller than the screen is wide,
 * so it fills the height and you drag sideways to look around, starting at the cabin.
 */
export function AmbienceScene() {
  const [dragged, setDragged] = useState(false);

  return (
    <>
      <div className="scene hidden sm:block" aria-hidden="true" />
      <div
        className="fixed inset-0 z-0 overflow-x-auto overflow-y-hidden bg-[var(--sky)] sm:hidden"
        onScroll={() => setDragged(true)}
        role="img"
        aria-label="The village: a cabin, pine trees and a snowman in the snow. Drag sideways to look around."
      >
        <div
          className="h-full"
          style={{
            aspectRatio: "1800 / 1020",
            backgroundImage: "var(--scene)",
            backgroundSize: "cover",
            backgroundPosition: "left bottom",
            imageRendering: "pixelated",
          }}
        />
      </div>
      <p
        aria-hidden="true"
        className={`sc pointer-events-none fixed top-4 left-1/2 z-10 -translate-x-1/2 bg-[color-mix(in_srgb,var(--paper)_90%,transparent)] px-3 py-1.5 text-[15px] whitespace-nowrap text-[var(--ink)] transition-opacity duration-500 sm:hidden ${
          dragged ? "opacity-0" : "opacity-100"
        }`}
      >
        Drag sideways to look around
      </p>
    </>
  );
}
