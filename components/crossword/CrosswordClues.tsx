"use client";

import { useEffect, useRef } from "react";
import { CrosswordPuzzle, CrosswordState, Direction } from "@/lib/crossword/types";
import { getActiveClue } from "@/lib/crossword/navigation";

interface CrosswordCluesProps {
  puzzle: CrosswordPuzzle;
  state: CrosswordState;
  onClueClick: (clueNumber: number, direction: Direction) => void;
}

export default function CrosswordClues({ puzzle, state, onClueClick }: CrosswordCluesProps) {
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

  return (
    <div className="flex flex-col gap-4 text-sm text-[var(--color-dark)] dark:text-[var(--color-snow)] min-w-0">
      <div>
        <h3 className="font-playfair text-base font-bold mb-2 tracking-wide uppercase text-[var(--color-dark)]/60 dark:text-[var(--color-snow)]/50">
          Across
        </h3>
        <ol className="space-y-1">
          {acrossClues.map((clue) => (
            <li
              key={`a${clue.number}`}
              ref={isActive(clue.number, "across") ? activeRef : undefined}
              className={`px-2 py-1 cursor-pointer rounded hover:bg-[var(--color-dark)]/5 dark:hover:bg-[var(--color-snow)]/5 ${
                isActive(clue.number, "across") ? "crossword-clue--active" : ""
              }`}
              onClick={() => onClueClick(clue.number, "across")}
            >
              <span className="font-bold mr-2">{clue.number}</span>
              {clue.text}
            </li>
          ))}
        </ol>
      </div>
      <div>
        <h3 className="font-playfair text-base font-bold mb-2 tracking-wide uppercase text-[var(--color-dark)]/60 dark:text-[var(--color-snow)]/50">
          Down
        </h3>
        <ol className="space-y-1">
          {downClues.map((clue) => (
            <li
              key={`d${clue.number}`}
              ref={isActive(clue.number, "down") ? activeRef : undefined}
              className={`px-2 py-1 cursor-pointer rounded hover:bg-[var(--color-dark)]/5 dark:hover:bg-[var(--color-snow)]/5 ${
                isActive(clue.number, "down") ? "crossword-clue--active" : ""
              }`}
              onClick={() => onClueClick(clue.number, "down")}
            >
              <span className="font-bold mr-2">{clue.number}</span>
              {clue.text}
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
}
