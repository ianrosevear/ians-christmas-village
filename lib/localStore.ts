"use client";

import { useCallback, useSyncExternalStore } from "react";

/**
 * The site's one place for remembering things in the browser: settings (edition, snow,
 * wind…) and crossword progress all go through here. Values are stored as JSON in
 * localStorage under their own keys. If storage isn't available (private browsing,
 * blocked cookies) reads fall back to the default and writes are quietly dropped.
 */

const CHANGE_EVENT = "localstore";

export function readStored<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    return raw === null ? fallback : (JSON.parse(raw) as T);
  } catch {
    return fallback;
  }
}

export function writeStored<T>(key: string, value: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // Storage unavailable: the change just won't be remembered.
  }
  window.dispatchEvent(new CustomEvent(CHANGE_EVENT, { detail: key }));
}

// Parsed values cached by their raw text, so object values keep the same identity between
// reads (useSyncExternalStore needs that).
const cache = new Map<string, { raw: string | null; value: unknown }>();

function subscribe(callback: () => void) {
  window.addEventListener(CHANGE_EVENT, callback);
  window.addEventListener("storage", callback); // changes made in other tabs
  return () => {
    window.removeEventListener(CHANGE_EVENT, callback);
    window.removeEventListener("storage", callback);
  };
}

/**
 * A remembered value as React state. `fallback` is used until something is stored; it can
 * be a function, evaluated in the browser (e.g. to follow the system's dark mode).
 * `serverValue` is what's rendered before the browser takes over.
 */
export function useStored<T>(key: string, fallback: T | (() => T), serverValue?: T): [T, (value: T) => void] {
  const value = useSyncExternalStore(
    subscribe,
    () => {
      let raw: string | null = null;
      try {
        raw = localStorage.getItem(key);
      } catch {
        raw = null;
      }
      const hit = cache.get(key);
      if (hit && hit.raw === raw && raw !== null) return hit.value as T;
      if (raw === null) {
        const fb = typeof fallback === "function" ? (fallback as () => T)() : fallback;
        // Cache the fallback too so object fallbacks stay stable.
        if (hit && hit.raw === null && JSON.stringify(hit.value) === JSON.stringify(fb)) return hit.value as T;
        cache.set(key, { raw: null, value: fb });
        return fb;
      }
      try {
        const parsed = JSON.parse(raw) as T;
        cache.set(key, { raw, value: parsed });
        return parsed;
      } catch {
        return typeof fallback === "function" ? (fallback as () => T)() : fallback;
      }
    },
    () => (serverValue !== undefined ? serverValue : typeof fallback === "function" ? (undefined as T) : fallback),
  );

  const set = useCallback((next: T) => writeStored(key, next), [key]);
  return [value, set];
}
