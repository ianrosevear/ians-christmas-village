"use client";

import { useEffect, useState } from "react";

export type EditionDate = {
  /** e.g. "Thursday, September 24, 2026" */
  long: string;
  /** e.g. "Thursday, September 24" */
  short: string;
  /** Whole days until December 25 (0 on Christmas Day). */
  daysUntilChristmas: number;
};

function compute(): EditionDate {
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  let christmas = new Date(now.getFullYear(), 11, 25);
  if (today > christmas) christmas = new Date(now.getFullYear() + 1, 11, 25);
  return {
    long: now.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric", year: "numeric" }),
    short: now.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" }),
    daysUntilChristmas: Math.round((christmas.getTime() - today.getTime()) / 86_400_000),
  };
}

/** Today's date and the Christmas countdown. Null until mounted, so server and client HTML match. */
export function useEditionDate(): EditionDate | null {
  const [value, setValue] = useState<EditionDate | null>(null);

  useEffect(() => {
    const update = () => setValue(compute());
    update();
    const id = setInterval(update, 60_000);
    return () => clearInterval(id);
  }, []);

  return value;
}

export function countdownLabel(days: number): string {
  if (days === 0) return "Christmas Day";
  return days === 1 ? "day until Christmas" : "days until Christmas";
}
