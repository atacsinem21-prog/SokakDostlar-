type Bucket = { count: number; resetAt: number };

const store = new Map<string, Bucket>();

export type RateLimitOptions = {
  /** Pencere suresi (ms) */
  windowMs: number;
  /** Pencere basina maksimum istek */
  max: number;
};

const DEFAULT_OPTS: RateLimitOptions = {
  windowMs: 60_000,
  max: 30,
};

/**
 * Sunucu belleginde basit sliding pencere (serverless'ta instance basina ayri sayac).
 */
export function checkRateLimit(
  key: string,
  opts: Partial<RateLimitOptions> = {},
): { ok: true } | { ok: false; retryAfterSec: number } {
  const { windowMs, max } = { ...DEFAULT_OPTS, ...opts };
  const now = Date.now();
  let b = store.get(key);
  if (!b || now > b.resetAt) {
    b = { count: 0, resetAt: now + windowMs };
    store.set(key, b);
  }
  b.count += 1;
  if (b.count > max) {
    return {
      ok: false,
      retryAfterSec: Math.max(1, Math.ceil((b.resetAt - now) / 1000)),
    };
  }
  return { ok: true };
}

export function getClientIp(req: Request): string {
  const forwarded = req.headers.get("x-forwarded-for");
  if (forwarded) {
    const first = forwarded.split(",")[0]?.trim();
    if (first) return first;
  }
  const real = req.headers.get("x-real-ip");
  if (real?.trim()) return real.trim();
  return "unknown";
}
