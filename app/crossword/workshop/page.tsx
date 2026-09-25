import type { Metadata } from "next";
import Folio from "@/components/masthead/Folio";
import { toolLabel, workshop } from "@/lib/crossword/workshop";
import { formatPublished } from "@/lib/crossword/puzzles";

export const metadata: Metadata = {
  title: "Santa's Workshop",
  description: "Tools for making your own crossword.",
  openGraph: {
    title: "Santa's Workshop",
    description: "Tools for making your own crossword.",
  },
};

/** Set like the guide: a centred headline and byline over a single column. */
export default function WorkshopPage() {
  return (
    <>
      <Folio current="puzzles" />
      <article className="mx-auto max-w-[720px]">
        <header className="pt-9 pb-6 text-center sm:pt-12">
          <h1 className="text-[40px] leading-none font-semibold tracking-[-0.02em] sm:text-[64px]">Santa&rsquo;s Workshop</h1>
          <p className="mt-3.5 text-[17px] text-[var(--ink-soft)] sm:text-[18px]">
            <span className="italic">by Ian Rosevear</span> &middot; {formatPublished("2026-09")}
          </p>
        </header>

        <div className="border-t-[3px] border-[var(--rule)] pt-8 text-[19px] leading-[1.62] sm:text-[20px]">
          <p className="drop-cap mb-10 flow-root">
            These are the tools I use when I&rsquo;m making a crossword. Eventually I&rsquo;ll write a full guide, but for
            now I hope this list will suffice. If you have additional questions, need a helping hand, or have a resource you think I should add, send me a message.
            I&rsquo;m always looking to collaborate and spread the joys of puzzle-making.
          </p>

          <div className="space-y-12">
            {workshop.map((group) => (
              <section key={group.heading}>
                <h2 className="mb-3.5 text-[28px] leading-tight font-semibold tracking-[-0.01em] sm:text-[32px]">{group.heading}</h2>
                <ul className="space-y-3">
                  {group.tools.map((tool) => (
                    <li key={tool.url}>
                      <a href={tool.url} target="_blank" rel="noopener noreferrer">
                        {toolLabel(tool)}
                      </a>
                      : {tool.note}
                    </li>
                  ))}
                </ul>
              </section>
            ))}
          </div>
        </div>
      </article>
    </>
  );
}
