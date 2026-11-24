export type Book = {
  /** Stable slug derived from title + author. */
  id: string;
  title: string;
  author: string;
  year?: number;
  /** Remote cover URL (Open Library). Optional; a generated cover is used otherwise. */
  cover?: string;
};

export type SummaryLength = "brief" | "standard" | "deep";

export const LENGTHS: Record<
  SummaryLength,
  { label: string; words: number; blurb: string }
> = {
  brief: { label: "Brief", words: 300, blurb: "The core idea" },
  standard: { label: "Standard", words: 900, blurb: "Main arguments & structure" },
  deep: { label: "Deep dive", words: 2000, blurb: "Chapter-level detail" },
};

export type SavedSummary = {
  key: string;
  book: Book;
  length: SummaryLength;
  text: string;
  createdAt: number;
};
