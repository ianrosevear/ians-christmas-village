import Link from "next/link";

export default function Home() {
  return (
    <div className="font-playfair">
      <h2 className="text-3xl italic text-[var(--color-dark)] dark:text-[var(--color-snow)] mb-1">
        A collection of gifts from me to you
      </h2>

      <hr className="border-[var(--color-dark)]/15 dark:border-[var(--color-snow)]/15 mb-6" />

      <ul className="space-y-5">
        <li>
          <Link
            href="/favorites"
            className="text-lg text-[var(--color-cranberry)] dark:text-[var(--color-gold)] hover:underline"
          >
            → Stuff I Like
          </Link>
          <p className="text-sm text-[var(--color-dark)]/45 dark:text-[var(--color-snow)]/40 mt-0.5 ml-4">
            I think you should check this stuff out
          </p>
        </li>
        <li>
          <Link
            href="/crossword"
            className="text-lg text-[var(--color-cranberry)] dark:text-[var(--color-gold)] hover:underline"
          >
            → Crossword
          </Link>
          <p className="text-sm text-[var(--color-dark)]/45 dark:text-[var(--color-snow)]/40 mt-0.5 ml-4">
            A cryptic crossword puzzle
          </p>
        </li>
      </ul>
    </div>
  );
}
