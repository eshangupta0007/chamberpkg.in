# Précis for Android

Native Android (Kotlin, Jetpack Compose) version of the Précis book-summary app: search a book, have Claude
write a brief, standard or deep summary, then read it or listen to it.

## Why native

The web version (`../audio-summaries`) uses the browser's speech engine, which stops when the screen locks.
This app speaks through Android `TextToSpeech` inside a foreground service with a media notification, so
**playback continues with the screen off** and has lock-screen / notification controls (previous, play/pause,
next, close). Audio focus is handled, so a phone call or another media app pauses it.

## Your API key

The app calls the Anthropic API directly with **your own key**, entered in Settings. It is stored encrypted with
the Android Keystore (`EncryptedSharedPreferences`) and sent only to `api.anthropic.com`. Nothing is hosted.
This suits personal use. Do **not** ship a build with a key baked in, and don't hand this app to other people
without moving the key behind a server you control. Every summary spends your API credit.

## Build

Needs JDK 17+ and the Android SDK (platform 36).

```bash
cd precis-android
./gradlew :core:test            # logic + Claude client tests; no Android SDK required
./gradlew :app:assembleDebug    # app/build/outputs/apk/debug/app-debug.apk
```

```bash
./gradlew :app:testDebugUnitTest   # player state machine + screens, under Robolectric
./gradlew :app:lintDebug
```

CI (`.github/workflows/precis-android.yml`) runs all of the above and uploads the debug APK as an artifact.
Open the `precis-android` folder in Android Studio to run it on a device or emulator.

## Layout

| Module | What it holds |
|---|---|
| `core` | Pure Kotlin/JVM, unit-tested: Claude client (official Anthropic Java SDK, streaming), prompts, text chunking, Open Library search |
| `app` | Compose UI, `PlayerController` (TTS state machine), `PlaybackService` (foreground service + MediaSession), encrypted storage |

Model: `claude-opus-5-5` (`SummaryClient.DEFAULT_MODEL`).

## What has and hasn't been verified

Verified (Gradle, JDK 21, Android SDK 36, no device):
- `core`: 23 unit tests, including the real Anthropic Java SDK against a local server that speaks the Messages
  streaming format (request shape, streaming, refusal, truncation, 401, 500, unreachable).
- `app`: compiles, lints clean (no errors), builds a debug APK; manifest declares the `mediaPlayback` foreground service.
- `PlayerController`: 13 tests (advance, pause, stale callbacks, resume, paragraph skip, finish, progress resume,
  speed change, stop, engine failure) against Robolectric's shadow `TextToSpeech`.
- Screens: 4 Compose smoke tests (discover, search-as-typed, book + missing-key flow, empty library).

**Not verified, because there is no emulator or device here:** actual speech output and voice quality, the
lock-screen/notification controls and foreground-service behaviour on real Android versions, saving the key to
the Android Keystore (Robolectric has no Keystore), and a live call to the Anthropic API with a real key.
Run it on a phone before relying on it.

Dependency note: AndroidX is pinned to Compose BOM 2026.05.01 and slightly older lifecycle/core releases because
the newest ones require AGP 9.1+ and compileSdk 37. `EncryptedSharedPreferences` is deprecated by Google but still
works; replace it with a direct Keystore-backed AES-GCM store if that matters to you.

## Limits

- **Summaries come from Claude's general knowledge, not the book's text** and can be wrong for lesser-known titles.
  The prompt tells Claude to say so instead of inventing content; the app shows that message and doesn't save it.
- Voice quality depends on the device's installed TTS engine and voices (Settings → System → Text-to-speech).
- Covers are generated from the title; there is no catalog artwork.
- English only. Release builds are not minified (the SDK's Jackson/OkHttp need keep rules first) and not signed.
- The server-side refusal fallback used by the web app is not enabled here: the Java SDK builder for it isn't
  documented in the references I used, so a refusal is shown as an error instead.
