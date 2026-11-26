"use client";

import { useSyncExternalStore } from "react";
import type { SavedSummary } from "./types";

/**
 * Minimal localStorage-backed store for useSyncExternalStore. Snapshots are
 * referentially stable until the underlying value changes. If storage is
 * unavailable (private mode, blocked), the store keeps working in memory.
 */
function createStore<T>(key: string, fallback: T) {
  const listeners = new Set<() => void>();
  let raw: string | null | undefined;
  let cached: T = fallback;
  let memoryOnly = false;

  const emit = () => listeners.forEach((l) => l());

  function getSnapshot(): T {
    if (memoryOnly) return cached;
    let r: string | null = null;
    try {
      r = localStorage.getItem(key);
    } catch {
      memoryOnly = true;
      return cached;
    }
    if (r === raw) return cached;
    raw = r;
    try {
      cached = r ? (JSON.parse(r) as T) : fallback;
    } catch {
      cached = fallback;
    }
    return cached;
  }

  function set(value: T) {
    cached = value;
    try {
      raw = JSON.stringify(value);
      localStorage.setItem(key, raw);
    } catch {
      memoryOnly = true;
    }
    emit();
  }

  function subscribe(cb: () => void) {
    listeners.add(cb);
    const onStorage = (e: StorageEvent) => {
      if (e.key === key) cb();
    };
    window.addEventListener("storage", onStorage);
    return () => {
      listeners.delete(cb);
      window.removeEventListener("storage", onStorage);
    };
  }

  return {
    getSnapshot,
    set,
    subscribe,
    use: () => useSyncExternalStore(subscribe, getSnapshot, () => fallback),
  };
}

const EMPTY_LIBRARY: SavedSummary[] = [];
const EMPTY_PROGRESS: Record<string, number> = {};
export type Prefs = { rate: number; voiceURI: string | null };
const DEFAULT_PREFS: Prefs = { rate: 1, voiceURI: null };

export const libraryStore = createStore<SavedSummary[]>("precis:library", EMPTY_LIBRARY);
/** summary key -> index of the last spoken chunk */
export const progressStore = createStore<Record<string, number>>("precis:progress", EMPTY_PROGRESS);
export const prefsStore = createStore<Prefs>("precis:prefs", DEFAULT_PREFS);

export function saveSummary(s: SavedSummary) {
  const rest = libraryStore.getSnapshot().filter((x) => x.key !== s.key);
  libraryStore.set([s, ...rest]);
}

export function removeSummary(key: string) {
  libraryStore.set(libraryStore.getSnapshot().filter((x) => x.key !== key));
  const { [key]: _drop, ...progress } = progressStore.getSnapshot();
  void _drop;
  progressStore.set(progress);
}
