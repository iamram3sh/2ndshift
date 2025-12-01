import { createClient, SupabaseClient } from '@supabase/supabase-js'

// Validate environment variables
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

// Log warning if environment variables are missing (but don't throw during build)
if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('⚠️ Supabase environment variables not configured. Auth will not work.')
  console.warn('Please set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY')
}

// Lazy initialization to avoid issues during build time
let _supabase: SupabaseClient | null = null

function getSupabaseClient(): SupabaseClient {
  if (_supabase) {
    return _supabase
  }

  // Create Supabase client for client-side operations
  _supabase = createClient(
    supabaseUrl || 'https://placeholder.supabase.co',
    supabaseAnonKey || 'placeholder-key',
    {
      auth: {
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: true
      }
    }
  )

  return _supabase
}

// Export as a proxy for lazy initialization
export const supabase = new Proxy({} as SupabaseClient, {
  get(_, prop) {
    const client = getSupabaseClient()
    const value = (client as any)[prop]
    if (typeof value === 'function') {
      return value.bind(client)
    }
    return value
  }
})

// NOTE: Service role operations should ONLY be done server-side
// This file is for CLIENT-SIDE operations only
// For admin operations, use lib/supabase/admin.ts (server-side only)