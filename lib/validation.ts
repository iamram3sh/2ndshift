// Input validation and sanitization utilities
import { z } from 'zod'

// Environment validation schema
export const envSchema = z.object({
  NEXT_PUBLIC_SUPABASE_URL: z.string().url(),
  NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string().min(1),
  SUPABASE_SERVICE_ROLE_KEY: z.string().min(1).optional(),
  RAZORPAY_KEY_ID: z.string().min(1).optional(),
  RAZORPAY_SECRET: z.string().min(1).optional(),
  NEXT_PUBLIC_APP_URL: z.string().url().optional(),
  GOOGLE_CLIENT_ID: z.string().optional(),
  GOOGLE_CLIENT_SECRET: z.string().optional(),
  LINKEDIN_CLIENT_ID: z.string().optional(),
  LINKEDIN_CLIENT_SECRET: z.string().optional(),
})

// Validate environment variables
export function validateEnv() {
  try {
    envSchema.parse(process.env)
    return { success: true, errors: null }
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { success: false, errors: error.issues }
    }
    return { success: false, errors: [{ message: 'Unknown validation error' }] }
  }
}

// API Request validation schemas
export const paymentRequestSchema = z.object({
  contractId: z.string().uuid(),
  amount: z.number().positive().min(1).max(10000000), // Max 1 crore
})

export const projectCreateSchema = z.object({
  title: z.string().min(3).max(200),
  description: z.string().min(10).max(5000),
  budget: z.number().positive().min(100).max(10000000),
  required_skills: z.array(z.string()).min(1).max(20),
  duration_hours: z.number().positive().min(1).max(10000),
  deadline: z.string().datetime().optional(),
})

export const userUpdateSchema = z.object({
  full_name: z.string().min(2).max(100),
  phone: z.string().regex(/^[6-9]\d{9}$/).optional(), // Indian phone number
  pan_number: z.string().regex(/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/).optional(), // PAN format
})

export const loginSchema = z.object({
  email: z.string().email().max(255),
  password: z.string().min(8).max(128),
})

export const registerSchema = z.object({
  fullName: z.string().min(2).max(100),
  email: z.string().email().max(255),
  password: z.string()
    .min(8)
    .max(128)
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&#]/, 
      'Password must contain uppercase, lowercase, number, and special character'),
  confirmPassword: z.string(),
  userType: z.enum(['worker', 'client']),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
})

// Sanitize HTML to prevent XSS
export function sanitizeHtml(input: string): string {
  // Remove all HTML tags and dangerous characters
  return input
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, '')
    .replace(/<object\b[^<]*(?:(?!<\/object>)<[^<]*)*<\/object>/gi, '')
    .replace(/<embed\b[^<]*(?:(?!<\/embed>)<[^<]*)*<\/embed>/gi, '')
    .replace(/<[^>]*>/g, '')
    .replace(/javascript:/gi, '')
    .replace(/on\w+\s*=/gi, '')
    .trim()
}

// Validate and sanitize user input
export function sanitizeUserInput(input: string, maxLength: number = 1000): string {
  if (!input) return ''
  
  let sanitized = sanitizeHtml(input)
  
  // Truncate to max length
  if (sanitized.length > maxLength) {
    sanitized = sanitized.substring(0, maxLength)
  }
  
  return sanitized
}

// Check if password is in common password list (basic implementation)
const commonPasswords = [
  'password', '12345678', 'qwerty123', 'abc123456', 'password123',
  'admin123', 'welcome123', 'letmein123', 'monkey123', '1234567890'
]

export function isCommonPassword(password: string): boolean {
  const lowerPassword = password.toLowerCase()
  return commonPasswords.some(common => lowerPassword.includes(common))
}

// Validate file upload
export function validateFileUpload(file: File, options: {
  maxSize?: number, // in bytes
  allowedTypes?: string[]
} = {}) {
  const maxSize = options.maxSize || 5 * 1024 * 1024 // 5MB default
  const allowedTypes = options.allowedTypes || ['image/jpeg', 'image/png', 'image/webp', 'application/pdf']
  
  const errors: string[] = []
  
  if (file.size > maxSize) {
    errors.push(`File size must be less than ${maxSize / (1024 * 1024)}MB`)
  }
  
  if (!allowedTypes.includes(file.type)) {
    errors.push(`File type must be one of: ${allowedTypes.join(', ')}`)
  }
  
  // Check file extension matches MIME type
  const extension = file.name.split('.').pop()?.toLowerCase()
  const mimeExtensionMap: Record<string, string[]> = {
    'image/jpeg': ['jpg', 'jpeg'],
    'image/png': ['png'],
    'image/webp': ['webp'],
    'application/pdf': ['pdf']
  }
  
  const expectedExtensions = mimeExtensionMap[file.type]
  if (expectedExtensions && extension && !expectedExtensions.includes(extension)) {
    errors.push('File extension does not match file type')
  }
  
  return {
    valid: errors.length === 0,
    errors
  }
}

// Rate limit check helper
export function checkRateLimitResponse(response: Response): boolean {
  return response.status === 429
}

// Generate CSRF token (for future use)
export function generateCSRFToken(): string {
  if (typeof window !== 'undefined' && window.crypto) {
    const array = new Uint8Array(32)
    window.crypto.getRandomValues(array)
    return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('')
  }
  throw new Error('CSRF token generation requires browser crypto API')
}
