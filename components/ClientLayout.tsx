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

      <div className="snow-ground" />

      <main className="relative z-10 pt-20 pb-0 px-4 min-h-screen flex justify-center">
        <div className="w-full max-w-3xl bg-white/80 backdrop-blur-sm rounded-2xl border border-white/50 shadow-xl shadow-blue-900/10 p-8 h-fit">
          {children}
        </div>
      </main>
    </>
  );
}
