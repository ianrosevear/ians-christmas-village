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
