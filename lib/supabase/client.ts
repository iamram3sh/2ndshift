import { createClient, SupabaseClient } from '@supabase/supabase-js'

// Lazy initialization to prevent build-time errors
let _supabase: SupabaseClient | null = null

function getSupabaseClient(): SupabaseClient {
  if (_supabase) return _supabase
  
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseAnonKey) {
    // During build or when env vars missing, use placeholder
    console.warn('⚠️ Supabase environment variables not configured. Using placeholder.')
    return createClient(
      'https://placeholder.supabase.co',
      'placeholder-key',
      {
        auth: {
          autoRefreshToken: true,
          persistSession: true,
          detectSessionInUrl: true
        }
      }
    )
  }

  // Create Supabase client for client-side operations
  _supabase = createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: true
    }
  })
  
  return _supabase
}

// Export as a proxy for lazy initialization
export const supabase = new Proxy({} as SupabaseClient, {
  get(_, prop) {
    return getSupabaseClient()[prop as keyof SupabaseClient]
  }
})

// NOTE: Service role operations should ONLY be done server-side
// This file is for CLIENT-SIDE operations only
// For admin operations, use lib/supabase/admin.ts (server-side only)