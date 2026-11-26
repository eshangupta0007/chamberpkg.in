package app.precis.ui

import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.PaddingValues
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.grid.GridCells
import androidx.compose.foundation.lazy.grid.GridItemSpan
import androidx.compose.foundation.lazy.grid.LazyVerticalGrid
import androidx.compose.foundation.lazy.grid.items
import androidx.compose.foundation.lazy.itemsIndexed
import androidx.compose.foundation.text.KeyboardOptions
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Pause
import androidx.compose.material.icons.filled.PlayArrow
import androidx.compose.material.icons.filled.Search
import androidx.compose.material3.Button
import androidx.compose.material3.FilterChip
import androidx.compose.material3.Icon
import androidx.compose.material3.LinearProgressIndicator
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.OutlinedButton
import androidx.compose.material3.OutlinedTextField
import androidx.compose.material3.Text
import androidx.compose.material3.TextButton
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.saveable.rememberSaveable
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.text.font.FontFamily
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.input.KeyboardType
import androidx.compose.ui.text.input.PasswordVisualTransformation
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import app.precis.AppViewModel
import app.precis.GenStatus
import app.precis.SearchState
import app.precis.core.Book
import app.precis.core.FEATURED
import app.precis.core.SavedSummary
import app.precis.core.SummaryLength
import app.precis.core.UNFAMILIAR_MARKER
import app.precis.core.BlockKind
import app.precis.core.bookFromTyped
import app.precis.core.minutesFor
import app.precis.core.parseBlocks
import app.precis.core.summaryKey
import app.precis.core.toChunks
import app.precis.playback.PlayStatus
import app.precis.playback.PlayerState

private val Pad = 16.dp

@Composable
fun DiscoverScreen(vm: AppViewModel, onOpen: (Book) -> Unit) {
    val s = vm.search
    LazyVerticalGrid(
        columns = GridCells.Adaptive(120.dp),
        contentPadding = PaddingValues(Pad),
        horizontalArrangement = Arrangement.spacedBy(12.dp),
        verticalArrangement = Arrangement.spacedBy(16.dp),
    ) {
        item(span = { GridItemSpan(maxLineSpan) }) {
            Column(verticalArrangement = Arrangement.spacedBy(8.dp)) {
                Text("Any book, in minutes.", fontSize = 28.sp, fontWeight = FontWeight.Bold)
                Text(
                    "Search a title, read the summary Claude writes, or press play and listen.",
                    color = MaterialTheme.colorScheme.onSurfaceVariant,
                )
                OutlinedTextField(
                    value = vm.query,
                    onValueChange = vm::onQuery,
                    modifier = Modifier.fillMaxWidth(),
                    singleLine = true,
                    leadingIcon = { Icon(Icons.Filled.Search, contentDescription = null) },
                    placeholder = { Text("Search, or type “Title by Author”") },
                    keyboardOptions = KeyboardOptions(keyboardType = KeyboardType.Text),
                )
            }
        }

        val typed = vm.query.trim().takeIf { it.length >= 2 }?.let(::bookFromTyped)
        if (s != SearchState.Idle || typed != null) {
            item(span = { GridItemSpan(maxLineSpan) }) { Text("Results", fontWeight = FontWeight.SemiBold, fontSize = 18.sp) }
            if (typed != null) item(span = { GridItemSpan(maxLineSpan) }) {
                OutlinedButton(onClick = { onOpen(typed) }, modifier = Modifier.fillMaxWidth()) {
                    Text("Summarise “${typed.title}”${if (typed.author.isNotEmpty()) " by ${typed.author}" else ""} as typed")
                }
            }
            when (s) {
                SearchState.Loading -> item(span = { GridItemSpan(maxLineSpan) }) { Muted("Searching…") }
                is SearchState.Failed -> item(span = { GridItemSpan(maxLineSpan) }) {
                    Muted("Catalog search is unavailable. You can still summarise what you typed above.")
                }
                is SearchState.Results -> {
                    if (s.books.isEmpty()) item(span = { GridItemSpan(maxLineSpan) }) {
                        Muted("No catalog matches. You can still summarise what you typed above.")
                    }
                    items(s.books, key = { it.id }) { BookCard(it, onClick = { onOpen(it) }) }
                }
                SearchState.Idle -> Unit
            }
        } else {
            item(span = { GridItemSpan(maxLineSpan) }) { Text("Popular picks", fontWeight = FontWeight.SemiBold, fontSize = 18.sp) }
            items(FEATURED, key = { it.id }) { BookCard(it, onClick = { onOpen(it) }) }
        }
    }
}

