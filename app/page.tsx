import ChristmasCountdown from "@/components/ChristmasCountdown";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] gap-8 px-4">
      <h1 className="text-5xl text-[var(--color-snow)] text-center" style={{ fontFamily: "var(--font-playfair-display)" }}>
        Welcome to Ian&apos;s Christmas Village
      </h1>
      {/* <p className="text-lg text-[var(--color-snow)]/60 text-center max-w-md">
        A collection of gifts from me to you.
      </p> */}
      <ChristmasCountdown />
    </div>
  );
}