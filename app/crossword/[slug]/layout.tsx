import type { Metadata } from "next";
import { getPuzzleBySlug, getAllPuzzles } from "@/lib/crossword/puzzles";

export function generateStaticParams() {
  return getAllPuzzles().map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const info = getPuzzleBySlug(slug);
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
