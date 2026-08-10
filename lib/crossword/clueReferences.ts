import { ClueDef, CrosswordPuzzle, Direction } from "./types";

const REFERENCE_RE = /(\d+)[\s-]?(Across|Down)/gi;

/** Find clues referenced by number in a clue's text, e.g. "one from 28-Down". */
export function getReferencedClues(puzzle: CrosswordPuzzle, clue: ClueDef): ClueDef[] {
  const found: ClueDef[] = [];
  const seen = new Set<string>();

  for (const match of clue.text.matchAll(REFERENCE_RE)) {
    const number = parseInt(match[1], 10);
    const direction = match[2].toLowerCase() as Direction;
    if (number === clue.number && direction === clue.direction) continue;

    const key = `${number}${direction}`;
    if (seen.has(key)) continue;
    seen.add(key);

    const referenced = puzzle.clues.find((c) => c.number === number && c.direction === direction);
    if (referenced) found.push(referenced);
  }

  return found;
}
