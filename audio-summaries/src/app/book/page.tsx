import type { Metadata } from "next";
import { Suspense } from "react";
import { BookView } from "@/components/BookView";

export const metadata: Metadata = { title: "Book" };

export default function BookPage() {
  return (
    <Suspense fallback={<p className="muted">Loading…</p>}>
      <BookView />
    </Suspense>
  );
}
