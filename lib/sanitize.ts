/**
 * Input sanitization utilities
 * Prevents XSS and injection attacks
 */

/**
 * Sanitize HTML string (basic XSS prevention)
 * In production, use a library like DOMPurify
 */
export function sanitizeHtml(html: string): string {
  if (typeof window === 'undefined') {
    // Server-side: basic sanitization
    return html
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#x27;')
      .replace(/\//g, '&#x2F;')
  }
  
  // Client-side: use DOMPurify if available, otherwise basic sanitization
  // TODO: Add DOMPurify library for production
  return html
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;')
}

/**
 * Sanitize user input for database queries
 * Removes potentially dangerous characters
 */
export function sanitizeInput(input: string): string {
  if (!input || typeof input !== 'string') {
    return ''
  }
  
  // Remove null bytes
  let sanitized = input.replace(/\0/g, '')
  
  // Trim whitespace
  sanitized = sanitized.trim()
  
  // Limit length (prevent DoS)
  if (sanitized.length > 10000) {
    sanitized = sanitized.substring(0, 10000)
  }
  
  return sanitized
}

/**
 * Sanitize email address
 */
export function sanitizeEmail(email: string): string {
  if (!email || typeof email !== 'string') {
    return ''
  }
  
  // Lowercase and trim
  const sanitized = email.toLowerCase().trim()
  
  // Basic email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(sanitized)) {
    throw new Error('Invalid email format')
  }
  
  return sanitized
}

/**
 * Sanitize phone number
 */
export function sanitizePhone(phone: string): string {
  if (!phone || typeof phone !== 'string') {
    return ''
  }
  
  // Remove all non-digit characters except +
  const sanitized = phone.replace(/[^\d+]/g, '')
  
  // Validate format (basic)
  if (sanitized.length < 10 || sanitized.length > 15) {
    throw new Error('Invalid phone number format')
  }
  
  return sanitized
}

/**
 * Sanitize URL
 */
export function sanitizeUrl(url: string): string {
  if (!url || typeof url !== 'string') {
    return ''
  }
  
  try {
    const parsed = new URL(url)
    
    // Only allow http and https protocols
    if (!['http:', 'https:'].includes(parsed.protocol)) {
      throw new Error('Invalid URL protocol')
    }
    
    return parsed.toString()
  } catch {
    throw new Error('Invalid URL format')
  }
}

/**
 * Sanitize filename
 */
export function sanitizeFilename(filename: string): string {
  if (!filename || typeof filename !== 'string') {
    return 'file'
  }
  
  // Remove path traversal attempts
  let sanitized = filename.replace(/\.\./g, '')
  sanitized = sanitized.replace(/\//g, '_')
  sanitized = sanitized.replace(/\\/g, '_')
  
  // Remove dangerous characters
  sanitized = sanitized.replace(/[<>:"|?*]/g, '_')
  
  // Limit length
  if (sanitized.length > 255) {
    const ext = sanitized.split('.').pop()
    sanitized = sanitized.substring(0, 255 - (ext?.length || 0) - 1) + '.' + ext
  }
  
  return sanitized || 'file'
}
