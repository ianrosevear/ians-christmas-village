export type Favorite = {
  category: string;
  name: string;
  url?: string;
  note?: string;
};

export const favorites: Favorite[] = [
  { category: "Music", name: "A Home for Roaches - Quip Trade", url: "https://open.spotify.com/track/5nkEIoNyAwfxRW9Nc3jX66" }
];