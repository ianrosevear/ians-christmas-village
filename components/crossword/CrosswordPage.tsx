"use client";

import { useCallback, useEffect, useReducer, useRef, useState } from "react";
import Link from "next/link";
import { CrosswordPuzzle, CrosswordState, Direction, cellKey } from "@/lib/crossword/types";
import {
  getActiveClue,
  handleArrowKey,
  handleBackspace,
  handleCellClick,
  handleClueClick,
  handleLetterInput,
  handleTab,
} from "@/lib/crossword/navigation";
import { loadProgress, saveProgress, emptyState } from "@/lib/crossword/storage";
import type { PuzzleInfo } from "@/lib/crossword/puzzles";
import { useIsTouch, useMediaQuery } from "@/lib/useIsTouch";
import CrosswordGrid from "./CrosswordGrid";
import CrosswordClues from "./CrosswordClues";
import ClueBar from "./ClueBar";
import OnScreenKeyboard, { KeyboardSpacer } from "./OnScreenKeyboard";
import { Toolbar, ToolsMenu, type Scope } from "./Toolbar";
import { clueKey, type AnnotationMap } from "./ClueText";

type Action =
  | { type: "SET"; state: CrosswordState }
  | { type: "CELL_CLICK"; row: number; col: number }
  | { type: "LETTER"; letter: string }
  | { type: "BACKSPACE" }
  | { type: "ARROW"; arrow: "ArrowUp" | "ArrowDown" | "ArrowLeft" | "ArrowRight" }
  | { type: "TAB"; shift: boolean }
  | { type: "CLUE_CLICK"; clueNumber: number; direction: Direction }
  | { type: "SWITCH_DIRECTION" }
  | { type: "FILL"; cells: [number, number][] };

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
      case "SWITCH_DIRECTION":
        // Same as tapping the selected cell again
        return handleCellClick(puzzle, state, state.cursor.row, state.cursor.col);
      case "FILL": {
        const entries = state.entries.map((row) => [...row]);
        for (const [r, c] of action.cells) entries[r][c] = puzzle.grid[r][c].solution;
        return { ...state, entries };
      }
      default:
        return state;
    }
  };
}

const ARROWS = ["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"] as const;

interface CrosswordPageProps {
  puzzle: CrosswordPuzzle;
  info: PuzzleInfo;
  annotations?: AnnotationMap;
}

