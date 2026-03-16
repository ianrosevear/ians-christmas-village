"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { CrosswordPuzzle, CrosswordState, ClueDef, Direction } from "@/lib/crossword/types";
import { getActiveClue } from "@/lib/crossword/navigation";
import { SmallToggle, ANNOTATION_COLORS } from "@/lib/crossword/annotations";

type AnnotationMap = Record<string, (show: boolean) => React.ReactNode>;

const LEGEND_ITEMS = [
  { key: "definition", label: "Definition", className: ANNOTATION_COLORS.def, desc: "The straightforward definition of the answer. Almost always at the front or end of the clue." },
  { key: "indicator", label: "Indicator", className: ANNOTATION_COLORS.ind, desc: "A word or phrase that directs you to modify adjacent fodder in some way." },
  { key: "fodder", label: "Fodder", className: ANNOTATION_COLORS.fod, desc: "Words that are modified by indicators. If the clue is a recipe, fodder are ingredients." },
  { key: "charade", label: "Charade", className: ANNOTATION_COLORS.cha, desc: "Words substituted with a synonym or abbreviation to build the answer." },
] as const;

type LegendKey = typeof LEGEND_ITEMS[number]["key"];

function ColorLegend() {
  const [active, setActive] = useState<LegendKey | null>(null);
  const activeItem = LEGEND_ITEMS.find((i) => i.key === active);

  return (
    <div className="text-xs">
      <div className="flex flex-wrap gap-x-3 gap-y-1">
        {LEGEND_ITEMS.map((item) => (
          <button
            key={item.key}
            onClick={() => setActive(active === item.key ? null : item.key)}
            className={`cursor-pointer rounded px-1 ${item.className} ${active === item.key ? "ring-1 ring-[var(--color-dark)]/30 dark:ring-[var(--color-snow)]/30" : ""}`}
          >
            {item.label}
          </button>
        ))}
      </div>
      {activeItem && (
        <p className="mt-1.5 text-[var(--color-dark)]/60 dark:text-[var(--color-snow)]/50">
          {activeItem.desc}
        </p>
      )}
    </div>
  );
}

interface CrosswordCluesProps {
  puzzle: CrosswordPuzzle;
  state: CrosswordState;
  onClueClick: (clueNumber: number, direction: Direction) => void;
  annotations?: AnnotationMap;
}

function ClueItem({
  clue,
  direction,
  isActive,
  activeRef,
  onClick,
  annotation,
}: {
  clue: ClueDef;
  direction: Direction;
  isActive: boolean;
  activeRef: React.RefObject<HTMLLIElement | null>;
  onClick: () => void;
  annotation?: (show: boolean) => React.ReactNode;
}) {
  const [showColors, setShowColors] = useState(false);

  return (
    <li
      ref={isActive ? activeRef : undefined}
      className={`px-2 py-1 cursor-pointer rounded hover:bg-[var(--color-dark)]/5 dark:hover:bg-[var(--color-snow)]/5 ${
        isActive ? "crossword-clue--active" : ""
      }`}
      onClick={onClick}
    >
      <span className="font-bold mr-2">{clue.number}</span>
      {annotation ? (
        <>
          {annotation(showColors)}
          {" "}
          <SmallToggle
            label="colors"
            active={showColors}
            onClick={() => setShowColors(!showColors)}
          />
        </>
      ) : (
        clue.text
      )}
    </li>
  );
}

export default function CrosswordClues({ puzzle, state, onClueClick, annotations }: CrosswordCluesProps) {
  const activeClue = getActiveClue(puzzle, state.cursor.row, state.cursor.col, state.direction);
  const activeRef = useRef<HTMLLIElement>(null);

  useEffect(() => {
    activeRef.current?.scrollIntoView({ block: "nearest", behavior: "smooth" });
  }, [activeClue?.number, activeClue?.direction]);

  const acrossClues = useMemo(
    () => puzzle.clues.filter((c) => c.direction === "across").sort((a, b) => a.number - b.number),
    [puzzle.clues]
  );
  const downClues = useMemo(
    () => puzzle.clues.filter((c) => c.direction === "down").sort((a, b) => a.number - b.number),
    [puzzle.clues]
  );

  const isActive = (num: number, dir: Direction) =>
    activeClue?.number === num && activeClue?.direction === dir;

  const clueKey = (num: number, dir: Direction) =>
    `${num}${dir === "across" ? "A" : "D"}`;

  return (
    <div className="flex flex-col gap-4 text-sm text-[var(--color-dark)] dark:text-[var(--color-snow)] min-w-0">
      {annotations && <ColorLegend />}
      <div>
        <h3 className="font-raleway text-base font-bold mb-2 tracking-wide uppercase text-[var(--color-dark)]/60 dark:text-[var(--color-snow)]/50">
          Across
        </h3>
        <ol className="space-y-1">
          {acrossClues.map((clue) => (
            <ClueItem
              key={`a${clue.number}`}
              clue={clue}
              direction="across"
              isActive={isActive(clue.number, "across")}
              activeRef={activeRef}
              onClick={() => onClueClick(clue.number, "across")}
              annotation={annotations?.[clueKey(clue.number, "across")]}
            />
          ))}
        </ol>
      </div>
      <div>
        <h3 className="font-raleway text-base font-bold mb-2 tracking-wide uppercase text-[var(--color-dark)]/60 dark:text-[var(--color-snow)]/50">
          Down
        </h3>
        <ol className="space-y-1">
          {downClues.map((clue) => (
            <ClueItem
              key={`d${clue.number}`}
              clue={clue}
              direction="down"
              isActive={isActive(clue.number, "down")}
              activeRef={activeRef}
              onClick={() => onClueClick(clue.number, "down")}
              annotation={annotations?.[clueKey(clue.number, "down")]}
            />
          ))}
        </ol>
      </div>
    </div>
  );
}
