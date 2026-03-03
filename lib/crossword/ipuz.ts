import { CellDef, ClueDef, CrosswordPuzzle, Direction, cellKey } from "./types";

interface iPUZCell {
  cell: number;
  style?: { barred?: string };
}

interface iPUZData {
  title?: string;
  author?: string;
  dimensions: { width: number; height: number };
  puzzle: (iPUZCell | number | string)[][];
  solution: string[][];
  clues: {
    Across: [number, string][];
    Down: [number, string][];
  };
}

function parseCell(raw: iPUZCell | number | string, row: number, col: number, solution: string): CellDef {
  if (typeof raw === "number" || typeof raw === "string") {
    const num = typeof raw === "number" ? raw : parseInt(raw, 10);
    return {
      row,
      col,
      clueNumber: num > 0 ? num : null,
      bars: { right: false, bottom: false },
      solution,
    };
  }

  const barred = raw.style?.barred ?? "";
  return {
    row,
    col,
    clueNumber: raw.cell > 0 ? raw.cell : null,
    bars: {
      right: barred.includes("R"),
      bottom: barred.includes("B"),
    },
    solution,
  };
}

function buildClueEntries(
  grid: CellDef[][],
  rawClues: [number, string][],
  direction: Direction,
  height: number,
  width: number,
): ClueDef[] {
  const clues: ClueDef[] = [];

  for (const [num, text] of rawClues) {
    // Find the cell with this clue number
    let startRow = -1;
    let startCol = -1;
    for (let r = 0; r < height; r++) {
      for (let c = 0; c < width; c++) {
        if (grid[r][c].clueNumber === num) {
          startRow = r;
          startCol = c;
          break;
        }
      }
      if (startRow >= 0) break;
    }

    if (startRow < 0) continue;

    // Walk from start cell to collect all cells in this word
    const cells: [number, number][] = [];
    let r = startRow;
    let c = startCol;

    while (r < height && c < width) {
      cells.push([r, c]);
      const cell = grid[r][c];

      // Stop if this cell has a bar in the walk direction
      if (direction === "across" && cell.bars.right) break;
      if (direction === "down" && cell.bars.bottom) break;

      // Advance
      if (direction === "across") c++;
      else r++;
    }

    clues.push({ number: num, direction, text, cells });
  }

  return clues;
}

export function parseiPUZ(json: unknown): CrosswordPuzzle {
  const data = json as iPUZData;
  const { width, height } = data.dimensions;

  // Build grid
  const grid: CellDef[][] = [];
  for (let r = 0; r < height; r++) {
    const row: CellDef[] = [];
    for (let c = 0; c < width; c++) {
      row.push(parseCell(data.puzzle[r][c], r, c, data.solution[r][c]));
    }
    grid.push(row);
  }

  // Build clues
  const acrossClues = buildClueEntries(grid, data.clues.Across, "across", height, width);
  const downClues = buildClueEntries(grid, data.clues.Down, "down", height, width);
  const allClues = [...acrossClues, ...downClues];

  // Build cell-to-clues lookup
  const cellToClues = new Map<string, { across: ClueDef | null; down: ClueDef | null }>();
  for (let r = 0; r < height; r++) {
    for (let c = 0; c < width; c++) {
      cellToClues.set(cellKey(r, c), { across: null, down: null });
    }
  }
  for (const clue of allClues) {
    for (const [r, c] of clue.cells) {
      const entry = cellToClues.get(cellKey(r, c))!;
      entry[clue.direction] = clue;
    }
  }

  return {
    title: data.title ?? "Untitled",
    author: data.author ?? "Unknown",
    width,
    height,
    grid,
    clues: allClues,
    cellToClues,
  };
}
