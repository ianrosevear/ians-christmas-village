/** A tool for crossword constructors, listed on the Santa's Workshop page. */
export type Tool = {
  note: string;
  url: string;
  /** Link text; defaults to the site's domain. */
  label?: string;
};

export type ToolGroup = {
  heading: string;
  tools: Tool[];
};

export const workshop: ToolGroup[] = [
  {
    heading: "Basics",
    tools: [
      { 
        note: "Hands down the best construction software out there. Others exist but this is all you need. I wouldn't recommend using a browser-based tool.", 
        url: "https://ingrid.cx/",
        label: "Ingrid"
      },
      {
        note: "Search through grid shapes that have already been published. You can put in a couple of theme answers and see shapes that will work with them.",
        url: "https://ugleh.com/gridsearch/",
        label: "Ugleh Gridsearch",
      },
      {
        note: "Look for clue ideas, or check whether anyone has ever used your terrible fill before (ignore the warning).",
        url: "https://crosswordtracker.com/",
        label: "Crossword Tracker",
      },
      { 
        note: "Upload a puzzle for easy sharing.", 
        url: "https://crosshare.org/upload", 
        label: "Crosshare" 
      },
      { 
        note: "Alternative uploading site.", 
        url: "https://squares.io/", 
        label: "Squares"
      },
    ],
  },
  {
    heading: "Themes & Clue Writing",
    tools: [
      { 
        note: "Word finder and reverse dictionary.", 
        url: "https://www.onelook.com/", 
        label: "OneLook"
      },
      { 
        note: "Pattern and anagram search.", 
        url: "https://www.quinapalus.com/cgi-bin/qat", 
        label: "Qat" 
      },
      {
        note: "A fun list I use occasionally.",
        url: "https://rickiheicklen.com/unparalleled-misalignments.html",
        label: "Unparalleled Misalignments",
      },
    ],
  },
  {
    heading: "Cryptic Specifics",
    tools: [
      { 
        note: "A guide to solving cryptic crosswords. It includes some more types of obscure clues than the guide on this site.", 
        url: "https://chesterley.github.io/howto.htm", 
        label: "Chesterley's Cryptic Crosswords" 
      },
      { 
        note: "A dictionary of cryptic crossword terms.", 
        url: "https://www.crosswordunclued.com/2008/09/dictionary.html", 
        label: "Crossword Unclued" 
      },
      { 
        note: "Crossword abbreviations. Useful for both solving and constructing!", 
        url: "https://en.wikipedia.org/wiki/Crossword_abbreviations", 
        label: "Wikipedia" 
      },
      { 
        note: "Alternative list of abbreviations.", 
        url: "https://cryptics.fandom.com/wiki/List_of_abbreviations", 
        label: "Cryptics Wiki" 
      },
      { 
        note: "My favorite anagram solver, useful for both solving and constructing!", 
        url: "https://www.ssynth.co.uk/~gay/anagram.html", 
        label: "Andy's Anagram Solver" 
      },
    ],
  },
];

export function toolLabel(tool: Tool): string {
  return tool.label ?? new URL(tool.url).hostname.replace(/^www\./, "");
}
