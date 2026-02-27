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
  const pathname = usePathname();

  const toggleSnow = makeToggle("snowEnabled", true);
  const toggleDark = makeToggle("darkMode", false);

  return (
    <div className={darkMode ? "dark" : ""}>
      {/* Floating toggles */}
      <div className="fixed top-4 right-4 z-50 flex items-center gap-2">
        <Toggle checked={darkMode} onChange={toggleDark} icon="🌙" />
        <Toggle checked={snowEnabled} onChange={toggleSnow} icon="❄️" />
      </div>

      {snowEnabled && <Snowflakes />}
      <div className="snow-ground" />

      <main className="relative z-10 pt-12 pb-8 px-4 min-h-screen flex justify-center">
        <div className="w-full max-w-3xl bg-white/80 dark:bg-white/10 backdrop-blur-sm rounded-2xl border border-white/50 dark:border-white/10 shadow-xl shadow-blue-900/10 p-8 h-fit">
          <nav className="flex gap-4 mb-6 pb-4 border-b border-[var(--color-dark)]/10">
            {routes.map((route) => (
              <Link
                key={route.href}
                href={route.href}
                className={`text-sm transition-colors hover:text-[var(--color-gold)] ${
                  pathname === route.href
                    ? "text-[var(--color-gold)]"
                    : "text-[var(--color-dark)]/60"
                }`}
              >
                {route.label}
              </Link>
            ))}
          </nav>
          {children}
        </div>
      </main>
    </div>
  );
}