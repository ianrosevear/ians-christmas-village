"use client";

import { useEffect, useRef, useState } from "react";
import { useSitePrefs } from "./SitePrefs";

/**
 * Ambient sounds. Drop looping audio files at these paths in /public and the buttons
 * start working; until then a missing file just stays silent.
 */
const SOUNDS = [
  { key: "fire", label: "Fire", src: "/sounds/fire.mp3" },
  { key: "wind", label: "Wind", src: "/sounds/wind.mp3" },
  { key: "rain", label: "Rain", src: "/sounds/rain.mp3" },
] as const;

type SoundKey = (typeof SOUNDS)[number]["key"];

function Dot() {
  return (
    <span className="size-[9px] shrink-0 rounded-full border-[1.5px] border-current group-aria-pressed:border-[var(--accent)] group-aria-pressed:bg-[var(--accent)]" />
  );
}

function SoundButton({ label, pressed, onClick }: { label: string; pressed: boolean; onClick: () => void }) {
  return (
    <button
      type="button"
      aria-pressed={pressed}
      onClick={onClick}
      className="group sc flex min-h-12 items-center justify-center gap-2.5 border border-[var(--rule-soft)] px-3.5 text-[18px] text-[var(--ink-soft)] aria-pressed:border-[var(--rule)] aria-pressed:text-[var(--ink)] sm:min-h-11 sm:border-0"
    >
      <Dot />
      {label}
    </button>
  );
}

/** The paper folded down to a strip: ambient sounds, snow, and a way back. */
export function AmbienceControls({ onPickUp }: { onPickUp: () => void }) {
  const { snow, setSnow, setWindy } = useSitePrefs();
  const [playing, setPlaying] = useState<Record<SoundKey, boolean>>({ fire: false, wind: false, rain: false });
  // Starts silent: sounds only play once the volume is turned up.
  const [volume, setVolume] = useState(0);
  const audio = useRef<Partial<Record<SoundKey, HTMLAudioElement>>>({});

  const toggle = (key: SoundKey, src: string) => {
    const on = !playing[key];
    setPlaying((p) => ({ ...p, [key]: on }));
    if (key === "wind") setWindy(on);
    let el = audio.current[key];
    if (!el) {
      el = new Audio(src);
      el.loop = true;
      audio.current[key] = el;
    }
    el.volume = volume;
    if (on) el.play().catch(() => {});
    else el.pause();
  };

  useEffect(() => {
    for (const el of Object.values(audio.current)) if (el) el.volume = volume;
  }, [volume]);

  // Stop everything when the paper is picked back up.
  useEffect(() => {
    const sounds = audio.current;
    return () => {
      for (const el of Object.values(sounds)) el?.pause();
      setWindy(false);
    };
  }, [setWindy]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onPickUp();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onPickUp]);

  return (
    <div
      role="region"
      aria-label="Ambience"
      className="paper rise-in fixed inset-x-0 bottom-0 z-20 mx-auto w-full sm:w-[min(1040px,calc(100%-48px))]"
    >
      <button type="button" className="paper-tab paper-tab--on-strip sc" onClick={onPickUp}>
        Pick the paper up
      </button>
      <div className="ribbon !h-1.5" />
      <div className="flex flex-col gap-3 px-4 pt-3 pb-[max(20px,env(safe-area-inset-bottom))] sm:flex-row sm:items-center sm:justify-between sm:gap-6 sm:px-7 sm:py-2.5">
        <div className="hidden text-[22px] font-semibold tracking-[-0.01em] whitespace-nowrap lg:block">Ian&rsquo;s Christmas Village</div>

        <div role="group" aria-label="Sounds" className="grid grid-cols-4 gap-2 sm:flex sm:items-center sm:gap-0">
          {SOUNDS.map((s) => (
            <SoundButton key={s.key} label={s.label} pressed={playing[s.key]} onClick={() => toggle(s.key, s.src)} />
          ))}
          <SoundButton label="Snow" pressed={snow} onClick={() => setSnow(!snow)} />
        </div>

        <label className="sc flex min-h-10 items-center gap-3 text-[17px] text-[var(--ink-soft)] sm:border-l sm:border-[var(--rule-soft)] sm:pl-4">
          Volume
          <input
            type="range"
            min={0}
            max={1}
            step={0.05}
            value={volume}
            onChange={(e) => setVolume(Number(e.target.value))}
            className="grow accent-[var(--ink)] sm:w-28 sm:grow-0"
          />
        </label>

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
