"use client";

import { useState, useEffect } from "react";

export default function ChristmasCountdown() {
  const [days, setDays] = useState<number | null>(null);

  useEffect(() => {
    const calcDays = () => {
      const now = new Date();
      const christmas = new Date(now.getFullYear(), 11, 25);
      if (now > christmas) christmas.setFullYear(christmas.getFullYear() + 1);
      const diff = Math.ceil((christmas.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
      setDays(diff);
    };

    calcDays();
    const interval = setInterval(calcDays, 60000);
    return () => clearInterval(interval);
  }, []);

  if (days === null) return null;

  const isChristmas = days === 0;

  return (
    <div className="text-center">
      {isChristmas ? (
        <p className="text-4xl text-[var(--color-gold)]" style={{ fontFamily: "var(--font-playfair-display)" }}>
          🎅 Merry Christmas! 🎅
        </p>
      ) : (
        <>
          <p className="text-7xl font-bold text-[var(--color-gold)]" style={{ fontFamily: "var(--font-pixelify-sans)" }}>
            {days}
          </p>
          <p className="text-xl text-[var(--color-dark)] dark:text-[var(--color-snow)] mt-2" style={{ fontFamily: "var(--font-pixelify-sans)" }}>
            {days === 1 ? "day" : "days"} until Christmas
          </p>
        </>
      )}
    </div>
  );
}