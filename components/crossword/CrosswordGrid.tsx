"use client";

import { CrosswordPuzzle, CrosswordState, cellKey } from "@/lib/crossword/types";
import { getActiveClue } from "@/lib/crossword/navigation";
import { getReferencedClues } from "@/lib/crossword/clueReferences";

interface CrosswordGridProps {
  puzzle: CrosswordPuzzle;
  state: CrosswordState;
  onCellClick: (row: number, col: number) => void;
  incorrect: Set<string>;
  revealed: Set<string>;
  solved: boolean;
}

export default function CrosswordGrid({ puzzle, state, onCellClick, incorrect, revealed, solved }: CrosswordGridProps) {
  const activeClue = getActiveClue(puzzle, state.cursor.row, state.cursor.col, state.direction);
  const wordCells = new Set(activeClue?.cells.map(([r, c]) => cellKey(r, c)) ?? []);
  const referencedCells = new Set(
    activeClue ? getReferencedClues(puzzle, activeClue).flatMap((clue) => clue.cells.map(([r, c]) => cellKey(r, c))) : [],
  );

  return (
    <div
      role="grid"
      aria-label={`${puzzle.title} grid`}
      className={`xw-grid ${solved ? "xw-solved" : ""}`}
      style={{ "--cols": puzzle.width } as React.CSSProperties}
    >
      {puzzle.grid.flat().map((cell) => {
        const key = cellKey(cell.row, cell.col);
        if (cell.blocked) return <div key={key} className="xw-cell xw-cell--blocked" aria-hidden="true" />;

        const selected = !solved && state.cursor.row === cell.row && state.cursor.col === cell.col;
        const letter = state.entries[cell.row][cell.col];
        const classes = ["xw-cell"];
        if (selected) classes.push("xw-cell--selected");
        else if (!solved && wordCells.has(key)) classes.push("xw-cell--word");
        else if (!solved && referencedCells.has(key)) classes.push("xw-cell--referenced");
        if (incorrect.has(key)) classes.push("xw-cell--incorrect");
        if (revealed.has(key)) classes.push("xw-cell--revealed");

        return (
          <div
            key={key}
            role="gridcell"
            aria-selected={selected}
            aria-label={`${cell.clueNumber ? `${cell.clueNumber}, ` : ""}${letter || "blank"}`}
            className={classes.join(" ")}
            data-bar-right={cell.bars.right || undefined}
            data-bar-bottom={cell.bars.bottom || undefined}
            onClick={() => onCellClick(cell.row, cell.col)}
          >
            {cell.clueNumber && <span className="xw-number">{cell.clueNumber}</span>}
            {letter}
          </div>
        );
      })}
    </div>
  );
}
