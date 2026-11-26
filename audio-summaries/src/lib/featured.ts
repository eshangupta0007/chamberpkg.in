import { makeBook } from "./book";

// Titles and authors only: no covers, no ISBNs, nothing that could be wrong.
export const FEATURED = [
  makeBook("Atomic Habits", "James Clear"),
  makeBook("Sapiens: A Brief History of Humankind", "Yuval Noah Harari"),
  makeBook("Thinking, Fast and Slow", "Daniel Kahneman"),
  makeBook("Man's Search for Meaning", "Viktor E. Frankl"),
  makeBook("The Prince", "Niccolò Machiavelli"),
  makeBook("Meditations", "Marcus Aurelius"),
  makeBook("Nineteen Eighty-Four", "George Orwell"),
  makeBook("Deep Work", "Cal Newport"),
  makeBook("The Art of War", "Sun Tzu"),
  makeBook("Guns, Germs, and Steel", "Jared Diamond"),
  makeBook("The Selfish Gene", "Richard Dawkins"),
  makeBook("Zero to One", "Peter Thiel"),
];
