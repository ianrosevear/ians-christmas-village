// Server only: reads the puzzle files from disk at build time.
import fs from "node:fs";
import path from "node:path";
import { parseiPUZ } from "./ipuz";

/**
 * A puzzle's grid shape, for drawing thumbnails. One string per row:
 * "#" block, "." open, "r" bar on the right, "b" bar below, "x" both.
 */
export type GridShape = { width: number; height: number; rows: string[] };

export function loadGridShape(file: string): GridShape {
  const json = JSON.parse(fs.readFileSync(path.join(process.cwd(), "public", "crosswords", file), "utf8"));
  const puzzle = parseiPUZ(json);
  const rows = puzzle.grid.map((row) =>
    row
      .map((cell) => {
        if (cell.blocked) return "#";
        if (cell.bars.right && cell.bars.bottom) return "x";
        if (cell.bars.right) return "r";
        if (cell.bars.bottom) return "b";
        return ".";
      })
      .join(""),
  );
  return { width: puzzle.width, height: puzzle.height, rows };
}
