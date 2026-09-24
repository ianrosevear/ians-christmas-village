"use client";

import { useEffect, useRef } from "react";
import { useSitePrefs } from "./SitePrefs";

const CHARS = ["❄", "❅", "❆", "•", "•", "✦"];
/** Flakes at full snow; the snow amount draws a share of them. */
const MAX_FLAKES = 520;

type Flake = {
  x: number;
  y: number;
  size: number;
  speed: number;
  sway: number;
  phase: number;
  opacity: number;
  char: string;
  rotation: number;
  spin: number;
};

/**
 * Falling snow, drawn on a canvas. When the Wind sound is on, the snow drifts sideways
 * in gusts and swirls; the change eases in and out rather than snapping.
 */
export default function Snowflakes() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { wind: windSetting, snowAmount, snowOverPaper } = useSitePrefs();
  const windTarget = useRef(windSetting);
  const amount = useRef(snowAmount);
  const overPaper = useRef(snowOverPaper);

  useEffect(() => {
    windTarget.current = windSetting;
    amount.current = snowAmount;
    overPaper.current = snowOverPaper;
  }, [windSetting, snowAmount, snowOverPaper]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let width = 0;
    let height = 0;
    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    window.addEventListener("resize", resize);

    const makeFlake = (y: number): Flake => ({
      x: Math.random() * width,
      y,
      size: Math.round(Math.random() * 10 + 4),
      speed: Math.random() * 0.6 + 0.35,
      sway: Math.random() * 0.4 + 0.1,
      phase: Math.random() * Math.PI * 2,
      opacity: Math.random() * 0.5 + 0.15,
      char: CHARS[Math.floor(Math.random() * CHARS.length)],
      rotation: Math.random() * Math.PI * 2,
      spin: (Math.random() - 0.5) * 0.02,
    });
    const flakes = Array.from({ length: MAX_FLAKES }, () => makeFlake(Math.random() * height));

    // Drawing text (and especially text with a shadow) every frame is slow, so each
    // character/size/style is drawn once to a small canvas and then copied as an image.
    const sprites = new Map<string, HTMLCanvasElement>();
    // Spinning is done by picking one of a few pre-rotated copies: snowflakes look the same
    // every 60° (the star every 90°), so six steps per turn of symmetry is plenty.
    const STEPS = 6;
    const symmetry = (char: string) => (char === "✦" ? Math.PI / 2 : char === "•" ? 0 : Math.PI / 3);
    const sprite = (char: string, size: number, shadow: boolean, step: number) => {
      const key = `${char}${size}${shadow ? "s" : ""}${step}`;
      let img = sprites.get(key);
      if (!img) {
        const scale = Math.min(window.devicePixelRatio || 1, 2);
        const box = Math.ceil(size * 1.5 + 8);
        img = document.createElement("canvas");
        img.width = img.height = Math.ceil(box * scale);
        const c = img.getContext("2d")!;
        c.scale(scale, scale);
        c.font = `${size}px serif`;
        c.textAlign = "center";
        c.textBaseline = "middle";
        c.fillStyle = "#fff";
        if (shadow) {
          c.shadowColor = "rgba(30, 40, 60, 0.9)";
          c.shadowBlur = 2.5;
          c.shadowOffsetY = 0.5;
        }
        c.translate(box / 2, box / 2);
        c.rotate((step / STEPS) * symmetry(char));
        c.fillText(char, 0, 0);
        sprites.set(key, img);
      }
      return img;
    };

    // Where the paper (and the ambience strip) is on screen, refreshed a few times a second:
    // flakes in front of it get a shadow so they show up on the cream; flakes over the sky don't.
    let paperRects: DOMRect[] = [];
    let rectsAt = -Infinity;
    const onPaper = (x: number, y: number) =>
      paperRects.some((r) => x >= r.left && x <= r.right && y >= r.top && y <= r.bottom);

    let wind = windTarget.current;
    let frame = 0;
    let last = performance.now();

    const tick = (now: number) => {
      const dt = Math.min((now - last) / 16.7, 3); // in 60fps frames
      last = now;
      wind += (windTarget.current - wind) * 0.02 * dt; // ease towards the target

      const dpr = canvas.width / width;
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Squared, so the low end of the slider stays gentle and the top end is a blizzard.
      const level = Math.min(1, Math.max(0.05, amount.current));
      const shown = Math.round(MAX_FLAKES * level * level);
      const inFront = overPaper.current;
      if (inFront && now - rectsAt > 200) {
        rectsAt = now;
        paperRects = [...document.querySelectorAll(".paper")]
          .map((el) => el.getBoundingClientRect())
          .filter((r) => r.width > 0 && r.height > 0);
      }
      const t = now * 0.001;
      const gust = 0.6 + 0.4 * Math.sin(now * 0.0006) + 0.25 * Math.sin(now * 0.0017);

      for (let i = 0; i < shown; i++) {
        const f = flakes[i];
        // Gentle side-to-side sway, plus wind: a gusting push and a swirl that curls flakes around.
        const swirl = wind > 0.001 ? Math.sin(f.y * 0.012 + t * 1.3 + f.phase) * 1.4 * wind : 0;
        f.x += (Math.sin(t * f.sway * 2 + f.phase) * 0.35 + wind * (1.5 * gust + 0.5 * f.speed) + swirl) * dt;
        f.y += (f.speed * (1 + wind * 0.4) + (wind > 0.001 ? Math.cos(f.x * 0.01 + t + f.phase) * 0.6 * wind : 0)) * dt;
        f.rotation += f.spin * (1 + wind * 4) * dt;

        if (f.y > height + 20) Object.assign(f, makeFlake(-20));
        if (f.x > width + 30) f.x = -30;
        if (f.x < -30) f.x = width + 30;

        const sym = symmetry(f.char);
        const step = sym ? Math.round((((f.rotation % sym) + sym) % sym) / sym * STEPS) % STEPS : 0;
        const shadow = inFront && onPaper(f.x, f.y);
        const img = sprite(f.char, f.size, shadow, step);
        const half = img.width / 2;
        // Heavier snow also reads a little brighter; snow in front of the paper more so.
        ctx.globalAlpha = Math.min(1, f.opacity + (shadow ? 0.4 : 0) + level * 0.15);
        ctx.drawImage(img, Math.round(f.x * dpr - half), Math.round(f.y * dpr - half));
      }
      frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className={`pointer-events-none fixed top-0 left-0 h-dvh w-screen ${snowOverPaper ? "z-[25]" : "z-[5]"}`}
    />
  );
}
