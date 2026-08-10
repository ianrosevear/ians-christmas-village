export type PuzzleInfo = {
  slug: string;
  title: string;
  file: string;
  description: string;
  mixedCryptic?: boolean;
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
  {
    slug: "little-ice-age",
    title: "Little Ice Age",
    file: "Little Ice Age.ipuz",
    description: "A more difficult cryptic crossword puzzle",
  },
  {
    slug: "yule-jewel",
    title: "Yule Jewel",
    file: "Yule Jewel.ipuz",
    description: "A regular crossword with a few cryptic clues mixed in",
    mixedCryptic: true,
  },
];

export function getAllPuzzles(): PuzzleInfo[] {
  return puzzles;
}

export function getPuzzleBySlug(slug: string): PuzzleInfo | undefined {
  return puzzles.find((p) => p.slug === slug);
}