export default function CrosswordPage({ puzzle, info, annotations }: CrosswordPageProps) {
  const [state, dispatch] = useReducer(makeReducer(puzzle), null, () => {
    if (typeof window === "undefined") return emptyState(puzzle.height, puzzle.width);
    return loadProgress(info.slug, puzzle.height, puzzle.width);
  });

  const isTouch = useIsTouch();
  const gridRef = useRef<HTMLDivElement>(null);
  const clueBarRef = useRef<HTMLDivElement>(null);

  const openCells = puzzle.grid.flat().filter((cell) => !cell.blocked);
  const solved = openCells.every((cell) => state.entries[cell.row][cell.col] === cell.solution);

  useEffect(() => {
    saveProgress(info.slug, state, solved);
  }, [info.slug, state, solved]);

  // ----- Check / reveal / clear -----

  const [checked, setChecked] = useState<Set<string>>(() => new Set());
  const [revealed, setRevealed] = useState<Set<string>>(() => new Set());
  const [confirming, setConfirming] = useState<"reveal" | "clear" | null>(null);

  const activeClue = getActiveClue(puzzle, state.cursor.row, state.cursor.col, state.direction);

  const cellsFor = useCallback(
    (scope: Scope): [number, number][] => {
      if (scope === "letter") return [[state.cursor.row, state.cursor.col]];
      if (scope === "word") return activeClue?.cells ?? [];
      return openCells.map((cell) => [cell.row, cell.col] as [number, number]);
    },
    [state.cursor, activeClue, openCells],
  );

  const focusGrid = useCallback(() => {
    if (!isTouch) gridRef.current?.focus({ preventScroll: true });
  }, [isTouch]);

  const onCheck = (scope: Scope) => {
    setChecked((prev) => new Set([...prev, ...cellsFor(scope).map(([r, c]) => cellKey(r, c))]));
    focusGrid();
  };

  const reveal = (cells: [number, number][]) => {
    const keys = cells.filter(([r, c]) => state.entries[r][c] !== puzzle.grid[r][c].solution).map(([r, c]) => cellKey(r, c));
    setRevealed((prev) => new Set([...prev, ...keys]));
    dispatch({ type: "FILL", cells });
    focusGrid();
  };

  const onReveal = (scope: Scope) => {
    if (scope === "puzzle") setConfirming("reveal");
    else reveal(cellsFor(scope));
  };

  const confirm = () => {
    if (confirming === "reveal") reveal(cellsFor("puzzle"));
    if (confirming === "clear") {
      dispatch({ type: "SET", state: emptyState(puzzle.height, puzzle.width) });
      setChecked(new Set());
      setRevealed(new Set());
      focusGrid();
    }
    setConfirming(null);
  };

  // A checked cell shows as wrong only while it still holds a wrong letter.
  const incorrect = new Set(
    [...checked].filter((key) => {
      const [r, c] = key.split(",").map(Number);
      const entry = state.entries[r][c];
      return entry !== "" && entry !== puzzle.grid[r][c].solution;
    }),
  );

  // ----- Wordplay colours (per clue, or all at once) -----

  const [wordplay, setWordplay] = useState<Set<string>>(() => new Set());
  const [showAll, setShowAllState] = useState(false);
  const isWordplayOn = (key: string) => showAll || wordplay.has(key);
  const toggleWordplay = (key: string) => {
    if (showAll) {
      // Turning one off while everything is on: keep the rest on.
      setShowAllState(false);
      setWordplay(new Set(Object.keys(annotations ?? {}).filter((k) => k !== key)));
      return;
    }
    setWordplay((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  };
  const setShowAll = (on: boolean) => {
    setShowAllState(on);
    if (!on) setWordplay(new Set());
  };

  // ----- Input -----

  const input = useCallback(
    (action: Action) => {
      if (solved && action.type !== "CLUE_CLICK" && action.type !== "CELL_CLICK") return;
      dispatch(action);
    },
    [solved],
  );

  const handleKey = useCallback(
    (e: KeyboardEvent | React.KeyboardEvent) => {
      if (e.metaKey || e.ctrlKey || e.altKey) return;
      if (e.key === "Tab") {
        e.preventDefault();
        input({ type: "TAB", shift: e.shiftKey });
      } else if (e.key === "Backspace" || e.key === "Delete") {
        e.preventDefault();
        input({ type: "BACKSPACE" });
      } else if ((ARROWS as readonly string[]).includes(e.key)) {
        e.preventDefault();
        input({ type: "ARROW", arrow: e.key as (typeof ARROWS)[number] });
      } else if (e.key === " ") {
        e.preventDefault();
        input({ type: "SWITCH_DIRECTION" });
      } else if (/^[a-zA-Z]$/.test(e.key)) {
        e.preventDefault();
        input({ type: "LETTER", letter: e.key });
      }
    },
    [input],
  );

  // Typing works even when nothing in particular has focus (e.g. a hardware keyboard on a tablet).
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (document.activeElement === document.body) handleKey(e);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [handleKey]);

  useEffect(() => {
    focusGrid();
  }, [focusGrid]);

  const onCellClick = (row: number, col: number) => {
    input({ type: "CELL_CLICK", row, col });
    // On phones, make sure the clue bar is visible above the on-screen keyboard.
    if (isTouch) clueBarRef.current?.scrollIntoView({ block: "nearest", behavior: "smooth" });
  };

  const onClueClick = (clueNumber: number, direction: Direction) => {
    input({ type: "CLUE_CLICK", clueNumber, direction });
    if (isTouch) gridRef.current?.scrollIntoView({ block: "start", behavior: "smooth" });
    focusGrid();
  };

  // ----- Layout -----

  const cellMax = Math.max(puzzle.width, puzzle.height) <= 10 ? 64 : 38;
  const gridWidth = puzzle.width * cellMax + 4;
  // Grid and clues sit side by side once there's room; big grids need a wider screen.
  const big = gridWidth > 480;
  const layout = big
    ? {
        wrap: "xl:grid xl:grid-cols-[var(--grid-w)_minmax(0,1fr)] xl:gap-12",
        left: "xl:sticky xl:top-4 xl:gap-3.5 xl:self-start",
        bar: "xl:order-1",
        grid: "xl:order-2",
        clues: "xl:mt-0",
        clueCols: "sm:grid-cols-2 xl:grid-cols-1",
      }
    : {
        wrap: "lg:grid lg:grid-cols-[var(--grid-w)_minmax(0,1fr)] lg:gap-12",
        left: "lg:sticky lg:top-4 lg:gap-3.5 lg:self-start",
        bar: "lg:order-1",
        grid: "lg:order-2",
        clues: "lg:mt-0",
        clueCols: "sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2",
      };
  const sideBySide = useMediaQuery(big ? "(min-width: 1280px)" : "(min-width: 1024px)");
  const activeAnnotation = activeClue ? annotations?.[clueKey(activeClue)] : undefined;
  const activeWordplayOn = activeClue ? isWordplayOn(clueKey(activeClue)) : false;
  const toolProps = {
    onCheck,
    onReveal,
    onClear: () => setConfirming("clear"),
    showAll: annotations ? { on: showAll, set: setShowAll } : undefined,
  };

  return (
    <>
      <div className="mt-3 mb-3 flex items-center justify-between gap-6 md:mt-7 md:mb-5 md:items-end">
        <div className="min-w-0">
          <h1 className="text-[26px] leading-none font-semibold tracking-[-0.015em] md:text-[52px]">{info.title}</h1>
          <p className="mt-2 hidden text-[17px] text-[var(--ink-soft)] md:block">
            <span className="italic">by {puzzle.author || "Ian Rosevear"}</span> &middot; {info.kind} &middot; {puzzle.width} &times;{" "}
            {puzzle.height} &middot; {info.level}
            {info.type === "cryptic" || info.mixedCryptic ? (
              <>
                {" "}
                &middot; New to cryptics? <Link href="/guide">Read the guide</Link>
              </>
            ) : null}
          </p>
        </div>
        <div className="hidden shrink-0 md:block">
          <Toolbar {...toolProps} />
        </div>
        <div className="shrink-0 md:hidden">
          <ToolsMenu {...toolProps} />
        </div>
      </div>

      {confirming && (
        <div role="alertdialog" aria-label="Confirm" className="mb-4 flex flex-wrap items-center gap-x-5 gap-y-1 border-y border-[var(--rule)] py-2 text-[18px]">
          <span>{confirming === "reveal" ? "Reveal every answer?" : "Clear every letter from the grid?"}</span>
          <span className="flex gap-5">
            <button type="button" className="sc min-h-11 font-bold text-[var(--accent)]" onClick={confirm}>
              {confirming === "reveal" ? "Reveal" : "Clear"}
            </button>
            <button type="button" className="sc min-h-11 text-[var(--ink-soft)]" onClick={() => setConfirming(null)}>
              Cancel
            </button>
          </span>
        </div>
      )}

      <div className={layout.wrap} style={{ "--grid-w": `${gridWidth}px` } as React.CSSProperties}>
        <div className={`-mx-4 flex flex-col sm:mx-auto sm:max-w-[var(--grid-w)] sm:gap-3.5 ${layout.left}`}>
          <div ref={clueBarRef} className={`order-2 scroll-mb-[200px] sm:order-1 ${layout.bar}`}>
            <ClueBar
              clue={activeClue}
              annotation={activeAnnotation}
              wordplayOn={activeWordplayOn}
              onToggleWordplay={() => activeClue && toggleWordplay(clueKey(activeClue))}
              onPrev={() => input({ type: "TAB", shift: true })}
              onNext={() => input({ type: "TAB", shift: false })}
              onSwitchDirection={() => input({ type: "SWITCH_DIRECTION" })}
              solved={solved}
            />
          </div>
          <div
            ref={gridRef}
            tabIndex={0}
            onKeyDown={handleKey}
            aria-label={`${info.title}. Type letters to fill the grid; arrow keys move, Tab goes to the next clue, Space switches direction.`}
            className={`order-1 scroll-mt-4 outline-none sm:order-2 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent)] ${layout.grid}`}
          >
            <CrosswordGrid puzzle={puzzle} state={state} onCellClick={onCellClick} incorrect={incorrect} revealed={revealed} solved={solved} />
          </div>
        </div>

        <div id="clues" className={`mt-7 ${layout.clues}`}>
          <CrosswordClues
            puzzle={puzzle}
            state={state}
            onClueClick={onClueClick}
            annotations={annotations}
            isWordplayOn={isWordplayOn}
            toggleWordplay={toggleWordplay}
            showAll={showAll}
            setShowAll={setShowAll}
            columnsClass={layout.clueCols}
            scrollActiveIntoView={!isTouch && sideBySide}
          />
        </div>
      </div>

      {isTouch && !solved && (
        <>
          <KeyboardSpacer />
          <OnScreenKeyboard onLetter={(letter) => input({ type: "LETTER", letter })} onBackspace={() => input({ type: "BACKSPACE" })} />
        </>
      )}
    </>
  );
}
