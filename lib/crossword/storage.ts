import { CrosswordState, Direction } from "./types";
import { readStored, writeStored } from "@/lib/localStore";

// Crossword progress is remembered through the same store as the site's settings.

interface StoredProgress {
  entries: string[][];
  cursor: { row: number; col: number };
  direction: Direction;
  /** Set once the grid has been filled in correctly. */
  solved?: boolean;
}

function storageKey(slug: string): string {
  return `crossword-progress-${slug}`;
}

export function loadProgress(
  slug: string,
  height: number,
  width: number,
): CrosswordState {
  const stored = readStored<StoredProgress | null>(storageKey(slug), null);
  if (stored && stored.entries?.length === height && stored.entries[0]?.length === width) {
    return {
      entries: stored.entries,
      cursor: stored.cursor,
      direction: stored.direction,
    };
  }
  return emptyState(height, width);
}

export function saveProgress(slug: string, state: CrosswordState, solved = false): void {
  const stored: StoredProgress = {
    entries: state.entries,
    cursor: state.cursor,
    direction: state.direction,
    solved,
  };
  writeStored(storageKey(slug), stored);
}

/** For the archive: has this puzzle been started or solved in this browser? */
export function readProgressStatus(slug: string): "solved" | "started" | null {
  const stored = readStored<StoredProgress | null>(storageKey(slug), null);
  if (!stored) return null;
  if (stored.solved) return "solved";
  return stored.entries?.some((row) => row.some((letter) => letter !== "")) ? "started" : null;
}

export function emptyState(height: number, width: number): CrosswordState {
  return {
    entries: Array.from({ length: height }, () => Array(width).fill("")),
    cursor: { row: 0, col: 0 },
    direction: "across",
  };
}
