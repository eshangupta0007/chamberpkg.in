"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  useSyncExternalStore,
  type ReactNode,
} from "react";
import { minutesFor } from "@/lib/book";
import { parseBlocks, toChunks, type Chunk } from "@/lib/speech";
import { prefsStore, progressStore } from "@/lib/store";
import type { SavedSummary } from "@/lib/types";

export type Track = {
  summary: SavedSummary;
  chunks: Chunk[];
};

export function buildTrack(summary: SavedSummary): Track {
  return { summary, chunks: toChunks(parseBlocks(summary.text)) };
}

type Status = "idle" | "playing" | "paused";

type PlayerCtx = {
  supported: boolean;
  track: Track | null;
  status: Status;
  index: number;
  rate: number;
  voiceURI: string | null;
  voices: SpeechSynthesisVoice[];
  sleepEndsAt: number | null;
  minutesLeft: number;
  /** Load a summary (resuming saved progress) and start, or toggle if already loaded. */
  listen: (summary: SavedSummary) => void;
  toggle: () => void;
  seek: (chunkIndex: number) => void;
  seekBlock: (delta: 1 | -1) => void;
  setRate: (rate: number) => void;
  setVoice: (uri: string | null) => void;
  setSleep: (minutes: number | null) => void;
  stop: () => void;
};

const Ctx = createContext<PlayerCtx | null>(null);

export function usePlayer(): PlayerCtx {
  const c = useContext(Ctx);
  if (!c) throw new Error("usePlayer must be used inside <PlayerProvider>");
  return c;
}

/* ---- voices: a stable-snapshot external store over speechSynthesis ---- */
let voiceSnapshot: SpeechSynthesisVoice[] = [];
let voiceSig = "";
const EMPTY_VOICES: SpeechSynthesisVoice[] = [];

function readVoices(): SpeechSynthesisVoice[] {
  if (typeof window === "undefined" || !("speechSynthesis" in window)) return EMPTY_VOICES;
  const all = window.speechSynthesis.getVoices();
  const sig = all.map((v) => v.voiceURI).join("|");
  if (sig !== voiceSig) {
    voiceSig = sig;
    const en = all.filter((v) => v.lang.toLowerCase().startsWith("en"));
    voiceSnapshot = en.length ? en : all;
  }
  return voiceSnapshot;
}

function subscribeVoices(cb: () => void) {
  if (!("speechSynthesis" in window)) return () => {};
  window.speechSynthesis.addEventListener("voiceschanged", cb);
  return () => window.speechSynthesis.removeEventListener("voiceschanged", cb);
}

const subscribeNothing = () => () => {};

