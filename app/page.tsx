import Link from "next/link";

const items = [
  {
    href: "/favorites",
    title: "Stuff I Like",
    description: "I think you should check this stuff out",
  },
  {
    href: "/crossword",
    title: "Crossword",
    description: "A cryptic crossword puzzle",
  },
  {
    href: null,
    title: "How to Solve Cryptic Crosswords",
    description: "A beginner's guide — coming soon",
  },
];

export default function Home() {
  return (
    <div className="font-playfair">
      <h2 className="text-3xl italic text-[var(--color-dark)] dark:text-[var(--color-snow)] mb-1">
        A collection of gifts from me to you
      </h2>

      <hr className="border-[var(--color-dark)]/15 dark:border-[var(--color-snow)]/15 mb-6" />

      <ul className="space-y-5">
        {items.map(({ href, title, description }) => (
          <li key={title}>
            {href ? (
              <Link href={href} className="text-lg text-[var(--color-cranberry)] dark:text-[var(--color-gold)] hover:underline">
                → {title}
              </Link>
            ) : (
              <span className="text-lg text-[var(--color-dark)]/30 dark:text-[var(--color-snow)]/30">
                → {title}
              </span>
            )}
            <p className="text-sm text-[var(--color-dark)]/45 dark:text-[var(--color-snow)]/40 mt-0.5 ml-4">
              {description}
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
}
