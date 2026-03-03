import type { Metadata } from "next";

// Because crossword page.tsx has "use client" it can't export metadata and needs a seperate layout to do that
export const metadata: Metadata = {
  title: "Solid Start — Crossword",
  description: "A crossword puzzle by Ian Rosevear.",
  openGraph: {
    title: "Solid Start — Crossword",
    description: "A crossword puzzle by Ian Rosevear.",
  },
};

export default function CrosswordLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
