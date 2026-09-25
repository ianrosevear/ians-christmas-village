"use client";

import { useEffect, useRef, useState } from "react";
import { useSitePrefs } from "./SitePrefs";
import { useSounds } from "./Sounds";

function SoundButton({ label, color, pressed, onClick }: { label: string; color: string; pressed: boolean; onClick: () => void }) {
  return (
    <button
      type="button"
      aria-pressed={pressed}
      onClick={onClick}
      className="group sc flex min-h-11 items-center justify-center gap-2.5 border border-[var(--rule-soft)] px-3.5 text-[18px] text-[var(--ink-soft)] aria-pressed:border-[var(--rule)] aria-pressed:text-[var(--ink)] sm:border-0 sm:px-2"
    >
      {/* Outlined in the sound's colour; filled while it's playing */}
      <span
        className="size-[9px] shrink-0 rounded-full border-[1.5px]"
        style={{ borderColor: color, backgroundColor: pressed ? color : "transparent" }}
      />
      {label}
    </button>
  );
}

function Slider({ label, value, onChange }: { label: string; value: number; onChange: (value: number) => void }) {
  return (
    <label className="sc flex min-h-9 items-center gap-3 text-[17px] text-[var(--ink-soft)]">
      <span className="w-28 shrink-0 sm:w-auto">{label}</span>
      <input
        type="range"
        min={0}
        max={1}
        step={0.05}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="grow accent-[var(--ink)] sm:w-24 sm:grow-0"
      />
    </label>
  );
}

function Choice({ label, pressed, onClick }: { label: string; pressed: boolean; onClick: () => void }) {
  return (
    <button type="button" aria-pressed={pressed} onClick={onClick} className="text-toggle min-h-9 px-1">
      {label}
    </button>
  );
}

