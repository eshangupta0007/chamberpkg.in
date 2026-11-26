package app.precis.core

import kotlinx.serialization.Serializable

@Serializable
data class Book(
    /** Stable slug derived from title + author. */
    val id: String,
    val title: String,
    val author: String,
    val year: Int? = null,
)

enum class SummaryLength(val label: String, val words: Int, val blurb: String) {
    BRIEF("Brief", 300, "The core idea"),
    STANDARD("Standard", 900, "Main arguments & structure"),
    DEEP("Deep dive", 2000, "Chapter-level detail"),
}

@Serializable
data class SavedSummary(
    val key: String,
    val book: Book,
    val length: SummaryLength,
    val text: String,
    val createdAt: Long,
)

const val WORDS_PER_MINUTE = 150

fun slugify(s: String): String =
    java.text.Normalizer.normalize(s.lowercase(), java.text.Normalizer.Form.NFKD)
        .replace(Regex("\\p{M}+"), "")
        .replace(Regex("[^a-z0-9]+"), "-")
        .trim('-')
        .take(80)

fun makeBook(title: String, author: String, year: Int? = null): Book {
    val t = title.trim()
    val a = author.trim()
    return Book(id = slugify("$t $a").ifEmpty { "book" }, title = t, author = a, year = year)
}

fun summaryKey(book: Book, length: SummaryLength): String = "${book.id}:${length.name.lowercase()}"

fun minutesFor(text: String, rate: Float = 1f): Int {
    val words = text.trim().split(Regex("\\s+")).count { it.isNotEmpty() }
    return maxOf(1, Math.round(words / (WORDS_PER_MINUTE * rate)))
}

/** "Title by Author" -> Book from what was typed, for titles the catalog doesn't have. */
fun bookFromTyped(q: String): Book {
    val i = q.lowercase().lastIndexOf(" by ")
    return if (i > 0) makeBook(q.substring(0, i), q.substring(i + 4)) else makeBook(q, "")
}

val FEATURED: List<Book> = listOf(
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
)
