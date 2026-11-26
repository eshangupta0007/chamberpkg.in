package app.precis.playback

import android.app.Application
import android.content.Intent
import android.media.AudioAttributes
import android.media.AudioFocusRequest
import android.media.AudioManager
import android.os.Handler
import android.os.Looper
import android.speech.tts.TextToSpeech
import android.speech.tts.UtteranceProgressListener
import android.speech.tts.Voice
import androidx.core.content.ContextCompat
import app.precis.core.Chunk
import app.precis.core.SavedSummary
import app.precis.core.minutesFor
import app.precis.core.parseBlocks
import app.precis.core.toChunks
import app.precis.data.PlayerPrefs
import app.precis.data.ProgressStore
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.Job
import kotlinx.coroutines.SupervisorJob
import kotlinx.coroutines.delay
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.flow.update
import kotlinx.coroutines.launch

enum class PlayStatus { IDLE, PLAYING, PAUSED }

data class PlayerState(
    val summary: SavedSummary? = null,
    val chunks: List<Chunk> = emptyList(),
    val index: Int = 0,
    val status: PlayStatus = PlayStatus.IDLE,
    val rate: Float = 1f,
    val voiceName: String? = null,
    val voiceNames: List<String> = emptyList(),
    val sleepEndsAt: Long? = null,
    val error: String? = null,
) {
    val currentBlock: Int? get() = chunks.getOrNull(index)?.block
    val minutesLeft: Int
        get() = chunks.drop(index).joinToString(" ") { it.text }.let { if (it.isEmpty()) 0 else minutesFor(it, rate) }
}

/**
 * Speaks a summary chunk by chunk through Android's TextToSpeech.
 *
 * All public methods must be called on the main thread. Each (re)start bumps [gen]; utterance ids
 * carry it, so callbacks from a superseded utterance are ignored. This mirrors the web player.
 */
