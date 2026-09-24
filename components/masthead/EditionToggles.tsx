"use client";

import { useSitePrefs } from "@/components/SitePrefs";

function Choice({ label, pressed, onClick }: { label: string; pressed: boolean; onClick: () => void }) {
  return (
    <button type="button" aria-pressed={pressed} onClick={onClick} className="text-toggle min-h-11 px-1">
      {label}
    </button>
  );
}

/** Single-button versions for narrow screens: tap to switch. */
export function CompactToggles() {
  const { evening, setEvening, snow, setSnow } = useSitePrefs();
  return (
    <div className="sc flex items-center justify-between text-[16px] text-[var(--ink-soft)]">
      <button type="button" className="min-h-11" onClick={() => setEvening(!evening)} aria-label={`Edition: ${evening ? "evening" : "morning"}. Switch edition`}>
        Edition: <span className="text-[var(--ink)] underline underline-offset-4">{evening ? "Evening" : "Morning"}</span>
      </button>
      <button type="button" className="min-h-11" onClick={() => setSnow(!snow)} aria-label={`Snow ${snow ? "on" : "off"}. Toggle snow`}>
        Snow: <span className="text-[var(--ink)] underline underline-offset-4">{snow ? "On" : "Off"}</span>
      </button>
    </div>
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
