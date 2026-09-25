"use client";

import { countdownLabel, useEditionDate } from "@/lib/useEditionDate";
import { useSitePrefs } from "@/components/SitePrefs";
import { CompactToggles, EditionToggle, SnowToggle } from "./EditionToggles";
import Snowflake from "./Snowflake";

/** The village weather, read from the snow, wind and edition settings. */
function weather({ evening, snow, snowAmount, wind }: { evening: boolean; snow: boolean; snowAmount: number; wind: number }) {
  if (!snow) return evening ? "Clear night" : "Clear skies";
  if (snowAmount >= 0.7 && wind >= 0.6) return "Blizzard";
  const fall = snowAmount < 0.34 ? "Light snow" : snowAmount < 0.7 ? "Snow" : "Heavy snow";
  return wind >= 0.6 ? `${fall}, windy` : fall;
}

/** The full masthead, used on the front page only. */
export default function FrontMasthead() {
  const date = useEditionDate();
  const prefs = useSitePrefs();

  return (
    <header>
      <div className="sm:hidden">
        <CompactToggles />
      </div>
      <div className="hidden items-center justify-between gap-x-4 text-[16px] sm:flex">
        <EditionToggle />
        <SnowToggle />
      </div>

      <h1 className="mt-3 mb-4 text-center text-[44px] leading-none font-semibold tracking-[-0.015em] sm:text-[64px] lg:text-[82px]">
        Ian&rsquo;s Christmas Village
      </h1>

      <div className="double-rule">
        <div className="sc grid grid-cols-1 items-center gap-0.5 border-b border-[var(--rule)] py-2 text-center text-[16px] sm:grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] sm:px-0.5 sm:text-left sm:text-[17px]">
          <span className="hidden sm:block">Forecast: {weather(prefs)}</span>
          <span className="flex min-h-[1.5em] items-center justify-center gap-3 sm:gap-[18px]">
            <Snowflake />
            <span>{date?.long ?? ""}</span>
            <Snowflake />
          </span>
          <span className="min-h-[1.5em] sm:text-right">
            {date && (
              <>
                {date.daysUntilChristmas > 0 && `${date.daysUntilChristmas} `}
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
