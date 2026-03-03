"use client";

import { useCallback, useEffect, useReducer, useRef, useState } from "react";
import { CrosswordPuzzle, CrosswordState, Direction } from "@/lib/crossword/types";
import { getActiveClue, handleArrowKey, handleBackspace, handleCellClick, handleClueClick, handleLetterInput, handleTab } from "@/lib/crossword/navigation";
import { loadProgress, saveProgress, emptyState } from "@/lib/crossword/storage";
import CrosswordGrid from "./CrosswordGrid";
import CrosswordClues from "./CrosswordClues";

type Action =
  | { type: "SET"; state: CrosswordState }
  | { type: "CELL_CLICK"; row: number; col: number }
  | { type: "LETTER"; letter: string }
  | { type: "BACKSPACE" }
  | { type: "ARROW"; arrow: "ArrowUp" | "ArrowDown" | "ArrowLeft" | "ArrowRight" }
  | { type: "TAB"; shift: boolean }
  | { type: "CLUE_CLICK"; clueNumber: number; direction: Direction };

function makeReducer(puzzle: CrosswordPuzzle) {
  return function reducer(state: CrosswordState, action: Action): CrosswordState {
    switch (action.type) {
      case "SET":
        return action.state;
      case "CELL_CLICK":
        return handleCellClick(puzzle, state, action.row, action.col);
      case "LETTER":
        return handleLetterInput(puzzle, state, action.letter);
      case "BACKSPACE":
        return handleBackspace(puzzle, state);
      case "ARROW":
        return handleArrowKey(puzzle, state, action.arrow);
      case "TAB":
        return handleTab(puzzle, state, action.shift);
      case "CLUE_CLICK":
        return handleClueClick(puzzle, state, action.clueNumber, action.direction);
      default:
        return state;
    }
  };
}

interface CrosswordPageProps {
  puzzle: CrosswordPuzzle;
}

