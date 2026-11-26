package app.precis.core

import com.sun.net.httpserver.HttpServer
import kotlinx.coroutines.runBlocking
import java.net.InetSocketAddress
import kotlin.test.AfterTest
import kotlin.test.Test
import kotlin.test.assertEquals
import kotlin.test.assertTrue

class CatalogTest {
    private var server: HttpServer? = null
    private var lastQuery: String? = null

    private fun start(code: Int, body: String): String {
        val s = HttpServer.create(InetSocketAddress("127.0.0.1", 0), 0)
        s.createContext("/search.json") { ex ->
            lastQuery = ex.requestURI.rawQuery
            val b = body.toByteArray()
            ex.sendResponseHeaders(code, b.size.toLong()); ex.responseBody.use { it.write(b) }
        }
        s.start(); server = s
        return "http://127.0.0.1:${s.address.port}"
    }

    @AfterTest fun stop() { server?.stop(0) }

    @Test fun mapsAndDedupes() {
        val url = start(200, """{"numFound":3,"docs":[
          {"title":"Atomic Habits","author_name":["James Clear"],"first_publish_year":2018,"extra":1},
          {"title":"Atomic Habits","author_name":["James Clear"]},
          {"author_name":["No Title"]},
          {"title":"Untitled Author"}]}""")
        val books = runBlocking { Catalog(url).search("atomic habits & more") }.getOrThrow()
        assertEquals(listOf("Atomic Habits", "Untitled Author"), books.map { it.title })
        assertEquals(2018, books[0].year)
        assertTrue(lastQuery!!.contains("q=atomic+habits+%26+more"), lastQuery)
    }

    @Test fun shortQueriesSkipTheNetwork() {
        val books = runBlocking { Catalog("http://127.0.0.1:1").search("a") }.getOrThrow()
        assertTrue(books.isEmpty())
    }

    @Test fun httpErrorIsAFailureResult() {
        val url = start(503, "down")
        assertTrue(runBlocking { Catalog(url).search("atomic") }.isFailure)
    }

    @Test fun unreachableIsAFailureResult() =
        assertTrue(runBlocking { Catalog("http://127.0.0.1:1").search("atomic") }.isFailure)
}
