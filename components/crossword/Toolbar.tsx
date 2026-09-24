"use client";

import { Menu, MenuButton, MenuHeading, MenuItem, MenuItems, MenuSection, MenuSeparator } from "@headlessui/react";

export type Scope = "letter" | "word" | "puzzle";

function Chevron() {
  return (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
      <path d="M2.5 4.5 6 8l3.5-3.5" />
    </svg>
  );
}

const itemClass = "block w-full px-4 py-2.5 text-left text-[18px] data-focus:bg-[var(--tint)]";
const panelClass = "paper z-50 min-w-44 border border-[var(--rule)] py-1 focus:outline-none [--anchor-gap:4px]";

function ScopeMenu({ label, onPick, puzzleLabel }: { label: string; onPick: (scope: Scope) => void; puzzleLabel: string }) {
  return (
    <Menu>
      <MenuButton className="sc flex min-h-11 items-center gap-1">
        {label} <Chevron />
      </MenuButton>
      <MenuItems anchor="bottom end" className={panelClass}>
        <MenuItem>
          <button type="button" className={itemClass} onClick={() => onPick("letter")}>
            Letter
          </button>
        </MenuItem>
        <MenuItem>
          <button type="button" className={itemClass} onClick={() => onPick("word")}>
            Word
          </button>
        </MenuItem>
        <MenuItem>
          <button type="button" className={itemClass} onClick={() => onPick("puzzle")}>
            {puzzleLabel}
          </button>
        </MenuItem>
      </MenuItems>
    </Menu>
  );
}

type ToolbarProps = {
  onCheck: (scope: Scope) => void;
  onReveal: (scope: Scope) => void;
  onClear: () => void;
  /** Only for puzzles with wordplay annotations. */
  showAll?: { on: boolean; set: (on: boolean) => void };
};

/** Desktop: Check, Reveal, Clear side by side. */
export function Toolbar({ onCheck, onReveal, onClear }: ToolbarProps) {
  return (
    <div className="flex items-center gap-7 text-[17px]">
      <ScopeMenu label="Check" onPick={onCheck} puzzleLabel="Puzzle" />
      <ScopeMenu label="Reveal" onPick={onReveal} puzzleLabel="Puzzle…" />
      <button type="button" className="sc min-h-11 text-[var(--ink-soft)] hover:text-[var(--ink)]" onClick={onClear}>
        Clear…
      </button>
    </div>
  );
}

/** Phones: everything in one Tools menu. */
export function ToolsMenu({ onCheck, onReveal, onClear, showAll }: ToolbarProps) {
  const scopes: [Scope, string][] = [
    ["letter", "letter"],
    ["word", "word"],
    ["puzzle", "puzzle"],
  ];
  return (
    <Menu>
      <MenuButton className="sc flex min-h-11 items-center gap-1 text-[17px]">
        Tools <Chevron />
      </MenuButton>
      <MenuItems anchor="bottom end" className={panelClass}>
        <MenuSection>
          <MenuHeading className="sc px-4 pt-1.5 text-[15px] text-[var(--ink-soft)]">Check</MenuHeading>
          {scopes.map(([scope, label]) => (
            <MenuItem key={scope}>
              <button type="button" className={itemClass} onClick={() => onCheck(scope)}>
                Check {label}
              </button>
            </MenuItem>
          ))}
        </MenuSection>
        <MenuSeparator className="my-1 h-px bg-[var(--rule-soft)]" />
        <MenuSection>
          <MenuHeading className="sc px-4 pt-1.5 text-[15px] text-[var(--ink-soft)]">Reveal</MenuHeading>
          {scopes.map(([scope, label]) => (
            <MenuItem key={scope}>
              <button type="button" className={itemClass} onClick={() => onReveal(scope)}>
                Reveal {label}
                {scope === "puzzle" ? "…" : ""}
              </button>
            </MenuItem>
          ))}
        </MenuSection>
        <MenuSeparator className="my-1 h-px bg-[var(--rule-soft)]" />
        {showAll && (
          <MenuItem>
            <button type="button" className={itemClass} onClick={() => showAll.set(!showAll.on)}>
              {showAll.on ? "Hide all wordplay" : "Show all wordplay"}
            </button>
          </MenuItem>
        )}
        <MenuItem>
          <button type="button" className={itemClass} onClick={onClear}>
            Clear puzzle…
          </button>
        </MenuItem>
      </MenuItems>
    </Menu>
  );
}
