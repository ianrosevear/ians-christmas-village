"use client";

import { useSyncExternalStore } from "react";

/** Whether a media query matches. False during server rendering. */
export function useMediaQuery(query: string): boolean {
  return useSyncExternalStore(
    (callback) => {
      const mq = window.matchMedia(query);
      mq.addEventListener("change", callback);
      return () => mq.removeEventListener("change", callback);
    },
    () => window.matchMedia(query).matches,
    () => false,
  );
}

/** True on devices whose main pointer is a finger. */
export function useIsTouch(): boolean {
  return useMediaQuery("(pointer: coarse)");
}
