export type Favorite = {
  category: string;
  name: string;
  url?: string;
  note?: string;
};

export const favorites: Favorite[] = [
  { category: "Websites", name: "Example Site", url: "https://example.com", note: "Placeholder — add your own!" },
  { category: "Music", name: "Some Album", note: "Placeholder — add your own!" },
  { category: "Movies", name: "Some Movie", note: "Placeholder — add your own!" },
  { category: "Crosswords", name: "NYT Crossword", url: "https://www.nytimes.com/crosswords", note: "The gold standard" },
  { category: "Products", name: "Keebio Iris Rev8", note: "Best split keyboard" },
];