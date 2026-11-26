import { makeBook } from "./book";
import type { Book } from "./types";

type OpenLibraryDoc = {
  title?: string;
  author_name?: string[];
  first_publish_year?: number;
  cover_i?: number;
};

/** Maps Open Library search results to Books, dropping unusable rows and duplicates. */
export function mapOpenLibrary(docs: OpenLibraryDoc[]): Book[] {
  const seen = new Set<string>();
  const books: Book[] = [];
  for (const d of docs) {
    if (!d.title) continue;
    const book = makeBook(d.title, d.author_name?.[0] ?? "", {
      year: d.first_publish_year,
      cover: d.cover_i ? `https://covers.openlibrary.org/b/id/${d.cover_i}-M.jpg` : undefined,
    });
    if (seen.has(book.id)) continue;
    seen.add(book.id);
    books.push(book);
  }
  return books;
}
