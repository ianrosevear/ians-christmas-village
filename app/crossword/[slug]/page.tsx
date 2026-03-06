"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { parseiPUZ } from "@/lib/crossword/ipuz";
import { CrosswordPuzzle } from "@/lib/crossword/types";
import { getPuzzleBySlug } from "@/lib/crossword/puzzles";
import CrosswordPage from "@/components/crossword/CrosswordPage";

export default function CrosswordRoute() {
  const { slug } = useParams<{ slug: string }>();
  const [puzzle, setPuzzle] = useState<CrosswordPuzzle | null>(null);
  const [error, setError] = useState<string | null>(null);

  const info = getPuzzleBySlug(slug);

  useEffect(() => {
    if (!info) {
      setError("Puzzle not found");
      return;
    }

    fetch(`/crosswords/${info.file}`)
      .then((response) => {
        if (!response.ok) throw new Error("Failed to load puzzle");
        return response.json();
      })
      .then((json) => setPuzzle(parseiPUZ(json)))
      .catch((err) => setError(err.message));
  }, [info]);

  if (error) {
    return (
      <div className="font-raleway text-[var(--color-dark)] dark:text-[var(--color-snow)]">
        <p>Could not load the crossword puzzle.</p>
      </div>
    );
  }

  if (!puzzle) {
    return (
      <div className="font-raleway text-[var(--color-dark)]/40 dark:text-[var(--color-snow)]/35">
        Loading puzzle...
      </div>
    );
  }

  return <CrosswordPage puzzle={puzzle} />;
}
