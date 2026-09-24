"use client";

const ROWS = ["QWERTYUIOP", "ASDFGHJKL", "ZXCVBNM"];

/**
 * Letter keyboard for touch devices. Using our own keys means the phone's keyboard
 * never opens, so the grid doesn't jump around or get covered.
 */
export default function OnScreenKeyboard({ onLetter, onBackspace }: { onLetter: (letter: string) => void; onBackspace: () => void }) {
  // pointerdown + preventDefault: instant response, and no focus or double-tap zoom.
  const press = (fn: () => void) => (e: React.PointerEvent) => {
    e.preventDefault();
    fn();
  };

  return (
    <div
      role="group"
      aria-label="Keyboard"
      className="fixed inset-x-0 bottom-0 z-30 flex flex-col gap-[9px] bg-[var(--keyboard)] px-[3px] pt-2 pb-[max(14px,env(safe-area-inset-bottom))]"
    >
      {ROWS.map((row, i) => (
        <div
          key={row}
          className="grid gap-[5px]"
          style={{
            gridTemplateColumns: i === 2 ? `repeat(${row.length}, minmax(0, 1fr)) 1.6fr` : `repeat(${row.length}, minmax(0, 1fr))`,
            padding: i === 1 ? "0 5%" : i === 2 ? "0 0 0 5%" : undefined,
          }}
        >
          {[...row].map((letter) => (
            <button key={letter} type="button" className="xw-key" onPointerDown={press(() => onLetter(letter))} onClick={(e) => e.preventDefault()}>
              {letter}
            </button>
          ))}
          {i === 2 && (
            <button
              type="button"
              aria-label="Delete"
              className="xw-key !bg-[var(--key-special)]"
              onPointerDown={press(onBackspace)}
              onClick={(e) => e.preventDefault()}
            >
              <svg width="22" height="16" viewBox="0 0 22 16" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
                <path d="M7 1h13v14H7L1 8z" />
                <path d="m11 5 6 6m0-6-6 6" />
              </svg>
            </button>
          )}
        </div>
      ))}
    </div>
  );
}

/** Space at the end of the page so the keyboard never covers the last clues. */
export function KeyboardSpacer() {
  return <div aria-hidden="true" className="h-[190px]" />;
}
