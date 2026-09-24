import type { Metadata } from "next";
import Folio from "@/components/masthead/Folio";
import { favorites } from "@/lib/favorites";

export const metadata: Metadata = {
  title: "Stuff I Like",
  description: "Things Ian Rosevear thinks you should check out.",
};

export default function FavoritesPage() {
  const categories = [...new Set(favorites.map((f) => f.category))];

  return (
    <>
      <Folio current="stuff" />
      <h1 className="mt-8 mb-5 text-[44px] leading-none font-semibold tracking-[-0.015em] sm:text-[64px]">Stuff I Like</h1>

      {categories.length === 0 && <p className="text-[19px] text-[var(--ink-soft)] italic">Coming soon.</p>}

      {categories.map((category) => (
        <section key={category} className="mb-8">
          <h2 className="section-head">{category}</h2>
          <ul>
            {favorites
              .filter((f) => f.category === category)
              .map((f) => (
                <li key={f.name} className="border-b border-[var(--rule-soft)] py-2.5 text-[19px] last:border-0">
                  {f.url ? (
                    <a href={f.url} target="_blank" rel="noopener noreferrer">
                      {f.name}
                    </a>
                  ) : (
                    <span>{f.name}</span>
                  )}
                  {f.note && <span className="text-[var(--ink-soft)] italic"> &mdash; {f.note}</span>}
                </li>
              ))}
          </ul>
        </section>
      ))}
    </>
  );
}
