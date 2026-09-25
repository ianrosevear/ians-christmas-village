"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { CrosswordPuzzle, CrosswordState, Direction } from "@/lib/crossword/types";
import { getActiveClue } from "@/lib/crossword/navigation";
import { getReferencedClues } from "@/lib/crossword/clueReferences";
import { ANNOTATION_CLASSES, WORDPLAY_KEY } from "@/lib/crossword/annotations";
import { ClueText, WordplayButton, clueKey, type AnnotationMap } from "./ClueText";

/** The four highlighter colours; tap one to read what it means. `children` sit at the end of the row. */
function WordplayKey({ className = "", children }: { className?: string; children?: React.ReactNode }) {
  const [active, setActive] = useState<string | null>(null);
  const item = WORDPLAY_KEY.find((k) => k.key === active);

  return (
    <div className={`mb-3.5 border-b border-[var(--rule)] pb-2 ${className}`}>
      <div className="flex flex-wrap items-center justify-between gap-x-4">
        <div className="flex flex-wrap items-baseline gap-x-3.5 gap-y-1 text-[16px]">
          <span className="sc text-[var(--ink-soft)]">Key</span>
          {WORDPLAY_KEY.map((k) => (
            <button
              key={k.key}
              type="button"
              aria-expanded={active === k.key}
              onClick={() => setActive(active === k.key ? null : k.key)}
              className={`${ANNOTATION_CLASSES[k.key]} min-h-8 ${active === k.key ? "underline underline-offset-4" : ""}`}
            >
              {k.label}
            </button>
          ))}
        </div>
        {children}
      </div>
      {item && <p className="mt-1 text-[16px] text-[var(--ink-soft)]">{item.desc}</p>}
    </div>
  );
}

export function ShowAllSwitch({ on, onChange }: { on: boolean; onChange: (on: boolean) => void }) {
  return (
    <button type="button" role="switch" aria-checked={on} onClick={() => onChange(!on)} className="sc flex min-h-10 items-center gap-2 text-[16px]">
      Show all
      <span className={`relative inline-block h-[17px] w-8 rounded-full border-[1.5px] border-[var(--ink)] ${on ? "bg-[var(--ink)]" : ""}`}>
        <span
          className={`absolute top-[1.5px] size-[11px] rounded-full transition-[left] ${on ? "left-[16.5px] bg-[var(--paper)]" : "left-[1.5px] bg-[var(--ink)]"}`}
        />
      </span>
    </button>
  );
}

interface CrosswordCluesProps {
  puzzle: CrosswordPuzzle;
  state: CrosswordState;
  onClueClick: (clueNumber: number, direction: Direction) => void;
  annotations?: AnnotationMap;
  isWordplayOn: (key: string) => boolean;
  toggleWordplay: (key: string) => void;
  showAll: boolean;
  setShowAll: (on: boolean) => void;
  /** Responsive classes for laying out the clues: the whole panel, the pair of lists, each list, and each list's scrolling box. */
  panel: { root: string; lists: string; list: string; scroll: string };
  scrollActiveIntoView: boolean;
}

export default function CrosswordClues({
  puzzle,
  state,
  onClueClick,
  annotations,
  isWordplayOn,
  toggleWordplay,
  showAll,
  setShowAll,
  panel,
  scrollActiveIntoView,
}: CrosswordCluesProps) {
  const activeClue = getActiveClue(puzzle, state.cursor.row, state.cursor.col, state.direction);
  const activeRef = useRef<HTMLLIElement>(null);

  // Keep the active clue in view as you move around the grid (not on first load).
  const mounted = useRef(false);
  useEffect(() => {
    if (!mounted.current) {
      mounted.current = true;
      return;
    }
    const row = activeRef.current;
    if (!scrollActiveIntoView || !row) return;
    // When the list scrolls in its own box, scroll just that box, so the page stays put.
    const box = row.closest("ol");
    if (box && box.scrollHeight > box.clientHeight) {
      const r = row.getBoundingClientRect();
      const b = box.getBoundingClientRect();
      const by = r.top < b.top ? r.top - b.top : r.bottom > b.bottom ? r.bottom - b.bottom : 0;
      if (by) box.scrollBy({ top: by, behavior: "smooth" });
    } else row.scrollIntoView({ block: "nearest", behavior: "smooth" });
  }, [activeClue?.number, activeClue?.direction, scrollActiveIntoView]);

  const referenced = useMemo(() => (activeClue ? getReferencedClues(puzzle, activeClue) : []), [puzzle, activeClue]);

  const lists = (["across", "down"] as const).map((direction) => ({
    direction,
    clues: puzzle.clues.filter((c) => c.direction === direction).sort((a, b) => a.number - b.number),
  }));

  return (
    <div className={panel.root}>
      {annotations && (
        <WordplayKey className="shrink-0">
          <ShowAllSwitch on={showAll} onChange={setShowAll} />
        </WordplayKey>
      )}

      <div className={`grid grid-cols-1 gap-x-9 gap-y-6 ${panel.lists}`}>
        {lists.map(({ direction, clues }) => (
          <div key={direction} className={panel.list}>
            <h2 className="sc mb-1.5 shrink-0 text-[18px] font-bold">{direction === "across" ? "Across" : "Down"}</h2>
            <ol className={`xw-clue-scroll ${panel.scroll}`}>
              {clues.map((clue) => {
                const key = clueKey(clue);
                const isActive = activeClue === clue;
                const isReferenced = referenced.includes(clue);
                const annotation = annotations?.[key];
                const on = isWordplayOn(key);
                return (
                  <li
                    key={key}
                    ref={isActive ? activeRef : undefined}
                    className="xw-clue-row"
                    data-active={isActive || undefined}
                    data-referenced={(!isActive && isReferenced) || undefined}
                  >
                    <button
                      type="button"
                      onClick={() => onClueClick(clue.number, clue.direction)}
                      aria-current={isActive || undefined}
                      className="flex min-w-0 grow gap-2.5 px-2.5 py-[7px] text-left text-[18px] leading-[1.45]"
                    >
                      <span className="min-w-6 shrink-0 text-right font-bold">{clue.number}</span>
                      <span>
                        <ClueText clue={clue} annotation={annotation} showWordplay={on} />
                      </span>
                    </button>
                    {annotation && <WordplayButton on={on} label={`${clue.number} ${direction}`} onToggle={() => toggleWordplay(key)} />}
                  </li>
                );
              })}
            </ol>
          </div>
        ))}
      </div>
    </div>
  );
}
