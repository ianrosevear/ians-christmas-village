import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "How to Solve Cryptic Crosswords",
  description: "A beginner's guide to solving cryptic crosswords, with colour-coded wordplay.",
  openGraph: {
    title: "How to Solve Cryptic Crosswords",
    description: "A beginner's guide to solving cryptic crosswords, with colour-coded wordplay.",
  },
};

export default function GuideLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
