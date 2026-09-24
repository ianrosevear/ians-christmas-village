/** Small six-spoke snowflake used as a typographic ornament. */
export default function Snowflake({ size = 13 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size + 1}
      viewBox="0 0 14 14"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.3"
      strokeLinecap="round"
      aria-hidden="true"
      className="shrink-0 text-[var(--ink-soft)]"
    >
      <path d="M7 1v12M1.8 4l10.4 6M1.8 10l10.4-6" />
    </svg>
  );
}
