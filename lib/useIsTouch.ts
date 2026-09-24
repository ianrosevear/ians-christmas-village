"use client";

import { useSyncExternalStore } from "react";

const QUERY = "(pointer: coarse)";

/** True on devices whose main pointer is a finger. False during server rendering. */
export function useIsTouch(): boolean {
  return useSyncExternalStore(
    (callback) => {
      const mq = window.matchMedia(QUERY);
      mq.addEventListener("change", callback);
      return () => mq.removeEventListener("change", callback);
    },
    () => window.matchMedia(QUERY).matches,
    () => false,
  );
}
