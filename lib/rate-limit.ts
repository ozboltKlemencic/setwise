// ── In-memory rate limiter (no external dependencies) ──────────────────────────
// Suitable for single-server deployments. For multi-instance (Vercel serverless),
// swap to Upstash Redis.

type RateLimitEntry = {
    count: number;
    resetAt: number;
};

const store = new Map<string, RateLimitEntry>();

// Cleanup stale entries every 60 s (server-side only)
if (typeof globalThis !== 'undefined' && typeof (globalThis as any).window === 'undefined') {
    setInterval(() => {
        const now = Date.now();
        for (const [key, entry] of store.entries()) {
            if (now > entry.resetAt) store.delete(key);
        }
    }, 60_000);
}

export type RateLimitResult = {
    success: boolean;
    limit: number;
    remaining: number;
    reset: number;
};

/**
 * Simple sliding-window rate limiter.
 *
 * @param identifier  Unique key (IP, email, user ID, …)
 * @param limit       Max requests allowed inside the window
 * @param windowMs    Window size in milliseconds (default 60 000 = 1 min)
 */
export async function rateLimit(
    identifier: string,
    limit = 5,
    windowMs = 60_000,
): Promise<RateLimitResult> {
    const now = Date.now();
    const record = store.get(identifier);

    if (!record || now > record.resetAt) {
        const resetAt = now + windowMs;
        store.set(identifier, { count: 1, resetAt });
        return { success: true, limit, remaining: limit - 1, reset: resetAt };
    }

    if (record.count >= limit) {
        return { success: false, limit, remaining: 0, reset: record.resetAt };
    }

    record.count += 1;
    return { success: true, limit, remaining: limit - record.count, reset: record.resetAt };
}

// ── Convenience limiters ───────────────────────────────────────────────────────

export const rateLimiters = {
    /** 5 requests / minute per IP */
    byIP: (ip: string) => rateLimit(`ip:${ip}`, 5, 60_000),
    /** 3 requests / 5 minutes per email */
    byEmail: (email: string) => rateLimit(`email:${email}`, 3, 300_000),
};

// ── IP extraction helper ───────────────────────────────────────────────────────

export function getClientIP(headers: Headers): string {
    return (
        headers.get('cf-connecting-ip') ??          // Cloudflare
        headers.get('x-forwarded-for')?.split(',')[0]?.trim() ??
        headers.get('x-real-ip')?.trim() ??
        '127.0.0.1'
    );
}
