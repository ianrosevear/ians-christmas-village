"use client";

import { createContext, useCallback, useContext, useState, useSyncExternalStore } from "react";

/** A boolean stored in localStorage, shared across components and tabs. */
function useStoredBoolean(key: string, defaultValue: boolean): [boolean, (next: boolean) => void] {
  const value = useSyncExternalStore(
    (callback) => {
      window.addEventListener("storage", callback);
      return () => window.removeEventListener("storage", callback);
    },
    () => {
      try {
        const saved = localStorage.getItem(key);
        return saved !== null ? (JSON.parse(saved) as boolean) : defaultValue;
      } catch {
        return defaultValue;
      }
    },
    () => defaultValue,
  );

  const set = useCallback(
    (next: boolean) => {
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
  snow: boolean;
  setSnow: (snow: boolean) => void;
  paperDown: boolean;
  setPaperDown: (down: boolean) => void;
  /** The Wind sound is playing: the snow blows sideways. */
  windy: boolean;
  setWindy: (windy: boolean) => void;
};

const SitePrefsContext = createContext<SitePrefs | null>(null);

export function SitePrefsProvider({ children }: { children: React.ReactNode }) {
  // Keys kept from the previous design so returning visitors keep their settings.
  const [evening, setEvening] = useStoredBoolean("darkMode", false);
  const [snow, setSnow] = useStoredBoolean("snowEnabled", true);
  const [paperDown, setPaperDown] = useState(false);
  const [windy, setWindy] = useState(false);

  return (
    <SitePrefsContext.Provider value={{ evening, setEvening, snow, setSnow, paperDown, setPaperDown, windy, setWindy }}>
      {children}
    </SitePrefsContext.Provider>
  );
}

export function useSitePrefs(): SitePrefs {
  const prefs = useContext(SitePrefsContext);
  if (!prefs) throw new Error("useSitePrefs must be used inside SitePrefsProvider");
  return prefs;
}
