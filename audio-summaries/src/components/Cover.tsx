"use client";

import { useState } from "react";
import type { Book } from "@/lib/types";

function hue(s: string): number {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) % 360;
  return h;
}

/** Catalog cover when available; otherwise a typographic cover generated from the title. */
export function Cover({ book, size = "md" }: { book: Book; size?: "sm" | "md" | "lg" }) {
  const [failed, setFailed] = useState(false);
  const h = hue(book.title + book.author);

  if (book.cover && !failed) {
    return (
      // eslint-disable-next-line @next/next/no-img-element -- remote catalog art, no optimisation needed
      <img
        className={`cover cover-${size}`}
        src={book.cover}
        alt={`Cover of ${book.title}`}
        loading="lazy"
        onError={() => setFailed(true)}
      />
    );
  }
  return (
    <div
      className={`cover cover-${size} cover-gen`}
      style={{ background: `linear-gradient(145deg, hsl(${h} 45% 28%), hsl(${(h + 40) % 360} 50% 14%))` }}
      role="img"
      aria-label={`Cover of ${book.title}`}
    >
      <span className="cover-title">{book.title.split(/[:(]/)[0]}</span>
      {book.author && <span className="cover-author">{book.author}</span>}
    </div>
  );
}
