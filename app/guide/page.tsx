"use client";

import { useState } from "react";
import Link from "next/link";
import Folio from "@/components/masthead/Folio";
import { Def, Ind, Fod, Cha, WordplayGlyph } from "@/lib/crossword/annotations";
import { formatPublished } from "@/lib/crossword/puzzles";

const SECTIONS: [id: string, title: string][] = [
  ["intro", "What is a cryptic?"],
  ["anagrams", "Anagrams"],
  ["charades", "Charades"],
  ["containers", "Containers"],
  ["reversals", "Reversals"],
  ["deletions", "Deletions"],
  ["selections", "Selections"],
  ["homophones", "Homophones"],
  ["hidden-words", "Hidden words"],
  ["positioners", "Positioners"],
  ["double-definition", "Double definitions"],
  ["notes", "Additional notes"],
  ["conclusion", "Conclusion"],
  ["credits", "Credits"],
];

function AnchorLink({ id }: { id: string }) {
  const [copied, setCopied] = useState(false);

  const handleClick = () => {
    const url = `${window.location.origin}${window.location.pathname}#${id}`;
    window.history.replaceState(null, "", `#${id}`);
    navigator.clipboard.writeText(url).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    });
  };

  return (
    <button
      onClick={handleClick}
      aria-label="Copy link to section"
      className="ml-2 align-middle text-[0.7em] font-normal text-[var(--ink-soft)] opacity-0 transition-opacity group-hover:opacity-100 focus-visible:opacity-100"
    >
      {copied ? "copied" : "#"}
    </button>
  );
}

function Toggle({ pressed, onClick, children }: { pressed: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button type="button" aria-pressed={pressed} onClick={onClick} className="text-toggle sc mr-5 inline-flex min-h-11 items-center gap-2 text-[16px]">
      {children}
    </button>
  );
}

/** An example clue with its wordplay colours and working, each switched on separately. */
function Clue({
  children,
  length,
  diagram,
  initiallyShown = false,
}: {
  children: (show: boolean) => React.ReactNode;
  length: string;
  diagram: string;
  initiallyShown?: boolean;
}) {
  const [showColors, setShowColors] = useState(initiallyShown);
  const [showDiagram, setShowDiagram] = useState(initiallyShown);

  return (
    <div className="-mx-4 my-6 bg-[var(--tint)] px-4 pt-4 pb-1 sm:mx-0 sm:px-[22px]">
      <p className="text-[21px] leading-normal font-semibold sm:text-[22px]">
        {children(showColors)} ({length})
      </p>
      {showDiagram && <p className="mt-2 text-[16px] tracking-[0.02em] text-[var(--ink-body)] sm:text-[17px]">{diagram}</p>}
      <div className="mt-1">
        <Toggle pressed={showColors} onClick={() => setShowColors(!showColors)}>
          <WordplayGlyph on={showColors} size={16} />
          Wordplay
        </Toggle>
        <Toggle pressed={showDiagram} onClick={() => setShowDiagram(!showDiagram)}>
          Working
        </Toggle>
      </div>
    </div>
  );
}

