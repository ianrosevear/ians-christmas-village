"use client";

import { CellDef } from "@/lib/crossword/types";

interface CrosswordCellProps {
  cell: CellDef;
  letter: string;
  isSelected: boolean;
  isActiveWord: boolean;
  onClick: (row: number, col: number) => void;
}

export default function CrosswordCell({
  cell,
  letter,
  isSelected,
  isActiveWord,
  onClick,
}: CrosswordCellProps) {
  if (cell.blocked) {
    return <div className="crossword-cell crossword-cell--blocked" />;
  }

  const className = [
    "crossword-cell",
    isSelected && "crossword-cell--selected",
    !isSelected && isActiveWord && "crossword-cell--active-word",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div
      className={className}
      data-bar-right={cell.bars.right || undefined}
      data-bar-bottom={cell.bars.bottom || undefined}
      onClick={() => onClick(cell.row, cell.col)}
    >
      {cell.clueNumber && (
        <span className="crossword-cell__number">{cell.clueNumber}</span>
      )}
      {letter}
    </div>
  );
}
