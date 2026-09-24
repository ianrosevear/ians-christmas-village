"use client";

import { useEffect, useRef } from "react";
import { useSitePrefs } from "./SitePrefs";

const CHARS = ["❄", "❅", "❆", "•", "•", "✦"];
const COUNT = 60;

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
  const { windy } = useSitePrefs();
  const windTarget = useRef(0);

  useEffect(() => {
    windTarget.current = windy ? 1 : 0;
  }, [windy]);

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
      size: Math.random() * 10 + 4,
      speed: Math.random() * 0.6 + 0.35,
      sway: Math.random() * 0.4 + 0.1,
      phase: Math.random() * Math.PI * 2,
      opacity: Math.random() * 0.5 + 0.15,
      char: CHARS[Math.floor(Math.random() * CHARS.length)],
      rotation: Math.random() * Math.PI * 2,
      spin: (Math.random() - 0.5) * 0.02,
    });
    const flakes = Array.from({ length: COUNT }, () => makeFlake(Math.random() * height));

    let wind = windTarget.current;
    let frame = 0;
    let last = performance.now();

    const tick = (now: number) => {
      const dt = Math.min((now - last) / 16.7, 3); // in 60fps frames
      last = now;
      wind += (windTarget.current - wind) * 0.02 * dt; // ease towards the target

      ctx.clearRect(0, 0, width, height);
      ctx.fillStyle = "#fff";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";

      const gust = 0.6 + 0.4 * Math.sin(now * 0.0006) + 0.25 * Math.sin(now * 0.0017);
      for (const f of flakes) {
        const t = now * 0.001;
        // Gentle side-to-side sway, plus wind: a gusting push and a swirl that curls flakes around.
        const swirl = Math.sin(f.y * 0.012 + t * 1.3 + f.phase) * 1.4 * wind;
        f.x += (Math.sin(t * f.sway * 2 + f.phase) * 0.35 + wind * (1.5 * gust + 0.5 * f.speed) + swirl) * dt;
        f.y += (f.speed * (1 + wind * 0.4) + Math.cos(f.x * 0.01 + t + f.phase) * 0.6 * wind) * dt;
        f.rotation += f.spin * (1 + wind * 4) * dt;

        if (f.y > height + 20) Object.assign(f, makeFlake(-20));
        if (f.x > width + 30) f.x = -30;
        if (f.x < -30) f.x = width + 30;

        ctx.globalAlpha = f.opacity;
        ctx.font = `${f.size}px serif`;
        ctx.save();
        ctx.translate(f.x, f.y);
        ctx.rotate(f.rotation);
        ctx.fillText(f.char, 0, 0);
        ctx.restore();
      }
      frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return <canvas ref={canvasRef} aria-hidden="true" className="pointer-events-none fixed top-0 left-0 z-[5] h-dvh w-screen" />;
}
