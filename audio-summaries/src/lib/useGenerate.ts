"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { Book, SummaryLength } from "./types";

export type GenState = {
  status: "idle" | "loading" | "streaming" | "done" | "error";
  text: string;
  error?: string;
};

const IDLE: GenState = { status: "idle", text: "" };

type Event = { t: "text"; v: string } | { t: "error"; v: string } | { t: "done" };

export function useGenerate(onDone: (text: string) => void) {
  const [state, setState] = useState<GenState>(IDLE);
  const abortRef = useRef<AbortController | null>(null);
  const onDoneRef = useRef(onDone);
  useEffect(() => {
    onDoneRef.current = onDone;
  });

  const cancel = useCallback(() => {
    abortRef.current?.abort();
    abortRef.current = null;
    setState(IDLE);
  }, []);

  useEffect(() => () => abortRef.current?.abort(), []);

  const start = useCallback(async (book: Book, length: SummaryLength) => {
    abortRef.current?.abort();
    const ac = new AbortController();
    abortRef.current = ac;
    setState({ status: "loading", text: "" });

    const fail = (error: string, text = "") => setState({ status: "error", text, error });

    try {
      const res = await fetch("/api/summary", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: book.title, author: book.author, length }),
        signal: ac.signal,
      });
      if (!res.ok || !res.body) {
        const data = (await res.json().catch(() => null)) as { error?: string } | null;
        return fail(data?.error ?? `Request failed (${res.status}).`);
      }

      const reader = res.body.getReader();
      const dec = new TextDecoder();
      let buf = "";
      let text = "";
      let finished = false;

      const handle = (ev: Event) => {
        if (ev.t === "text") {
          text += ev.v;
          setState({ status: "streaming", text });
        } else if (ev.t === "error") {
          finished = true;
          fail(ev.v, text);
        } else {
          finished = true;
          setState({ status: "done", text });
          onDoneRef.current(text);
        }
      };

      for (;;) {
        const { done, value } = await reader.read();
        if (done) break;
        buf += dec.decode(value, { stream: true });
        let nl: number;
        while ((nl = buf.indexOf("\n")) >= 0) {
          const line = buf.slice(0, nl).trim();
          buf = buf.slice(nl + 1);
          if (line) handle(JSON.parse(line) as Event);
        }
      }
      if (!finished) fail("The connection closed before the summary finished.", text);
    } catch (err) {
      if (ac.signal.aborted) return;
      console.error(err);
      fail("Couldn't reach the server. Check your connection and try again.");
    }
  }, []);

  return { state, start, cancel };
}
