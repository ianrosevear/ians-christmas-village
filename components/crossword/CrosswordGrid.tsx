"use client";

import { CrosswordPuzzle, CrosswordState, cellKey } from "@/lib/crossword/types";
import { getActiveClue } from "@/lib/crossword/navigation";
import CrosswordCell from "./CrosswordCell";

interface CrosswordGridProps {
  puzzle: CrosswordPuzzle;
  state: CrosswordState;
  onCellClick: (row: number, col: number) => void;
}

export default function CrosswordGrid({ puzzle, state, onCellClick }: CrosswordGridProps) {
  // Determine which cells are in the active word
  const activeClue = getActiveClue(puzzle, state.cursor.row, state.cursor.col, state.direction);
  const activeCells = new Set<string>();
  if (activeClue) {
    for (const [r, c] of activeClue.cells) {
      activeCells.add(cellKey(r, c));
    }
  }

  return (
    <div
      className="crossword-grid"
      style={{
        gridTemplateColumns: `repeat(${puzzle.width}, var(--cell-size, 40px))`,
      }}
    >
      {puzzle.grid.flat().map((cell) => {
        const key = cellKey(cell.row, cell.col);
        return (
          <CrosswordCell
            key={key}
            cell={cell}
            letter={state.entries[cell.row][cell.col]}
            isSelected={state.cursor.row === cell.row && state.cursor.col === cell.col}
            isActiveWord={activeCells.has(key)}
            onClick={onCellClick}
          />
        );
      })}
    </div>
  );
}