@Composable
private fun Muted(text: String) = Text(text, color = MaterialTheme.colorScheme.onSurfaceVariant)

@Composable
fun BookScreen(
    vm: AppViewModel,
    book: Book,
    library: List<SavedSummary>,
    player: PlayerState,
    onListen: (SavedSummary) -> Unit,
    onSeek: (Int) -> Unit,
    onGoToSettings: () -> Unit,
) {
    var length by rememberSaveable { mutableStateOf(SummaryLength.STANDARD) }
    val key = summaryKey(book, length)
    val saved = library.find { it.key == key }
    val gen = vm.gen.takeIf { it.key == key } ?: app.precis.GenState()
    val text = if (gen.busy || gen.status == GenStatus.ERROR) gen.text else saved?.text ?: gen.text
    val unfamiliar = text.trimStart().startsWith(UNFAMILIAR_MARKER)
    val loaded = player.summary?.key == key
    val playingThis = loaded && player.status == PlayStatus.PLAYING
    val blocks = androidx.compose.runtime.remember(text) { parseBlocks(text) }
    val chunks = androidx.compose.runtime.remember(text) { toChunks(blocks) }

    LazyColumn(contentPadding = PaddingValues(Pad), verticalArrangement = Arrangement.spacedBy(12.dp)) {
        item {
            Row(horizontalArrangement = Arrangement.spacedBy(16.dp)) {
                Cover(book, Modifier.width(110.dp), titleSize = 15)
                Column(Modifier.weight(1f), verticalArrangement = Arrangement.spacedBy(4.dp)) {
                    Text(book.title, fontSize = 24.sp, fontWeight = FontWeight.Bold, lineHeight = 28.sp)
                    Muted(book.author.ifEmpty { "Author unknown" } + (book.year?.let { " · $it" } ?: ""))
                }
            }
        }
        item {
            Row(horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                SummaryLength.entries.forEach { l ->
                    FilterChip(
                        selected = l == length,
                        enabled = !gen.busy,
                        onClick = { vm.cancelGeneration(); length = l },
                        label = { Text("${l.label} · ${l.words / 150} min") },
                    )
                }
            }
        }
        item {
            Row(horizontalArrangement = Arrangement.spacedBy(8.dp), verticalAlignment = Alignment.CenterVertically) {
                when {
                    saved != null -> {
                        Button(onClick = { onListen(saved) }) {
                            Icon(if (playingThis) Icons.Filled.Pause else Icons.Filled.PlayArrow, contentDescription = null)
                            Spacer(Modifier.width(6.dp))
                            Text("${if (playingThis) "Pause" else if (loaded) "Resume" else "Listen"} · ${minutesFor(saved.text)} min")
                        }
                        OutlinedButton(onClick = { vm.generate(book, length) }) { Text("Redo") }
                        TextButton(onClick = { vm.remove(key) }) { Text("Remove") }
                    }
                    gen.busy -> OutlinedButton(onClick = vm::cancelGeneration) { Text("Stop") }
                    else -> Button(onClick = { vm.generate(book, length) }) { Text("Generate ${length.label.lowercase()} summary") }
                }
            }
        }
        if (gen.status == GenStatus.LOADING) item { Muted("Claude is thinking…") }
        if (gen.status == GenStatus.ERROR) item {
            Column(verticalArrangement = Arrangement.spacedBy(4.dp)) {
                Text(gen.error.orEmpty(), color = MaterialTheme.colorScheme.error)
                if (gen.needsKey) TextButton(onClick = onGoToSettings) { Text("Open Settings") }
            }
        }

        if (unfamiliar) {
            item { Text(text.replace(UNFAMILIAR_MARKER, "").trim(), modifier = Modifier.padding(vertical = 8.dp)) }
        } else if (text.isNotBlank()) {
            itemsIndexed(blocks) { i, b ->
                if (b.kind == BlockKind.HEADING) {
                    Text(
                        b.text.uppercase(), color = MaterialTheme.colorScheme.primary,
                        fontWeight = FontWeight.Bold, fontSize = 14.sp, modifier = Modifier.padding(top = 12.dp),
                    )
                } else {
                    val chunkIdx = chunks.indexOfFirst { it.block == i }
                    val current = loaded && player.currentBlock == i
                    Text(
                        b.text,
                        fontFamily = FontFamily.Serif, fontSize = 18.sp, lineHeight = 28.sp,
                        modifier = Modifier
                            .fillMaxWidth()
                            .then(if (loaded && chunkIdx >= 0) Modifier.clickable { onSeek(chunkIdx) } else Modifier)
                            .then(if (current) Modifier.background(MaterialTheme.colorScheme.surfaceVariant) else Modifier)
                            .padding(horizontal = 6.dp, vertical = 4.dp),
                    )
                }
            }
            item {
                Spacer(Modifier.height(8.dp))
                Muted(
                    "Written by Claude from its general knowledge of the book, not from the book's text. " +
                        "It can be incomplete or wrong, especially for lesser-known titles. " +
                        "Check anything important against the book itself.",
                )
            }
        }
    }
}

