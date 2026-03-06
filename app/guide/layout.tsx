import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "How to Solve Cryptic Crosswords",
  description: "A beginner's guide to solving cryptic crosswords.",
  openGraph: {
    title: "How to Solve Cryptic Crosswords",
    description: "A beginner's guide to solving cryptic crosswords.",
  },
};

export default function GuideLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
