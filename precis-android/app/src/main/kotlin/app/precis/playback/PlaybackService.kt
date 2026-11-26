package app.precis.playback

import android.app.Notification
import android.app.NotificationChannel
import android.app.NotificationManager
import android.app.PendingIntent
import android.app.Service
import android.content.Intent
import android.content.pm.ServiceInfo
import android.os.IBinder
import android.support.v4.media.MediaMetadataCompat
import android.support.v4.media.session.MediaSessionCompat
import android.support.v4.media.session.PlaybackStateCompat
import androidx.core.app.NotificationCompat
import androidx.core.app.ServiceCompat
import androidx.media.app.NotificationCompat.MediaStyle
import app.precis.MainActivity
import app.precis.PrecisApp
import app.precis.R
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.SupervisorJob
import kotlinx.coroutines.cancel
import kotlinx.coroutines.flow.collect
import kotlinx.coroutines.launch

/**
 * Keeps playback alive with the screen off and shows lock-screen / notification controls.
 * The speech itself runs in [PlayerController]; this service only hosts the foreground
 * notification and a MediaSession, and forwards button presses.
 */
class PlaybackService : Service() {
    private lateinit var session: MediaSessionCompat
    private val scope = CoroutineScope(SupervisorJob() + Dispatchers.Main.immediate)
    private val player get() = (application as PrecisApp).player
    private var started = false

    override fun onBind(intent: Intent?): IBinder? = null

    override fun onCreate() {
        super.onCreate()
        getSystemService(NotificationManager::class.java).createNotificationChannel(
            NotificationChannel(CHANNEL, "Playback", NotificationManager.IMPORTANCE_LOW).apply {
                description = "Controls for the summary being read aloud"
                setShowBadge(false)
            },
        )
        session = MediaSessionCompat(this, "Precis").apply {
            setCallback(object : MediaSessionCompat.Callback() {
                override fun onPlay() { if (player.state.value.status != PlayStatus.PLAYING) player.toggle() }
                override fun onPause() = player.pause()
                override fun onSkipToNext() = player.seekBlock(1)
                override fun onSkipToPrevious() = player.seekBlock(-1)
                override fun onStop() = player.stop()
            })
            isActive = true
        }
    }

    override fun onStartCommand(intent: Intent?, flags: Int, startId: Int): Int {
        // Must reach startForeground quickly after startForegroundService().
        val first = player.state.value
        ServiceCompat.startForeground(this, NOTIF_ID, build(first), MEDIA_PLAYBACK)

        when (intent?.action) {
            ACTION_TOGGLE -> player.toggle()
            ACTION_NEXT -> player.seekBlock(1)
            ACTION_PREV -> player.seekBlock(-1)
            ACTION_STOP -> player.stop()
        }

        if (!started) {
            started = true
            scope.launch {
                player.state.collect { st ->
                    if (st.summary == null) {
                        ServiceCompat.stopForeground(this@PlaybackService, ServiceCompat.STOP_FOREGROUND_REMOVE)
                        stopSelf()
                    } else {
                        publish(st)
                    }
                }
            }
        }
        return START_NOT_STICKY
    }

    private fun publish(st: PlayerState) {
        val book = st.summary?.book ?: return
        session.setMetadata(
            MediaMetadataCompat.Builder()
                .putString(MediaMetadataCompat.METADATA_KEY_TITLE, book.title)
                .putString(MediaMetadataCompat.METADATA_KEY_ARTIST, book.author)
                .build(),
        )
        val playing = st.status == PlayStatus.PLAYING
        session.setPlaybackState(
            PlaybackStateCompat.Builder()
                .setActions(
                    PlaybackStateCompat.ACTION_PLAY or PlaybackStateCompat.ACTION_PAUSE or
                        PlaybackStateCompat.ACTION_PLAY_PAUSE or PlaybackStateCompat.ACTION_SKIP_TO_NEXT or
                        PlaybackStateCompat.ACTION_SKIP_TO_PREVIOUS or PlaybackStateCompat.ACTION_STOP,
                )
                .setState(
                    if (playing) PlaybackStateCompat.STATE_PLAYING else PlaybackStateCompat.STATE_PAUSED,
                    PlaybackStateCompat.PLAYBACK_POSITION_UNKNOWN, if (playing) st.rate else 0f,
                )
                .build(),
        )
        // Re-posting through startForeground updates the notification without a separate notify permission.
        ServiceCompat.startForeground(this, NOTIF_ID, build(st), MEDIA_PLAYBACK)
    }

    private fun action(icon: Int, title: String, action: String, code: Int) =
        NotificationCompat.Action.Builder(
            icon, title,
            PendingIntent.getService(
                this, code, Intent(this, PlaybackService::class.java).setAction(action),
                PendingIntent.FLAG_IMMUTABLE or PendingIntent.FLAG_UPDATE_CURRENT,
            ),
        ).build()

    private fun build(st: PlayerState): Notification {
        val playing = st.status == PlayStatus.PLAYING
        val book = st.summary?.book
        return NotificationCompat.Builder(this, CHANNEL)
            .setSmallIcon(R.drawable.ic_stat_precis)
            .setContentTitle(book?.title ?: "Précis")
            .setContentText(book?.author.orEmpty())
            .setContentIntent(
                PendingIntent.getActivity(
                    this, 0, Intent(this, MainActivity::class.java).addFlags(Intent.FLAG_ACTIVITY_SINGLE_TOP),
                    PendingIntent.FLAG_IMMUTABLE or PendingIntent.FLAG_UPDATE_CURRENT,
                ),
            )
            .addAction(action(android.R.drawable.ic_media_previous, "Previous", ACTION_PREV, 1))
            .addAction(
                if (playing) action(android.R.drawable.ic_media_pause, "Pause", ACTION_TOGGLE, 2)
                else action(android.R.drawable.ic_media_play, "Play", ACTION_TOGGLE, 2),
            )
            .addAction(action(android.R.drawable.ic_media_next, "Next", ACTION_NEXT, 3))
            .addAction(action(android.R.drawable.ic_menu_close_clear_cancel, "Close", ACTION_STOP, 4))
            .setStyle(MediaStyle().setMediaSession(session.sessionToken).setShowActionsInCompactView(0, 1, 2))
            .setVisibility(NotificationCompat.VISIBILITY_PUBLIC)
            .setOnlyAlertOnce(true)
            .setOngoing(playing)
            .build()
    }

    override fun onDestroy() {
        scope.cancel()
        session.isActive = false
        session.release()
        super.onDestroy()
    }

    companion object {
        private const val CHANNEL = "playback"
        private const val NOTIF_ID = 1

        // Constant is inlined at compile time; ServiceCompat ignores the type below API 29.
        @android.annotation.SuppressLint("InlinedApi")
        private const val MEDIA_PLAYBACK = ServiceInfo.FOREGROUND_SERVICE_TYPE_MEDIA_PLAYBACK
        const val ACTION_TOGGLE = "app.precis.action.TOGGLE"
        const val ACTION_NEXT = "app.precis.action.NEXT"
        const val ACTION_PREV = "app.precis.action.PREV"
        const val ACTION_STOP = "app.precis.action.STOP"
    }
}
