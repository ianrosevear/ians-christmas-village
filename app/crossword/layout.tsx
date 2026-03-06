import type { Metadata } from "next";

// Because crossword page.tsx has "use client" it can't export metadata and needs a seperate layout to do that
// Next.js automatically picks up any layout file in a route folder and wraps page.tsx with the layout
export const metadata: Metadata = {
  title: "Crosswords",
  description: "Crossword puzzles by Ian Rosevear.",
  openGraph: {
    title: "Crosswords",
    description: "Crossword puzzles by Ian Rosevear.",
  },
};

export default function CrosswordLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
