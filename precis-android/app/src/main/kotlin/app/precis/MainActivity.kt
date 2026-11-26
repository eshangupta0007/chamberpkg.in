package app.precis

import android.Manifest
import android.content.pm.PackageManager
import android.os.Build
import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.activity.enableEdgeToEdge
import androidx.activity.result.contract.ActivityResultContracts
import androidx.activity.viewModels
import androidx.core.content.ContextCompat
import app.precis.core.SavedSummary
import app.precis.ui.PrecisRoot
import app.precis.ui.PrecisTheme

class MainActivity : ComponentActivity() {
    private val vm: AppViewModel by viewModels()
    private var askedForNotifications = false

    private val notificationPermission =
        registerForActivityResult(ActivityResultContracts.RequestPermission()) { /* playback works either way */ }

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        enableEdgeToEdge()
        val player = (application as PrecisApp).player
        setContent {
            PrecisTheme {
                PrecisRoot(vm = vm, player = player, onListen = ::listen)
            }
        }
    }

    /** Ask once for notification permission (Android 13+) so lock-screen controls can show, then play. */
    private fun listen(summary: SavedSummary) {
        if (Build.VERSION.SDK_INT >= 33 && !askedForNotifications &&
            ContextCompat.checkSelfPermission(this, Manifest.permission.POST_NOTIFICATIONS) != PackageManager.PERMISSION_GRANTED
        ) {
            askedForNotifications = true
            notificationPermission.launch(Manifest.permission.POST_NOTIFICATIONS)
        }
        (application as PrecisApp).player.listen(summary)
    }
}
