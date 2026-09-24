import type { ClueDef } from "@/lib/crossword/types";
import { WordplayGlyph } from "@/lib/crossword/annotations";

export type Annotation = (show: boolean) => React.ReactNode;
export type AnnotationMap = Record<string, Annotation>;

const LENGTH_RE = /\s*(\([\d,\s\-–]+\))\s*$/;

export function clueKey(clue: Pick<ClueDef, "number" | "direction">): string {
  return `${clue.number}${clue.direction === "across" ? "A" : "D"}`;
}

/** Clue text, highlighted when its wordplay is showing, with the length in grey. */
export function ClueText({ clue, annotation, showWordplay }: { clue: ClueDef; annotation?: Annotation; showWordplay: boolean }) {
  const match = clue.text.match(LENGTH_RE);
  const body = match ? clue.text.slice(0, match.index).trim() : clue.text;
  const length = match?.[1];

  return (
    <>
      {annotation && showWordplay ? annotation(true) : body}
      {length && (
        <>
          {" "}
          <span className="text-[var(--ink-soft)]">{length}</span>
        </>
      )}
    </>
  );
}

/** The per-clue wordplay switch. */
export function WordplayButton({
  on,
  label,
  onToggle,
  size = "md",
}: {
  on: boolean;
  label: string;
  onToggle: () => void;
  size?: "md" | "lg";
}) {
  return (
    <button
      type="button"
      aria-pressed={on}
      aria-label={`${on ? "Hide" : "Show"} wordplay for ${label}`}
      title={`${on ? "Hide" : "Show"} wordplay`}
      onClick={(e) => {
        e.stopPropagation();
        onToggle();
      }}
      className={`flex shrink-0 items-center justify-center rounded hover:bg-[var(--tint)] ${size === "lg" ? "size-11" : "size-9"} ${
        on && size === "lg" ? "bg-[var(--tint)]" : ""
      }`}
    >
      <WordplayGlyph on={on} />
    </button>
  );
}
