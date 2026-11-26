package app.precis.playback

import android.app.Application
import android.os.Looper
import android.speech.tts.TextToSpeech
import android.speech.tts.UtteranceProgressListener
import androidx.test.core.app.ApplicationProvider
import app.precis.core.SavedSummary
import app.precis.core.SummaryLength
import app.precis.core.makeBook
import app.precis.data.PlayerPrefs
import app.precis.data.ProgressStore
import org.junit.Assert.assertEquals
import org.junit.Assert.assertNotNull
import org.junit.Assert.assertNull
import org.junit.Before
import org.junit.Test
import org.junit.runner.RunWith
import org.robolectric.RobolectricTestRunner
import org.robolectric.Shadows.shadowOf
import org.robolectric.annotation.Config
import org.robolectric.shadows.ShadowTextToSpeech

@RunWith(RobolectricTestRunner::class)
@Config(sdk = [34])
class PlayerControllerTest {
    private lateinit var app: Application
    private lateinit var progress: ProgressStore
    private lateinit var player: PlayerController

    // chunks: 0 "The Idea." | 1 "First para." | 2 "Second para." | 3 "The End." | 4 "Last para."
    private val text = "## The Idea\n\nFirst para.\n\nSecond para.\n\n## The End\n\nLast para."
    private val summary = SavedSummary("t-a:standard", makeBook("T", "A"), SummaryLength.STANDARD, text, 0)

    @Before fun setUp() {
        app = ApplicationProvider.getApplicationContext()
        progress = ProgressStore(app)
        player = PlayerController(app, PlayerPrefs(app), progress)
    }

    private fun idle() = shadowOf(Looper.getMainLooper()).idle()

    private fun tts() = shadowOf(ShadowTextToSpeech.getLastTextToSpeechInstance())

    /** The controller's own listener, captured so tests decide exactly when utterances finish. */
    private lateinit var real: UtteranceProgressListener

    /**
     * Completes engine initialisation as the system TTS service would. Robolectric's shadow completes
     * every utterance by itself; to drive completion manually, run just the init task, take the
     * controller's listener, and swap in a no-op so the shadow's automatic callbacks go nowhere.
     */
    private fun initEngine() {
        tts().onInitListener.onInit(TextToSpeech.SUCCESS)
        shadowOf(Looper.getMainLooper()).runOneTask()
        real = tts().utteranceProgressListener
        ShadowTextToSpeech.getLastTextToSpeechInstance().setOnUtteranceProgressListener(
            object : UtteranceProgressListener() {
                override fun onStart(utteranceId: String?) {}
                @Deprecated("required override") override fun onError(utteranceId: String?) {}
                override fun onDone(utteranceId: String?) {}
            },
        )
        idle()
    }

    private fun gen(): Int =
        PlayerController::class.java.getDeclaredField("gen").apply { isAccessible = true }.getInt(player)

    /** Signals that the utterance the player is currently speaking has finished. */
    private fun finishUtterance() = finishWithId("${gen()}:${player.state.value.index}")

    private fun finishWithId(id: String) {
        real.onDone(id)
        idle()
    }

    private fun spoken(): List<String> = tts().spokenTextList

    private fun start() {
        player.listen(summary)
        initEngine()
    }

    @Test fun listenStartsSpeakingTheFirstChunkOnceTheEngineIsReady() {
        player.listen(summary)
        assertEquals("nothing spoken before the engine initialises", PlayStatus.PAUSED, player.state.value.status)
        initEngine()
        assertEquals(listOf("The Idea."), spoken())
        assertEquals(PlayStatus.PLAYING, player.state.value.status)
        assertEquals(0, player.state.value.index)
    }

    @Test fun eachFinishedUtteranceAdvancesToTheNextChunk() {
        start()
        finishUtterance()
        finishUtterance()
        assertEquals(listOf("The Idea.", "First para.", "Second para."), spoken())
        assertEquals(2, player.state.value.index)
    }

    @Test fun aStaleUtteranceCallbackIsIgnored() {
        start()
        val oldId = "${gen()}:0"
        player.seek(3)               // restarts speech at chunk 3, bumping the generation
        finishWithId(oldId)          // late callback from the superseded utterance
        assertEquals(3, player.state.value.index)
        assertEquals("The End.", spoken().last())
    }

    @Test fun pauseStopsAndALateCallbackDoesNotResumeSpeech() {
        start()
        val id = "${gen()}:0"
        player.pause()
        assertEquals(PlayStatus.PAUSED, player.state.value.status)
        finishWithId(id)
        assertEquals(0, player.state.value.index)
        assertEquals(1, spoken().size)
    }

    @Test fun resumeReplaysTheCurrentChunk() {
        start(); finishUtterance()            // now on chunk 1
        player.pause()
        player.toggle()
        assertEquals(listOf("The Idea.", "First para.", "First para."), spoken())
        assertEquals(PlayStatus.PLAYING, player.state.value.status)
    }

    @Test fun listeningToTheSameSummaryAgainTogglesInsteadOfRestarting() {
        start()
        player.listen(summary)
        assertEquals(PlayStatus.PAUSED, player.state.value.status)
        player.listen(summary)
        assertEquals(PlayStatus.PLAYING, player.state.value.status)
    }

    @Test fun paragraphSkipMovesToBlockBoundaries() {
        start(); finishUtterance()                    // chunk 1 = block 1
        player.seekBlock(1)
        assertEquals(2, player.state.value.index)     // next paragraph
        player.seekBlock(-1)
        assertEquals(1, player.state.value.index)     // already at paragraph start -> previous one
        finishUtterance()                             // speech moves on to chunk 2, the start of block 2
        player.seekBlock(-1)                          // at a paragraph's start -> previous paragraph
        assertEquals(1, player.state.value.index)
    }

    @Test fun skippingForwardPastTheEndFinishesAndParksAtTheStart() {
        start()
        player.seek(4)
        player.seekBlock(1)
        assertEquals(PlayStatus.PAUSED, player.state.value.status)
        assertEquals(0, player.state.value.index)
        assertEquals(0, progress.get(summary.key))
    }

    @Test fun finishingTheLastChunkClearsProgress() {
        start()
        player.seek(4)
        finishUtterance()
        assertEquals(PlayStatus.PAUSED, player.state.value.status)
        assertEquals(0, player.state.value.index)
        assertEquals(0, progress.get(summary.key))
    }

    @Test fun progressIsSavedAndASecondControllerResumesThere() {
        start(); finishUtterance(); finishUtterance()
        assertEquals(2, progress.get(summary.key))

        val second = PlayerController(app, PlayerPrefs(app), progress)
        second.listen(summary)
        initEngine()
        assertEquals(2, second.state.value.index)
        assertEquals("Second para.", spoken().last())
    }

    @Test fun changingSpeedWhilePlayingRestartsTheCurrentChunk() {
        start(); finishUtterance()
        player.setRate(1.5f)
        assertEquals(1.5f, player.state.value.rate)
        assertEquals(listOf("The Idea.", "First para.", "First para."), spoken())
    }

    @Test fun stopClearsTheTrackButKeepsPreferences() {
        start()
        player.setRate(1.25f)
        player.stop()
        assertNull(player.state.value.summary)
        assertEquals(PlayStatus.IDLE, player.state.value.status)
        assertEquals(1.25f, player.state.value.rate)
    }

    @Test fun engineInitFailureIsReportedNotSwallowed() {
        player.listen(summary)
        tts().onInitListener.onInit(TextToSpeech.ERROR)
        idle()
        assertNotNull(player.state.value.error)
        assertEquals(PlayStatus.PAUSED, player.state.value.status)
    }
}
