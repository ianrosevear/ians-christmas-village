export type PuzzleType = "cryptic" | "standard";

export type PuzzleInfo = {
  slug: string;
  title: string;
  file: string;
  /** Used for page metadata. */
  description: string;
  /** Filter group on the archive page. */
  type: PuzzleType;
  /** Shown in the puzzle's detail line, e.g. "Cryptic". */
  kind: string;
  level: "Gentle" | "Moderate" | "Tough";
  /** Month published, "YYYY-MM". */
  published: string;
  /** Optional line on the archive page. Only when there's something worth saying. */
  note?: string;
  /** Marked "New" on the front page and archive. */
  isNew?: boolean;
  /** Standard crossword with a few cryptic clues mixed in. */
  mixedCryptic?: boolean;
};

const puzzles: PuzzleInfo[] = [
  {
    slug: "solid-start",
    title: "Solid Start",
    file: "Solid Start.ipuz",
    description: "A cryptic crossword puzzle",
    type: "cryptic",
    kind: "Cryptic",
    level: "Moderate",
    published: "2026-03",
  },
  {
    slug: "beginner-cryptic",
    title: "Beginner Cryptic",
    file: "Beginner Cryptic.ipuz",
    description: "A beginner-friendly cryptic crossword",
    type: "cryptic",
    kind: "Cryptic",
    level: "Gentle",
    published: "2026-03",
    note: "Start here. Every clue can show its wordplay in colour, one clue at a time.",
  },
  {
    slug: "little-ice-age",
    title: "Little Ice Age",
    file: "Little Ice Age.ipuz",
    description: "A more difficult cryptic crossword puzzle",
    type: "cryptic",
    kind: "Cryptic",
    level: "Tough",
    published: "2026-05",
  },
  {
    slug: "yule-jewel",
    title: "Yule Jewel",
    file: "Yule Jewel.ipuz",
    description: "A regular crossword with a few cryptic clues mixed in",
    type: "standard",
    kind: "Standard (mostly)",
    level: "Moderate",
    published: "2026-08",
    note: "A regular crossword with a few cryptic clues mixed in.",
    mixedCryptic: true,
    isNew: true,
  },
];

export function getAllPuzzles(): PuzzleInfo[] {
  return puzzles;
}

/** Newest first. */
export function getPuzzlesByDate(): PuzzleInfo[] {
  return [...puzzles].sort((a, b) => b.published.localeCompare(a.published));
}

export function getPuzzleBySlug(slug: string): PuzzleInfo | undefined {
  return puzzles.find((p) => p.slug === slug);
}

export function formatPublished(published: string): string {
  const [year, month] = published.split("-").map(Number);
  return new Date(year, month - 1, 1).toLocaleDateString("en-US", { month: "long", year: "numeric" });
}