export function PlayerProvider({ children }: { children: ReactNode }) {
  const supported = useSyncExternalStore(
    subscribeNothing,
    () => "speechSynthesis" in window,
    () => false,
  );
  const voices = useSyncExternalStore(subscribeVoices, readVoices, () => EMPTY_VOICES);
  const prefs = prefsStore.use();

  const [track, setTrack] = useState<Track | null>(null);
  const [status, setStatus] = useState<Status>("idle");
  const [index, setIndex] = useState(0);
  const [sleepEndsAt, setSleepEndsAt] = useState<number | null>(null);

  // Engine state lives in refs so utterance callbacks never see stale values.
  const trackRef = useRef<Track | null>(null);
  const indexRef = useRef(0);
  const genRef = useRef(0); // bumped on every (re)start/pause so old callbacks go inert
  const utterRef = useRef<SpeechSynthesisUtterance | null>(null); // keep alive: Chrome GC bug
  const rateRef = useRef(prefs.rate);
  const voiceRef = useRef(prefs.voiceURI);
  const voicesRef = useRef(voices);
  useEffect(() => {
    rateRef.current = prefs.rate;
    voiceRef.current = prefs.voiceURI;
    voicesRef.current = voices;
  });

  // speakAt chains itself from utterance callbacks; going through a ref avoids a self-reference.
  const speakAtRef = useRef<(i: number) => void>(() => {});

  const speakAt = useCallback((i: number) => {
    const t = trackRef.current;
    if (!t || !("speechSynthesis" in window)) return;
    const synth = window.speechSynthesis;
    const gen = ++genRef.current;
    synth.cancel();

    if (i >= t.chunks.length) {
      // Finished: park at the start so "play" replays, and clear saved progress.
      indexRef.current = 0;
      setIndex(0);
      setStatus("paused");
      progressStore.set({ ...progressStore.getSnapshot(), [t.summary.key]: 0 });
      return;
    }

    const u = new SpeechSynthesisUtterance(t.chunks[i].text);
    u.rate = rateRef.current;
    const voice = voicesRef.current.find((v) => v.voiceURI === voiceRef.current);
    if (voice) u.voice = voice;
    u.lang = voice?.lang ?? "en-US";
    u.onend = () => {
      if (gen === genRef.current) speakAtRef.current(i + 1);
    };
    u.onerror = (e) => {
      if (gen !== genRef.current) return;
      if (e.error === "canceled" || e.error === "interrupted") return;
      setStatus("paused");
    };
    utterRef.current = u;
    indexRef.current = i;
    setIndex(i);
    setStatus("playing");
    synth.speak(u);
  }, []);

  useEffect(() => {
    speakAtRef.current = speakAt;
  }, [speakAt]);

  const pause = useCallback(() => {
    genRef.current++;
    if ("speechSynthesis" in window) window.speechSynthesis.cancel();
    setStatus("paused");
  }, []);

  const listen = useCallback(
    (summary: SavedSummary) => {
      if (trackRef.current?.summary.key === summary.key) {
        if (status === "playing") pause();
        else speakAt(indexRef.current);
        return;
      }
      const t = buildTrack(summary);
      trackRef.current = t;
      setTrack(t);
      const saved = progressStore.getSnapshot()[summary.key] ?? 0;
      speakAt(saved < t.chunks.length ? saved : 0);
    },
    [pause, speakAt, status],
  );

  const toggle = useCallback(() => {
    if (!trackRef.current) return;
    if (status === "playing") pause();
    else speakAt(indexRef.current);
  }, [pause, speakAt, status]);

  const seek = useCallback(
    (i: number) => {
      const t = trackRef.current;
      if (!t) return;
      const clamped = Math.max(0, Math.min(t.chunks.length - 1, i));
      if (status === "playing") speakAt(clamped);
      else {
        indexRef.current = clamped;
        setIndex(clamped);
      }
    },
    [speakAt, status],
  );

  const seekBlock = useCallback(
    (delta: 1 | -1) => {
      const t = trackRef.current;
      if (!t) return;
      const cur = t.chunks[indexRef.current]?.block ?? 0;
      const firstOf = (b: number) => t.chunks.findIndex((c) => c.block === b);
      const startOfCurrent = firstOf(cur);
      if (delta === -1) {
        // First press returns to the start of this paragraph; a second goes to the previous one.
        if (indexRef.current > startOfCurrent) return seek(startOfCurrent);
        const prev = [...new Set(t.chunks.map((c) => c.block))].filter((b) => b < cur).pop();
        return seek(prev === undefined ? 0 : firstOf(prev));
      }
      const next = t.chunks.find((c) => c.block > cur);
      if (next) seek(t.chunks.indexOf(next));
      else seek(t.chunks.length); // past the end -> finish
    },
    [seek],
  );

  const setRate = useCallback(
    (rate: number) => {
      rateRef.current = rate;
      prefsStore.set({ ...prefsStore.getSnapshot(), rate });
      if (status === "playing") speakAt(indexRef.current);
    },
    [speakAt, status],
  );

  const setVoice = useCallback(
    (uri: string | null) => {
      voiceRef.current = uri;
      prefsStore.set({ ...prefsStore.getSnapshot(), voiceURI: uri });
      if (status === "playing") speakAt(indexRef.current);
    },
    [speakAt, status],
  );

  const setSleep = useCallback(
    (minutes: number | null) => setSleepEndsAt(minutes ? Date.now() + minutes * 60_000 : null),
    [],
  );

  const stop = useCallback(() => {
    genRef.current++;
    if ("speechSynthesis" in window) window.speechSynthesis.cancel();
    trackRef.current = null;
    setTrack(null);
    setStatus("idle");
    setSleepEndsAt(null);
  }, []);

  // Sleep timer
  useEffect(() => {
    if (!sleepEndsAt) return;
    const id = setTimeout(
      () => {
        pause();
        setSleepEndsAt(null);
      },
      Math.max(0, sleepEndsAt - Date.now()),
    );
    return () => clearTimeout(id);
  }, [sleepEndsAt, pause]);

  // Persist listening position
  const trackKey = track?.summary.key;
  useEffect(() => {
    if (!trackKey || status === "idle") return;
    const cur = progressStore.getSnapshot();
    if (cur[trackKey] !== index) progressStore.set({ ...cur, [trackKey]: index });
  }, [trackKey, index, status]);

  // Stop speaking when the page is torn down (Chrome can keep talking after reload).
  useEffect(() => {
    const stopSpeech = () => "speechSynthesis" in window && window.speechSynthesis.cancel();
    window.addEventListener("pagehide", stopSpeech);
    return () => {
      window.removeEventListener("pagehide", stopSpeech);
      stopSpeech();
    };
  }, []);

  const minutesLeft = useMemo(() => {
    if (!track) return 0;
    const rest = track.chunks.slice(index).map((c) => c.text).join(" ");
    return rest ? minutesFor(rest, prefs.rate) : 0;
  }, [track, index, prefs.rate]);

  const value: PlayerCtx = {
    supported,
    track,
    status,
    index,
    rate: prefs.rate,
    voiceURI: prefs.voiceURI,
    voices,
    sleepEndsAt,
    minutesLeft,
    listen,
    toggle,
    seek,
    seekBlock,
    setRate,
    setVoice,
    setSleep,
    stop,
  };

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}
