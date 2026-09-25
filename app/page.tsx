import { Fragment } from "react";
import Link from "next/link";
import FrontMasthead from "@/components/masthead/FrontMasthead";
import GridThumbnail from "@/components/GridThumbnail";
import { NewTag, PuzzleDetails } from "@/components/PuzzleDetails";
import { getPuzzlesByDate } from "@/lib/crossword/puzzles";
import { loadGridShape } from "@/lib/crossword/thumbnail";
import { posts } from "@/lib/writing";
import { Def, Fod, Ind } from "@/lib/crossword/annotations";
import { inside } from "@/lib/sections";

export default function FrontPage() {
  const puzzles = getPuzzlesByDate()
    .slice(0, 4)
    .map((p) => ({ ...p, shape: loadGridShape(p.file) }));
  const lead = posts[0];

  return (
    <>
      <FrontMasthead />

      <div className="mt-8 grid grid-cols-1 gap-y-10 md:grid-cols-[minmax(0,1.7fr)_minmax(0,1fr)]">
        <section className="md:pr-10">
          <h2 className="section-head">Puzzles</h2>

          {/* Phone: compact rows. Larger screens: two-by-two thumbnails. */}
          <ul className="sm:grid sm:grid-cols-2 sm:gap-9">
            {puzzles.map((p) => (
              <li key={p.slug} className="border-b border-[var(--rule-soft)] sm:border-0">
                <Link href={`/crossword/${p.slug}`} className="plain flex items-center gap-4 py-4 sm:flex-col sm:items-start sm:gap-3 sm:py-0">
                  <span className="flex size-[84px] shrink-0 items-center justify-center sm:hidden">
                    <GridThumbnail shape={p.shape} size={82} />
                  </span>
                  <span className="hidden h-[168px] items-end sm:flex">
                    <GridThumbnail shape={p.shape} size={160} />
                  </span>
                  <span className="min-w-0">
                    <span className="mb-1 block text-[24px] leading-tight font-semibold sm:text-[28px]">
                      {p.title}
                      {p.isNew && <NewTag />}
                    </span>
                    <PuzzleDetails kind={p.kind} level={p.level} />
                  </span>
                </Link>
              </li>
            ))}
          </ul>
          <p className="mt-4 text-[17px] sm:mt-7">
            <Link href="/crossword">Full archive</Link>
          </p>
        </section>

        <aside className="flex flex-col gap-10 md:border-l md:border-[var(--rule)] md:pl-10">
          <section>
            <h2 className="section-head">Writing</h2>
            <h3 className="mb-2.5 text-[28px] leading-[1.1] font-semibold sm:text-[30px]">
              <Link href={lead.href} className="plain">
                {lead.title}
              </Link>
            </h3>
            <p className="mb-4 text-[18px] leading-normal">{lead.dek}</p>
            <div className="bg-[var(--tint)] px-4 py-4 sm:px-[18px]">
              <p className="text-[20px] leading-normal font-semibold">
                <Def show>Christmas carol</Def> <Ind show>uniquely</Ind> <Fod show>lent insight</Fod> (6,5)
              </p>
              <p className="mt-2 text-[15px] leading-relaxed text-[var(--ink-soft)]">
                <Def show>definition</Def> &middot; <Ind show>indicator</Ind> &middot; <Fod show>fodder</Fod>
              </p>
            </div>
            <p className="mt-4 text-[17px]">
              <Link href={lead.href}>Read the guide</Link>
            </p>
          </section>

          <section>
            <h2 className="section-head">Santa&rsquo;s Workshop</h2>
            <p className="text-[18px] leading-normal">Want to make your own crossword? Here&rsquo;s a list of helpful tools.</p>
            <p className="mt-4 text-[17px]">
              <Link href="/crossword/workshop">See the list</Link>
            </p>
          </section>
        </aside>
      </div>

      <nav aria-label="Inside" className="sc mt-12 border-t-[3px] border-[var(--rule)] pt-2 text-center text-[16px] sm:text-[17px]">
        {inside.map((item, i) => (
          <Fragment key={item.href}>
            {i > 0 && <span aria-hidden="true"> &middot; </span>}
            <Link href={item.href} className="plain whitespace-nowrap">
              {item.name}
            </Link>
          </Fragment>
        ))}
      </nav>
    </>
  );
}
