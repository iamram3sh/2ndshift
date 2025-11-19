// Rate Limiting Utility using in-memory store
// For production, use Redis (Upstash) or similar

interface RateLimitStore {
  [key: string]: {
    count: number
    resetTime: number
  }
}

const store: RateLimitStore = {}

// Clean up expired entries every minute
setInterval(() => {
  const now = Date.now()
  Object.keys(store).forEach((key) => {
    if (store[key].resetTime < now) {
      delete store[key]
    }
  })
}, 60000)

export interface RateLimitConfig {
  interval: number // in milliseconds
  maxRequests: number
}

export const rateLimitConfigs = {
  login: { interval: 15 * 60 * 1000, maxRequests: 5 }, // 5 attempts per 15 minutes
  register: { interval: 60 * 60 * 1000, maxRequests: 3 }, // 3 per hour
  contactForm: { interval: 60 * 60 * 1000, maxRequests: 5 }, // 5 per hour
  api: { interval: 60 * 1000, maxRequests: 100 }, // 100 per minute
  projectCreate: { interval: 60 * 60 * 1000, maxRequests: 10 }, // 10 per hour
}

export function rateLimit(
  identifier: string,
  config: RateLimitConfig
): {
  success: boolean
  remaining: number
  resetTime: number
} {
  const now = Date.now()
  const key = identifier

  // Check if entry exists and is still valid
  if (!store[key] || store[key].resetTime < now) {
    store[key] = {
      count: 1,
      resetTime: now + config.interval,
    }
    return {
      success: true,
      remaining: config.maxRequests - 1,
      resetTime: store[key].resetTime,
    }
  }

  // Increment count
  store[key].count++

  // Check if limit exceeded
  if (store[key].count > config.maxRequests) {
    return {
      success: false,
      remaining: 0,
      resetTime: store[key].resetTime,
    }
  }

  return {
    success: true,
    remaining: config.maxRequests - store[key].count,
    resetTime: store[key].resetTime,
  }
}

// Middleware helper for API routes
export function checkRateLimit(
  request: Request,
  config: RateLimitConfig
): {
  success: boolean
  remaining: number
  resetTime: number
} {
  // Get identifier (IP address or user ID)
  const forwarded = request.headers.get('x-forwarded-for')
  const ip = forwarded ? forwarded.split(',')[0] : 'unknown'
  
  return rateLimit(ip, config)
}

// Response helper
export function createRateLimitResponse(
  resetTime: number
): Response {
  const resetDate = new Date(resetTime)
  return new Response(
    JSON.stringify({
      error: 'Too many requests',
      message: 'Rate limit exceeded. Please try again later.',
      resetTime: resetDate.toISOString(),
    }),
    {
      status: 429,
      headers: {
        'Content-Type': 'application/json',
        'Retry-After': Math.ceil((resetTime - Date.now()) / 1000).toString(),
        'X-RateLimit-Reset': resetTime.toString(),
      },
    }
  )
}
