"use client";

export default function ExploreMoreButton() {
  const handleClick = () => {
    localStorage.setItem("windowOpen", "true");
    window.dispatchEvent(new Event("storage"));
  };

  return (
    <button
      onClick={handleClick}
      className="font-pixel text-xl px-6 py-3 bg-[var(--color-gold)] text-[var(--color-dark)] border-2 border-[var(--color-dark)] shadow-[4px_4px_0px_0px_var(--color-dark)] hover:shadow-[2px_2px_0px_0px_var(--color-dark)] hover:translate-x-[2px] hover:translate-y-[2px] active:shadow-none active:translate-x-[4px] active:translate-y-[4px] cursor-pointer pointer-events-auto"
    >
      Explore More →
    </button>
  );
}
