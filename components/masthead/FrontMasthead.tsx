"use client";

import { countdownLabel, useEditionDate } from "@/lib/useEditionDate";
import { EditionToggle, SnowToggle } from "./EditionToggles";
import Snowflake from "./Snowflake";

/** The full masthead, used on the front page only. */
export default function FrontMasthead() {
  const date = useEditionDate();

  return (
    <header>
      <div className="flex flex-wrap items-center justify-between gap-x-4 text-[16px]">
        <EditionToggle />
        <SnowToggle />
      </div>

      <h1 className="mt-1 mb-4 text-center text-[44px] leading-none font-semibold tracking-[-0.015em] sm:text-[72px] lg:text-[92px]">
        Ian&rsquo;s Christmas Village
      </h1>

      <div className="double-rule">
        <div className="grid grid-cols-1 items-center gap-0.5 border-b border-[var(--rule)] py-2 text-center text-[16px] sm:grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] sm:px-0.5 sm:text-left sm:text-[17px]">
          <span className="sc hidden sm:block">Vol. I &middot; No. 5</span>
          <span className="flex min-h-[1.5em] items-center justify-center gap-3 italic sm:gap-[18px]">
            <Snowflake />
            <span>{date?.long ?? ""}</span>
            <Snowflake />
          </span>
          <span className="sc min-h-[1.5em] sm:text-right">
            {date && (
              <>
                {date.daysUntilChristmas > 0 && (
                  <strong className="font-bold [font-variant-caps:normal]">{date.daysUntilChristmas} </strong>
                )}
                {countdownLabel(date.daysUntilChristmas)}
              </>
            )}
          </span>
        </div>
      </div>
      <div className="ribbon mt-1.5" />
    </header>
  );
}
