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
function labelFor(clue: ClueDef) {
  return `${clue.number} ${clue.direction === "across" ? "Across" : "Down"}`;
}

function ClueLine({ clue, children }: { clue: ClueDef | null; children?: React.ReactNode }) {
  return (
    <span className="flex min-w-0 flex-col justify-center gap-0.5 self-center py-2 md:flex-row md:items-baseline md:gap-3">
      <span className="sc shrink-0 text-[14px] font-bold text-[var(--ink-soft)] md:text-[16px] md:text-[var(--ink)]">
        {clue ? labelFor(clue) : ""}
      </span>
      <span className="text-[18px] leading-snug md:text-[20px]">{children}</span>
    </span>
  );
}

export default function ClueBar({
  clue,
  allClues,
  hasWordplay,
  annotation,
  wordplayOn,
  onToggleWordplay,
  onPrev,
  onNext,
  onSwitchDirection,
  solved,
}: {
  clue: ClueDef | null;
  /** Every clue in the puzzle: the bar is sized to fit the longest, so it never changes height. */
  allClues: ClueDef[];
  /** Whether any clue has a wordplay button: if so its space is kept for every clue. */
  hasWordplay: boolean;
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
      </div>
    );
  }

  const label = clue ? labelFor(clue) : "";

  return (
    <div className="flex min-h-[76px] items-stretch bg-[var(--tint-strong)] md:min-h-16" aria-live="polite">
      <button type="button" aria-label="Previous clue" onClick={onPrev} className="flex w-11 shrink-0 items-center justify-center">
        <Arrow dir="prev" />
      </button>
      <button
        type="button"
        onClick={onSwitchDirection}
        aria-label={`${label}. Switch direction`}
        // Every clue is laid out invisibly in the same grid cell as the current one, so the bar
        // is always as tall as the longest clue and the grid below never moves.
        className="grid min-w-0 grow text-left [&>*]:[grid-area:1/1]"
      >
        {allClues.map((c) => (
          <span key={`${c.number}-${c.direction}`} aria-hidden="true" className="invisible">
            <ClueLine clue={c}>
              <ClueText clue={c} showWordplay={false} />
            </ClueLine>
          </span>
        ))}
        <ClueLine clue={clue}>{clue && <ClueText clue={clue} annotation={annotation} showWordplay={wordplayOn} />}</ClueLine>
      </button>
      {hasWordplay && (
        <span className={`flex items-center ${annotation && clue ? "" : "invisible"}`} aria-hidden={annotation && clue ? undefined : true}>
          <WordplayButton on={wordplayOn} label={label} onToggle={onToggleWordplay} size="lg" />
        </span>
      )}
      <button type="button" aria-label="Next clue" onClick={onNext} className="flex w-11 shrink-0 items-center justify-center">
        <Arrow dir="next" />
      </button>
    </div>
  );
}
