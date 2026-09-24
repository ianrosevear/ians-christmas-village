import type { GridShape } from "@/lib/crossword/thumbnail";

/** A small drawing of a puzzle's grid, fitted inside a `size`-pixel square. */
export default function GridThumbnail({ shape, size }: { shape: GridShape; size: number }) {
  const n = Math.max(shape.width, shape.height);
  const border = size >= 120 ? 2 : 1.5;
  const cell = Math.floor((size - border * 2 - (n - 1)) / n);
  const w = shape.width * cell + (shape.width - 1) + border * 2;
  const h = shape.height * cell + (shape.height - 1) + border * 2;
  const bar = Math.max(1.5, cell / 6);

  const cells: React.ReactNode[] = [];
  shape.rows.forEach((row, r) => {
    [...row].forEach((ch, c) => {
      const x = border + c * (cell + 1);
      const y = border + r * (cell + 1);
      cells.push(
        <rect key={`${r},${c}`} x={x} y={y} width={cell} height={cell} style={{ fill: ch === "#" ? "var(--grid-block)" : "var(--grid-open)" }} />,
      );
      if (ch === "r" || ch === "x") {
        cells.push(<rect key={`${r},${c}r`} x={x + cell - bar / 2} y={y} width={bar + 1} height={cell} style={{ fill: "var(--grid-bar)" }} />);
      }
      if (ch === "b" || ch === "x") {
        cells.push(<rect key={`${r},${c}b`} x={x} y={y + cell - bar / 2} width={cell} height={bar + 1} style={{ fill: "var(--grid-bar)" }} />);
      }
    });
  });

  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} aria-hidden="true" className="block">
      <rect width={w} height={h} style={{ fill: "var(--grid-line)" }} />
      {cells}
    </svg>
  );
}
