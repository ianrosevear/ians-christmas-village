export type Favorite = {
  category: string;
  name: string;
  url?: string;
  note?: string;
};

export const favorites: Favorite[] = [
  { category: "In Progress", name: "Coming soon" }
];