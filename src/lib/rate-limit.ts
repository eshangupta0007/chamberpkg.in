const WINDOW_MS = 10 * 60 * 1000;
const MAX_REQUESTS = 5;

const hits = new Map<string, number[]>();

/**
 * Best-effort in-memory rate limit. Resets on cold start / new serverless
 * instance, so it's a spam speed bump, not a hard guarantee — sufficient for
 * a lean launch per spec §5.1; add Turnstile/hCaptcha if abuse shows up.
 */
export function isRateLimited(key: string): boolean {
  const now = Date.now();
  const recent = (hits.get(key) ?? []).filter((t) => now - t < WINDOW_MS);
  recent.push(now);
  hits.set(key, recent);
  return recent.length > MAX_REQUESTS;
}
