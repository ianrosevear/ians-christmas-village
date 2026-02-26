"use client";

import { useEffect, useRef } from "react";

const SNOWFLAKE_COUNT = 50;

export default function Snowflakes() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const snowflakes: HTMLDivElement[] = [];

    for (let i = 0; i < SNOWFLAKE_COUNT; i++) {
      const el = document.createElement("div");
      const size = Math.random() * 8 + 4;
      const left = Math.random() * 100;
      const delay = Math.random() * 10;
      const duration = Math.random() * 8 + 6;
      const drift = Math.random() * 40 - 20;

      el.textContent = "❄";
      el.style.cssText = `
        position: fixed;
        top: -20px;
        left: ${left}%;
        font-size: ${size}px;
        opacity: ${Math.random() * 0.6 + 0.2};
        pointer-events: none;
        z-index: 40;
        animation: snowfall ${duration}s ${delay}s linear infinite;
        --drift: ${drift}px;
      `;

      container.appendChild(el);
      snowflakes.push(el);
    }

    return () => {
      snowflakes.forEach((el) => el.remove());
    };
  }, []);

  return <div ref={containerRef} className="fixed inset-0 pointer-events-none z-40" />;
}