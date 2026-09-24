"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { parseiPUZ } from "@/lib/crossword/ipuz";
import { CrosswordPuzzle } from "@/lib/crossword/types";
import { getPuzzleBySlug } from "@/lib/crossword/puzzles";
import CrosswordPage from "@/components/crossword/CrosswordPage";
import Folio from "@/components/masthead/Folio";
import beginnerCrypticAnnotations from "@/lib/crossword/beginner-cryptic-annotations";

// Puzzles with wordplay colours, by slug.
const ANNOTATIONS: Record<string, typeof beginnerCrypticAnnotations> = {
  "beginner-cryptic": beginnerCrypticAnnotations,
};

export default function CrosswordRoute() {
  const { slug } = useParams<{ slug: string }>();
  const [puzzle, setPuzzle] = useState<CrosswordPuzzle | null>(null);
  const [error, setError] = useState<string | null>(null);

  const info = getPuzzleBySlug(slug);

  useEffect(() => {
    if (!info) return;

    fetch(`/crosswords/${encodeURIComponent(info.file)}`)
      .then((response) => {
        if (!response.ok) throw new Error("Failed to load puzzle");
        return response.json();
      })
      .then((json) => setPuzzle(parseiPUZ(json)))
      .catch((err) => setError(err.message));
  }, [info]);

  return (
    <>
      <Folio current="puzzles" />
      {!info || error ? (
        <p className="mt-8 text-[19px]">Could not load the crossword puzzle.</p>
      ) : !puzzle ? (
        <p className="mt-8 text-[19px] text-[var(--ink-soft)] italic">Loading the puzzle&hellip;</p>
      ) : (
        <CrosswordPage puzzle={puzzle} info={info} annotations={ANNOTATIONS[slug]} />
      )}
    </>
  );
}
