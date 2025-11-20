// API middleware for authentication and rate limiting
import { NextRequest, NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase/server'
import { checkRateLimit, rateLimitConfigs, createRateLimitResponse } from '@/lib/rate-limit'

export interface AuthenticatedRequest extends NextRequest {
  userId?: string
  userEmail?: string
}

// Middleware to verify authentication
export async function withAuth(
  request: NextRequest,
  handler: (req: AuthenticatedRequest) => Promise<NextResponse>
): Promise<NextResponse> {
  try {
    const supabase = await createServerSupabaseClient()
    const { data: { user }, error } = await supabase.auth.getUser()
    
    if (error || !user) {
      return NextResponse.json(
        { error: 'Unauthorized', message: 'Authentication required' },
        { status: 401 }
      )
    }
    
    // Attach user info to request
    const authRequest = request as AuthenticatedRequest
    authRequest.userId = user.id
    authRequest.userEmail = user.email
    
    return handler(authRequest)
  } catch (error) {
    console.error('Authentication error:', error)
    return NextResponse.json(
      { error: 'Authentication failed' },
      { status: 401 }
    )
  }
}

// Middleware to apply rate limiting
export async function withRateLimit(
  request: NextRequest,
  handler: (req: NextRequest) => Promise<NextResponse>,
  configKey: keyof typeof rateLimitConfigs = 'api'
): Promise<NextResponse> {
  const config = rateLimitConfigs[configKey]
  const result = checkRateLimit(request, config)
  
  if (!result.success) {
    const rateLimitResponse = createRateLimitResponse(result.resetTime)
    return NextResponse.json(
      { error: 'Rate limit exceeded', resetTime: result.resetTime },
      { status: 429, headers: rateLimitResponse.headers }
    )
  }
  
  const response = await handler(request)
  
  // Add rate limit headers
  response.headers.set('X-RateLimit-Limit', config.maxRequests.toString())
  response.headers.set('X-RateLimit-Remaining', result.remaining.toString())
  response.headers.set('X-RateLimit-Reset', result.resetTime.toString())
  
  return response
}

// Combined middleware for auth + rate limiting
export async function withAuthAndRateLimit(
  request: NextRequest,
  handler: (req: AuthenticatedRequest) => Promise<NextResponse>,
  configKey: keyof typeof rateLimitConfigs = 'api'
): Promise<NextResponse> {
  return withRateLimit(
    request,
    (req) => withAuth(req, handler),
    configKey
  )
}

// Validate request content type
export function validateContentType(
  request: NextRequest,
  expectedType: string = 'application/json'
): boolean {
  const contentType = request.headers.get('content-type')
  return contentType?.includes(expectedType) ?? false
}

// Parse and validate JSON body
export async function parseAndValidateJSON<T>(
  request: NextRequest,
  validator?: (data: any) => { success: boolean; data?: T; error?: any }
): Promise<{ success: boolean; data?: T; error?: string }> {
  try {
    if (!validateContentType(request)) {
      return { success: false, error: 'Invalid content type. Expected application/json' }
    }
    
    const body = await request.json()
    
    if (validator) {
      const result = validator(body)
      if (!result.success) {
        return { success: false, error: result.error?.message || 'Validation failed' }
      }
      return { success: true, data: result.data }
    }
    
    return { success: true, data: body }
  } catch (error) {
    return { success: false, error: 'Invalid JSON body' }
  }
}

// Security headers helper
export function addSecurityHeaders(response: NextResponse): NextResponse {
  response.headers.set('X-Content-Type-Options', 'nosniff')
  response.headers.set('X-Frame-Options', 'DENY')
  response.headers.set('X-XSS-Protection', '1; mode=block')
  return response
}

// Log security events
export function logSecurityEvent(event: {
  type: 'auth_failure' | 'rate_limit' | 'invalid_input' | 'suspicious_activity'
  ip?: string
  userId?: string
  details?: string
}) {
  // In production, this should log to a security monitoring service
  console.warn('[SECURITY EVENT]', {
    timestamp: new Date().toISOString(),
    ...event
  })
}
