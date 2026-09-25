"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { SitePrefsProvider, useSitePrefs } from "./SitePrefs";
import Snowflakes from "./Snowflakes";
import Footer from "./masthead/Footer";
import { AmbienceControls, AmbienceScene } from "./Ambience";
import { SoundsProvider, useSounds } from "./Sounds";

/** How long the paper takes to slide away or come back. Matches .paper-slide in paper.css. */
function slideMs() {
  return window.matchMedia("(max-width: 639px)").matches ? 560 : 420;
}

type Phase = "up" | "lowering" | "down" | "raising";

function prefersReducedMotion() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function Shell({ children }: { children: React.ReactNode }) {
  const { evening, snow, paperDown, setPaperDown } = useSitePrefs();
  const { keepPlaying, stopAll } = useSounds();
  const pathname = usePathname();
  const wide = pathname.startsWith("/crossword/");

  // The paper slides off the bottom of the screen, then is removed from the page;
  // picking it up puts it back off-screen and slides it in.
  const [phase, setPhase] = useState<Phase>("up");
  // The full-screen scene stays until the paper has finished sliding back up.
  const [fullScene, setFullScene] = useState(false);
  const phaseRef = useRef<Phase>("up");
  useEffect(() => {
    phaseRef.current = phase;
  }, [phase]);

  useEffect(() => {
    const reduced = prefersReducedMotion();
    let timer: ReturnType<typeof setTimeout> | undefined;
    let frame: number | undefined;
    if (paperDown) {
      setFullScene(true);
      if (reduced) setPhase("down");
      else {
        setPhase("lowering");
        timer = setTimeout(() => setPhase("down"), slideMs());
      }
    } else if (phaseRef.current !== "up") {
      window.scrollTo({ top: 0 });
      if (!keepPlaying) stopAll();
      if (reduced) {
        setPhase("up");
        setFullScene(false);
      } else {
        timer = setTimeout(() => setFullScene(false), slideMs() + 50);
        // Put it back on the page off-screen, then let it slide up on the next frames.
        setPhase("raising");
        frame = requestAnimationFrame(() => {
          frame = requestAnimationFrame(() => setPhase("up"));
        });
      }
    }
    return () => {
      if (timer) clearTimeout(timer);
      if (frame) cancelAnimationFrame(frame);
    };
    // Only reacting to the paper going up or down.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [paperDown]);

  const paperAway = phase !== "up";
  const ambienceShown = phase === "lowering" || phase === "down";

  return (
    <div className={`site ${evening ? "dark" : ""}`}>
      {fullScene ? <AmbienceScene /> : <div className="scene" aria-hidden="true" />}
      {snow && <Snowflakes />}

      {ambienceShown && <AmbienceControls onPickUp={() => setPaperDown(false)} />}

      <main
        hidden={phase === "down"}
        inert={paperAway}
        className={`paper-slide relative z-10 flex justify-center sm:px-6 sm:pt-[88px] sm:pb-16 ${wide ? "pt-[52px]" : "pt-[168px]"} ${
          paperAway ? "paper-slide--away" : ""
        }`}
      >
        <div className={`relative w-full ${wide ? "max-w-[1320px]" : "max-w-[1040px]"}`}>
          <button type="button" className="paper-tab sc" onClick={() => setPaperDown(true)}>
            Admire the scenery
          </button>
          <div
            className={`paper relative px-4 pt-2 pb-8 sm:min-h-0 sm:px-12 sm:pt-6 sm:pb-10 lg:px-14 ${
              wide ? "min-h-[calc(100dvh-52px)]" : "min-h-[calc(100dvh-168px)]"
            }`}
          >
            {children}
            <Footer />
          </div>
        </div>
      </main>
    </div>
  );
}

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  return (
    <SitePrefsProvider>
      <SoundsProvider>
        <Shell>{children}</Shell>
      </SoundsProvider>
    </SitePrefsProvider>
  );
}
