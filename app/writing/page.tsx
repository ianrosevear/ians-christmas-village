import type { Metadata } from "next";
import Link from "next/link";
import Folio from "@/components/masthead/Folio";
import { posts } from "@/lib/writing";
import { formatPublished } from "@/lib/crossword/puzzles";

export const metadata: Metadata = {
  title: "Writing",
  description: "Writing by Ian Rosevear.",
};

export default function WritingIndex() {
  return (
    <>
      <Folio current="writing" />
      <h1 className="mt-8 mb-5 text-[44px] leading-none font-semibold tracking-[-0.015em] sm:text-[64px]">Writing</h1>
      <ul className="border-t-[3px] border-[var(--rule)]">
        {posts.map((post) => (
          <li key={post.href} className="border-b border-[var(--rule-soft)] py-5 sm:py-6">
            <Link href={post.href} className="plain block text-[26px] leading-tight font-semibold sm:text-[32px]">
              {post.title}
            </Link>
            <p className="mt-1.5 text-[15px] text-[var(--ink-soft)] italic sm:text-[17px]">{formatPublished(post.published)}</p>
            <p className="mt-2 max-w-[680px] text-[18px] leading-normal text-[var(--ink-body)]">{post.dek}</p>
          </li>
        ))}
      </ul>
    </>
  );
}
