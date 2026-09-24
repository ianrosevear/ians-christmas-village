import Link from "next/link";
import Folio from "@/components/masthead/Folio";
import PuzzleArchive from "@/components/PuzzleArchive";
import { formatPublished, getPuzzlesByDate } from "@/lib/crossword/puzzles";
import { loadGridShape } from "@/lib/crossword/thumbnail";

export default function CrosswordIndex() {
  const puzzles = getPuzzlesByDate().map((p) => ({
    ...p,
    date: formatPublished(p.published),
    shape: loadGridShape(p.file),
  }));

  return (
    <>
      <Folio current="puzzles" />
      <PuzzleArchive puzzles={puzzles}>
        <p className="mb-5 max-w-[640px] text-[19px] leading-normal text-[var(--ink-body)]">
          New to cryptics? Start with Beginner Cryptic, and keep <Link href="/guide">the guide</Link> open alongside it.
        </p>
      </PuzzleArchive>
    </>
  );
}
