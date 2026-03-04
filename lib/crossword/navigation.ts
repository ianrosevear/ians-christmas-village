import { CrosswordPuzzle, CrosswordState, Direction, cellKey } from "./types";

// ---------- Helpers ----------

function getActiveClue(puzzle: CrosswordPuzzle, row: number, col: number, direction: Direction) {
  return puzzle.cellToClues.get(cellKey(row, col))?.[direction] ?? null;
}

function otherDirection(d: Direction): Direction {
  return d === "across" ? "down" : "across";
}

/** Get all clues sorted: across by number, then down by number. */
function allCluesSorted(puzzle: CrosswordPuzzle) {
  const across = puzzle.clues.filter((c) => c.direction === "across").sort((a, b) => a.number - b.number);
  const down = puzzle.clues.filter((c) => c.direction === "down").sort((a, b) => a.number - b.number);
  return { across, down, all: [...across, ...down] };
}

// ---------- Click ----------

export function handleCellClick(
  puzzle: CrosswordPuzzle,
  state: CrosswordState,
  row: number,
  col: number,
): CrosswordState {
  const sameCell = state.cursor.row === row && state.cursor.col === col;

  if (sameCell) {
    // Toggle direction if the other direction has a clue here
    const other = otherDirection(state.direction);
    const otherClue = getActiveClue(puzzle, row, col, other);
    if (otherClue) {
      return { ...state, direction: other };
    }
    return state;
  }

  // Moving to a new cell — keep direction if possible, otherwise switch
  let dir = state.direction;
  if (!getActiveClue(puzzle, row, col, dir)) {
    const other = otherDirection(dir);
    if (getActiveClue(puzzle, row, col, other)) {
      dir = other;
    }
  }

  return { ...state, cursor: { row, col }, direction: dir };
}

// ---------- Typing ----------

export function handleLetterInput(
  puzzle: CrosswordPuzzle,
  state: CrosswordState,
  letter: string,
): CrosswordState {
  const { row, col } = state.cursor;
  const newEntries = state.entries.map((r) => [...r]);
  newEntries[row][col] = letter.toUpperCase();

  // Advance to next cell in current word
  const clue = getActiveClue(puzzle, row, col, state.direction);
  if (clue) {
    const idx = clue.cells.findIndex(([r, c]) => r === row && c === col);

    // Find the next empty cell after the current position
    const nextEmpty = clue.cells.slice(idx + 1).find(([r, c]) => !newEntries[r][c]);
    if (nextEmpty) {
      const [nr, nc] = nextEmpty;
      return { ...state, entries: newEntries, cursor: { row: nr, col: nc } };
    }

    // No empty cells remaining in this word — auto-jump to the next clue
    if (idx >= 0) {
      const newState = { ...state, entries: newEntries };
      return handleTab(puzzle, newState, false);
    }
  }

  return { ...state, entries: newEntries };
}

// ---------- Backspace ----------

export function handleBackspace(
  puzzle: CrosswordPuzzle,
  state: CrosswordState,
): CrosswordState {
  const { row, col } = state.cursor;
  const currentLetter = state.entries[row][col];

  if (currentLetter) {
    // Delete current cell, stay in place
    const newEntries = state.entries.map((r) => [...r]);
    newEntries[row][col] = "";
    return { ...state, entries: newEntries };
  }

  // Current cell empty — move back in word and delete that cell
  const clue = getActiveClue(puzzle, row, col, state.direction);
  if (clue) {
    const idx = clue.cells.findIndex(([r, c]) => r === row && c === col);
    if (idx > 0) {
      const [pr, pc] = clue.cells[idx - 1];
      const newEntries = state.entries.map((r) => [...r]);
      newEntries[pr][pc] = "";
      return { ...state, entries: newEntries, cursor: { row: pr, col: pc } };
    }
  }

  return state;
}

// ---------- Arrow Keys ----------

export function handleArrowKey(
  puzzle: CrosswordPuzzle,
  state: CrosswordState,
  arrow: "ArrowUp" | "ArrowDown" | "ArrowLeft" | "ArrowRight",
): CrosswordState {
  const isHorizontal = arrow === "ArrowLeft" || arrow === "ArrowRight";
  const arrowDirection: Direction = isHorizontal ? "across" : "down";

  // If arrow is perpendicular to current direction, just switch direction
  if (arrowDirection !== state.direction) {
    // Only switch if there's a clue in the new direction at this cell
    const newClue = getActiveClue(puzzle, state.cursor.row, state.cursor.col, arrowDirection);
    if (newClue) {
      return { ...state, direction: arrowDirection };
    }
    // No clue in that direction — move anyway
  }

  // Move one cell in the arrow direction
  let { row, col } = state.cursor;
  if (arrow === "ArrowUp") row--;
  if (arrow === "ArrowDown") row++;
  if (arrow === "ArrowLeft") col--;
  if (arrow === "ArrowRight") col++;

  // Clamp to grid bounds
  if (row < 0 || row >= puzzle.height || col < 0 || col >= puzzle.width) {
    return state;
  }

  // Update direction to match arrow
  let dir = arrowDirection;
  // If new cell doesn't have a clue in this direction, try the other
  if (!getActiveClue(puzzle, row, col, dir)) {
    const other = otherDirection(dir);
    if (getActiveClue(puzzle, row, col, other)) {
      dir = other;
    }
  }

  return { ...state, cursor: { row, col }, direction: dir };
}

// ---------- Tab ----------

export function handleTab(
  puzzle: CrosswordPuzzle,
  state: CrosswordState,
  shift: boolean,
): CrosswordState {
  const { all } = allCluesSorted(puzzle);
  if (all.length === 0) return state;

  // Find current clue
  const currentClue = getActiveClue(puzzle, state.cursor.row, state.cursor.col, state.direction);
  let currentIdx = currentClue ? all.indexOf(currentClue) : -1;
  if (currentIdx < 0) currentIdx = 0;

  // Move to next/prev clue
  const step = shift ? -1 : 1;
  let nextIdx = (currentIdx + step + all.length) % all.length;

  const targetClue = all[nextIdx];

  // Find first empty cell in the target clue, or first cell if all filled
  const firstEmpty = targetClue.cells.find(([r, c]) => !state.entries[r][c]);
  const [nr, nc] = firstEmpty ?? targetClue.cells[0];

  return {
    ...state,
    cursor: { row: nr, col: nc },
    direction: targetClue.direction,
  };
}

// ---------- Clue click ----------

export function handleClueClick(
  puzzle: CrosswordPuzzle,
  state: CrosswordState,
  clueNumber: number,
  direction: Direction,
): CrosswordState {
  const clue = puzzle.clues.find((c) => c.number === clueNumber && c.direction === direction);
  if (!clue || clue.cells.length === 0) return state;

  const firstEmpty = clue.cells.find(([r, c]) => !state.entries[r][c]);
  const [nr, nc] = firstEmpty ?? clue.cells[0];

  return { ...state, cursor: { row: nr, col: nc }, direction };
}

// ---------- Utility ----------

export { getActiveClue };