class PlayerController(
    private val app: Application,
    private val prefs: PlayerPrefs,
    private val progress: ProgressStore,
) {
    private val _state = MutableStateFlow(PlayerState(rate = prefs.rate, voiceName = prefs.voiceName))
    val state: StateFlow<PlayerState> = _state.asStateFlow()

    private val main = Handler(Looper.getMainLooper())
    private val scope = CoroutineScope(SupervisorJob() + Dispatchers.Main.immediate)
    private var tts: TextToSpeech? = null
    private var ready = false
    private var whenReady: (() -> Unit)? = null
    private var voice: Voice? = null
    private var gen = 0
    private var sleepJob: Job? = null

    private val audioManager = app.getSystemService(AudioManager::class.java)
    private val attrs = AudioAttributes.Builder()
        .setUsage(AudioAttributes.USAGE_MEDIA)
        .setContentType(AudioAttributes.CONTENT_TYPE_SPEECH)
        .build()
    private var hasFocus = false
    private val focusRequest = AudioFocusRequest.Builder(AudioManager.AUDIOFOCUS_GAIN)
        .setAudioAttributes(attrs)
        .setOnAudioFocusChangeListener { change ->
            // A call or another media app took over: stop talking over it. Ducking is ignored.
            if (change == AudioManager.AUDIOFOCUS_LOSS || change == AudioManager.AUDIOFOCUS_LOSS_TRANSIENT) {
                main.post { hasFocus = false; if (_state.value.status == PlayStatus.PLAYING) pause() }
            }
        }
        .build()

    private val listener = object : UtteranceProgressListener() {
        override fun onStart(utteranceId: String?) {}

        override fun onDone(utteranceId: String?) {
            val (g, i) = parse(utteranceId) ?: return
            main.post { if (g == gen) speakAt(i + 1) }
        }

        @Deprecated("Required override on older API levels")
        override fun onError(utteranceId: String?) {
            val (g, _) = parse(utteranceId) ?: return
            main.post {
                if (g == gen) {
                    pause()
                    _state.update { it.copy(error = "The speech engine reported an error.") }
                }
            }
        }
    }

    private fun parse(id: String?): Pair<Int, Int>? =
        id?.split(":")?.takeIf { it.size == 2 }?.let { (g, i) -> (g.toIntOrNull() ?: return null) to (i.toIntOrNull() ?: return null) }

    /* ---------- public controls ---------- */

    /** Load [summary] (resuming saved progress) and start, or toggle if it is already loaded. */
    fun listen(summary: SavedSummary) {
        val cur = _state.value
        if (cur.summary?.key == summary.key) return toggle()

        val chunks = toChunks(parseBlocks(summary.text))
        val saved = progress.get(summary.key)
        val start = if (saved in chunks.indices) saved else 0
        gen++
        tts?.stop()
        _state.update { it.copy(summary = summary, chunks = chunks, index = start, status = PlayStatus.PAUSED, error = null) }
        ContextCompat.startForegroundService(app, Intent(app, PlaybackService::class.java))
        withEngine { speakAt(start) }
    }

    fun toggle() {
        val s = _state.value
        if (s.summary == null) return
        if (s.status == PlayStatus.PLAYING) pause() else withEngine { speakAt(_state.value.index) }
    }

    fun pause() {
        gen++
        tts?.stop()
        abandonFocus()
        _state.update { if (it.summary == null) it else it.copy(status = PlayStatus.PAUSED) }
    }

    fun seek(chunkIndex: Int) {
        val s = _state.value
        if (s.chunks.isEmpty()) return
        val i = chunkIndex.coerceIn(0, s.chunks.size - 1)
        if (s.status == PlayStatus.PLAYING) speakAt(i) else _state.update { it.copy(index = i) }.also { persist(i) }
    }

    /** +1: start of the next paragraph (past the end finishes). -1: start of this paragraph, then the previous. */
    fun seekBlock(delta: Int) {
        val s = _state.value
        val cur = s.currentBlock ?: return
        val firstOf = { b: Int -> s.chunks.indexOfFirst { it.block == b } }
        if (delta < 0) {
            val startOfCurrent = firstOf(cur)
            if (s.index > startOfCurrent) return seek(startOfCurrent)
            val prev = s.chunks.map { it.block }.distinct().lastOrNull { it < cur }
            return seek(if (prev == null) 0 else firstOf(prev))
        }
        val next = s.chunks.firstOrNull { it.block > cur }
        if (next != null) seek(s.chunks.indexOf(next)) else speakAt(s.chunks.size)
    }

    fun setRate(rate: Float) {
        prefs.rate = rate
        _state.update { it.copy(rate = rate) }
        if (_state.value.status == PlayStatus.PLAYING) speakAt(_state.value.index)
    }

    fun setVoice(name: String?) {
        prefs.voiceName = name
        voice = name?.let { n -> runCatching { tts?.voices?.firstOrNull { it.name == n } }.getOrNull() }
        _state.update { it.copy(voiceName = name) }
        if (_state.value.status == PlayStatus.PLAYING) speakAt(_state.value.index)
    }

    fun setSleep(minutes: Int?) {
        sleepJob?.cancel()
        if (minutes == null) {
            _state.update { it.copy(sleepEndsAt = null) }
            return
        }
        val ends = System.currentTimeMillis() + minutes * 60_000L
        _state.update { it.copy(sleepEndsAt = ends) }
        sleepJob = scope.launch {
            delay(minutes * 60_000L)
            pause()
            _state.update { it.copy(sleepEndsAt = null) }
        }
    }

    fun stop() {
        gen++
        sleepJob?.cancel()
        tts?.stop()
        abandonFocus()
        _state.update { PlayerState(rate = it.rate, voiceName = it.voiceName, voiceNames = it.voiceNames) }
    }

    /* ---------- engine ---------- */

    private fun speakAt(i: Int) {
        val engine = tts ?: return
        val s = _state.value
        val chunks = s.chunks
        val key = s.summary?.key ?: return
        gen++
        engine.stop()

        if (i >= chunks.size) { // finished: park at the start so Play replays, clear saved progress
            abandonFocus()
            progress.set(key, 0)
            _state.update { it.copy(index = 0, status = PlayStatus.PAUSED) }
            return
        }
        if (!requestFocus()) {
            _state.update { it.copy(status = PlayStatus.PAUSED, error = "Another app is using audio.") }
            return
        }
        engine.setSpeechRate(s.rate)
        voice?.let { engine.voice = it }
        _state.update { it.copy(index = i, status = PlayStatus.PLAYING, error = null) }
        persist(i)
        engine.speak(chunks[i].text, TextToSpeech.QUEUE_FLUSH, null, "$gen:$i")
    }

    private fun persist(i: Int) {
        _state.value.summary?.key?.let { progress.set(it, i) }
    }

    private fun requestFocus(): Boolean {
        if (hasFocus) return true
        hasFocus = audioManager.requestAudioFocus(focusRequest) == AudioManager.AUDIOFOCUS_REQUEST_GRANTED
        return hasFocus
    }

    private fun abandonFocus() {
        if (hasFocus) audioManager.abandonAudioFocusRequest(focusRequest)
        hasFocus = false
    }

    /** Creates the TextToSpeech engine on first use; runs [block] once it is initialised. */
    private fun withEngine(block: () -> Unit) {
        if (ready) return block()
        whenReady = block
        if (tts != null) return
        tts = TextToSpeech(app) { status ->
            main.post {
                val engine = tts
                if (status != TextToSpeech.SUCCESS || engine == null) {
                    _state.update { it.copy(status = PlayStatus.PAUSED, error = "Text-to-speech isn't available on this device.") }
                    tts = null
                    return@post
                }
                engine.setAudioAttributes(attrs)
                engine.setOnUtteranceProgressListener(listener)
                ready = true
                val english = runCatching { engine.voices.orEmpty() }.getOrDefault(emptySet())
                    .filter { it.locale.language == "en" && !it.features.contains("notInstalled") }
                    .sortedBy { it.name }
                val chosen = _state.value.voiceName
                voice = english.firstOrNull { it.name == chosen }
                _state.update { it.copy(voiceNames = english.map { v -> v.name }) }
                whenReady?.invoke()
                whenReady = null
            }
        }
    }
}