function Pair({ label, a, b, isA, setA }: { label: string; a: string; b: string; isA: boolean; setA: (isA: boolean) => void }) {
  return (
    <div role="group" aria-label={label} className="sc flex items-center gap-1.5 text-[17px] text-[var(--ink-soft)]">
      <span className="w-28 shrink-0 sm:w-auto">{label}:</span>
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
  const { playing, toggle, volume, setVolume } = useSounds();

  // Tell the phone scene how tall this panel is, so the art can be dragged clear of it.
  const panelRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = panelRef.current;
    if (!el) return;
    const root = document.documentElement;
    const ro = new ResizeObserver(() => root.style.setProperty("--ambience-panel-h", `${el.offsetHeight}px`));
    ro.observe(el);
    return () => {
      ro.disconnect();
      root.style.removeProperty("--ambience-panel-h");
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
      ref={panelRef}
      role="region"
      aria-label="Ambience"
      // Positioned against the full window width (vw), so it doesn't shift when the scrollbar goes away.
      className="rise-in fixed inset-x-0 bottom-0 z-20 w-full sm:right-auto sm:left-[calc(50vw-min(520px,50vw-24px))] sm:w-[min(1040px,calc(100vw-48px))]"
    >
      {/* The tab sits behind the strip, like the one on the paper. */}
      <button type="button" className="paper-tab sc" onClick={onPickUp}>
        Read the paper
      </button>
      <div className="paper relative">
        <div className="ribbon !h-1.5" />
        <div className="flex flex-col gap-x-6 gap-y-1 px-4 pt-3 pb-[max(20px,env(safe-area-inset-bottom))] sm:px-7 sm:pt-2.5 sm:pb-3">
          <div className="flex flex-col gap-x-6 gap-y-2 sm:flex-row sm:flex-wrap sm:items-center">
            <span className="sc hidden w-[88px] text-[15px] font-bold sm:block">Sounds</span>
            <div role="group" aria-label="Sounds" className="grid grid-cols-2 gap-2 sm:flex sm:gap-3">
              <SoundButton label="Fire" color="#ff4500" pressed={playing.fire} onClick={() => toggle("fire")} />
              <SoundButton label="Wind" color="#3b82f6" pressed={playing.wind} onClick={() => toggle("wind")} />
            </div>
            <Slider label="Volume" value={volume} onChange={setVolume} />
            <div className="sm:ml-auto">
              <Pair label="Edition" a="Morning" b="Evening" isA={!evening} setA={(morning) => setEvening(!morning)} />
            </div>
          </div>
          <div className="flex flex-col gap-x-6 gap-y-1 border-t border-[var(--rule-soft)] pt-1 sm:flex-row sm:flex-wrap sm:items-center">
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
 * The scene with the paper put down. On phones the art is shown larger than the screen:
 * you drag to look around in any direction, starting at the bottom left on the cabin.
 * Space the size of the controls panel sits under the art, so its bottom edge can be
 * dragged up clear of the panel.
 */
export function AmbienceScene() {
  const [dragged, setDragged] = useState(false);
  const draggedRef = useRef(false);
  const panRef = useRef<HTMLDivElement>(null);

  const onUserPan = () => {
    draggedRef.current = true;
    setDragged(true);
  };

  // Touch pans natively; a mouse needs click-and-drag wired up by hand.
  const drag = useRef<{ x: number; y: number; left: number; top: number } | null>(null);
  const onPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    onUserPan();
    if (e.pointerType !== "mouse" || e.button !== 0) return;
    const el = e.currentTarget;
    drag.current = { x: e.clientX, y: e.clientY, left: el.scrollLeft, top: el.scrollTop };
    el.setPointerCapture(e.pointerId);
  };
  const onPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const d = drag.current;
    if (!d) return;
    e.currentTarget.scrollLeft = d.left - (e.clientX - d.x);
    e.currentTarget.scrollTop = d.top - (e.clientY - d.y);
  };
  const endDrag = () => {
    drag.current = null;
  };

  useEffect(() => {
    const el = panRef.current;
    if (!el) return;
    // Start at the bottom left, and stay there while the panel slides in and sizes itself.
    const toStart = () => {
      if (draggedRef.current) return;
      const art = el.firstElementChild as HTMLElement | null;
      if (!art) return;
      const panel = parseFloat(getComputedStyle(document.documentElement).getPropertyValue("--ambience-panel-h")) || 0;
      const visible = el.clientHeight - panel;
      // The cabin sits about two-thirds of the way down the art: centre it above the panel.
      el.scrollLeft = 0;
      el.scrollTop = art.offsetHeight * 0.66 - visible / 2;
    };
    toStart();
    const ro = new ResizeObserver(toStart);
    for (const child of el.children) ro.observe(child);
    return () => ro.disconnect();
  }, []);

  return (
    <>
      <div className="scene ambience-static" aria-hidden="true" />
      <div
        ref={panRef}
        className="ambience-pan no-scrollbar fixed inset-0 z-0 cursor-grab overflow-auto overscroll-contain bg-[var(--ground)] select-none active:cursor-grabbing"
        onTouchStart={onUserPan}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={endDrag}
        onPointerCancel={endDrag}
        onWheel={onUserPan}
        role="img"
        aria-label="The village: a cabin, pine trees and a snowman in the snow. Drag to look around."
      >
        <div
          style={{
            height: "120dvh",
            aspectRatio: "1800 / 1020",
            backgroundImage: "var(--scene)",
            backgroundSize: "cover",
            imageRendering: "pixelated",
          }}
        />
        <div aria-hidden="true" style={{ height: "var(--ambience-panel-h, 0px)" }} />
      </div>
      <p
        aria-hidden="true"
        className={`sc pointer-events-none fixed top-4 left-1/2 z-10 -translate-x-1/2 bg-[color-mix(in_srgb,var(--paper)_90%,transparent)] px-3 py-1.5 text-[15px] whitespace-nowrap text-[var(--ink)] transition-opacity duration-500 ambience-pan ${
          dragged ? "opacity-0" : "opacity-100"
        }`}
      >
        Drag to look around
      </p>
    </>
  );
}
