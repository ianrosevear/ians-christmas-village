"use client";

import { useState } from "react";
import Link from "next/link";
import { Def, Ind, Fod, Cha, SmallToggle } from "@/lib/crossword/annotations";

function Clue({
  children,
  length,
  diagram,
}: {
  children: (show: boolean) => React.ReactNode;
  length: string;
  diagram: string;
}) {
  const [showColors, setShowColors] = useState(false);
  const [showDiagram, setShowDiagram] = useState(false);

  return (
    <div className="my-4 ml-6">
      <div className="flex items-baseline gap-3">
        <p className="font-bold">{children(showColors)} ({length})</p>
        <div className="flex gap-1.5 shrink-0">
          <SmallToggle label="colors" active={showColors} onClick={() => setShowColors(!showColors)} />
          <SmallToggle label="diagram" active={showDiagram} onClick={() => setShowDiagram(!showDiagram)} />
        </div>
      </div>
      {showDiagram && (
        <p className="text-sm text-[var(--color-dark)]/60 dark:text-[var(--color-snow)]/50 mt-0.5">
          {diagram}
        </p>
      )}
    </div>
  );
}

export default function GuidePage() {
  return (
    <div className="font-raleway">
      <h2 className="text-3xl italic text-[var(--color-dark)] dark:text-[var(--color-snow)] mb-1">
        How to Solve Cryptic Crosswords
      </h2>

      <hr className="border-[var(--color-dark)]/15 dark:border-[var(--color-snow)]/15 mb-6" />

      <div className="space-y-6 text-[var(--color-dark)] dark:text-[var(--color-snow)] leading-relaxed">
        {/* Intro */}
        <section className="space-y-3">
          <h3 className="text-xl font-bold">What is a cryptic crossword?</h3>
          <p>
            A cryptic crossword is a special type of crossword in which each clue is itself a
            little wordplay puzzle. Most cryptic crossword clues are composed of two parts: a
            definition&mdash;basically a regular crossword clue&mdash;joined with tricky word
            play. Both parts will independently resolve to the same thing: the answer that goes
            in the grid. An additional wrinkle is that it will often not be clear where the
            definition ends and the wordplay begins.
          </p>
          <p>Let&rsquo;s look at an example. Don't worry, I&rsquo;ll explain everything soon!</p>

          <div className="my-4 ml-6">
            <p className="font-bold">
              <Def show>Christmas carol</Def>{" "}
              <Ind show>uniquely</Ind>{" "}
              <Fod show>lent insight</Fod>{" "}
              (6,5)
            </p>
            <p className="text-sm text-[var(--color-dark)]/60 dark:text-[var(--color-snow)]/50 mt-0.5">
              LENT INSIGHT (anagram) → SILENT NIGHT
            </p>
          </div>

          <p>
            The &ldquo;surface&rdquo; of the clue is the straightforward reading of the phrase.
            This surface gives us an impression of a Christmas carol uncannily offering pearls 
            of wisdom. But to solve a cryptic crossword, we have to look below the surface.
          </p>
          <p>
            In this example, we are looking for a phrase made of a six and five letter word which
            can have the definition &ldquo;Christmas carol&rdquo; (the number at the end of the
            clue tells us the length of the answer).
          </p>

          <div className="ml-6 space-y-2 text-sm">
            <p className="font-bold text-base mb-1">The four components of cryptic wordplay</p>
            <p>
              <span className="rounded px-1 bg-blue-200/60 dark:bg-blue-500/30 font-semibold">
                Definition
              </span>{" "}
              &mdash; the straightforward definition of the answer. Almost always at the front
              or end of the clue.
            </p>
            <p>
              <span className="rounded px-1 bg-pink-200/70 dark:bg-pink-400/30 font-semibold">
                Indicator
              </span>{" "}
              &mdash; a word or phrase that directs you to modify adjacent fodder in some way.
              We'll cover several types of indicator later in the guide.
            </p>
            <p>
              <span className="rounded px-1 bg-amber-200/70 dark:bg-amber-400/30 font-semibold">
                Fodder
              </span>{" "}
              &mdash; words that are modified by indicators. If the clue is a recipe, fodder
              are ingredients.
            </p>
            <p>
              <span className="rounded px-1 bg-orange-200/70 dark:bg-orange-400/30 font-semibold">
                Charade
              </span>{" "}
              &mdash; words substituted with a synonym or abbreviation to build the answer. 
              More on charades later.
            </p>
          </div>

          <p>
            There are several classes of indicator that tell you to perform different
            modifications to fodder. In this case &ldquo;uniquely&rdquo; is an anagram indicator.
            We can anagram the adjacent fodder &ldquo;lent insight&rdquo; to get &ldquo;Silent
            Night&rdquo;. Silent Night could have the definition &ldquo;Christmas Carol&rdquo;,
            so we can confirm that&rsquo;s our answer!
          </p>
          <p>
            If that seems tricky to you, that&rsquo;s okay. It&rsquo;s a totally new way of
            looking at crosswords where the words don&rsquo;t mean what they usually mean. One
            important thing to keep in mind though is that none of the wordplay required is
            arbitrary. Every step you have to take is spelled out for you and justified by the
            conventions and rules of cryptic crossword solving.
          </p>
          <p>There are 10 important clue types to be aware of:</p>
          <ol className="list-decimal ml-8 space-y-0.5">
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
        <section className="space-y-3">
          <h3 className="text-xl font-bold">Anagrams</h3>
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
        <section className="space-y-3">
          <h3 className="text-xl font-bold">Charades</h3>
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
        <section className="space-y-3">
          <h3 className="text-xl font-bold">Containers</h3>
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
        <section className="space-y-3">
          <h3 className="text-xl font-bold">Reversals</h3>
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
        <section className="space-y-3">
          <h3 className="text-xl font-bold">Deletions</h3>
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
        <section className="space-y-3">
          <h3 className="text-xl font-bold">Selections</h3>
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

          <Clue length="4" diagram="STAR (T)OPPER → T + TREE → ASH = SASH">
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
        <section className="space-y-3">
          <h3 className="text-xl font-bold">Homophones</h3>
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
        <section className="space-y-3">
          <h3 className="text-xl font-bold">Hidden Words</h3>
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
        <section className="space-y-3">
          <h3 className="text-xl font-bold">Positioners</h3>
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
        <section className="space-y-3">
          <h3 className="text-xl font-bold">Double Definition</h3>
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
        <section className="space-y-3">
          <h3 className="text-xl font-bold">Additional Notes</h3>
          <p>
            You may have noticed the occasional word that wasn&rsquo;t highlighted and
            didn&rsquo;t seem to contribute to the solving recipe or the definition. These are
            known as <strong>connectors</strong> or <strong>link words</strong> and are added
            between the wordplay and the definition to improve the flow and appearance of the
            surface. Link words can&rsquo;t just be any old word, they must imply some sort of
            construction or equivalence:
          </p>
          <ul className="list-disc ml-8 space-y-0.5">
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
        <section className="space-y-3">
          <h3 className="text-xl font-bold">Conclusion</h3>
          <p>
            You should now be ready to start solving cryptic crosswords! I recommend trying{" "}
            <Link
              href="/crossword/beginner-cryptic"
              className="text-[var(--color-cranberry)] dark:text-[var(--color-gold)] underline"
            >
              the beginner crossword on this site
            </Link>{" "}
            to help you get your feet wet. Once you solve that, check out
            other publications such as Minute Cryptic, the New Yorker, and the Guardian.
          </p>
        </section>

        {/* Credits */}
        <section className="pt-2 border-t border-[var(--color-dark)]/10 dark:border-[var(--color-snow)]/10">
          <h3 className="text-xl font-bold mb-2">Credits</h3>
          <ul className="space-y-1 text-sm text-[var(--color-dark)]/60 dark:text-[var(--color-snow)]/50">
            <li>
              Guide inspired by{" "}
              <a href="https://chesterley.github.io/howto.htm" target="_blank" rel="noopener noreferrer" className="underline hover:text-[var(--color-dark)] dark:hover:text-[var(--color-snow)]">
                Tony Chesterly
              </a>
            </li>
            <li>
              Colors inspired by{" "}
              <a href="https://www.minutecryptic.com/" target="_blank" rel="noopener noreferrer" className="underline hover:text-[var(--color-dark)] dark:hover:text-[var(--color-snow)]">
                Minute Cryptic
              </a>
            </li>
            <li>
              Other references:{" "}
              <a href="https://crypticcrosswordbook.com/" target="_blank" rel="noopener noreferrer" className="underline hover:text-[var(--color-dark)] dark:hover:text-[var(--color-snow)]">
                Cryptic Crossword Book
              </a>
              ,{" "}
              <a href="https://www.crosswordunclued.com/" target="_blank" rel="noopener noreferrer" className="underline hover:text-[var(--color-dark)] dark:hover:text-[var(--color-snow)]">
                Crossword Unclued
              </a>
            </li>
          </ul>
        </section>
      </div>
    </div>
  );
}
