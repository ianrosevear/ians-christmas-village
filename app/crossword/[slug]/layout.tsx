import type { Metadata } from "next";
import { getPuzzleBySlug, getAllPuzzles } from "@/lib/crossword/puzzles";

export function generateStaticParams() {
  return getAllPuzzles().map((p) => ({ slug: p.slug }));
}

export function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Metadata {
  const info = getPuzzleBySlug(params.slug);
  const title = info ? `${info.title} — Crossword` : "Crossword";
  const description = info?.description ?? "A crossword puzzle by Ian Rosevear.";

  return {
    title,
    description,
    openGraph: { title, description },
  };
}

export default function CrosswordSlugLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