@Composable
fun LibraryScreen(
    vm: AppViewModel,
    library: List<SavedSummary>,
    progress: Map<String, Int>,
    player: PlayerState,
    onOpen: (Book) -> Unit,
    onListen: (SavedSummary) -> Unit,
) {
    if (library.isEmpty()) {
        Column(Modifier.padding(Pad), verticalArrangement = Arrangement.spacedBy(8.dp)) {
            Text("Your library", fontSize = 28.sp, fontWeight = FontWeight.Bold)
            Muted("Summaries you generate are saved here, on this device.")
        }
        return
    }
    LazyColumn(contentPadding = PaddingValues(Pad), verticalArrangement = Arrangement.spacedBy(12.dp)) {
        item { Text("Your library", fontSize = 28.sp, fontWeight = FontWeight.Bold) }
        items(library.size) { n ->
            val s = library[n]
            val total = toChunks(parseBlocks(s.text)).size
            val pct = if (total > 0) (progress[s.key] ?: 0).toFloat() / total else 0f
            val playing = player.summary?.key == s.key && player.status == PlayStatus.PLAYING
            Row(
                Modifier.fillMaxWidth().clickable { onOpen(s.book) },
                horizontalArrangement = Arrangement.spacedBy(12.dp), verticalAlignment = Alignment.CenterVertically,
            ) {
                Cover(s.book, Modifier.width(54.dp), titleSize = 8)
                Column(Modifier.weight(1f), verticalArrangement = Arrangement.spacedBy(2.dp)) {
                    Text(s.book.title, fontWeight = FontWeight.SemiBold, maxLines = 2)
                    Muted("${s.book.author} · ${s.length.label.lowercase()} · ${minutesFor(s.text)} min")
                    if (pct > 0f) LinearProgressIndicator(progress = { pct }, modifier = Modifier.fillMaxWidth())
                }
                Button(onClick = { onListen(s) }) {
                    Icon(if (playing) Icons.Filled.Pause else Icons.Filled.PlayArrow, contentDescription = if (playing) "Pause" else "Listen")
                }
                TextButton(onClick = { vm.remove(s.key) }) { Text("Remove") }
            }
        }
    }
}

@Composable
fun SettingsScreen(vm: AppViewModel, hasKey: Boolean) {
    var key by rememberSaveable { mutableStateOf("") }
    var failed by rememberSaveable { mutableStateOf(false) }
    Column(Modifier.padding(Pad), verticalArrangement = Arrangement.spacedBy(12.dp)) {
        Text("Settings", fontSize = 28.sp, fontWeight = FontWeight.Bold)
        Text("Anthropic API key", fontWeight = FontWeight.SemiBold)
        Muted(
            if (hasKey) "A key is saved on this device."
            else "Summaries are written by Claude using your own Anthropic API key. Create one at platform.claude.com.",
        )
        OutlinedTextField(
            value = key, onValueChange = { key = it; failed = false },
            modifier = Modifier.fillMaxWidth(), singleLine = true,
            label = { Text(if (hasKey) "Replace key" else "sk-ant-…") },
            visualTransformation = PasswordVisualTransformation(),
            keyboardOptions = KeyboardOptions(keyboardType = KeyboardType.Password),
            isError = failed,
            supportingText = if (failed) { { Text("Couldn't save the key on this device.") } } else null,
        )
        Row(horizontalArrangement = Arrangement.spacedBy(8.dp)) {
            Button(enabled = key.isNotBlank(), onClick = { if (vm.saveKey(key)) key = "" else failed = true }) { Text("Save key") }
            if (hasKey) OutlinedButton(onClick = vm::clearKey) { Text("Remove key") }
        }
        Muted(
            "The key is encrypted with the Android Keystore and sent only to api.anthropic.com. " +
                "Each summary uses your API credit.",
        )
    }
}

