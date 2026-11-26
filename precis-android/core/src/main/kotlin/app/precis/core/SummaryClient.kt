package app.precis.core

import com.anthropic.client.okhttp.AnthropicOkHttpClient
import com.anthropic.errors.AnthropicIoException
import com.anthropic.errors.AnthropicServiceException
import com.anthropic.errors.RateLimitException
import com.anthropic.errors.UnauthorizedException
import com.anthropic.models.messages.MessageCreateParams
import com.anthropic.models.messages.OutputConfig
import com.anthropic.models.messages.StopReason
import kotlinx.coroutines.CancellationException
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.flow.Flow
import kotlinx.coroutines.flow.channelFlow
import kotlinx.coroutines.flow.flowOn

sealed interface SummaryEvent {
    data class Text(val delta: String) : SummaryEvent
    data object Done : SummaryEvent
    data class Failed(val message: String) : SummaryEvent
}

/**
 * Streams a book summary from Claude using the official Anthropic Java SDK.
 *
 * [baseUrl] exists for tests and proxies; leave it null to use api.anthropic.com.
 */
class SummaryClient(
    private val apiKey: String,
    private val model: String = DEFAULT_MODEL,
    private val baseUrl: String? = null,
    private val maxRetries: Int = 2,
) {
    fun stream(book: Book, length: SummaryLength): Flow<SummaryEvent> = channelFlow {
        val client = AnthropicOkHttpClient.builder()
            .apiKey(apiKey)
            .maxRetries(maxRetries)
            .also { b -> baseUrl?.let { b.baseUrl(it) } }
            .build()

        val params = MessageCreateParams.builder()
            .model(model)
            .maxTokens(16000L)
            // Latency matters more than depth for a summary the user is waiting on.
            .outputConfig(OutputConfig.builder().effort(OutputConfig.Effort.LOW).build())
            .system(SYSTEM_PROMPT)
            .addUserMessage(userPrompt(book.title, book.author, length))
            .build()

        // Collected per request: send() is suspending and can't be called inside a Java lambda.
        val pending = ArrayDeque<String>()
        try {
            var stop: StopReason? = null
            client.messages().createStreaming(params).use { response ->
                val events = response.stream().iterator()
                while (events.hasNext()) {
                    val event = events.next()
                    event.contentBlockDelta().ifPresent { d ->
                        d.delta().text().ifPresent { t -> pending.add(t.text()) }
                    }
                    event.messageDelta().ifPresent { m ->
                        m.delta().stopReason().ifPresent { stop = it }
                    }
                    while (pending.isNotEmpty()) send(SummaryEvent.Text(pending.removeFirst()))
                }
            }
            when (stop) {
                StopReason.REFUSAL -> send(SummaryEvent.Failed("Claude declined to summarise this title."))
                StopReason.MAX_TOKENS -> send(SummaryEvent.Failed("The summary was cut off. Try again."))
                else -> send(SummaryEvent.Done)
            }
        } catch (e: CancellationException) {
            throw e
        } catch (e: Exception) {
            send(SummaryEvent.Failed(describe(e)))
        } finally {
            client.close()
        }
    }.flowOn(Dispatchers.IO)

    companion object {
        const val DEFAULT_MODEL = "claude-opus-5-5"

        fun describe(e: Exception): String = when (e) {
            is UnauthorizedException -> "Anthropic rejected your API key. Check it in Settings."
            is RateLimitException -> "Claude is rate-limited right now. Try again shortly."
            is AnthropicServiceException -> "Claude API error (${e.statusCode()})."
            is AnthropicIoException -> "Couldn't reach Claude. Check your connection."
            else -> "Something went wrong generating the summary."
        }
    }
}
