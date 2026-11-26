package app.precis.core

import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.withContext
import kotlinx.serialization.Serializable
import kotlinx.serialization.json.Json
import java.net.HttpURLConnection
import java.net.URL
import java.net.URLEncoder

@Serializable
private data class OpenLibraryResponse(val docs: List<OpenLibraryDoc> = emptyList())

@Serializable
internal data class OpenLibraryDoc(
    val title: String? = null,
    @kotlinx.serialization.SerialName("author_name") val authorName: List<String>? = null,
    @kotlinx.serialization.SerialName("first_publish_year") val firstPublishYear: Int? = null,
)

/** Maps Open Library rows to Books, dropping unusable rows and duplicates. */
internal fun mapOpenLibrary(docs: List<OpenLibraryDoc>): List<Book> {
    val seen = HashSet<String>()
    val out = ArrayList<Book>()
    for (d in docs) {
        val title = d.title ?: continue
        val book = makeBook(title, d.authorName?.firstOrNull().orEmpty(), d.firstPublishYear)
        if (seen.add(book.id)) out += book
    }
    return out
}

/** Open Library search. Failures are reported as [Result.failure]; callers can still summarise typed text. */
class Catalog(private val baseUrl: String = "https://openlibrary.org") {
    private val json = Json { ignoreUnknownKeys = true }

    suspend fun search(query: String): Result<List<Book>> = withContext(Dispatchers.IO) {
        runCatching {
            val q = query.trim().take(120)
            if (q.length < 2) return@runCatching emptyList()
            val url = URL(
                "$baseUrl/search.json?q=${URLEncoder.encode(q, "UTF-8")}&limit=12" +
                    "&fields=title,author_name,first_publish_year",
            )
            val conn = (url.openConnection() as HttpURLConnection).apply {
                connectTimeout = 8000
                readTimeout = 8000
                setRequestProperty("User-Agent", "Precis-Android/0.1")
            }
            try {
                check(conn.responseCode == 200) { "Open Library responded ${conn.responseCode}" }
                val body = conn.inputStream.bufferedReader().use { it.readText() }
                mapOpenLibrary(json.decodeFromString<OpenLibraryResponse>(body).docs)
            } finally {
                conn.disconnect()
            }
        }
    }
}
