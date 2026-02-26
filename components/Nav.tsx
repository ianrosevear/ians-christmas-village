"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Switch } from "@headlessui/react";

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

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-3 bg-[var(--color-pine)]/90 backdrop-blur-sm border-b border-[var(--color-gold)]/20">
      <div className="flex items-center gap-6">
        <Link href="/" className="text-lg font-bold text-[var(--color-gold)]" style={{ fontFamily: "var(--font-playfair-display)" }}>
          🎄 Ian&apos;s Christmas Village
        </Link>
        <div className="flex gap-4">
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
        </div>
      </div>
      <div className="flex items-center gap-2">
        <span className="text-sm">❄️</span>
        <Switch
          checked={snowEnabled}
          onChange={toggleSnow}
          className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${
            snowEnabled ? "bg-[var(--color-gold)]" : "bg-[var(--color-snow)]/20"
          }`}
        >
          <span
            className={`inline-block h-3.5 w-3.5 rounded-full bg-white transition-transform ${
              snowEnabled ? "translate-x-4.5" : "translate-x-0.5"
            }`}
          />
        </Switch>
      </div>
    </nav>
  );
}