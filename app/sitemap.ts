import type { MetadataRoute } from "next";
import { getAllPuzzles } from "@/lib/crossword/puzzles";

const BASE_URL = "https://ianrosevear.com";

export default function sitemap(): MetadataRoute.Sitemap {
  const puzzleRoutes = getAllPuzzles().map((puzzle) => ({
    url: `${BASE_URL}/crossword/${puzzle.slug}`,
    lastModified: new Date(),
    changeFrequency: "yearly" as const,
    priority: 0.7,
  }));

  return [
    {
      url: BASE_URL,
      lastModified: new Date(),
      changeFrequency: "yearly",
      priority: 1,
    },
    {
      url: `${BASE_URL}/guide`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/crossword`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/favorites`,
      lastModified: new Date(),
      changeFrequency: "yearly",
      priority: 0.6,
    },
    ...puzzleRoutes,
  ];
}
