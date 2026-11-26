package app.precis.core

import com.sun.net.httpserver.HttpServer
import kotlinx.coroutines.flow.toList
import kotlinx.coroutines.runBlocking
import kotlinx.serialization.json.Json
import kotlinx.serialization.json.JsonObject
import kotlinx.serialization.json.jsonObject
import kotlinx.serialization.json.jsonPrimitive
import java.net.InetSocketAddress
import java.util.concurrent.CopyOnWriteArrayList
import kotlin.test.AfterTest
import kotlin.test.Test
import kotlin.test.assertEquals
import kotlin.test.assertIs
import kotlin.test.assertTrue

/** Runs the real Anthropic Java SDK against a local server that speaks the Messages SSE format. */
class SummaryClientTest {
    private val requests = CopyOnWriteArrayList<Pair<Map<String, List<String>>, JsonObject>>()
    private var server: HttpServer? = null

    private fun sse(event: String, data: String) = "event: $event\ndata: $data\n\n"

    private fun start(handler: (title: String) -> Pair<Int, String>): String {
        val s = HttpServer.create(InetSocketAddress("127.0.0.1", 0), 0)
        s.createContext("/v1/messages") { ex ->
            val body = Json.parseToJsonElement(ex.requestBody.readBytes().decodeToString()).jsonObject
            requests += ex.requestHeaders.mapKeys { it.key.lowercase() } to body
            val prompt = body["messages"].toString()
            val (code, payload) = handler(prompt)
            val bytes = payload.toByteArray()
            ex.responseHeaders.add("content-type", if (code == 200) "text/event-stream" else "application/json")
            ex.sendResponseHeaders(code, bytes.size.toLong())
            ex.responseBody.use { it.write(bytes) }
        }
        s.start()
        server = s
        return "http://127.0.0.1:${s.address.port}"
    }

    @AfterTest fun stop() { server?.stop(0) }

    private fun stream(parts: List<String>, stop: String = "end_turn"): String = buildString {
        append(sse("message_start", """{"type":"message_start","message":{"id":"msg_1","type":"message","role":"assistant","model":"claude-opus-5-5","content":[],"stop_reason":null,"stop_sequence":null,"usage":{"input_tokens":10,"output_tokens":1}}}"""))
        if (parts.isNotEmpty()) {
            append(sse("content_block_start", """{"type":"content_block_start","index":0,"content_block":{"type":"text","text":""}}"""))
            for (p in parts) append(sse("content_block_delta", """{"type":"content_block_delta","index":0,"delta":{"type":"text_delta","text":${Json.encodeToString(kotlinx.serialization.serializer<String>(), p)}}}"""))
            append(sse("content_block_stop", """{"type":"content_block_stop","index":0}"""))
        }
        append(sse("message_delta", """{"type":"message_delta","delta":{"stop_reason":"$stop","stop_sequence":null},"usage":{"output_tokens":50}}"""))
        append(sse("message_stop", """{"type":"message_stop"}"""))
    }

    private fun collect(url: String, book: Book = makeBook("Atomic Habits", "James Clear"), key: String = "sk-test") =
        runBlocking { SummaryClient(key, baseUrl = url, maxRetries = 0).stream(book, SummaryLength.BRIEF).toList() }

    @Test fun streamsTextThenDone() {
        val url = start { 200 to stream(listOf("## The Idea\n\n", "Small changes ", "compound.")) }
        val events = collect(url)
        assertEquals("## The Idea\n\nSmall changes compound.", events.filterIsInstance<SummaryEvent.Text>().joinToString("") { it.delta })
        assertEquals(SummaryEvent.Done, events.last())
    }

    @Test fun sendsTheRequestWeExpect() {
        val url = start { 200 to stream(listOf("ok")) }
        collect(url)
        val (headers, body) = requests.single()
        assertEquals("claude-opus-5-5", body["model"]!!.jsonPrimitive.content)
        assertEquals("16000", body["max_tokens"]!!.jsonPrimitive.content)
        assertEquals("true", body["stream"]!!.jsonPrimitive.content)
        assertEquals("low", body["output_config"]!!.jsonObject["effort"]!!.jsonPrimitive.content)
        assertTrue(body["system"].toString().contains(UNFAMILIAR_MARKER))
        assertTrue(body["messages"].toString().contains("<title>Atomic Habits</title>"))
        assertTrue("thinking" !in body, "thinking must be omitted on Claude Opus 5.5")
        assertTrue("temperature" !in body)
        assertTrue(headers.keys.any { it == "x-api-key" || it == "authorization" }, "key sent: ${headers.keys}")
    }

    @Test fun refusalIsReportedAsFailure() {
        val url = start { 200 to stream(emptyList(), stop = "refusal") }
        val last = collect(url).last()
        assertIs<SummaryEvent.Failed>(last)
        assertTrue("declined" in last.message)
    }

    @Test fun truncationIsReportedAsFailure() {
        val url = start { 200 to stream(listOf("partial"), stop = "max_tokens") }
        assertIs<SummaryEvent.Failed>(collect(url).last())
    }

    @Test fun badKeyGivesAFriendlyMessage() {
        val url = start { 401 to """{"type":"error","error":{"type":"authentication_error","message":"invalid x-api-key"}}""" }
        val last = collect(url, key = "nope").last()
        assertIs<SummaryEvent.Failed>(last)
        assertTrue("API key" in last.message, last.message)
    }

    @Test fun serverErrorGivesStatusCode() {
        val url = start { 500 to """{"type":"error","error":{"type":"api_error","message":"boom"}}""" }
        val last = collect(url).last()
        assertIs<SummaryEvent.Failed>(last)
        assertTrue("500" in last.message, last.message)
    }

    @Test fun unreachableServerIsAFailureNotACrash() {
        val last = collect("http://127.0.0.1:1").last()
        assertIs<SummaryEvent.Failed>(last)
    }
}
