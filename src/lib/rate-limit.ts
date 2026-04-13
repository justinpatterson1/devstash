import { Ratelimit } from "@upstash/ratelimit"
import { Redis } from "@upstash/redis"
import { NextResponse } from "next/server"

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
})

// 5 attempts per 15 minutes
export const signInLimiter = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(5, "15 m"),
  prefix: "rl:sign-in",
})

// 3 attempts per hour
export const registerLimiter = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(3, "1 h"),
  prefix: "rl:register",
})

// 3 attempts per hour
export const forgotPasswordLimiter = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(3, "1 h"),
  prefix: "rl:forgot-password",
})

// 5 attempts per 15 minutes
export const resetPasswordLimiter = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(5, "15 m"),
  prefix: "rl:reset-password",
})

// 5 attempts per 15 minutes
export const changePasswordLimiter = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(5, "15 m"),
  prefix: "rl:change-password",
})

export function getIP(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for")
  return forwarded?.split(",")[0].trim() ?? "unknown"
}

export async function checkRateLimit(
  limiter: Ratelimit,
  key: string
): Promise<NextResponse | null> {
  try {
    const { success, reset } = await limiter.limit(key)

    if (!success) {
      const retryAfter = Math.ceil((reset - Date.now()) / 1000)
      const minutes = Math.ceil(retryAfter / 60)
      return NextResponse.json(
        { error: `Too many attempts. Please try again in ${minutes} minute${minutes === 1 ? "" : "s"}.` },
        {
          status: 429,
          headers: { "Retry-After": String(retryAfter) },
        }
      )
    }

    return null // not rate limited
  } catch {
    // Fail open — allow request if Redis is unavailable
    return null
  }
}
