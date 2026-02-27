"use client";

import { useSyncExternalStore } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Toggle from "./Toggle";
import Snowflakes from "./Snowflakes";

const routes = [
  { label: "Home", href: "/" },
  { label: "Favorites", href: "/favorites" },
];

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
  const showWindow = !isHome || windowOpen;

  return (
    <div
      className={`${darkMode ? "dark" : ""} bg-texture min-h-screen transition-colors duration-300`}
      style={{
        backgroundImage: darkMode ? "url('/cabin-night.png')" : "url('/cabin-day.png')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundAttachment: "fixed",
      }}
    >
      {/* Floating toggles */}
      <div className="fixed top-4 right-4 z-50 flex items-center gap-2">
        <Toggle checked={darkMode} onChange={toggleDark} icon="🌙" />
        <Toggle checked={snowEnabled} onChange={toggleSnow} icon="❄️" />
        {isHome && (
          <Toggle checked={windowOpen} onChange={toggleWindow} icon="🏠" />
        )}
      </div>

      {snowEnabled && <Snowflakes />}

      {/* Home: countdown floats in the scene when window is closed */}
      {isHome && !windowOpen && (
        <div className="fixed inset-0 flex items-start justify-center z-10 pointer-events-none pt-18">
          {children}
        </div>
      )}

      {/* Main window */}
      {showWindow && (
        <main className="relative z-10 pt-12 pb-8 px-4 min-h-screen flex justify-center">
          <div className="w-full max-w-3xl h-fit rounded-2xl overflow-hidden bg-white border border-stone-200 shadow-2xl shadow-slate-300/60 dark:bg-slate-800/70 dark:backdrop-blur-md dark:border-slate-600/60 dark:shadow-slate-900/80">
            <nav className="flex items-center gap-1 px-6 py-3 bg-stone-100 border-b border-stone-200 dark:bg-slate-700/60 dark:border-slate-600/50">
              {routes.map((route) => {
                const isActive = pathname === route.href;
                return (
                  <Link
                    key={route.href}
                    href={route.href}
                    className={`relative px-3 py-1.5 text-sm rounded-md font-medium transition-all duration-200 ${
                      isActive
                        ? "text-[var(--color-gold)]"
                        : "text-[var(--color-dark)]/60 hover:text-[var(--color-gold)] hover:bg-black/5 dark:text-[var(--color-snow)]/60 dark:hover:bg-white/5"
                    }`}
                  >
                    {route.label}
                    {isActive && (
                      <span className="absolute bottom-0 left-3 right-3 h-0.5 rounded-full bg-[var(--color-gold)] opacity-80" />
                    )}
                  </Link>
                );
              })}
            </nav>
            <div className="p-8">
              {children}
            </div>
          </div>
        </main>
      )}
    </div>
  );
}