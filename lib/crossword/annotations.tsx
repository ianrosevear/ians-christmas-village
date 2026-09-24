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

/** Four stacked bars: the wordplay key in miniature. Coloured when on, grey when off. */
export function WordplayGlyph({ on, size = 18 }: { on: boolean; size?: number }) {
  const fills = on
    ? ["var(--wp-def)", "var(--wp-ind)", "var(--wp-fod)", "var(--wp-cha)"]
    : ["var(--wp-off)", "var(--wp-off)", "var(--wp-off)", "var(--wp-off)"];
  return (
    <svg width={size} height={(size * 16) / 18} viewBox="0 0 18 16" aria-hidden="true" className="shrink-0">
      {fills.map((fill, i) => (
        <rect key={i} x="1" y={0.5 + i * 4.2} width="16" height="2.8" rx="1.3" style={{ fill }} />
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
