package app.precis.ui

import androidx.activity.compose.BackHandler
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.padding
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Home
import androidx.compose.material.icons.filled.Settings
import androidx.compose.material.icons.filled.Star
import androidx.compose.material3.Icon
import androidx.compose.material3.NavigationBar
import androidx.compose.material3.NavigationBarItem
import androidx.compose.material3.Scaffold
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.ui.Modifier
import androidx.lifecycle.compose.collectAsStateWithLifecycle
import app.precis.AppViewModel
import app.precis.Tab
import app.precis.core.SavedSummary
import app.precis.playback.PlayerController

@Composable
fun PrecisRoot(vm: AppViewModel, player: PlayerController, onListen: (SavedSummary) -> Unit) {
    val ps by player.state.collectAsStateWithLifecycle()
    val library by vm.library.collectAsStateWithLifecycle()
    val progress by vm.progress.collectAsStateWithLifecycle()
    val hasKey by vm.hasKey.collectAsStateWithLifecycle()
    val book = vm.openBook

    BackHandler(enabled = book != null) { vm.closeBook() }

    Scaffold(
        bottomBar = {
            Column {
                MiniPlayer(ps, player)
                NavigationBar {
                    Tab.entries.forEach { t ->
                        NavigationBarItem(
                            selected = vm.tab == t && book == null,
                            onClick = { vm.closeBook(); vm.tab = t },
                            icon = {
                                Icon(
                                    when (t) { Tab.DISCOVER -> Icons.Filled.Home; Tab.LIBRARY -> Icons.Filled.Star; Tab.SETTINGS -> Icons.Filled.Settings },
                                    contentDescription = null,
                                )
                            },
                            label = { Text(t.label) },
                        )
                    }
                }
            }
        },
    ) { pad ->
        Box(Modifier.padding(pad)) {
            when {
                book != null -> BookScreen(
                    vm, book, library, ps, onListen, onSeek = player::seek,
                    onGoToSettings = { vm.closeBook(); vm.tab = Tab.SETTINGS },
                )
                vm.tab == Tab.DISCOVER -> DiscoverScreen(vm, onOpen = vm::open)
                vm.tab == Tab.LIBRARY -> LibraryScreen(vm, library, progress, ps, onOpen = vm::open, onListen = onListen)
                else -> SettingsScreen(vm, hasKey)
            }
        }
    }
}
