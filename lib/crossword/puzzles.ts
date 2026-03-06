export type PuzzleInfo = {
  slug: string;
  title: string;
  file: string;
  description: string;
};

const puzzles: PuzzleInfo[] = [
  {
    slug: "solid-start",
    title: "Solid Start",
    file: "Solid Start.ipuz",
    description: "A cryptic crossword puzzle",
  },
  {
    slug: "beginner-cryptic",
    title: "Beginner Cryptic",
    file: "Beginner Cryptic.ipuz",
    description: "A beginner-friendly cryptic crossword",
  },
];

export function getAllPuzzles(): PuzzleInfo[] {
  return puzzles;
}

export function getPuzzleBySlug(slug: string): PuzzleInfo | undefined {
  return puzzles.find((p) => p.slug === slug);
}
