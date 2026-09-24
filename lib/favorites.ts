export type Favorite = {
  category: string;
  name: string;
  url?: string;
  note?: string;
};

// Empty for now; the page and front-page column say "Coming soon." until something is added.
export const favorites: Favorite[] = [];
