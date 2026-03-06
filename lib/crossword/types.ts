export type Direction = "across" | "down";

export interface CellDef {
  row: number;
  col: number;
  blocked: boolean;
  clueNumber: number | null;
  bars: { right: boolean; bottom: boolean };
  solution: string;
}

export interface ClueDef {
  number: number;
  direction: Direction;
  text: string;
  cells: [number, number][];
}

export interface CrosswordPuzzle {
  title: string;
  author: string;
  width: number;
  height: number;
  grid: CellDef[][];
  clues: ClueDef[];
  cellToClues: Map<string, { across: ClueDef | null; down: ClueDef | null }>;
}

export interface CrosswordState {
  entries: string[][];
  cursor: { row: number; col: number };
  direction: Direction;
}

export function cellKey(row: number, col: number): string {
  return `${row},${col}`;
}
