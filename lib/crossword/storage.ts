import { CrosswordState, Direction } from "./types";

const STORAGE_KEY = "crossword-progress";

interface StoredProgress {
  puzzleTitle: string;
  entries: string[][];
  cursor: { row: number; col: number };
  direction: Direction;
}

export function loadProgress(
  puzzleTitle: string,
  height: number,
  width: number,
): CrosswordState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const stored: StoredProgress = JSON.parse(raw);
      if (
        stored.puzzleTitle === puzzleTitle &&
        stored.entries.length === height &&
        stored.entries[0]?.length === width
      ) {
        return {
          entries: stored.entries,
          cursor: stored.cursor,
          direction: stored.direction,
        };
      }
    }
  } catch {
    // Ignore corrupt data
  }
  return emptyState(height, width);
}

export function saveProgress(puzzleTitle: string, state: CrosswordState): void {
  const stored: StoredProgress = {
    puzzleTitle,
    entries: state.entries,
    cursor: state.cursor,
    direction: state.direction,
  };
  localStorage.setItem(STORAGE_KEY, JSON.stringify(stored));
}

export function emptyState(height: number, width: number): CrosswordState {
  return {
    entries: Array.from({ length: height }, () => Array(width).fill("")),
    cursor: { row: 0, col: 0 },
    direction: "across",
  };
}
