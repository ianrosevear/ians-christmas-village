"use client";

import { useSitePrefs } from "@/components/SitePrefs";

function Choice({ label, pressed, onClick }: { label: string; pressed: boolean; onClick: () => void }) {
  return (
    <button type="button" aria-pressed={pressed} onClick={onClick} className="text-toggle min-h-11 px-1">
      {label}
    </button>
  );
}

export function EditionToggle() {
  const { evening, setEvening } = useSitePrefs();
  return (
    <div role="group" aria-label="Edition" className="sc flex items-center gap-1.5 text-[var(--ink-soft)]">
      <span>Edition:</span>
      <Choice label="Morning" pressed={!evening} onClick={() => setEvening(false)} />
      <span aria-hidden="true">/</span>
      <Choice label="Evening" pressed={evening} onClick={() => setEvening(true)} />
    </div>
  );
}

export function SnowToggle() {
  const { snow, setSnow } = useSitePrefs();
  return (
    <div role="group" aria-label="Snow" className="sc flex items-center gap-1.5 text-[var(--ink-soft)]">
      <span>Snow:</span>
      <Choice label="On" pressed={snow} onClick={() => setSnow(true)} />
      <span aria-hidden="true">/</span>
      <Choice label="Off" pressed={!snow} onClick={() => setSnow(false)} />
    </div>
  );
}
