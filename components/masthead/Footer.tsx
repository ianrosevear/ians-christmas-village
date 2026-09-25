"use client";

import { usePathname } from "next/navigation";
import { CompactToggles, EditionToggle, SnowToggle } from "./EditionToggles";
import { useSounds } from "@/components/Sounds";

export default function Footer() {
  const isFront = usePathname() === "/";
  const { anyPlaying, stopAll } = useSounds();

  return (
    <footer className={`${isFront ? "mt-2" : "mt-12"} border-t border-[var(--rule)] pt-2 text-[14px] text-[var(--ink-soft)]`}>
      {!isFront && (
        <>
          <div className="sm:hidden">
            <CompactToggles />
          </div>
          <div className="hidden flex-wrap gap-x-6 text-[15px] sm:flex">
            <EditionToggle />
            <SnowToggle />
          </div>
        </>
      )}
      <div className="flex flex-col gap-1 pt-2 sm:flex-row sm:items-center sm:justify-between">
        <span>Made by Ian Rosevear</span>
        {anyPlaying && (
          <div className="sc flex items-center gap-2 text-[15px]">
            <span>Sounds playing</span>
            <button type="button" onClick={stopAll} className="min-h-11 px-1 text-[var(--ink)] underline underline-offset-4">
              Stop
            </button>
          </div>
        )}
      </div>
    </footer>
  );
}
