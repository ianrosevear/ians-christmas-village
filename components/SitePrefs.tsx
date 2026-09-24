"use client";

import { createContext, useCallback, useContext, useState, useSyncExternalStore } from "react";

/** A value stored in localStorage as JSON, shared across components and tabs. */
function useStored<T extends boolean | number>(key: string, defaultValue: T): [T, (next: T) => void] {
  const value = useSyncExternalStore(
    (callback) => {
      window.addEventListener("storage", callback);
      return () => window.removeEventListener("storage", callback);
    },
    () => {
      try {
        const saved = localStorage.getItem(key);
        return saved !== null ? (JSON.parse(saved) as T) : defaultValue;
      } catch {
        return defaultValue;
      }
    },
    () => defaultValue,
  );

  const set = useCallback(
    (next: T) => {
      try {
        localStorage.setItem(key, JSON.stringify(next));
      } catch {
        // Storage unavailable (private mode etc.): the change just won't stick.
      }
      window.dispatchEvent(new Event("storage"));
    },
    [key],
  );

  return [value, set];
}

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
  /** Wind strength, 0–1. Blows the snow sideways; lasts for the visit. */
  wind: number;
  setWind: (wind: number) => void;
  paperDown: boolean;
  setPaperDown: (down: boolean) => void;
};

const SitePrefsContext = createContext<SitePrefs | null>(null);

export function SitePrefsProvider({ children }: { children: React.ReactNode }) {
  // "darkMode" and "snowEnabled" are kept from the previous design so returning visitors keep their settings.
  const [evening, setEvening] = useStored<boolean>("darkMode", false);
  const [snow, setSnow] = useStored<boolean>("snowEnabled", true);
  const [snowAmount, setSnowAmount] = useStored<number>("snowAmount", 0.5);
  const [snowOverPaper, setSnowOverPaper] = useStored<boolean>("snowOverPaper", false);
  const [wind, setWind] = useState(0);
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
