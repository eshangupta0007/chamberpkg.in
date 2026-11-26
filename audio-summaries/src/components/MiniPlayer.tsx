"use client";

import { useEffect, useState } from "react";
import { Cover } from "./Cover";
import { CloseIcon, MoonIcon, NextIcon, PauseIcon, PlayIcon, PrevIcon } from "./Icons";
import { usePlayer } from "./PlayerProvider";

const RATES = [0.8, 1, 1.25, 1.5, 1.75, 2];
const SLEEP = [null, 15, 30, 60] as const;

/** "15m"-style countdown for the sleep timer, recomputed when it is set and every 15 s. */
function useSleepLabel(endsAt: number | null): string | null {
  const [shown, setShown] = useState<{ endsAt: number; text: string } | null>(null);
  useEffect(() => {
    if (!endsAt) return;
    const update = () =>
      setShown({ endsAt, text: `${Math.max(1, Math.ceil((endsAt - Date.now()) / 60_000))}m` });
    const first = setTimeout(update, 0);
    const id = setInterval(update, 15_000);
    return () => {
      clearTimeout(first);
      clearInterval(id);
    };
  }, [endsAt]);
  if (!endsAt) return null;
  return shown?.endsAt === endsAt ? shown.text : "On";
}

export function MiniPlayer() {
  const p = usePlayer();
  const sleepLabel = useSleepLabel(p.sleepEndsAt);
  if (!p.track) return null;

  const { book, length } = p.track.summary;
  const total = p.track.chunks.length;
  const playing = p.status === "playing";

  const nextRate = () => {
    const i = RATES.findIndex((r) => r >= p.rate - 0.001);
    p.setRate(RATES[(i + 1) % RATES.length]);
  };
  const nextSleep = () => {
    const cur = p.sleepEndsAt ? Math.round((p.sleepEndsAt - Date.now()) / 60_000) : null;
    const i = cur === null ? 0 : SLEEP.findIndex((s) => s !== null && s >= cur);
    p.setSleep(SLEEP[(Math.max(i, 0) + 1) % SLEEP.length]);
  };

  return (
    <div className="player" role="region" aria-label="Audio player">
      <input
        className="player-seek"
        type="range"
        min={0}
        max={Math.max(0, total - 1)}
        value={p.index}
        onChange={(e) => p.seek(Number(e.target.value))}
        aria-label="Position in summary"
      />
      <div className="player-row">
        <div className="player-meta">
          <Cover book={book} size="sm" />
          <div className="player-text">
            <strong>{book.title}</strong>
            <span>
              {book.author} · {length} · {p.minutesLeft} min left
            </span>
          </div>
        </div>

        <div className="player-controls">
          <button className="icon-btn" onClick={() => p.seekBlock(-1)} aria-label="Previous paragraph">
            <PrevIcon />
          </button>
          <button className="play-btn" onClick={p.toggle} aria-label={playing ? "Pause" : "Play"}>
            {playing ? <PauseIcon size={24} /> : <PlayIcon size={24} />}
          </button>
          <button className="icon-btn" onClick={() => p.seekBlock(1)} aria-label="Next paragraph">
            <NextIcon />
          </button>
        </div>

        <div className="player-extras">
          <button className="chip" onClick={nextRate} aria-label={`Speed ${p.rate}x, change`}>
            {p.rate}×
          </button>
          <button
            className={sleepLabel ? "chip is-on" : "chip"}
            onClick={nextSleep}
            aria-label="Sleep timer"
          >
            <MoonIcon size={14} /> {sleepLabel ?? "Off"}
          </button>
          {p.voices.length > 0 && (
            <select
              className="chip voice"
              value={p.voiceURI ?? ""}
              onChange={(e) => p.setVoice(e.target.value || null)}
              aria-label="Voice"
            >
              <option value="">Default voice</option>
              {p.voices.map((v) => (
                <option key={v.voiceURI} value={v.voiceURI}>
                  {v.name}
                </option>
              ))}
            </select>
          )}
          <button className="icon-btn" onClick={p.stop} aria-label="Close player">
            <CloseIcon size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}
