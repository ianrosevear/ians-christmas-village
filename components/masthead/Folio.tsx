"use client";

import Link from "next/link";
import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";
import { sections } from "@/lib/sections";
import { countdownLabel, useEditionDate } from "@/lib/useEditionDate";

function Chevron() {
  return (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
      <path d="M2.5 4.5 6 8l3.5-3.5" />
    </svg>
  );
}

/** Compact masthead for inner pages: paper name, date, and the section line. */
export default function Folio({ current }: { current?: string }) {
  const date = useEditionDate();

  return (
    <header>
      <div className="flex items-center justify-between gap-4 border-b border-[var(--rule)] pb-1.5 sm:items-baseline sm:pb-2">
        <Link href="/" className="plain min-h-11 content-center text-[20px] font-semibold tracking-[-0.01em] sm:text-[30px]">
          Ian&rsquo;s Christmas Village
        </Link>

        <div className="hidden text-[16px] text-[var(--ink-soft)] sm:block">
          {date && (
            <>
              <span className="italic">{date.short}</span> &middot;{" "}
              <span className="sc">
                {date.daysUntilChristmas > 0 && `${date.daysUntilChristmas} `}
                {countdownLabel(date.daysUntilChristmas)}
              </span>
            </>
          )}
        </div>

        <Menu as="div" className="relative sm:hidden">
          <MenuButton className="sc flex min-h-11 items-center gap-1 px-2 text-[17px]">
            Sections <Chevron />
          </MenuButton>
          <MenuItems
            anchor="bottom end"
            className="paper z-50 min-w-48 border border-[var(--rule)] py-1 text-[18px] focus:outline-none"
          >
            {sections.map((s) => (
              <MenuItem key={s.key}>
                <Link
                  href={s.href}
                  className={`plain block px-4 py-2.5 data-focus:bg-[var(--tint)] ${s.key === current ? "font-bold" : ""}`}
                >
                  {s.name}
                </Link>
              </MenuItem>
            ))}
          </MenuItems>
        </Menu>
      </div>

      <nav aria-label="Sections" className="sc hidden gap-8 border-b border-[var(--rule)] text-[17px] sm:flex">
        {sections.map((s) => (
          <Link
            key={s.key}
            href={s.href}
            aria-current={s.key === current ? "page" : undefined}
            className={`plain flex min-h-10 items-center ${s.key === current ? "font-bold !text-[var(--accent)]" : ""}`}
          >
            {s.name}
          </Link>
        ))}
      </nav>
      <div className="ribbon mt-1.5" />
    </header>
  );
}
