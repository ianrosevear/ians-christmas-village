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
        <PuzzleSkeleton title={info.title} />
      ) : (
        <CrosswordPage puzzle={puzzle} info={info} annotations={ANNOTATIONS[slug]} />
      )}
    </>
  );
}

// Holds roughly the space the puzzle will take while it loads, so the page doesn't jump.
function PuzzleSkeleton({ title }: { title: string }) {
  return (
    <div aria-busy="true">
      <div className="mt-3 mb-3 md:mt-7 md:mb-5">
        <h1 className="text-[26px] leading-none font-semibold tracking-[-0.015em] md:text-[52px]">{title}</h1>
        <div className="mt-2.5 hidden h-[26px] md:block" />
      </div>
      <div className="-mx-4 flex aspect-square max-w-[560px] items-center justify-center border-2 border-[var(--rule-soft)] bg-[var(--tint)] sm:mx-auto lg:mx-0">
        <p className="text-[19px] text-[var(--ink-soft)] italic motion-safe:animate-pulse">Loading the puzzle&hellip;</p>
      </div>
    </div>
  );
}
