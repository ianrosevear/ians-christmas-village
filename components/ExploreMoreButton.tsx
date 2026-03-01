"use client";

export default function ExploreMoreButton() {
  const handleClick = () => {
    localStorage.setItem("windowOpen", "true");
    window.dispatchEvent(new Event("storage"));
  };

  return (
    <button
      onClick={handleClick}
      className="font-pixel pointer-events-auto px-6 py-3 rounded-full bg-[var(--color-gold)] text-[var(--color-dark)] font-semibold text-base shadow-lg hover:brightness-110 active:scale-95 transition-all duration-150"
    >
      Explore More →
    </button>
  );
}