export default function GuidePage() {
  return (
    <>
      <Folio current="writing" />
      <article className="mx-auto max-w-[720px]">
        <header className="pt-9 pb-6 text-center sm:pt-12">
          <h1 className="text-[40px] leading-none font-semibold tracking-[-0.02em] sm:text-[64px]">How to Solve Cryptic Crosswords</h1>
          <p className="mt-3.5 text-[17px] text-[var(--ink-soft)] sm:text-[18px]">
            <span className="italic">by Ian Rosevear</span> &middot; {formatPublished("2026-03")}
          </p>
        </header>

        <nav aria-label="Contents" className="mb-10 border-t-[3px] border-b border-[var(--rule)] pt-3 pb-2.5">
          <p className="sc mb-1.5 text-[16px] font-bold">In this piece &middot; {SECTIONS.length} sections</p>
          <ol className="list-inside list-decimal gap-x-7 leading-snug marker:text-[var(--ink-soft)] columns-2 text-[16px] sm:columns-3 sm:text-[17px]">
            {SECTIONS.map(([id, title]) => (
              <li key={id} className="break-inside-avoid py-1">
                <a href={`#${id}`} className="plain">
                  {title}
                </a>
              </li>
            ))}
          </ol>
        </nav>

        <div className="space-y-12 text-[19px] leading-[1.62] sm:text-[20px]">
        {/* Intro */}
        <section id="intro" className="scroll-mt-4 space-y-[18px]">
          <h2 className="group mb-3.5 text-[28px] leading-tight font-semibold tracking-[-0.01em] sm:text-[32px]">What is a cryptic crossword?<AnchorLink id="intro" /></h2>
          <p className="drop-cap">
            A cryptic crossword is a special type of crossword in which each clue is itself a
            little wordplay puzzle. Unlike a regular crossword clue, which just gives you a
            definition, a cryptic clue contains two paths to the same answer: a straightforward
            definition joined with tricky wordplay. Both parts will independently resolve to the
            same thing: the answer that goes in the grid.
          </p>
          <p>
            If that sounds confusing, let&rsquo;s look at an example. I&rsquo;ll walk you
            through it.
          </p>

          <Clue length="6,5" diagram="LENT INSIGHT (anagram) → SILENT NIGHT" initiallyShown>
            {(show) => (
              <>
                <Def show={show}>Christmas carol</Def> <Ind show={show}>uniquely</Ind> <Fod show={show}>lent insight</Fod>
              </>
            )}
          </Clue>

          <p>
            The &ldquo;surface&rdquo; of the clue is the straightforward reading of the phrase.
            This surface gives us an impression of a Christmas carol uncannily offering pearls
            of wisdom. But to solve a cryptic crossword, we have to look below the surface.
          </p>
          <p>
            We&rsquo;re looking for a phrase made of a six and five letter word (the number at
            the end of the clue tells us the length of the answer). The{" "}
            <span className="hl hl-def font-semibold">
              definition
            </span>{" "}
            is &ldquo;Christmas carol&rdquo;&mdash;that&rsquo;s the straightforward part of the
            clue, basically a regular crossword clue. Definitions are almost always at the front
            or end of the clue. An additional wrinkle is that it will often not be clear where the
            definition ends and the wordplay begins.
          </p>
          <p>
            Next, &ldquo;uniquely&rdquo; is an{" "}
            <span className="hl hl-ind font-semibold">
              indicator
            </span>
            &mdash;a word or phrase that directs you to modify adjacent fodder in some way.
            There are several classes of indicator that tell you to perform different
            modifications. In this case &ldquo;uniquely&rdquo; is an anagram indicator.
          </p>
          <p>
            That tells us to anagram the adjacent{" "}
            <span className="hl hl-fod font-semibold">
              fodder
            </span>{" "}
            &ldquo;lent insight&rdquo;. If the clue is a recipe, fodder are ingredients&mdash;the
            words that get modified by indicators. Anagramming &ldquo;lent insight&rdquo; gives us
            &ldquo;Silent Night&rdquo;. Silent Night could have the definition &ldquo;Christmas
            Carol&rdquo;, so we can confirm that&rsquo;s our answer!
          </p>

          <div className="border-t-[3px] border-b border-[var(--rule)] pt-3.5 pb-2 text-[18px] leading-normal [&>p+p]:mt-3">
            <p className="sc text-[17px] font-bold">The four components of cryptic wordplay</p>
            <p>
              <span className="hl hl-def font-semibold">
                Definition
              </span>{" "}
              &mdash; the straightforward definition of the answer. Almost always at the front
              or end of the clue.
            </p>
            <p>
              <span className="hl hl-ind font-semibold">
                Indicator
              </span>{" "}
              &mdash; a word or phrase that directs you to modify adjacent fodder in some way.
              We&apos;ll cover several types of indicator later in the guide.
            </p>
            <p>
              <span className="hl hl-fod font-semibold">
                Fodder
              </span>{" "}
              &mdash; words that are modified by indicators. If the clue is a recipe, fodder
              are ingredients.
            </p>
            <p>
              <span className="hl hl-cha font-semibold">
                Charade
              </span>{" "}
              &mdash; words substituted with a synonym or abbreviation to build the answer.
              More on charades later.
            </p>
          </div>

          <p>
            If that seems tricky to you, that&rsquo;s okay. It&rsquo;s a totally new way of
            looking at crosswords where the words don&rsquo;t mean what they usually mean. One
            important thing to keep in mind though is that none of the wordplay required is
            arbitrary. Every step you have to take is spelled out for you and justified by the
            conventions and rules of cryptic crossword solving.
          </p>
          <p>There are 10 important clue types to be aware of:</p>
          <ol className="ml-8 list-decimal space-y-0.5 !mt-3">
            <li>Anagrams</li>
            <li>Charades</li>
            <li>Containers</li>
            <li>Reversals</li>
            <li>Deletions</li>
            <li>Selections</li>
            <li>Homophones</li>
            <li>Hidden Words</li>
            <li>Positioners</li>
            <li>Double Definitions</li>
          </ol>
        </section>

        {/* Anagrams */}
        <section id="anagrams" className="scroll-mt-4 space-y-[18px]">
          <h2 className="group mb-3.5 text-[28px] leading-tight font-semibold tracking-[-0.01em] sm:text-[32px]">Anagrams<AnchorLink id="anagrams" /></h2>
          <p>
            Anagrams are a very common kind of clue. An indicator word will clue to anagram an
            adjacent word or phrase. Anagram indicators can be very broad. Any word that suggests
            motion, destruction, alteration, confusion, uniqueness, bad behavior, or similar can
            be an anagram indicator.
          </p>

          <Clue length="5,5" diagram="CAN ASSAULT (anagram) → SANTA CLAUS">
            {(show) => (
              <>
                <Fod show={show}>Can assault</Fod>{" "}
                <Ind show={show}>naughty</Ind>{" "}
                <Def show={show}>festive figure</Def>
              </>
            )}
          </Clue>

          <Clue length="5,7" diagram="CONGRESS LIAR (anagram) → CAROL SINGERS">
            {(show) => (
              <>
                <Fod show={show}>Congress liar</Fod>{" "}
                <Ind show={show}>besmirched</Ind>{" "}
                <Def show={show}>door-to-door performers</Def>
              </>
            )}
          </Clue>

          <Clue length="9,3" diagram="THIEVES SCRAM (anagram) → CHRISTMAS EVE">
            {(show) => (
              <>
                <Ind show={show}>Surprisingly</Ind>,{" "}
                <Fod show={show}>thieves scram</Fod>{" "}
                <Def show={show}>day before holiday</Def>
              </>
            )}
          </Clue>
        </section>

        {/* Charades */}
        <section id="charades" className="scroll-mt-4 space-y-[18px]">
          <h2 className="group mb-3.5 text-[28px] leading-tight font-semibold tracking-[-0.01em] sm:text-[32px]">Charades<AnchorLink id="charades" /></h2>
          <p>
            Charades are perhaps the most common kind of clue, and are often encountered
            alongside other types of clues. A charade clue is much like the party game it is
            named after: the answer is broken down into smaller parts, and a clue is given for
            each. There&rsquo;s no indicator for a charade clue. They are their own tiny
            definition puzzle that&mdash;once solved&mdash;can be used as building blocks for the
            answer, or as fodder for other wordplay.
          </p>

          <Clue length="10" diagram="ECCENTRIC → NUT + SNACK → CRACKER = NUTCRACKER">
            {(show) => (
              <>
                <Cha show={show}>Eccentric</Cha>{" "}
                <Cha show={show}>snack</Cha> for{" "}
                <Def show={show}>holiday ballet</Def>
              </>
            )}
          </Clue>

          <p>
            The definition here is &ldquo;holiday ballet&rdquo;. We can construct the answer
            using the charades, which are converted to synonyms. ECCENTRIC becomes NUT and SNACK
            becomes CRACKER.
          </p>
          <p>
            Note the change in form of &ldquo;eccentric&rdquo;. In the surface it is used as an
            adjective, but the charade uses the noun definition of the word.
          </p>
          <p>
            Charades can also take the form of common abbreviations or shortening. POUND could
            become LB, MEDIUM could become M, and so on. There are some less intuitive charades
            too, like QUIET becoming P (a common abbreviation of piano, a sheet music marking
            meaning to play quietly) or FOUR becoming IV (four in roman numerals). A frequent
            charade you&rsquo;ll see is elements being charades of their periodic table
            abbreviations (GOLD becomes AU).
          </p>

          <Clue length="4" diagram="SMALL → S + PRESENT → NOW = SNOW">
            {(show) => (
              <>
                <Def show={show}>White blanket</Def> is{" "}
                <Cha show={show}>small</Cha>{" "}
                <Cha show={show}>present</Cha>
              </>
            )}
          </Clue>

          <Clue length="6" diagram="COMMERCIAL → AD + OUTLET → VENT = ADVENT">
            {(show) => (
              <>
                <Def show={show}>Christmas season</Def>{" "}
                <Cha show={show}>commercial</Cha>{" "}
                <Cha show={show}>outlet</Cha>
              </>
            )}
          </Clue>
        </section>

        {/* Containers */}
        <section id="containers" className="scroll-mt-4 space-y-[18px]">
          <h2 className="group mb-3.5 text-[28px] leading-tight font-semibold tracking-[-0.01em] sm:text-[32px]">Containers<AnchorLink id="containers" /></h2>
          <p>
            Containers are a type of clue in which a word is placed inside another word. This can
            be clued either via one word surrounding another (with words like &ldquo;around&rdquo;,
            &ldquo;about&rdquo;, &ldquo;surrounding&rdquo;, &ldquo;straddling&rdquo;), or via
            one word being inside another (with words like &ldquo;within&rdquo;, &ldquo;carried
            by&rdquo;, &ldquo;interrupting&rdquo;, &ldquo;inwardly&rdquo;). This type of clue is
            commonly combined with charades.
          </p>

          <Clue length="8" diagram="ASS + SOBS → WAILS = W(ASS)AILS">
            {(show) => (
              <>
                <Fod show={show}>Ass</Fod>{" "}
                <Ind show={show}>breaks into</Ind>{" "}
                <Cha show={show}>sobs</Cha> for{" "}
                <Def show={show}>mulled wines</Def>
              </>
            )}
          </Clue>
        </section>

        {/* Reversals */}
        <section id="reversals" className="scroll-mt-4 space-y-[18px]">
          <h2 className="group mb-3.5 text-[28px] leading-tight font-semibold tracking-[-0.01em] sm:text-[32px]">Reversals<AnchorLink id="reversals" /></h2>
          <p>
            Reversals are a self explanatory kind of clue where a word or phrase is read
            backwards. Indicators for a reversal suggest changing direction or retreating. Look
            for things like &ldquo;around&rdquo;, &ldquo;came back&rdquo;, &ldquo;flipped&rdquo;.
            Sometimes they can be directional. In a grid you might see &ldquo;left&rdquo; or
            &ldquo;west&rdquo; for an across clue, or &ldquo;climbing&rdquo;,
            &ldquo;rising&rdquo;, and &ldquo;up&rdquo; for a down clue.
          </p>

          <Clue length="6" diagram="CHRISTMAS TREE → FIR → RIF + L.E.D. = RIFLED">
            {(show) => (
              <>
                <Def show={show}>Rummaged</Def>,{" "}
                <Ind show={show}>brought back</Ind>{" "}
                <Cha show={show}>Christmas tree</Cha>{" "}
                <Cha show={show}>light</Cha>
              </>
            )}
          </Clue>
        </section>

        {/* Deletions */}
        <section id="deletions" className="scroll-mt-4 space-y-[18px]">
          <h2 className="group mb-3.5 text-[28px] leading-tight font-semibold tracking-[-0.01em] sm:text-[32px]">Deletions<AnchorLink id="deletions" /></h2>
          <p>
            Deletions remove one or more letters from fodder to create a new word. Deletion
            indicators will often not only indicate a removal, but also what to remove or where
            to remove it. For example, indicators like &ldquo;headless&rdquo; or
            &ldquo;nonstarter&rdquo; call to remove the first letter. &ldquo;Without end&rdquo;
            or &ldquo;almost&rdquo; indicate to remove the final letter. &ldquo;Shelled&rdquo;
            and &ldquo;sanded edges&rdquo; indicate to remove both the first and last letter,
            while &ldquo;gutted&rdquo; and &ldquo;heartless&rdquo; indicate to remove the middle
            letter or letters.
          </p>

          <Clue length="5" diagram="ARTICLE → THE + TRIMMED (T)RE(E) → RE = TH(RE)E">
            {(show) => (
              <>
                <Cha show={show}>Article</Cha>{" "}
                <Ind show={show}>about</Ind>{" "}
                <Ind show={show}>trimmed</Ind>{" "}
                <Fod show={show}>tree</Fod> has{" "}
                <Def show={show}>number of wise men</Def>
              </>
            )}
          </Clue>

          <Clue length="5" diagram="PIN(E) CUT SHORT → PIN + OVER TIME → O.T. = PINOT">
            {(show) => (
              <>
                <Fod show={show}>Pine</Fod>{" "}
                <Ind show={show}>cut short</Ind>{" "}
                <Cha show={show}>over time</Cha> makes{" "}
                <Def show={show}>wine</Def>
              </>
            )}
          </Clue>

          <p>
            Deletions can also be even more specific and call to remove specific letters from a
            word.
          </p>

          <Clue length="6" diagram="ELF NOEL (NO L) → EF + FIGGY NOG (NO G) → FIGY = EFFIGY">
            {(show) => (
              <>
                <Def show={show}>Model intended for destruction</Def> of{" "}
                <Fod show={show}>elf</Fod>{" "}
                <Ind show={show}>noel</Ind>,{" "}
                <Fod show={show}>figgy</Fod>{" "}
                <Ind show={show}>nog</Ind>
              </>
            )}
          </Clue>
        </section>

        {/* Selections */}
        <section id="selections" className="scroll-mt-4 space-y-[18px]">
          <h2 className="group mb-3.5 text-[28px] leading-tight font-semibold tracking-[-0.01em] sm:text-[32px]">Selections<AnchorLink id="selections" /></h2>
          <p>
            Selections are a natural complement to deletions. Deletions indicate to remove a
            word, while selections indicate to use a specific subset of a word for constructing
            the answer. Look for words like &ldquo;head&rdquo;, &ldquo;face&rdquo;, and
            &ldquo;top&rdquo; for the first letter, &ldquo;heart&rdquo; and &ldquo;center&rdquo;
            for the middle, and &ldquo;tail&rdquo; or &ldquo;end&rdquo; for the final letter.
            You also might see multiple letters selected, such as &ldquo;alternating&rdquo; and
            &ldquo;regular&rdquo; indicating to select every other letter and &ldquo;oddly&rdquo;
            or &ldquo;evenly&rdquo; indicating to take every odd or even letter.
          </p>

          <Clue length="4" diagram="(S)TAR TOPPER → S + TREE → ASH = SASH">
            {(show) => (
              <>
                <Def show={show}>Ribbon</Def>,{" "}
                <Fod show={show}>star</Fod>{" "}
                <Ind show={show}>topper</Ind>,{" "}
                <Cha show={show}>tree</Cha>
              </>
            )}
          </Clue>

          <Clue length="3" diagram="NEEDING NO INTRODUCTION (T)HE → HE + FINAL SNO(W) → W = HEW">
            {(show) => (
              <>
                <Ind show={show}>Needing no introduction</Ind>,{" "}
                <Fod show={show}>the</Fod>{" "}
                <Ind show={show}>final</Ind>{" "}
                <Fod show={show}>snow</Fod>{" "}
                <Def show={show}>fell</Def>
              </>
            )}
          </Clue>

          <Clue length="4" diagram="ODDLY (R)E(I)N(D)E(E)R → RIDE">
            {(show) => (
              <>
                <Ind show={show}>Oddly</Ind>,{" "}
                <Fod show={show}>reindeer</Fod> is{" "}
                <Def show={show}>theme park attraction</Def>
              </>
            )}
          </Clue>
        </section>

        {/* Homophones */}
        <section id="homophones" className="scroll-mt-4 space-y-[18px]">
          <h2 className="group mb-3.5 text-[28px] leading-tight font-semibold tracking-[-0.01em] sm:text-[32px]">Homophones<AnchorLink id="homophones" /></h2>
          <p>
            Homophones are a fairly rare type of indicator, and usually aren&rsquo;t too
            difficult to spot. They indicate to treat a word or phrase as spoken or heard.
            &ldquo;TEA&rdquo; might become &ldquo;T&rdquo;, &ldquo;WHERE&rdquo; might become
            &ldquo;WEAR&rdquo;, and so on. A homophone indicator will make some reference to
            sound, speaking, or listening. For example, &ldquo;spoken&rdquo;,
            &ldquo;aloud&rdquo;, &ldquo;on the radio&rdquo;, &ldquo;reportedly&rdquo;, and so on.
          </p>

          <Clue length="8" diagram="SOUNDS LIKE YOU'LL → YULE + SPOIL DIET → TIDE = YULETIDE">
            {(show) => (
              <>
                <Ind show={show}>Sounds like</Ind>{" "}
                <Fod show={show}>you&rsquo;ll</Fod>{" "}
                <Ind show={show}>spoil</Ind>{" "}
                <Fod show={show}>diet</Fod> for{" "}
                <Def show={show}>Christmas season</Def>
              </>
            )}
          </Clue>
        </section>

        {/* Hidden Words */}
        <section id="hidden-words" className="scroll-mt-4 space-y-[18px]">
          <h2 className="group mb-3.5 text-[28px] leading-tight font-semibold tracking-[-0.01em] sm:text-[32px]">Hidden Words<AnchorLink id="hidden-words" /></h2>
          <p>
            Hidden words can be some of the easiest wordplay devices to spot, but can be
            maddening if you miss them. A hidden words indicator tells you to look for a word or
            phrase hidden in plain sight, spanning across a phrase of fodder. The indicator will
            make a reference to hiding (&ldquo;conceals&rdquo;, &ldquo;screens&rdquo;,
            &ldquo;disguises&rdquo;), or a more general reference to containment
            (&ldquo;partly&rdquo;, &ldquo;involved in&rdquo;, &ldquo;piece of&rdquo;,
            &ldquo;held by&rdquo;).
          </p>

          <Clue length="3" diagram='CHRISTM(AS H)EARTH HOLDS → ASH'>
            {(show) => (
              <>
                <Fod show={show}>Christmas hearth</Fod>{" "}
                <Ind show={show}>holds</Ind>{" "}
                <Def show={show}>fire remnants</Def>
              </>
            )}
          </Clue>
        </section>

        {/* Positioners */}
        <section id="positioners" className="scroll-mt-4 space-y-[18px]">
          <h2 className="group mb-3.5 text-[28px] leading-tight font-semibold tracking-[-0.01em] sm:text-[32px]">Positioners<AnchorLink id="positioners" /></h2>
          <p>
            While almost never used alone, positioners are a powerful tool for constructors to
            improve the surface of their clues. The recipe of wordplay is always done in order,
            left to right. However, a positioner indicator can signal to rearrange the outcome of
            some wordplay, opening up new possible sentence structures and solutions. Positioners
            can be any word that implies sequence (&ldquo;first&rdquo;, &ldquo;then&rdquo;,
            &ldquo;at last&rdquo;, &ldquo;finally&rdquo;) or relative position
            (&ldquo;before&rdquo;, &ldquo;following&rdquo;, &ldquo;on top of&rdquo;,
            &ldquo;under&rdquo;).
          </p>

          <Clue length="6" diagram="DRINK → GIN + FESTIVE DRINK → NOG = NOGGIN">
            {(show) => (
              <>
                <Cha show={show}>Drink</Cha>{" "}
                <Ind show={show}>after</Ind>{" "}
                <Cha show={show}>festive drink</Cha>&mdash;
                <Def show={show}>my head!</Def>
              </>
            )}
          </Clue>
        </section>

        {/* Double Definition */}
        <section id="double-definition" className="scroll-mt-4 space-y-[18px]">
          <h2 className="group mb-3.5 text-[28px] leading-tight font-semibold tracking-[-0.01em] sm:text-[32px]">Double Definition<AnchorLink id="double-definition" /></h2>
          <p>
            Double definition clues break the mold by eschewing the standard framework of fodder
            and indicators for&mdash;you guessed it&mdash;two definitions!
          </p>

          <Clue length="4" diagram="EVERGREEN → PINE / ACHE → PINE">
            {(show) => (
              <>
                <Def show={show}>Evergreen</Def>{" "}
                <Def show={show}>ache</Def>
              </>
            )}
          </Clue>

          <Clue length="7" diagram="GIFT → PRESENT / PUT FORTH FOR CONSIDERATION → PRESENT">
            {(show) => (
              <>
                <Def show={show}>Gift</Def>{" "}
                <Def show={show}>put forth for consideration</Def>
              </>
            )}
          </Clue>
        </section>

        {/* Additional Notes */}
        <section id="notes" className="scroll-mt-4 space-y-[18px]">
          <h2 className="group mb-3.5 text-[28px] leading-tight font-semibold tracking-[-0.01em] sm:text-[32px]">Additional Notes<AnchorLink id="notes" /></h2>
          <p>
            You may have noticed the occasional word that wasn&rsquo;t highlighted and
            didn&rsquo;t seem to contribute to the solving recipe or the definition. These are
            known as <strong>connectors</strong> or <strong>link words</strong> and are added
            between the wordplay and the definition to improve the flow and appearance of the
            surface. Link words can&rsquo;t just be any old word, they must imply some sort of
            construction or equivalence:
          </p>
          <ul className="ml-8 list-disc space-y-0.5 !mt-3">
            <li>
              <strong>Equality:</strong> is, being, and, or, &rsquo;s (apostrophe s)
            </li>
            <li>
              <strong>Creation:</strong> for, from, of, by, with, makes, becomes, gets, to,
              into, leads to, gives
            </li>
            <li>
              <strong>Composition:</strong> has, in, with, where
            </li>
          </ul>
          <p>
            Just like connectors, punctuation within a clue is usually there to improve the
            surface and has no effect on the solve. Watch out for an intentionally deceptive
            surface that uses punctuation to make you pass over a potential solution!
          </p>
          <p>
            Sometimes, an indicator might operate on two different pieces of fodder. A connecting
            word like &ldquo;and&rdquo; can be added to make this more clear.
          </p>

          <Clue length="4" diagram="TRIMMING SP(RU)CE AND P(IN)E → RUIN">
            {(show) => (
              <>
                <Ind show={show}>Trimming</Ind>{" "}
                <Fod show={show}>spruce</Fod> and{" "}
                <Fod show={show}>pine</Fod> leads to{" "}
                <Def show={show}>disaster</Def>
              </>
            )}
          </Clue>
        </section>

        {/* Conclusion */}
        <section id="conclusion" className="scroll-mt-4 space-y-[18px]">
          <h2 className="mb-3.5 text-[28px] leading-tight font-semibold sm:text-[32px]">Conclusion</h2>
          <p>
            You should now be ready to start solving cryptic crosswords! I recommend trying{" "}
            <Link href="/crossword/beginner-cryptic">
              the beginner crossword on this site
            </Link>{" "}
            to help you get your feet wet. Once you solve that, check out
            other publications such as Minute Cryptic, the New Yorker, and the Guardian.
          </p>
        </section>

        {/* Credits */}
        <section id="credits" className="scroll-mt-4 border-t border-[var(--rule-soft)] pt-3">
          <h2 className="sc mb-2 text-[18px] font-bold">Credits</h2>
          <ul className="space-y-1 text-[16px] text-[var(--ink-soft)]">
            <li>
              Guide inspired by{" "}
              <a href="https://chesterley.github.io/howto.htm" target="_blank" rel="noopener noreferrer">
                Tony Chesterly
              </a>
            </li>
            <li>
              Colors inspired by{" "}
              <a href="https://www.minutecryptic.com/" target="_blank" rel="noopener noreferrer">
                Minute Cryptic
              </a>
            </li>
            <li>
              Other references:{" "}
              <a href="https://crypticcrosswordbook.com/" target="_blank" rel="noopener noreferrer">
                Cryptic Crossword Book
              </a>
              ,{" "}
              <a href="https://www.crosswordunclued.com/" target="_blank" rel="noopener noreferrer">
                Crossword Unclued
              </a>
            </li>
          </ul>
        </section>
        </div>

        <div className="mt-10 flex flex-col justify-between gap-2 border-t border-[var(--rule)] pt-3.5 text-[18px] sm:flex-row">
          <a href="#intro">Back to the top</a>
          <Link href="/crossword/beginner-cryptic">Try it: Beginner Cryptic</Link>
        </div>
      </article>
    </>
  );
}
