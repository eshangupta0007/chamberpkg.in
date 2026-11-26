package app.precis.data

import android.content.Context
import androidx.core.content.edit
import androidx.security.crypto.EncryptedSharedPreferences
import androidx.security.crypto.MasterKey
import app.precis.core.SavedSummary
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.flow.update
import kotlinx.serialization.builtins.ListSerializer
import kotlinx.serialization.builtins.MapSerializer
import kotlinx.serialization.builtins.serializer
import kotlinx.serialization.json.Json

private val json = Json { ignoreUnknownKeys = true }

/** Saved summaries, kept as one JSON document in SharedPreferences. */
class LibraryStore(context: Context) {
    private val prefs = context.getSharedPreferences("precis_library", Context.MODE_PRIVATE)
    private val ser = ListSerializer(SavedSummary.serializer())
    private val _items = MutableStateFlow(load())
    val items: StateFlow<List<SavedSummary>> = _items.asStateFlow()

    private fun load(): List<SavedSummary> = runCatching {
        prefs.getString(KEY, null)?.let { json.decodeFromString(ser, it) }
    }.getOrNull().orEmpty()

    private fun persist(list: List<SavedSummary>) {
        _items.value = list
        prefs.edit { putString(KEY, json.encodeToString(ser, list)) }
    }

    fun save(s: SavedSummary) = persist(listOf(s) + _items.value.filter { it.key != s.key })
    fun remove(key: String) = persist(_items.value.filter { it.key != key })

    private companion object { const val KEY = "items" }
}

/** Last spoken chunk index per summary key. */
class ProgressStore(context: Context) {
    private val prefs = context.getSharedPreferences("precis_progress", Context.MODE_PRIVATE)
    private val ser = MapSerializer(String.serializer(), Int.serializer())
    private val _map = MutableStateFlow(
        runCatching { prefs.getString(KEY, null)?.let { json.decodeFromString(ser, it) } }.getOrNull().orEmpty(),
    )
    val map: StateFlow<Map<String, Int>> = _map.asStateFlow()

    fun get(key: String): Int = _map.value[key] ?: 0

    fun set(key: String, index: Int) {
        if (_map.value[key] == index) return
        _map.update { it + (key to index) }
        prefs.edit { putString(KEY, json.encodeToString(ser, _map.value)) }
    }

    fun clear(key: String) {
        _map.update { it - key }
        prefs.edit { putString(KEY, json.encodeToString(ser, _map.value)) }
    }

    private companion object { const val KEY = "progress" }
}

/** Playback preferences. */
class PlayerPrefs(context: Context) {
    private val prefs = context.getSharedPreferences("precis_player", Context.MODE_PRIVATE)
    var rate: Float
        get() = prefs.getFloat("rate", 1f)
        set(v) = prefs.edit { putFloat("rate", v) }
    var voiceName: String?
        get() = prefs.getString("voice", null)
        set(v) = prefs.edit { putString("voice", v) }
}

/**
 * The user's Anthropic API key, encrypted at rest with a hardware-backed Android Keystore key.
 * It is never logged and never leaves the device except in requests to api.anthropic.com.
 */
class ApiKeyStore(private val context: Context) {
    private val prefs by lazy {
        val master = MasterKey.Builder(context).setKeyScheme(MasterKey.KeyScheme.AES256_GCM).build()
        EncryptedSharedPreferences.create(
            context, "precis_secure", master,
            EncryptedSharedPreferences.PrefKeyEncryptionScheme.AES256_SIV,
            EncryptedSharedPreferences.PrefValueEncryptionScheme.AES256_GCM,
        )
    }
    private val _hasKey = MutableStateFlow(read() != null)
    val hasKey: StateFlow<Boolean> = _hasKey.asStateFlow()

    private fun read(): String? = runCatching { prefs.getString("anthropic_key", null) }.getOrNull()

    fun get(): String? = read()

    /** Returns false if the keystore refused the write. */
    fun set(key: String): Boolean = runCatching {
        prefs.edit { putString("anthropic_key", key.trim()) }
        _hasKey.value = true
    }.isSuccess

    fun clear() {
        runCatching { prefs.edit { remove("anthropic_key") } }
        _hasKey.value = false
    }
}
