import { favorites } from "@/lib/favorites";

export default function FavoritesPage() {
  const categories = [...new Set(favorites.map((f) => f.category))];

  return (
    <div className="max-w-2xl mx-auto px-4 py-12">
      <h1 className="text-4xl text-[var(--color-gold)] mb-8" style={{ fontFamily: "var(--font-playfair-display)" }}>
        Stuff I Like
      </h1>
      {categories.map((category) => (
        <section key={category} className="mb-8">
          <h2 className="text-xl text-[var(--color-cranberry)] mb-3 border-b border-[var(--color-gold)]/20 pb-1" style={{ fontFamily: "var(--font-playfair-display)" }}>
            {category}
          </h2>
          <ul className="space-y-2">
            {favorites
              .filter((f) => f.category === category)
              .map((f) => (
                <li key={f.name} className="text-[var(--color-snow)]/80">
                  {f.url ? (
                    <a href={f.url} target="_blank" rel="noopener noreferrer" className="text-[var(--color-gold)] hover:underline">
                      {f.name}
                    </a>
                  ) : (
                    <span>{f.name}</span>
                  )}
                  {f.note && <span className="text-[var(--color-snow)]/40 ml-2">— {f.note}</span>}
                </li>
              ))}
          </ul>
        </section>
      ))}
    </div>
  );
}