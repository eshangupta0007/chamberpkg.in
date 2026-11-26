import Link from "next/link";
import { bookHref } from "@/lib/book";
import type { Book } from "@/lib/types";
import { Cover } from "./Cover";

export function BookCard({ book }: { book: Book }) {
  return (
    <Link href={bookHref(book)} className="card">
      <Cover book={book} />
      <span className="card-title">{book.title}</span>
      <span className="card-sub">
        {book.author}
        {book.year ? ` · ${book.year}` : ""}
      </span>
    </Link>
  );
}
