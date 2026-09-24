"use client";

import { usePathname } from "next/navigation";
import { SitePrefsProvider, useSitePrefs } from "./SitePrefs";
import Snowflakes from "./Snowflakes";
import Footer from "./masthead/Footer";

function Shell({ children }: { children: React.ReactNode }) {
  const { evening, snow, paperDown, setPaperDown } = useSitePrefs();
  const pathname = usePathname();
  const wide = pathname.startsWith("/crossword/");

  return (
    <div className={`site ${evening ? "dark" : ""}`}>
      <div className="scene" aria-hidden="true" />
      {snow && <Snowflakes />}

      {paperDown ? (
        <div className="fixed inset-x-0 bottom-0 z-10 flex justify-center">
          <button type="button" className="paper sc min-h-12 px-6 text-[18px]" onClick={() => setPaperDown(false)}>
            Pick the paper up
          </button>
        </div>
      ) : (
        <main className={`relative z-10 flex justify-center sm:px-6 sm:pt-[88px] sm:pb-16 ${wide ? "pt-[52px]" : "pt-[168px]"}`}>
          <div className={`relative w-full ${wide ? "max-w-[1160px]" : "max-w-[1040px]"}`}>
            <button type="button" className="paper-tab sc" onClick={() => setPaperDown(true)}>
              Put the paper down
            </button>
            <div className={`paper relative px-4 pt-2 pb-8 sm:min-h-0 sm:px-12 sm:pt-6 sm:pb-10 lg:px-14 ${wide ? "min-h-[calc(100dvh-52px)]" : "min-h-[calc(100dvh-168px)]"}`}>
              {children}
              <Footer />
            </div>
          </div>
        </main>
      )}
    </div>
  );
}

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  return (
    <SitePrefsProvider>
      <Shell>{children}</Shell>
    </SitePrefsProvider>
  );
}
