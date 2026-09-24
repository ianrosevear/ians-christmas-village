export type Post = {
  href: string;
  title: string;
  /** Month published, "YYYY-MM". */
  published: string;
  /** One or two sentences for listings. */
  dek: string;
};

/** Newest first. */
export const posts: Post[] = [
  {
    href: "/guide",
    title: "How to Solve Cryptic Crosswords",
    published: "2026-03",
    dek: "A cryptic crossword is a special type of crossword in which each clue is itself a little wordplay puzzle.",
  },
];
