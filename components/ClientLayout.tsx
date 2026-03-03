"use client";

import { useSyncExternalStore } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Toggle from "./Toggle";
import Snowflakes from "./Snowflakes";
import ChristmasCountdown from "./ChristmasCountdown";
import ExploreMoreButton from "./ExploreMoreButton";

function useLocalStorageToggle(key: string, defaultValue: boolean) {
  const value = useSyncExternalStore(
    (callback) => {
      window.addEventListener("storage", callback);
      return () => window.removeEventListener("storage", callback);
    },
    () => {
      const saved = localStorage.getItem(key);
      return saved !== null ? JSON.parse(saved) : defaultValue;
    },
    () => defaultValue
  );
  return value;
}

function makeToggle(key: string, defaultValue: boolean) {
  return () => {
    const next = !JSON.parse(localStorage.getItem(key) ?? JSON.stringify(defaultValue));
    localStorage.setItem(key, JSON.stringify(next));
    window.dispatchEvent(new Event("storage"));
  };
}

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  const snowEnabled = useLocalStorageToggle("snowEnabled", true);
  const darkMode = useLocalStorageToggle("darkMode", false);
  const windowOpen = useLocalStorageToggle("windowOpen", false);
  const pathname = usePathname();

  const toggleSnow = makeToggle("snowEnabled", true);
  const toggleDark = makeToggle("darkMode", false);
  const toggleWindow = makeToggle("windowOpen", false);

  const isHome = pathname === "/";
  const isCrossword = pathname.startsWith("/crossword");
  const showWindow = !isHome || windowOpen;

  return (
    <div
      className={`${darkMode ? "dark" : ""} bg-scene min-h-screen transition-colors duration-300`}
    >
      {/* Floating toggles */}
      <div className="fixed top-4 right-4 z-50 flex items-center gap-2">
        <Toggle checked={darkMode} onChange={toggleDark} icon="🌙" />
        <Toggle checked={snowEnabled} onChange={toggleSnow} icon="❄️" />
      </div>

      {snowEnabled && <Snowflakes />}

      {/* Home scene: title, countdown, explore button */}
      {isHome && !windowOpen && (
        <div className="fixed inset-0 flex items-start justify-center z-10 pointer-events-none pt-18">
          <div className="flex flex-col items-center gap-8 py-12">
            <h1
              className="font-pixel text-5xl text-[var(--color-dark)] dark:text-[var(--color-snow)] text-center"
            >
              Welcome to Ian&apos;s Christmas Village
            </h1>
            <ChristmasCountdown />
            <ExploreMoreButton />
          </div>
        </div>
      )}

      {/* Main window */}
      {showWindow && (
        <main className="relative z-10 pt-12 pb-8 px-4 min-h-screen flex justify-center">
          <div className={`candy-cane-border w-full ${isCrossword ? "max-w-5xl" : "max-w-3xl"} h-fit`}>
          <div className="bg-[var(--color-snow)] dark:bg-[#1c1a14]">
            {/* Back / Countdown button */}
            <div className="px-8 pt-6 pb-0">
              {isHome ? (
                <button
                  onClick={toggleWindow}
                  className="font-raleway cursor-pointer text-xs text-[var(--color-dark)]/40 hover:text-[var(--color-dark)]/70 dark:text-[var(--color-snow)]/30 dark:hover:text-[var(--color-snow)]/60 tracking-widest uppercase"
                >
                  ← countdown
                </button>
              ) : (
                <Link
                  href="/"
                  className="font-raleway text-xs text-[var(--color-dark)]/40 hover:text-[var(--color-dark)]/70 dark:text-[var(--color-snow)]/30 dark:hover:text-[var(--color-snow)]/60 tracking-widest uppercase"
                >
                  ← back
                </Link>
              )}
            </div>

            <div className={isCrossword ? "px-6 py-4" : "px-8 py-8"}>
              {children}
            </div>
          </div>
          </div>
        </main>
      )}
      {/* Freepik attribution — required by license */}
      <div className="fixed bottom-2 left-1/2 -translate-x-1/2 z-50 text-[10px] text-[var(--color-dark)]/30 dark:text-[var(--color-snow)]/20">
        <a href="http://www.freepik.com" target="_blank" rel="noopener noreferrer" className="hover:opacity-60">
          Favicon by Freepik
        </a>
      </div>
    </div>
  );
}