export default function CrosswordPage({ puzzle }: CrosswordPageProps) {
  const [state, dispatch] = useReducer(
    makeReducer(puzzle),
    null,
    () => {
      if (typeof window === "undefined") return emptyState(puzzle.height, puzzle.width);
      return loadProgress(puzzle.title, puzzle.height, puzzle.width);
    },
  );

  // Persist state to localStorage
  useEffect(() => {
    saveProgress(puzzle.title, state);
  }, [puzzle.title, state]);

  // Focus management
  const wrapperRef = useRef<HTMLDivElement>(null);
  const hiddenInputRef = useRef<HTMLInputElement>(null);

  const focusInput = useCallback(() => {
    hiddenInputRef.current?.focus();
  }, []);

  // Auto-focus on mount
  useEffect(() => {
    focusInput();
  }, [focusInput]);

  // Completion checks
  const allFilled = puzzle.grid.flat().every(
    (cell) => state.entries[cell.row][cell.col] !== "",
  );
  const isCorrect = puzzle.grid.flat().every(
    (cell) => state.entries[cell.row][cell.col] === cell.solution,
  );
  const locked = isCorrect;

  const onCellClick = useCallback(
    (row: number, col: number) => {
      dispatch({ type: "CELL_CLICK", row, col });
      focusInput();
    },
    [focusInput],
  );

  const onClueClick = useCallback(
    (clueNumber: number, direction: Direction) => {
      dispatch({ type: "CLUE_CLICK", clueNumber, direction });
      focusInput();
    },
    [focusInput],
  );

  const onKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (locked) return;

    if (e.key === "Tab") {
      e.preventDefault();
      dispatch({ type: "TAB", shift: e.shiftKey });
      return;
    }

    if (e.key === "Backspace") {
      e.preventDefault();
      dispatch({ type: "BACKSPACE" });
      return;
    }

    if (["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].includes(e.key)) {
      e.preventDefault();
      dispatch({ type: "ARROW", arrow: e.key as "ArrowUp" | "ArrowDown" | "ArrowLeft" | "ArrowRight" });
      return;
    }

    // Single letter
    if (e.key.length === 1 && /^[a-zA-Z]$/.test(e.key)) {
      e.preventDefault();
      dispatch({ type: "LETTER", letter: e.key });
      return;
    }
  }, [locked]);

  const [confirmingReset, setConfirmingReset] = useState(false);

  const onReset = useCallback(() => {
    if (!confirmingReset) {
      setConfirmingReset(true);
      return;
    }
    setConfirmingReset(false);
    dispatch({ type: "SET", state: emptyState(puzzle.height, puzzle.width) });
    focusInput();
  }, [puzzle.height, puzzle.width, focusInput, confirmingReset]);

  const onCancelReset = useCallback(() => {
    setConfirmingReset(false);
  }, []);

  // Current clue for the bar display above the grid
  const activeClue = getActiveClue(puzzle, state.cursor.row, state.cursor.col, state.direction);

  return (
    <div className="font-playfair">
      <div className="mb-3 flex items-start justify-between">
        <div>
          <h2 className="text-2xl italic text-[var(--color-dark)] dark:text-[var(--color-snow)] mb-0.5">
            {puzzle.title}
          </h2>
          <p className="text-xs text-[var(--color-dark)]/40 dark:text-[var(--color-snow)]/35">
            By {puzzle.author}
          </p>
        </div>
        <div className="flex items-center gap-2 mt-1">
          {confirmingReset ? (
            <>
              <span className="text-xs text-[var(--color-cranberry)] tracking-widest uppercase">
                Are you sure?
              </span>
              <button
                onClick={onReset}
                className="font-playfair text-xs cursor-pointer text-[var(--color-cranberry)] hover:text-[var(--color-cranberry)]/80 tracking-widest uppercase font-bold"
              >
                Yes
              </button>
              <button
                onClick={onCancelReset}
                className="font-playfair text-xs cursor-pointer text-[var(--color-dark)]/40 hover:text-[var(--color-dark)]/70 dark:text-[var(--color-snow)]/30 dark:hover:text-[var(--color-snow)]/60 tracking-widest uppercase"
              >
                No
              </button>
            </>
          ) : (
            <button
              onClick={onReset}
              className="font-playfair text-xs cursor-pointer text-[var(--color-dark)]/40 hover:text-[var(--color-dark)]/70 dark:text-[var(--color-snow)]/30 dark:hover:text-[var(--color-snow)]/60 tracking-widest uppercase"
            >
              Reset
            </button>
          )}
        </div>
      </div>

      {/* Status / active clue bar — always takes up space so layout doesn't shift */}
      {allFilled && isCorrect ? (
        <div className="mb-3 px-3 py-2 rounded bg-[var(--color-pine)]/10 dark:bg-[var(--color-pine)]/10 text-[var(--color-pine)] dark:text-green-400 text-sm font-bold">
          Correct! Puzzle complete.
        </div>
      ) : (
        <div className="mb-3 px-3 py-2 rounded bg-[var(--color-dark)]/5 dark:bg-[var(--color-snow)]/5 text-sm text-[var(--color-dark)] dark:text-[var(--color-snow)]">
          {allFilled && !isCorrect ? (
            <span className="text-[var(--color-cranberry)] font-bold">
              Not quite right — some letters are incorrect.
            </span>
          ) : activeClue ? (
            <>
              <span className="font-bold mr-2">
                {activeClue.number}{activeClue.direction === "across" ? "A" : "D"}
              </span>
              {activeClue.text}
            </>
          ) : (
            <span>&nbsp;</span>
          )}
        </div>
      )}

      <div
        ref={wrapperRef}
        className="flex flex-col md:flex-row gap-6 outline-none relative"
        onClick={focusInput}
      >
        {/* Hidden input for keyboard capture (including mobile) */}
        <input
          ref={hiddenInputRef}
          className="absolute opacity-0 w-0 h-0"
          type="text"
          inputMode="text"
          autoComplete="off"
          autoCapitalize="characters"
          onKeyDown={onKeyDown}
          onChange={() => {
            if (hiddenInputRef.current) hiddenInputRef.current.value = "";
          }}
          onInput={(e) => {
            if (locked) return;
            const input = e.currentTarget;
            const val = input.value;
            if (val && /^[a-zA-Z]$/.test(val)) {
              dispatch({ type: "LETTER", letter: val });
            }
            input.value = "";
          }}
        />

        <div className="shrink-0 relative w-fit h-fit">
          <CrosswordGrid puzzle={puzzle} state={state} onCellClick={onCellClick} />
          {locked && (
            <div className="absolute inset-0 bg-[var(--color-pine)]/8 dark:bg-green-400/8 rounded pointer-events-none" />
          )}
        </div>

        <div className="flex-1 min-w-0 max-h-[420px] overflow-y-auto">
          <CrosswordClues puzzle={puzzle} state={state} onClueClick={onClueClick} />
        </div>
      </div>
    </div>
  );
}
