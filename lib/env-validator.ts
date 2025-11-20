// Environment variable validation - run at build time
// This ensures the application doesn't start with missing critical env vars

interface EnvVar {
  key: string
  required: boolean
  description: string
  production?: boolean // Only required in production
}

const envVars: EnvVar[] = [
  {
    key: 'NEXT_PUBLIC_SUPABASE_URL',
    required: true,
    description: 'Supabase project URL'
  },
  {
    key: 'NEXT_PUBLIC_SUPABASE_ANON_KEY',
    required: true,
    description: 'Supabase anonymous key (public)'
  },
  {
    key: 'SUPABASE_SERVICE_ROLE_KEY',
    required: true,
    production: true,
    description: 'Supabase service role key (server-side only)'
  },
  {
    key: 'RAZORPAY_KEY_ID',
    required: false,
    description: 'Razorpay API Key ID'
  },
  {
    key: 'RAZORPAY_SECRET',
    required: false,
    description: 'Razorpay API Secret'
  },
  {
    key: 'NEXT_PUBLIC_APP_URL',
    required: true,
    production: true,
    description: 'Application URL'
  },
  {
    key: 'GOOGLE_CLIENT_ID',
    required: false,
    description: 'Google OAuth Client ID'
  },
  {
    key: 'GOOGLE_CLIENT_SECRET',
    required: false,
    description: 'Google OAuth Client Secret'
  },
  {
    key: 'LINKEDIN_CLIENT_ID',
    required: false,
    description: 'LinkedIn OAuth Client ID'
  },
  {
    key: 'LINKEDIN_CLIENT_SECRET',
    required: false,
    description: 'LinkedIn OAuth Client Secret'
  },
  {
    key: 'NEXT_PUBLIC_GA_MEASUREMENT_ID',
    required: false,
    description: 'Google Analytics Measurement ID'
  }
]

export function validateEnvironment() {
  const isProduction = process.env.NODE_ENV === 'production'
  const errors: string[] = []
  const warnings: string[] = []

  console.log('🔍 Validating environment variables...')
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`)

  for (const envVar of envVars) {
    const value = process.env[envVar.key]
    const isRequired = envVar.required && (!envVar.production || isProduction)

    if (isRequired && !value) {
      errors.push(`❌ Missing required environment variable: ${envVar.key} - ${envVar.description}`)
    } else if (!value) {
      warnings.push(`⚠️  Optional environment variable not set: ${envVar.key} - ${envVar.description}`)
    } else {
      // Validate format
      if (envVar.key.includes('URL') && !isValidUrl(value)) {
        errors.push(`❌ Invalid URL format for ${envVar.key}: ${value}`)
      }
      
      // Check for placeholder values
      if (value.includes('placeholder') || value.includes('your_')) {
        errors.push(`❌ Placeholder value detected for ${envVar.key}. Please set a real value.`)
      }
      
      // Security checks
      if (envVar.key.includes('SECRET') || envVar.key.includes('SERVICE_ROLE')) {
        if (value.length < 20) {
          errors.push(`❌ ${envVar.key} appears to be too short. Ensure you're using the correct value.`)
        }
      }
    }
  }

  // Print warnings
  if (warnings.length > 0) {
    console.log('\n⚠️  WARNINGS:')
    warnings.forEach(warning => console.log(warning))
  }

  // Print errors and throw if any exist in production
  if (errors.length > 0) {
    console.error('\n🚨 ENVIRONMENT VALIDATION ERRORS:')
    errors.forEach(error => console.error(error))
    
    if (isProduction) {
      throw new Error(`Environment validation failed with ${errors.length} error(s). Cannot start in production.`)
    } else {
      console.error('\n⚠️  Application may not function correctly. Please fix the errors above.')
    }
  } else {
    console.log('✅ Environment validation passed!')
  }

  // Security reminders
  if (isProduction) {
    console.log('\n🔒 Production Security Checklist:')
    console.log('   ✓ Ensure all secrets are properly secured')
    console.log('   ✓ HTTPS is enforced')
    console.log('   ✓ CORS is configured correctly')
    console.log('   ✓ Rate limiting is enabled')
    console.log('   ✓ Database RLS policies are active')
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings
  }
}

function isValidUrl(url: string): boolean {
  try {
    new URL(url)
    return true
  } catch {
    return false
  }
}

// Export for use in next.config or other build scripts
export default validateEnvironment

// Auto-run validation if this file is executed directly
if (require.main === module) {
  validateEnvironment()
}
