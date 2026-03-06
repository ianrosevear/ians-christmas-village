"use client";

import { useEffect, useRef, useState } from "react";
import { CrosswordPuzzle, CrosswordState, ClueDef, Direction } from "@/lib/crossword/types";
import { getActiveClue } from "@/lib/crossword/navigation";
import { SmallToggle } from "@/lib/crossword/annotations";

type AnnotationMap = Record<string, (show: boolean) => React.ReactNode>;

interface CrosswordCluesProps {
  puzzle: CrosswordPuzzle;
  state: CrosswordState;
  onClueClick: (clueNumber: number, direction: Direction) => void;
  annotations?: AnnotationMap;
}

function ClueItem({
  clue,
  direction,
  isActive,
  activeRef,
  onClick,
  annotation,
}: {
  clue: ClueDef;
  direction: Direction;
  isActive: boolean;
  activeRef: React.RefObject<HTMLLIElement | null>;
  onClick: () => void;
  annotation?: (show: boolean) => React.ReactNode;
}) {
  const [showColors, setShowColors] = useState(false);

  return (
    <li
      ref={isActive ? activeRef : undefined}
      className={`px-2 py-1 cursor-pointer rounded hover:bg-[var(--color-dark)]/5 dark:hover:bg-[var(--color-snow)]/5 ${
        isActive ? "crossword-clue--active" : ""
      }`}
      onClick={onClick}
    >
      <span className="font-bold mr-2">{clue.number}</span>
      {annotation ? (
        <>
          {annotation(showColors)}
          {" "}
          <SmallToggle
            label="colors"
            active={showColors}
            onClick={() => setShowColors(!showColors)}
          />
        </>
      ) : (
        clue.text
      )}
    </li>
  );
}

export default function CrosswordClues({ puzzle, state, onClueClick, annotations }: CrosswordCluesProps) {
  const activeClue = getActiveClue(puzzle, state.cursor.row, state.cursor.col, state.direction);
  const activeRef = useRef<HTMLLIElement>(null);

  useEffect(() => {
    activeRef.current?.scrollIntoView({ block: "nearest", behavior: "smooth" });
  }, [activeClue?.number, activeClue?.direction]);

  const acrossClues = puzzle.clues
    .filter((c) => c.direction === "across")
    .sort((a, b) => a.number - b.number);
  const downClues = puzzle.clues
    .filter((c) => c.direction === "down")
    .sort((a, b) => a.number - b.number);

  const isActive = (num: number, dir: Direction) =>
    activeClue?.number === num && activeClue?.direction === dir;

  const clueKey = (num: number, dir: Direction) =>
    `${num}${dir === "across" ? "A" : "D"}`;

  return (
    <div className="flex flex-col gap-4 text-sm text-[var(--color-dark)] dark:text-[var(--color-snow)] min-w-0">
      {annotations && (
        <div className="cursor-default flex flex-wrap gap-x-3 gap-y-1 text-xs">
          <span className="rounded px-1 bg-blue-200/60 dark:bg-blue-500/30">Definition</span>
          <span className="rounded px-1 bg-pink-200/70 dark:bg-pink-400/30">Indicator</span>
          <span className="rounded px-1 bg-amber-200/70 dark:bg-amber-400/30">Fodder</span>
          <span className="rounded px-1 bg-orange-200/70 dark:bg-orange-400/30">Charade</span>
        </div>
      )}
      <div>
        <h3 className="font-raleway text-base font-bold mb-2 tracking-wide uppercase text-[var(--color-dark)]/60 dark:text-[var(--color-snow)]/50">
          Across
        </h3>
        <ol className="space-y-1">
          {acrossClues.map((clue) => (
            <ClueItem
              key={`a${clue.number}`}
              clue={clue}
              direction="across"
              isActive={isActive(clue.number, "across")}
              activeRef={activeRef}
              onClick={() => onClueClick(clue.number, "across")}
              annotation={annotations?.[clueKey(clue.number, "across")]}
            />
          ))}
        </ol>
      </div>
      <div>
        <h3 className="font-raleway text-base font-bold mb-2 tracking-wide uppercase text-[var(--color-dark)]/60 dark:text-[var(--color-snow)]/50">
          Down
        </h3>
        <ol className="space-y-1">
          {downClues.map((clue) => (
            <ClueItem
              key={`d${clue.number}`}
              clue={clue}
              direction="down"
              isActive={isActive(clue.number, "down")}
              activeRef={activeRef}
              onClick={() => onClueClick(clue.number, "down")}
              annotation={annotations?.[clueKey(clue.number, "down")]}
            />
          ))}
        </ol>
      </div>
    </div>
  );
}
