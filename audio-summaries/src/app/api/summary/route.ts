import Anthropic from "@anthropic-ai/sdk";
import { SYSTEM_PROMPT, userPrompt } from "@/lib/prompts";
import { clientIp, isRateLimited } from "@/lib/rate-limit";
import { LENGTHS, type SummaryLength } from "@/lib/types";

export const maxDuration = 120;

const MODEL = process.env.ANTHROPIC_MODEL || "claude-opus-5-5";

const clean = (v: unknown, max: number): string =>
  typeof v === "string" ? v.replace(/[<>]/g, " ").replace(/\s+/g, " ").trim().slice(0, max) : "";

function json(status: number, error: string): Response {
  return Response.json({ error }, { status });
}

/**
 * POST { title, author, length } -> newline-delimited JSON events:
 *   {"t":"text","v":"..."}   a chunk of summary text
 *   {"t":"error","v":"..."}  failure after the stream began
 *   {"t":"done"}             finished cleanly
 */
export async function POST(req: Request) {
  if (!process.env.ANTHROPIC_API_KEY) {
    return json(503, "The server has no ANTHROPIC_API_KEY configured.");
  }
  if (isRateLimited(`summary:${clientIp(req)}`, 10, 10 * 60 * 1000)) {
    return json(429, "Too many summaries requested. Please wait a few minutes.");
  }

  const body: unknown = await req.json().catch(() => null);
  const b = (body && typeof body === "object" ? body : {}) as Record<string, unknown>;
  const title = clean(b.title, 200);
  const author = clean(b.author, 120);
  const length = b.length as SummaryLength;
  if (!title || !(length in LENGTHS)) {
    return json(400, "Provide a book title and a valid length.");
  }

  const client = new Anthropic();
  const useFallback = process.env.ANTHROPIC_FALLBACKS !== "off";

  const stream = client.beta.messages.stream(
    {
      model: MODEL,
      max_tokens: 16000,
      // Latency matters more than depth for a summary the user is waiting on.
      output_config: { effort: "low" },
      system: SYSTEM_PROMPT,
      messages: [{ role: "user", content: userPrompt(title, author, length) }],
      ...(useFallback
        ? { betas: ["server-side-fallback-2026-07-01"], fallbacks: "default" as const }
        : {}),
    },
    { signal: req.signal },
  );

  const enc = new TextEncoder();
  const line = (o: object) => enc.encode(JSON.stringify(o) + "\n");

  const out = new ReadableStream<Uint8Array>({
    async start(controller) {
      try {
        for await (const ev of stream) {
          if (ev.type === "content_block_delta" && ev.delta.type === "text_delta") {
            controller.enqueue(line({ t: "text", v: ev.delta.text }));
          }
        }
        const final = await stream.finalMessage();
        if (final.stop_reason === "refusal") {
          controller.enqueue(line({ t: "error", v: "Claude declined to summarise this title." }));
        } else if (final.stop_reason === "max_tokens") {
          controller.enqueue(line({ t: "error", v: "The summary was cut off. Try again." }));
        } else {
          controller.enqueue(line({ t: "done" }));
        }
      } catch (err) {
        if (!req.signal.aborted) {
          const msg =
            err instanceof Anthropic.RateLimitError
              ? "Claude is rate-limited right now. Try again shortly."
              : err instanceof Anthropic.AuthenticationError
                ? "The server's Anthropic API key was rejected."
                : err instanceof Anthropic.APIError
                  ? `Claude API error (${err.status ?? "network"}).`
                  : "Something went wrong generating the summary.";
          console.error("summary stream failed:", err);
          controller.enqueue(line({ t: "error", v: msg }));
        }
      } finally {
        try {
          controller.close();
        } catch {
          /* already closed by an abort */
        }
      }
    },
    cancel() {
      stream.controller.abort();
    },
  });

  return new Response(out, {
    headers: {
      "Content-Type": "application/x-ndjson; charset=utf-8",
      "Cache-Control": "no-store",
      "X-Accel-Buffering": "no",
    },
  });
}
