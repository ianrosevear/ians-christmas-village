"use client";

import { useState, useRef } from "react";

export default function WhereDidIParkPage() {
  const [digits, setDigits] = useState<string[]>(Array(6).fill(""));
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState(false);
  const [checking, setChecking] = useState(false);
  const [clueUrl, setClueUrl] = useState<string | null>(null);
  const inputRefs = useRef<Array<HTMLInputElement | null>>([]);

  const answer = digits.join("");

  const setDigit = (index: number, value: string) => {
    const next = [...digits];
    next[index] = value;
    setDigits(next);
  };

  const handleChange = (index: number, rawValue: string) => {
    const value = rawValue.replace(/[^0-9]/g, "");

    if (value.length <= 1) {
      setDigit(index, value);
      if (value && index < digits.length - 1) {
        inputRefs.current[index + 1]?.focus();
      }
      return;
    }

    // Handle multi-character input (e.g. fast typing or IME quirks)
    const chars = value.split("");
    const next = [...digits];
    let i = index;
    for (const ch of chars) {
      if (i >= next.length) break;
      next[i] = ch;
      i++;
    }
    setDigits(next);
    inputRefs.current[Math.min(i, digits.length - 1)]?.focus();
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !digits[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    } else if (e.key === "ArrowLeft" && index > 0) {
      inputRefs.current[index - 1]?.focus();
    } else if (e.key === "ArrowRight" && index < digits.length - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text").replace(/[^0-9]/g, "").slice(0, 6);
    if (!pasted) return;
    const next = Array(6).fill("");
    for (let i = 0; i < pasted.length; i++) next[i] = pasted[i];
    setDigits(next);
    const focusIndex = Math.min(pasted.length, 5);
    inputRefs.current[focusIndex]?.focus();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setChecking(true);
    try {
      const res = await fetch("/api/where-did-i-park", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ answer }),
      });
      const { correct, clueUrl } = await res.json();
      if (correct) {
        setError(false);
        setClueUrl(clueUrl);
        setSubmitted(true);
      } else {
        setError(true);
      }
    } finally {
      setChecking(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-12">
      <h1 className="text-4xl text-[var(--color-gold)] mb-8">
        Where Did I Park?
      </h1>

      {submitted ? (
        <div className="text-[var(--color-dark)] dark:text-[var(--color-snow)]/80 space-y-4">
          <p>
            Well done! Thanks for saving the day!
          </p>
          <p>
            I gave the final clue to the owner of this YouTube channel. It contains an extremely important message, so hopefully they haven&apos;t misplaced it!
          </p>
          {clueUrl && (
            <a
              href={clueUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[var(--color-gold)] hover:underline"
            >
              {clueUrl}
            </a>
          )}
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <label className="block text-[var(--color-dark)] dark:text-[var(--color-snow)]/80">
            <div className="flex items-center gap-2">
              <span className="text-xl text-[var(--color-gold)]">#</span>
              {digits.map((digit, index) => (
                <input
                  key={index}
                  ref={(el) => {
                    inputRefs.current[index] = el;
                  }}
                  type="text"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleChange(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  onPaste={handlePaste}
                  className="w-12 h-14 text-center text-xl rounded border-2 border-[var(--color-gold)]/40 bg-transparent text-[var(--color-dark)] dark:text-[var(--color-snow)] caret-transparent focus:outline-none focus:border-[var(--color-gold)]"
                  autoFocus={index === 0}
                />
              ))}
            </div>
          </label>
          <button
            type="submit"
            disabled={checking || answer.length !== 6}
            className="px-4 py-2 rounded bg-[var(--color-cranberry)] text-white hover:opacity-90 disabled:opacity-50"
          >
            {checking ? "Checking..." : "Submit"}
          </button>
          {error && (
            <p className="text-[var(--color-cranberry)]">
              Not quite!
            </p>
          )}
        </form>
      )}
    </div>
  );
}