"use client";

import { useCallback, useSyncExternalStore } from "react";
import Nav from "./Nav";
import Snowflakes from "./Snowflakes";

function useSnowEnabled() {
  const value = useSyncExternalStore(
    (callback) => {
      window.addEventListener("storage", callback);
      return () => window.removeEventListener("storage", callback);
    },
    () => {
      const saved = localStorage.getItem("snowEnabled");
      return saved !== null ? JSON.parse(saved) : true;
    },
    () => true // server snapshot
  );
  return value;
}

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  const snowEnabled = useSnowEnabled();

  const toggleSnow = useCallback(() => {
    const next = !JSON.parse(localStorage.getItem("snowEnabled") ?? "true");
    localStorage.setItem("snowEnabled", JSON.stringify(next));
    window.dispatchEvent(new Event("storage"));
  }, []);

  return (
    <>
      <Nav snowEnabled={snowEnabled} toggleSnow={toggleSnow} />
      {snowEnabled && <Snowflakes />}
      <main className="pt-16 min-h-screen">{children}</main>
    </>
  );
}