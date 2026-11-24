"use client";

import Link from "next/link";
import { bookHref, minutesFor } from "@/lib/book";
import { libraryStore, progressStore, removeSummary } from "@/lib/store";
import { Cover } from "./Cover";
import { PauseIcon, PlayIcon } from "./Icons";
import { usePlayer } from "./PlayerProvider";
import { toChunks, parseBlocks } from "@/lib/speech";

export function LibraryView() {
  const library = libraryStore.use();
  const progress = progressStore.use();
  const player = usePlayer();

  if (library.length === 0) {
    return (
      <>
        <h1>Your library</h1>
        <p className="muted">
          Summaries you generate are saved here, on this device. <Link href="/">Find a book</Link>.
        </p>
      </>
    );
  }

  return (
    <>
      <h1>Your library</h1>
      <ul className="lib">
        {library.map((s) => {
          const total = toChunks(parseBlocks(s.text)).length;
          const pos = progress[s.key] ?? 0;
          const pct = total ? Math.round((pos / total) * 100) : 0;
          const loaded = player.track?.summary.key === s.key;
          const playing = loaded && player.status === "playing";
          return (
            <li key={s.key} className="lib-item">
              <Cover book={s.book} size="sm" />
              <div className="lib-info">
                <Link href={bookHref(s.book)}>
                  <strong>{s.book.title}</strong>
                </Link>
                <span className="muted">
                  {s.book.author} · {s.length} · {minutesFor(s.text)} min
                </span>
                {pct > 0 && (
                  <div className="bar" aria-label={`${pct}% listened`}>
                    <div style={{ width: `${pct}%` }} />
                  </div>
                )}
              </div>
              <button
                className="btn primary"
                onClick={() => player.listen(s)}
                disabled={!player.supported}
                aria-label={`${playing ? "Pause" : "Listen to"} ${s.book.title}`}
              >
                {playing ? <PauseIcon size={18} /> : <PlayIcon size={18} />}
              </button>
              <button className="btn ghost" onClick={() => removeSummary(s.key)} aria-label={`Remove ${s.book.title}`}>
                Remove
              </button>
            </li>
          );
        })}
      </ul>
    </>
  );
}
