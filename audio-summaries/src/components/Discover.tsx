"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { bookHref, makeBook } from "@/lib/book";
import { FEATURED } from "@/lib/featured";
import { libraryStore, progressStore } from "@/lib/store";
import type { Book } from "@/lib/types";
import { BookCard } from "./BookCard";
import { Cover } from "./Cover";
import { SearchIcon } from "./Icons";
import { usePlayer } from "./PlayerProvider";

type Result = { q: string; books: Book[]; error?: string };

/** "Title by Author" -> book from what was typed, for titles the catalog doesn't have. */
function bookFromTyped(q: string): Book {
  const i = q.toLowerCase().lastIndexOf(" by ");
  return i > 0 ? makeBook(q.slice(0, i), q.slice(i + 4)) : makeBook(q, "");
}

export function Discover() {
  const [query, setQuery] = useState("");
  const [debounced, setDebounced] = useState("");
  const [result, setResult] = useState<Result | null>(null);
  const library = libraryStore.use();
  const progress = progressStore.use();
  const player = usePlayer();

  useEffect(() => {
    const id = setTimeout(() => setDebounced(query.trim()), 350);
    return () => clearTimeout(id);
  }, [query]);

  useEffect(() => {
    if (debounced.length < 2) return;
    const ac = new AbortController();
    fetch(`/api/search?q=${encodeURIComponent(debounced)}`, { signal: ac.signal })
      .then((r) => r.json())
      .then((d: { books?: Book[]; error?: string }) =>
        setResult({ q: debounced, books: d.books ?? [], error: d.error }),
      )
      .catch((e) => {
        if (!ac.signal.aborted) setResult({ q: debounced, books: [], error: String(e) });
      });
    return () => ac.abort();
  }, [debounced]);

  const searching = debounced.length >= 2;
  const loading = searching && result?.q !== debounced;
  const shown = searching && result?.q === debounced ? result : null;
  const typed = query.trim().length >= 2 ? bookFromTyped(query.trim()) : null;

  const inProgress = library.filter((s) => (progress[s.key] ?? 0) > 0).slice(0, 6);

  return (
    <>
      <section className="hero">
        <h1>Any book, in minutes.</h1>
        <p>Search a title, read the summary Claude writes, or press play and listen.</p>
        <div className="search">
          <SearchIcon />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search a book, or type “Title by Author”"
            aria-label="Search books"
            autoComplete="off"
          />
        </div>
      </section>

      {searching ? (
        <section>
          <h2>Results</h2>
          {typed && (
            <Link href={bookHref(typed)} className="typed-row">
              Summarise “{typed.title}”{typed.author ? ` by ${typed.author}` : ""} as typed →
            </Link>
          )}
          {loading && <p className="muted">Searching…</p>}
          {shown?.error && <p className="muted">{shown.error} You can still summarise what you typed above.</p>}
          {shown && !shown.error && shown.books.length === 0 && (
            <p className="muted">No catalog matches. You can still summarise what you typed above.</p>
          )}
          {shown && shown.books.length > 0 && (
            <div className="grid">
              {shown.books.map((b) => (
                <BookCard key={b.id} book={b} />
              ))}
            </div>
          )}
        </section>
      ) : (
        <>
          {inProgress.length > 0 && (
            <section>
              <h2>Continue listening</h2>
              <div className="continue">
                {inProgress.map((s) => (
                  <button key={s.key} className="continue-item" onClick={() => player.listen(s)}>
                    <Cover book={s.book} size="sm" />
                    <span>
                      <strong>{s.book.title}</strong>
                      <small>{s.length}</small>
                    </span>
                  </button>
                ))}
              </div>
            </section>
          )}
          <section>
            <h2>Popular picks</h2>
            <div className="grid">
              {FEATURED.map((b) => (
                <BookCard key={b.id} book={b} />
              ))}
            </div>
          </section>
        </>
      )}
    </>
  );
}
