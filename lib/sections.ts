/**
 * The sections of the paper. Adding a section = one entry here, plus its pages.
 * The section line on inner pages and the phone "Sections" menu are built from this list.
 */
export type Section = {
  key: string;
  name: string;
  href: string;
};

export const sections: Section[] = [
  { key: "puzzles", name: "Puzzles", href: "/crossword" },
  { key: "writing", name: "Writing", href: "/writing" },
  { key: "stuff", name: "Stuff I Like", href: "/favorites" },
];

/**
 * The line of links along the bottom of the front page, like the index on a real front page: everything worth finding.
 * Add new kinds of content here as they arrive.
 */
export const inside: { name: string; href: string }[] = [
  { name: "Crosswords", href: "/crossword" },
  { name: "Cryptic guide", href: "/guide" },
  { name: "Santa’s Workshop", href: "/crossword/workshop" },
  { name: "Writing", href: "/writing" },
  { name: "Stuff I Like", href: "/favorites" },
];
