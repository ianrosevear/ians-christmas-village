import React from "react";

/** Highlighter classes for the four parts of cryptic wordplay (see paper.css). */
export const ANNOTATION_CLASSES = {
  def: "hl hl-def",
  ind: "hl hl-ind",
  fod: "hl hl-fod",
  cha: "hl hl-cha",
} as const;

type Props = { children: React.ReactNode; show: boolean };

export function Def({ children, show }: Props) {
  return <span className={show ? ANNOTATION_CLASSES.def : undefined}>{children}</span>;
}

export function Ind({ children, show }: Props) {
  return <span className={show ? ANNOTATION_CLASSES.ind : undefined}>{children}</span>;
}

export function Fod({ children, show }: Props) {
  return <span className={show ? ANNOTATION_CLASSES.fod : undefined}>{children}</span>;
}

export function Cha({ children, show }: Props) {
  return <span className={show ? ANNOTATION_CLASSES.cha : undefined}>{children}</span>;
}

export const WORDPLAY_KEY = [
  { key: "def", label: "Definition", desc: "The straightforward definition of the answer. Almost always at the front or end of the clue." },
  { key: "ind", label: "Indicator", desc: "A word or phrase that directs you to modify adjacent fodder in some way." },
  { key: "fod", label: "Fodder", desc: "Words that are modified by indicators. If the clue is a recipe, fodder are ingredients." },
  { key: "cha", label: "Charade", desc: "Words substituted with a synonym or abbreviation to build the answer." },
] as const;

/** A highlighter over its stroke: the stroke shows the four wordplay colours when on, grey when off. */
export function WordplayGlyph({ on, size = 18 }: { on: boolean; size?: number }) {
  const fills = on
    ? ["var(--wp-def)", "var(--wp-ind)", "var(--wp-fod)", "var(--wp-cha)"]
    : ["var(--wp-off)", "var(--wp-off)", "var(--wp-off)", "var(--wp-off)"];
  return (
    <svg width={size} height={size} viewBox="0 0 20 20" aria-hidden="true" className="shrink-0">
      {/* The pen, leaning left, its chisel tip resting on the stroke */}
      <g transform="translate(0.5 3.9) rotate(40 10 7.5)" className={on ? "text-[var(--ink)]" : "text-[var(--ink-soft)]"}>
        <rect x="7.5" y="0" width="5" height="8.5" rx="1" fill="none" stroke="currentColor" strokeWidth="1.5" />
        <path d="M7.9 9.5h4.2l-1.1 3.3H9z" fill="currentColor" />
      </g>
      {fills.map((fill, i) => (
        <rect key={i} x={1 + i * 4.5} y="16" width="4.5" height="3" style={{ fill }} />
      ))}
    </svg>
  );
}

/** Deprecated small text toggle, kept until every caller moves to WordplayGlyph buttons. */
export function SmallToggle({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={(e) => {
        e.stopPropagation();
        onClick();
      }}
      aria-pressed={active}
      className="text-toggle sc text-[15px]"
    >
      {label}
    </button>
  );
}
