import type { Book, SummaryLength } from "./types";

export function slugify(s: string): string {
  return s
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}

export function makeBook(
  title: string,
  author: string,
  extra: Pick<Book, "year" | "cover"> = {},
): Book {
  const t = title.trim();
  const a = author.trim();
  return { id: slugify(`${t} ${a}`) || "book", title: t, author: a, ...extra };
}

export function summaryKey(book: Book, length: SummaryLength): string {
  return `${book.id}:${length}`;
}

export function bookHref(book: Book): string {
  const p = new URLSearchParams({ t: book.title, a: book.author });
  if (book.year) p.set("y", String(book.year));
  if (book.cover) p.set("c", book.cover);
  return `/book?${p.toString()}`;
}

export function bookFromParams(p: URLSearchParams): Book | null {
  const t = p.get("t")?.trim();
  if (!t) return null;
  const yearRaw = Number(p.get("y"));
  const cover = p.get("c") ?? undefined;
  return makeBook(t, p.get("a") ?? "", {
    year: Number.isInteger(yearRaw) && yearRaw > 0 ? yearRaw : undefined,
    // Only ever render covers from the catalog host.
    cover: cover && cover.startsWith("https://covers.openlibrary.org/") ? cover : undefined,
  });
}

export const WORDS_PER_MINUTE = 150;

export function minutesFor(text: string, rate = 1): number {
  const words = text.trim().split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / (WORDS_PER_MINUTE * rate)));
}
