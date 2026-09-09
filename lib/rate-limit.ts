// Minimal in-memory sliding-window rate limiter for public API routes.
//
// LIMITATION: this only protects a single warm serverless instance — on
// Vercel that means it resets on cold start and doesn't share state across
// concurrent instances/regions, so it's a real but partial deterrent (stops
// a naive scripted loop hammering one instance), not a hard guarantee. For
// robust production-grade limiting, swap this for Upstash Redis
// (`@upstash/ratelimit` + `@upstash/redis`, both work natively on Vercel's
// edge) — see the SECURITY_FIXES.md note on this file for the drop-in
// replacement.
//
// Usage:
//   const { limited, retryAfterSeconds } = rateLimit(`leads:${ip}`, { max: 5, windowMs: 60 * 60 * 1000 })
//   if (limited) return NextResponse.json({ error: 'Too many requests' }, { status: 429 })

interface Bucket {
  count: number
  windowStart: number
}

const buckets = new Map<string, Bucket>()

// Prevent unbounded memory growth across the life of the instance.
const MAX_TRACKED_KEYS = 5000

export function rateLimit(
  key: string,
  { max, windowMs }: { max: number; windowMs: number }
): { limited: boolean; retryAfterSeconds: number } {
  const now = Date.now()
  const existing = buckets.get(key)

  if (!existing || now - existing.windowStart > windowMs) {
    if (buckets.size >= MAX_TRACKED_KEYS) {
      buckets.clear()
    }
    buckets.set(key, { count: 1, windowStart: now })
    return { limited: false, retryAfterSeconds: 0 }
  }

  existing.count += 1
  if (existing.count > max) {
    const retryAfterSeconds = Math.ceil((existing.windowStart + windowMs - now) / 1000)
    return { limited: true, retryAfterSeconds }
  }

  return { limited: false, retryAfterSeconds: 0 }
}

/** Best-effort client IP extraction behind Vercel's proxy. */
export function getClientIp(request: Request): string {
  const forwardedFor = request.headers.get('x-forwarded-for')
  if (forwardedFor) return forwardedFor.split(',')[0].trim()
  return request.headers.get('x-real-ip') || 'unknown'
}
