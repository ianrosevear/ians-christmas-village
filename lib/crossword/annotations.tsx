import React from "react";

export const ANNOTATION_COLORS = {
  def: "bg-blue-200/60 dark:bg-blue-500/30",
  ind: "bg-pink-200/70 dark:bg-pink-400/30",
  fod: "bg-amber-200/70 dark:bg-amber-400/30",
  cha: "bg-orange-200/70 dark:bg-orange-400/30",
} as const;

export function Def({ children, show }: { children: React.ReactNode; show: boolean }) {
  return (
    <span className={show ? `rounded px-0.5 ${ANNOTATION_COLORS.def}` : ""}>
      {children}
    </span>
  );
}

export function Ind({ children, show }: { children: React.ReactNode; show: boolean }) {
  return (
    <span className={show ? `rounded px-0.5 ${ANNOTATION_COLORS.ind}` : ""}>
      {children}
    </span>
  );
}

export function Fod({ children, show }: { children: React.ReactNode; show: boolean }) {
  return (
    <span className={show ? `rounded px-0.5 ${ANNOTATION_COLORS.fod}` : ""}>
      {children}
    </span>
  );
}

export function Cha({ children, show }: { children: React.ReactNode; show: boolean }) {
  return (
    <span className={show ? `rounded px-0.5 ${ANNOTATION_COLORS.cha}` : ""}>
      {children}
    </span>
  );
}

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
      onClick={(e) => { e.stopPropagation(); onClick(); }}
      className={`cursor-pointer text-[10px] tracking-wide uppercase rounded px-2 py-0.5 border transition-colors ${
        active
          ? "border-[var(--color-dark)]/25 dark:border-[var(--color-snow)]/25 text-[var(--color-dark)]/70 dark:text-[var(--color-snow)]/60"
          : "border-[var(--color-dark)]/10 dark:border-[var(--color-snow)]/10 text-[var(--color-dark)]/30 dark:text-[var(--color-snow)]/25"
      }`}
    >
      {label}
    </button>
  );
}
