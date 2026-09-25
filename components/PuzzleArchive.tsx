"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import GridThumbnail from "./GridThumbnail";
import { NewTag, PuzzleDetails } from "./PuzzleDetails";
import type { PuzzleInfo, PuzzleType } from "@/lib/crossword/puzzles";
import type { GridShape } from "@/lib/crossword/thumbnail";
import { readProgressStatus } from "@/lib/crossword/storage";

type ArchivePuzzle = PuzzleInfo & { date: string; shape: GridShape };

const FILTERS: { key: PuzzleType | "all"; label: string }[] = [
  { key: "all", label: "All" },
  { key: "cryptic", label: "Cryptic" },
  { key: "standard", label: "Standard" },
];

export default function PuzzleArchive({ puzzles, children }: { puzzles: ArchivePuzzle[]; children?: React.ReactNode }) {
  const [filter, setFilter] = useState<PuzzleType | "all">("all");
  const [status, setStatus] = useState<Record<string, "solved" | "started" | null>>({});

  useEffect(() => {
    // Progress lives in this browser's storage, so it can only be read after mounting.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setStatus(Object.fromEntries(puzzles.map((p) => [p.slug, readProgressStatus(p.slug)])));
  }, [puzzles]);

  const shown = filter === "all" ? puzzles : puzzles.filter((p) => p.type === filter);

  return (
    <>
      <div className="mt-8 mb-2 flex flex-wrap items-end justify-between gap-x-6 gap-y-2">
        <h1 className="text-[44px] leading-none font-semibold tracking-[-0.015em] sm:text-[64px]">Puzzles</h1>
        <div role="group" aria-label="Filter by type" className="sc flex gap-5 text-[18px] sm:gap-6">
          {FILTERS.map((f) => (
            <button key={f.key} type="button" aria-pressed={filter === f.key} onClick={() => setFilter(f.key)} className="text-toggle min-h-11">
              {f.label}
            </button>
          ))}
        </div>
      </div>
      {children}

      <ul className="border-t-[3px] border-[var(--rule)]">
        {shown.map((p) => {
          const s = status[p.slug];
          return (
            <li key={p.slug} className="border-b border-[var(--rule-soft)]">
              <Link
                href={`/crossword/${p.slug}`}
                className="plain grid grid-cols-[88px_minmax(0,1fr)] items-center gap-x-4 py-5 sm:grid-cols-[150px_minmax(0,1fr)_140px] sm:gap-x-8 sm:py-6"
              >
                <span className="flex items-center justify-center sm:h-[142px]">
                  <span className="sm:hidden">
                    <GridThumbnail shape={p.shape} size={86} />
                  </span>
                  <span className="hidden sm:block">
                    <GridThumbnail shape={p.shape} size={142} />
                  </span>
                </span>
                <span className="min-w-0">
                  <span className="mb-1.5 block text-[24px] leading-tight font-semibold sm:text-[32px]">
                    {p.title}
                    {p.isNew && <NewTag />}
                  </span>
                  <PuzzleDetails kind={p.kind} level={p.level} published={p.date} />
                  {p.note && <span className="mt-2 block text-[17px] text-[var(--ink-body)] italic sm:text-[18px]">{p.note}</span>}
                  {s && (
                    <span className={`sc mt-1 block text-[16px] sm:hidden ${s === "solved" ? "text-[var(--success)]" : "text-[var(--accent)]"}`}>
                      {s === "solved" ? "Solved" : "In progress"}
                    </span>
                  )}
                </span>
                <span
                  className={`sc hidden text-right text-[16px] sm:block ${s === "solved" ? "text-[var(--success)]" : "text-[var(--accent)]"}`}
                >
                  {s === "solved" ? "Solved" : s === "started" ? "In progress" : ""}
                </span>
              </Link>
            </li>
          );
        })}
      </ul>
    </>
  );
}
