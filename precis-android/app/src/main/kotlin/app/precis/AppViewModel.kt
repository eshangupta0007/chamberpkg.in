package app.precis

import android.app.Application
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.setValue
import androidx.lifecycle.AndroidViewModel
import androidx.lifecycle.viewModelScope
import app.precis.core.Book
import app.precis.core.Catalog
import app.precis.core.SavedSummary
import app.precis.core.SummaryClient
import app.precis.core.SummaryEvent
import app.precis.core.SummaryLength
import app.precis.core.UNFAMILIAR_MARKER
import app.precis.core.summaryKey
import kotlinx.coroutines.Job
import kotlinx.coroutines.delay
import kotlinx.coroutines.launch

enum class Tab(val label: String) { DISCOVER("Discover"), LIBRARY("Library"), SETTINGS("Settings") }

sealed interface SearchState {
    data object Idle : SearchState
    data object Loading : SearchState
    data class Results(val query: String, val books: List<Book>) : SearchState
    data class Failed(val query: String) : SearchState
}

enum class GenStatus { IDLE, LOADING, STREAMING, DONE, ERROR }

data class GenState(
    val status: GenStatus = GenStatus.IDLE,
    val key: String? = null,
    val text: String = "",
    val error: String? = null,
    val needsKey: Boolean = false,
) {
    val busy get() = status == GenStatus.LOADING || status == GenStatus.STREAMING
}

class AppViewModel(app: Application) : AndroidViewModel(app) {
    private val a = app as PrecisApp
    private val catalog = Catalog()

    val library = a.library.items
    val progress = a.progress.map
    val hasKey = a.keys.hasKey

    /* navigation */
    var tab by mutableStateOf(Tab.DISCOVER)
    var openBook by mutableStateOf<Book?>(null)
    fun open(book: Book) { cancelGeneration(); openBook = book }
    fun closeBook() { cancelGeneration(); openBook = null }

    /* search */
    var query by mutableStateOf("")
        private set
    var search by mutableStateOf<SearchState>(SearchState.Idle)
        private set
    private var searchJob: Job? = null

    fun onQuery(q: String) {
        query = q
        searchJob?.cancel()
        val t = q.trim()
        if (t.length < 2) { search = SearchState.Idle; return }
        searchJob = viewModelScope.launch {
            delay(350)
            search = SearchState.Loading
            search = catalog.search(t).fold({ SearchState.Results(t, it) }, { SearchState.Failed(t) })
        }
    }

    /* generation */
    var gen by mutableStateOf(GenState())
        private set
    private var genJob: Job? = null

    fun cancelGeneration() {
        genJob?.cancel()
        genJob = null
        gen = GenState()
    }

    fun generate(book: Book, length: SummaryLength) {
        cancelGeneration()
        val key = summaryKey(book, length)
        val apiKey = a.keys.get()
        if (apiKey.isNullOrBlank()) {
            gen = GenState(GenStatus.ERROR, key, error = "Add your Anthropic API key in Settings first.", needsKey = true)
            return
        }
        genJob = viewModelScope.launch {
            gen = GenState(GenStatus.LOADING, key)
            var text = ""
            SummaryClient(apiKey).stream(book, length).collect { ev ->
                when (ev) {
                    is SummaryEvent.Text -> { text += ev.delta; gen = GenState(GenStatus.STREAMING, key, text) }
                    SummaryEvent.Done -> {
                        gen = GenState(GenStatus.DONE, key, text)
                        // Never save a non-summary ("I don't know this book").
                        if (!text.trimStart().startsWith(UNFAMILIAR_MARKER)) {
                            a.library.save(SavedSummary(key, book, length, text.trim(), System.currentTimeMillis()))
                        }
                    }
                    is SummaryEvent.Failed -> gen = GenState(GenStatus.ERROR, key, text, ev.message)
                }
            }
        }
    }

    fun remove(key: String) {
        a.library.remove(key)
        a.progress.clear(key)
    }

    /* settings */
    fun saveKey(key: String): Boolean = key.isNotBlank() && a.keys.set(key)
    fun clearKey() = a.keys.clear()
}
