"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useState } from "react";
import { bookFromParams, minutesFor, summaryKey } from "@/lib/book";
import { UNFAMILIAR_MARKER } from "@/lib/prompts";
import { libraryStore, removeSummary, saveSummary } from "@/lib/store";
import { LENGTHS, type Book, type SummaryLength } from "@/lib/types";
import { useGenerate } from "@/lib/useGenerate";
import { Cover } from "./Cover";
import { PauseIcon, PlayIcon } from "./Icons";
import { usePlayer } from "./PlayerProvider";
import { SummaryReader } from "./SummaryReader";

export function BookView() {
  const params = useSearchParams();
  const book = bookFromParams(new URLSearchParams(params.toString()));
  if (!book) {
    return (
      <p className="muted">
        No book selected. <Link href="/">Search for one</Link>.
      </p>
    );
  }
  // Re-mount per book so generation state never leaks between titles.
  return <BookDetail key={book.id} book={book} />;
}

function BookDetail({ book }: { book: Book }) {
  const [length, setLength] = useState<SummaryLength>("standard");
  const library = libraryStore.use();
  const player = usePlayer();
  const key = summaryKey(book, length);
  const saved = library.find((s) => s.key === key);

  const gen = useGenerate((text) => {
    if (text.trimStart().startsWith(UNFAMILIAR_MARKER)) return; // never save a non-summary
    saveSummary({ key, book, length, text: text.trim(), createdAt: Date.now() });
  });

  const busy = gen.state.status === "loading" || gen.state.status === "streaming";
  const text = busy || gen.state.status === "error" ? gen.state.text : (saved?.text ?? gen.state.text);
  const unfamiliar = text.trimStart().startsWith(UNFAMILIAR_MARKER);
  const isLoadedTrack = player.track?.summary.key === key;
  const playingThis = isLoadedTrack && player.status === "playing";

  const pick = (l: SummaryLength) => {
    gen.cancel();
    setLength(l);
  };

  return (
    <article className="book">
      <div className="book-head">
        <Cover book={book} size="lg" />
        <div className="book-info">
          <h1>{book.title}</h1>
          <p className="muted">
            {book.author || "Author unknown"}
            {book.year ? ` · ${book.year}` : ""}
          </p>

          <fieldset className="lengths" disabled={busy}>
            <legend className="sr-only">Summary length</legend>
            {(Object.keys(LENGTHS) as SummaryLength[]).map((l) => (
              <label key={l} className={l === length ? "length is-on" : "length"}>
                <input type="radio" name="length" checked={l === length} onChange={() => pick(l)} />
                <strong>{LENGTHS[l].label}</strong>
                <span>≈ {Math.round(LENGTHS[l].words / 150)} min</span>
                <small>{LENGTHS[l].blurb}</small>
              </label>
            ))}
          </fieldset>

          <div className="actions">
            {saved ? (
              <>
                <button className="btn primary" onClick={() => player.listen(saved)} disabled={!player.supported}>
                  {playingThis ? <PauseIcon size={18} /> : <PlayIcon size={18} />}
                  {playingThis ? "Pause" : isLoadedTrack ? "Resume" : "Listen"} · {minutesFor(saved.text)} min
                </button>
                <button className="btn" onClick={() => gen.start(book, length)}>
                  Regenerate
                </button>
                <button className="btn ghost" onClick={() => removeSummary(key)}>
                  Remove from library
                </button>
              </>
            ) : busy ? (
              <button className="btn" onClick={gen.cancel}>
                Stop
              </button>
            ) : (
              <button className="btn primary" onClick={() => gen.start(book, length)}>
                Generate {LENGTHS[length].label.toLowerCase()} summary
              </button>
            )}
          </div>
          {!player.supported && (
            <p className="muted">This browser has no speech synthesis, so audio is unavailable. You can still read.</p>
          )}
        </div>
      </div>

      {gen.state.status === "loading" && <p className="muted" role="status">Claude is thinking…</p>}
      {gen.state.status === "error" && (
        <p className="error" role="alert">
          {gen.state.error}{" "}
          <button className="link-btn" onClick={() => gen.start(book, length)}>
            Try again
          </button>
        </p>
      )}

      {unfamiliar ? (
        <p className="notice">{text.replace(UNFAMILIAR_MARKER, "").trim()}</p>
      ) : (
        text && (
          <>
            <SummaryReader text={text} summaryKey={saved?.key} />
            <p className="disclaimer">
              Written by Claude from its general knowledge of the book, not from the book&apos;s text. It
              can be incomplete or wrong, especially for lesser-known titles. Check anything important
              against the book itself.
            </p>
          </>
        )
      )}
    </article>
  );
}
