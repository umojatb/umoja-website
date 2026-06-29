/**
 * Tiny in-memory rate limiter, keyed by an arbitrary string (typically
 * a client IP). Holds counters in a Map and prunes expired buckets on
 * each call so memory stays bounded.
 *
 * Caveats:
 *
 * - Per-instance, not distributed. On Vercel multi-instance setups this
 *   means a determined attacker could distribute requests across
 *   instances and bypass the limit. For the contact form on a 5-scholar
 *   org this is acceptable; tightening would mean Vercel KV or Upstash.
 * - Resets when the function instance recycles. Not a replay-resistant
 *   audit log; just a coarse abuse brake.
 * - Honors the `windowMs` and `max` you pass. There's no global config.
 */

type Bucket = { count: number; resetAt: number };

const buckets = new Map<string, Bucket>();

export type RateLimitResult = {
  readonly ok: boolean;
  readonly remaining: number;
  readonly resetAt: number;
};

export function rateLimit(
  key: string,
  opts: { readonly windowMs: number; readonly max: number },
): RateLimitResult {
  const now = Date.now();
  prune(now);
  const existing = buckets.get(key);
  if (!existing || existing.resetAt <= now) {
    const fresh: Bucket = { count: 1, resetAt: now + opts.windowMs };
    buckets.set(key, fresh);
    return { ok: true, remaining: opts.max - 1, resetAt: fresh.resetAt };
  }
  existing.count += 1;
  const ok = existing.count <= opts.max;
  return {
    ok,
    remaining: Math.max(0, opts.max - existing.count),
    resetAt: existing.resetAt,
  };
}

function prune(now: number): void {
  // Cheap pruning: walk and delete expired buckets. Map size stays
  // O(active clients in window). For this app that's tiny.
  for (const [key, bucket] of buckets) {
    if (bucket.resetAt <= now) buckets.delete(key);
  }
}

/** Test-only escape hatch to drop all buckets. */
export function _resetRateLimitBuckets(): void {
  buckets.clear();
}

/**
 * Best-effort client IP from request headers. Vercel sets
 * `x-forwarded-for` to the chain; we take the first entry. Falls back
 * to a string token so the limiter still keys on something even if
 * headers are missing.
 */
export function clientIpFromRequest(request: Request): string {
  const xff = request.headers.get("x-forwarded-for");
  if (xff) {
    const first = xff.split(",")[0]?.trim();
    if (first) return first;
  }
  const real = request.headers.get("x-real-ip");
  if (real) return real;
  return "unknown";
}
