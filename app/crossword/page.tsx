"use client";

import { useEffect, useState } from "react";
import { parseiPUZ } from "@/lib/crossword/ipuz";
import { CrosswordPuzzle } from "@/lib/crossword/types";
import CrosswordPage from "@/components/crossword/CrosswordPage";

export default function CrosswordRoute() {
  const [puzzle, setPuzzle] = useState<CrosswordPuzzle | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch("/crosswords/Solid Start.ipuz")
      .then((res) => {
        if (!res.ok) throw new Error("Failed to load puzzle");
        return res.json();
      })
      .then((json) => setPuzzle(parseiPUZ(json)))
      .catch((err) => setError(err.message));
  }, []);

  if (error) {
    return (
      <div className="font-playfair text-[var(--color-dark)] dark:text-[var(--color-snow)]">
        <p>Could not load the crossword puzzle.</p>
      </div>
    );
  }

  if (!puzzle) {
    return (
      <div className="font-playfair text-[var(--color-dark)]/40 dark:text-[var(--color-snow)]/35">
        Loading puzzle...
      </div>
    );
  }

  return <CrosswordPage puzzle={puzzle} />;
}
