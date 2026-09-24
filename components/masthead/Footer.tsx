"use client";

import { usePathname } from "next/navigation";
import { EditionToggle, SnowToggle } from "./EditionToggles";

export default function Footer() {
  const isFront = usePathname() === "/";

  return (
    <footer className="mt-12 border-t border-[var(--rule)] pt-2 text-[14px] text-[var(--ink-soft)]">
      {!isFront && (
        <div className="flex flex-wrap gap-x-6 text-[15px]">
          <EditionToggle />
          <SnowToggle />
        </div>
      )}
      <div className="flex flex-col gap-1 pt-2 sm:flex-row sm:justify-between">
        <span>Made by Ian Rosevear</span>
        {/* Freepik attribution, required by the favicon's license */}
        <a href="http://www.freepik.com" target="_blank" rel="noopener noreferrer" className="!text-[var(--ink-soft)]">
          Favicon by Freepik
        </a>
      </div>
    </footer>
  );
}
