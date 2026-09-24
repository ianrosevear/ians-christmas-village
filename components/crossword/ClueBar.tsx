"use client";

import type { ClueDef } from "@/lib/crossword/types";
import { ClueText, WordplayButton, type Annotation } from "./ClueText";

function Arrow({ dir }: { dir: "prev" | "next" }) {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
      <path d={dir === "prev" ? "M10 3 5 8l5 5" : "m6 3 5 5-5 5"} />
    </svg>
  );
}

/** The current clue, with previous/next buttons. Tapping the clue switches direction. */
export default function ClueBar({
  clue,
  annotation,
  wordplayOn,
  onToggleWordplay,
  onPrev,
  onNext,
  onSwitchDirection,
  solved,
}: {
  clue: ClueDef | null;
  annotation?: Annotation;
  wordplayOn: boolean;
  onToggleWordplay: () => void;
  onPrev: () => void;
  onNext: () => void;
  onSwitchDirection: () => void;
  solved: boolean;
}) {
  if (solved) {
    return (
      <div className="flex min-h-[76px] items-center bg-[var(--tint-strong)] px-4 text-[20px] text-[var(--success)] md:min-h-16" role="status">
        <span className="sc mr-3 font-bold">Solved</span>
        <span className="italic">Well done.</span>
      </div>
    );
  }

  const label = clue ? `${clue.number} ${clue.direction === "across" ? "Across" : "Down"}` : "";

  return (
    <div className="flex min-h-[76px] items-stretch bg-[var(--tint-strong)] md:min-h-16" aria-live="polite">
      <button type="button" aria-label="Previous clue" onClick={onPrev} className="flex w-11 shrink-0 items-center justify-center">
        <Arrow dir="prev" />
      </button>
      <button
        type="button"
        onClick={onSwitchDirection}
        aria-label={`${label}. Switch direction`}
        className="flex min-w-0 grow flex-col justify-center gap-0.5 py-2 text-left md:flex-row md:items-baseline md:gap-3"
      >
        <span className="sc shrink-0 text-[14px] font-bold text-[var(--ink-soft)] md:text-[16px] md:text-[var(--ink)]">{label}</span>
        <span className="text-[18px] leading-snug md:text-[20px]">
          {clue && <ClueText clue={clue} annotation={annotation} showWordplay={wordplayOn} />}
        </span>
      </button>
      {annotation && clue && (
        <span className="flex items-center">
          <WordplayButton on={wordplayOn} label={label} onToggle={onToggleWordplay} size="lg" />
        </span>
      )}
      <button type="button" aria-label="Next clue" onClick={onNext} className="flex w-11 shrink-0 items-center justify-center">
        <Arrow dir="next" />
      </button>
    </div>
  );
}
