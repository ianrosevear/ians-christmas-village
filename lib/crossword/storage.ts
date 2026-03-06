import { CrosswordState, Direction } from "./types";

interface StoredProgress {
  entries: string[][];
  cursor: { row: number; col: number };
  direction: Direction;
}

function storageKey(slug: string): string {
  return `crossword-progress-${slug}`;
}

export function loadProgress(
  slug: string,
  height: number,
  width: number,
): CrosswordState {
  try {
    const raw = localStorage.getItem(storageKey(slug));
    if (raw) {
      const stored: StoredProgress = JSON.parse(raw);
      if (
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

export function saveProgress(slug: string, state: CrosswordState): void {
  const stored: StoredProgress = {
    entries: state.entries,
    cursor: state.cursor,
    direction: state.direction,
  };
  localStorage.setItem(storageKey(slug), JSON.stringify(stored));
}

export function emptyState(height: number, width: number): CrosswordState {
  return {
    entries: Array.from({ length: height }, () => Array(width).fill("")),
    cursor: { row: 0, col: 0 },
    direction: "across",
  };
}
