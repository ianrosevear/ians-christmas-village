"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Switch } from "@headlessui/react";
import { useState } from "react";

const routes = [
  { label: "Home", href: "/" },
  { label: "Favorites", href: "/favorites" },
];

type NavProps = {
  snowEnabled: boolean;
  toggleSnow: () => void;
};

export default function Nav({ snowEnabled, toggleSnow }: NavProps) {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-[var(--color-pine)]/90 backdrop-blur-sm border-b border-[var(--color-gold)]/20">
      <div className="flex items-center justify-between px-6 py-3">
        <Link href="/" className="text-lg font-bold text-[var(--color-gold)]" style={{ fontFamily: "var(--font-playfair-display)" }}>
          🎄 Ian&apos;s Christmas Village
        </Link>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-6">
          {routes.map((route) => (
            <Link
              key={route.href}
              href={route.href}
              className={`text-sm transition-colors hover:text-[var(--color-gold)] ${
                pathname === route.href ? "text-[var(--color-gold)]" : "text-[var(--color-snow)]/70"
              }`}
            >
              {route.label}
            </Link>
          ))}
          <Switch
            checked={snowEnabled}
            onChange={toggleSnow}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors cursor-pointer select-none ${
              snowEnabled ? "bg-[var(--color-gold)]" : "bg-[var(--color-snow)]/20"
            }`}
          >
            <span className={`inline-flex items-center justify-center h-5 w-5 rounded-full bg-white transition-transform text-xs ${
              snowEnabled ? "translate-x-5.5" : "translate-x-0.5"
            }`}>
              ❄️
            </span>
          </Switch>
        </div>

        {/* Mobile: toggle + hamburger */}
        <div className="flex md:hidden items-center gap-3">
          <Switch
            checked={snowEnabled}
            onChange={toggleSnow}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors cursor-pointer select-none ${
              snowEnabled ? "bg-[var(--color-gold)]" : "bg-[var(--color-snow)]/20"
            }`}
          >
            <span className={`inline-flex items-center justify-center h-5 w-5 rounded-full bg-white transition-transform text-xs ${
              snowEnabled ? "translate-x-5.5" : "translate-x-0.5"
            }`}>
              ❄️
            </span>
          </Switch>
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="cursor-pointer text-[var(--color-snow)] text-2xl leading-none"
          >
            {menuOpen ? "✕" : "☰"}
          </button>
        </div>
      </div>

      {/* Mobile dropdown */}
      {menuOpen && (
        <div className="md:hidden px-6 pb-3 flex flex-col gap-2 border-t border-[var(--color-gold)]/10">
          {routes.map((route) => (
            <Link
              key={route.href}
              href={route.href}
              onClick={() => setMenuOpen(false)}
              className={`text-sm py-1 transition-colors hover:text-[var(--color-gold)] ${
                pathname === route.href ? "text-[var(--color-gold)]" : "text-[var(--color-snow)]/70"
              }`}
            >
              {route.label}
            </Link>
          ))}
        </div>
      )}
    </nav>
  );
}