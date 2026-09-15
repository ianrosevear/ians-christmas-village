"use client";

import { useState } from "react";

export default function WhereDidIParkPage() {
  const [answer, setAnswer] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState(false);
  const [checking, setChecking] = useState(false);
  const [clueUrl, setClueUrl] = useState<string | null>(null);

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
            ANSWER:
            <input
              type="text"
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              className="mt-2 w-full px-3 py-2 rounded border border-[var(--color-gold)]/40 bg-transparent text-[var(--color-dark)] dark:text-[var(--color-snow)] focus:outline-none focus:border-[var(--color-gold)]"
              autoFocus
            />
          </label>
          <button
            type="submit"
            disabled={checking}
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
