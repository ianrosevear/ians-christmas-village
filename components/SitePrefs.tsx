"use client";

import { createContext, useContext, useState } from "react";
import { useStored } from "@/lib/localStore";

type SitePrefs = {
  evening: boolean;
  setEvening: (evening: boolean) => void;
  /** Snow on or off (the masthead toggle). */
  snow: boolean;
  setSnow: (snow: boolean) => void;
  /** How heavy the snow is when it's on, 0.1–1. */
  snowAmount: number;
  setSnowAmount: (amount: number) => void;
  /** Draw the snow in front of the paper instead of behind it. */
  snowOverPaper: boolean;
  setSnowOverPaper: (over: boolean) => void;
  /** Wind strength, 0–1. Blows the snow sideways. */
  wind: number;
  setWind: (wind: number) => void;
  paperDown: boolean;
  setPaperDown: (down: boolean) => void;
};

const SitePrefsContext = createContext<SitePrefs | null>(null);

export function SitePrefsProvider({ children }: { children: React.ReactNode }) {
  // Remembered between visits. "darkMode" and "snowEnabled" are the keys the old design
  // used, kept so returning visitors keep their settings.
  // First visit: the edition follows the system's light/dark setting, and snow starts off
  // for anyone who has asked their system for reduced motion.
  const [evening, setEvening] = useStored<boolean>("darkMode", () => window.matchMedia("(prefers-color-scheme: dark)").matches, false);
  const [snow, setSnow] = useStored<boolean>("snowEnabled", () => !window.matchMedia("(prefers-reduced-motion: reduce)").matches, true);
  const [snowAmount, setSnowAmount] = useStored<number>("snowAmount", 0.25);
  const [snowOverPaper, setSnowOverPaper] = useStored<boolean>("snowOverPaper", false);
  const [wind, setWind] = useStored<number>("wind", 0.25);
  const [paperDown, setPaperDown] = useState(false);

  return (
    <SitePrefsContext.Provider
      value={{
        evening,
        setEvening,
        snow,
        setSnow,
        snowAmount,
        setSnowAmount,
        snowOverPaper,
        setSnowOverPaper,
        wind,
        setWind,
        paperDown,
        setPaperDown,
      }}
    >
      {children}
    </SitePrefsContext.Provider>
  );
}

export function useSitePrefs(): SitePrefs {
  const prefs = useContext(SitePrefsContext);
  if (!prefs) throw new Error("useSitePrefs must be used inside SitePrefsProvider");
  return prefs;
}
