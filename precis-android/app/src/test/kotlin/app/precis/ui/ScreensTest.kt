package app.precis.ui

import android.app.Application
import androidx.compose.ui.test.assertIsDisplayed
import androidx.compose.ui.test.junit4.createComposeRule
import androidx.compose.ui.test.onNodeWithText
import androidx.compose.ui.test.performClick
import androidx.compose.ui.test.performTextInput
import androidx.test.core.app.ApplicationProvider
import app.precis.AppViewModel
import app.precis.PrecisApp
import org.junit.Before
import org.junit.Rule
import org.junit.Test
import org.junit.runner.RunWith
import org.robolectric.RobolectricTestRunner
import org.robolectric.annotation.Config

/** Smoke-tests the real screens with the real ViewModel; no network, no API key stored. */
@RunWith(RobolectricTestRunner::class)
@Config(sdk = [34], application = PrecisApp::class)
class ScreensTest {
    @get:Rule val rule = createComposeRule()
    private lateinit var vm: AppViewModel

    @Before fun setUp() {
        val app = ApplicationProvider.getApplicationContext<Application>() as PrecisApp
        vm = AppViewModel(app)
        rule.setContent { PrecisTheme { PrecisRoot(vm, app.player, onListen = {}) } }
    }

    @Test fun discoverShowsThePopularShelfAndSearchBox() {
        rule.onNodeWithText("Any book, in minutes.").assertIsDisplayed()
        rule.onNodeWithText("Popular picks").assertIsDisplayed()
        rule.onNodeWithText("Atomic Habits").assertIsDisplayed()
    }

    @Test fun typingATitleOffersToSummariseItAsTyped() {
        rule.onNodeWithText("Search, or type “Title by Author”").performTextInput("Zzyzx by Nobody")
        rule.onNodeWithText("Summarise “Zzyzx” by Nobody as typed").assertIsDisplayed()
    }

    @Test fun openingABookShowsLengthsAndGenerateWithoutAKeyPointsToSettings() {
        rule.onNodeWithText("Atomic Habits").performClick()
        rule.onNodeWithText("Standard · 6 min").assertIsDisplayed()
        rule.onNodeWithText("Generate standard summary").performClick()
        rule.onNodeWithText("Add your Anthropic API key in Settings first.").assertIsDisplayed()
        rule.onNodeWithText("Open Settings").performClick()
        rule.onNodeWithText("Anthropic API key").assertIsDisplayed()
    }

    @Test fun libraryIsEmptyAtFirst() {
        rule.onNodeWithText("Library").performClick()
        rule.onNodeWithText("Summaries you generate are saved here, on this device.").assertIsDisplayed()
    }
}
