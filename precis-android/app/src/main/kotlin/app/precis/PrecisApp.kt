package app.precis

import android.app.Application
import app.precis.data.ApiKeyStore
import app.precis.data.LibraryStore
import app.precis.data.PlayerPrefs
import app.precis.data.ProgressStore
import app.precis.playback.PlayerController

class PrecisApp : Application() {
    lateinit var library: LibraryStore
    lateinit var progress: ProgressStore
    lateinit var keys: ApiKeyStore
    lateinit var player: PlayerController

    override fun onCreate() {
        super.onCreate()
        library = LibraryStore(this)
        progress = ProgressStore(this)
        keys = ApiKeyStore(this)
        player = PlayerController(this, PlayerPrefs(this), progress)
    }
}
