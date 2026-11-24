# Précis — listen to book summaries

An Audible-style web app: search any book, and Claude writes a summary you can **read** or **listen to**.

- **Discover**: search the Open Library catalog, or type `Title by Author` for anything it doesn't have.
- **Three lengths**: brief (≈2 min), standard (≈6 min), deep dive (≈13 min). Summaries stream in as Claude writes them.
- **Listen**: a persistent player with play/pause, previous/next paragraph, click-to-jump, 0.8×–2× speed, voice picker, sleep timer, and resume where you left off. The paragraph being read is highlighted.
- **Library**: saved summaries and listening progress, stored in the browser (`localStorage`). There are no accounts and no database.

## Run it

```bash
cd audio-summaries
cp .env.example .env.local     # add your ANTHROPIC_API_KEY
npm install
npm run dev                    # http://localhost:3000
```

## How it works

| Piece | Where |
|---|---|
| Streaming summary endpoint (Claude) | `src/app/api/summary/route.ts` |
| Prompt (grounding / refusal-to-invent rules) | `src/lib/prompts.ts` |
| Catalog search proxy (Open Library) | `src/app/api/search/route.ts` |
| Player engine (Web Speech API, chunked) | `src/components/PlayerProvider.tsx`, `src/lib/speech.ts` |

The model is `claude-opus-5-5` by default (`ANTHROPIC_MODEL` overrides it). Requests also opt into the API's server-side refusal fallback; set `ANTHROPIC_FALLBACKS=off` to disable that.

## Limits you should know about

- **Summaries come from Claude's general knowledge, not the book's text.** For well-known books that is usually good; for obscure titles it can be incomplete or wrong. The prompt tells Claude to say so instead of inventing content (the UI shows that message and does not save it), and every summary carries a disclaimer. This is a mitigation, not a guarantee.
- **Audio uses the browser's built-in speech engine.** It is free and needs no key, but voice quality varies by device, and on phones playback usually stops when the tab is backgrounded or the screen locks. Claude does not produce audio. For studio-quality, background-capable audio, add a neural TTS service that returns MP3 and play it through an `<audio>` element.
- **The summary endpoint spends your API credit.** It has a small in-memory per-IP rate limit and input caps, which are a speed bump only (they reset per serverless instance). Put authentication or a shared-store rate limit in front of it before deploying publicly.
- English only for now.
