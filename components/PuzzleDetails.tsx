/** A puzzle's facts as labelled lines, so every puzzle lays out the same way. */
export function PuzzleDetails({
  kind,
  level,
  published,
}: {
  kind: string;
  level: string;
  published?: string;
}) {
  const rows: [string, string][] = [
    ["Type", kind],
    ["Level", level],
  ];
  if (published) rows.push(["Published", published]);

  return (
    <dl className="grid grid-cols-[auto_minmax(0,1fr)] gap-x-3 text-[15px] leading-[1.28] sm:text-[16px]">
      {rows.map(([label, value]) => (
        <div key={label} className="contents">
          <dt className="sc text-[var(--ink-soft)]">{label}</dt>
          <dd>{value}</dd>
        </div>
      ))}
    </dl>
  );
}

/** Small-caps "New" flag set after a puzzle's title, in the accent colour. */
export function NewTag() {
  return (
    <span className="sc ml-2.5 inline-block translate-y-[-0.2em] border border-current px-1.5 align-middle text-[14px] leading-[1.35] font-bold tracking-[0.12em] text-[var(--new)]">
      New
    </span>
  );
}
