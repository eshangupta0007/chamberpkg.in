const hits = new Map<string, number[]>();

/**
 * Best-effort, in-memory sliding-window limiter. It resets on cold start and is
 * per-instance, so on a serverless host it is a speed bump, not a guarantee.
 * Every summary spends API credit: put real auth or a shared store (e.g. Redis)
 * in front of this before exposing the app publicly.
 */
export function isRateLimited(key: string, max: number, windowMs: number): boolean {
  const now = Date.now();
  const recent = (hits.get(key) ?? []).filter((t) => now - t < windowMs);
  recent.push(now);
  hits.set(key, recent);
  if (hits.size > 5000) {
    for (const [k, v] of hits) {
      if (v.every((t) => now - t >= windowMs)) hits.delete(k);
    }
  }
  return recent.length > max;
}

export function clientIp(req: Request): string {
  return req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
}
