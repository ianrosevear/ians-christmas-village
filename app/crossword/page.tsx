import Link from "next/link";
import { getAllPuzzles } from "@/lib/crossword/puzzles";

export default function CrosswordIndex() {
  const puzzles = getAllPuzzles();

  return (
    <div className="font-raleway">
      <h2 className="text-3xl italic text-[var(--color-dark)] dark:text-[var(--color-snow)] mb-1">
        Crosswords
      </h2>

      <hr className="border-[var(--color-dark)]/15 dark:border-[var(--color-snow)]/15 mb-6" />

      <ul className="space-y-5">
        {puzzles.map(({ slug, title, description }) => (
          <li key={slug}>
            <Link
              href={`/crossword/${slug}`}
              className="text-lg text-[var(--color-cranberry)] dark:text-[var(--color-gold)] hover:underline"
            >
              → {title}
            </Link>
            <p className="text-sm text-[var(--color-dark)]/45 dark:text-[var(--color-snow)]/40 mt-0.5 ml-4">
              {description}
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
}
