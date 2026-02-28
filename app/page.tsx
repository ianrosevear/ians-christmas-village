import ChristmasCountdown from "@/components/ChristmasCountdown";

export default function Home() {
  return (
    <div className="flex flex-col items-center gap-8 py-12">
      <h1
        className="text-5xl text-[var(--color-dark)] dark:text-[var(--color-snow)] text-center"
        style={{ fontFamily: "var(--font-pixelify-sans)" }}
      >
        Welcome to Ian&apos;s Christmas Village
      </h1>
      {/* <p className="text-lg text-[var(--color-dark)]/60 dark:text-[var(--color-snow)]/60 text-center max-w-md">
        A collection of gifts from me to you.
      </p> */}
      <ChristmasCountdown />
    </div>
  );
}
