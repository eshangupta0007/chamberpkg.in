package app.precis.ui

import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.width
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Bedtime
import androidx.compose.material.icons.filled.Close
import androidx.compose.material.icons.filled.Pause
import androidx.compose.material.icons.filled.PlayArrow
import androidx.compose.material.icons.filled.SkipNext
import androidx.compose.material.icons.filled.SkipPrevious
import androidx.compose.material3.AssistChip
import androidx.compose.material3.DropdownMenu
import androidx.compose.material3.DropdownMenuItem
import androidx.compose.material3.FilledIconButton
import androidx.compose.material3.Icon
import androidx.compose.material3.IconButton
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Slider
import androidx.compose.material3.Surface
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.text.style.TextOverflow
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import app.precis.playback.PlayStatus
import app.precis.playback.PlayerController
import app.precis.playback.PlayerState

private val RATES = listOf(0.8f, 1f, 1.25f, 1.5f, 1.75f, 2f)
private val SLEEP = listOf<Int?>(null, 15, 30, 60)

@Composable
fun MiniPlayer(state: PlayerState, player: PlayerController) {
    val summary = state.summary ?: return
    val playing = state.status == PlayStatus.PLAYING
    var voiceMenu by remember { mutableStateOf(false) }

    Surface(color = MaterialTheme.colorScheme.surface, tonalElevation = 3.dp) {
        Column(Modifier.fillMaxWidth().padding(horizontal = 12.dp, vertical = 4.dp)) {
            Slider(
                value = state.index.toFloat(),
                onValueChange = { player.seek(it.toInt()) },
                valueRange = 0f..(state.chunks.size - 1).coerceAtLeast(1).toFloat(),
            )
            Row(verticalAlignment = Alignment.CenterVertically) {
                Column(Modifier.weight(1f)) {
                    Text(summary.book.title, fontSize = 15.sp, maxLines = 1, overflow = TextOverflow.Ellipsis)
                    Text(
                        "${summary.book.author} · ${state.minutesLeft} min left",
                        fontSize = 12.sp, color = MaterialTheme.colorScheme.onSurfaceVariant,
                        maxLines = 1, overflow = TextOverflow.Ellipsis,
                    )
                }
                IconButton(onClick = { player.seekBlock(-1) }) { Icon(Icons.Filled.SkipPrevious, "Previous paragraph") }
                FilledIconButton(onClick = player::toggle) {
                    Icon(if (playing) Icons.Filled.Pause else Icons.Filled.PlayArrow, if (playing) "Pause" else "Play")
                }
                IconButton(onClick = { player.seekBlock(1) }) { Icon(Icons.Filled.SkipNext, "Next paragraph") }
                IconButton(onClick = player::stop) { Icon(Icons.Filled.Close, "Close player") }
            }
            Row(horizontalArrangement = Arrangement.spacedBy(8.dp), verticalAlignment = Alignment.CenterVertically) {
                AssistChip(
                    onClick = {
                        val i = RATES.indexOfFirst { it >= state.rate - 0.001f }
                        player.setRate(RATES[(i + 1) % RATES.size])
                    },
                    label = { Text("${state.rate}×") },
                )
                AssistChip(
                    onClick = {
                        val left = state.sleepEndsAt?.let { ((it - System.currentTimeMillis()) / 60_000).toInt() }
                        val i = if (left == null) 0 else SLEEP.indexOfFirst { it != null && it >= left }.coerceAtLeast(0)
                        player.setSleep(SLEEP[(i + 1) % SLEEP.size])
                    },
                    leadingIcon = { Icon(Icons.Filled.Bedtime, null, Modifier.width(16.dp)) },
                    label = { Text(if (state.sleepEndsAt == null) "Sleep" else "On") },
                )
                if (state.voiceNames.isNotEmpty()) {
                    AssistChip(onClick = { voiceMenu = true }, label = { Text("Voice") })
                    DropdownMenu(expanded = voiceMenu, onDismissRequest = { voiceMenu = false }) {
                        DropdownMenuItem(text = { Text("Default voice") }, onClick = { player.setVoice(null); voiceMenu = false })
                        state.voiceNames.forEach { n ->
                            DropdownMenuItem(text = { Text(n) }, onClick = { player.setVoice(n); voiceMenu = false })
                        }
                    }
                }
                state.error?.let { Text(it, color = MaterialTheme.colorScheme.error, fontSize = 12.sp) }
            }
        }
    }
}
