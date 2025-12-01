// SERVER-SIDE ONLY - Admin Supabase client with service role
// DO NOT import this in client-side code

import { createClient, SupabaseClient } from '@supabase/supabase-js'

// Lazy initialization to prevent build-time errors
let _supabaseAdmin: SupabaseClient | null = null

function getSupabaseAdmin(): SupabaseClient {
  if (_supabaseAdmin) return _supabaseAdmin
  
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!supabaseUrl || !supabaseServiceKey) {
    // During build time, return a placeholder client
    // It won't be used for actual operations during build
    console.warn('⚠️ Admin Supabase client not configured. Using placeholder for build.')
    return createClient(
      'https://placeholder.supabase.co',
      'placeholder-key',
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false
        }
      }
    )
  }

  // Create admin client with service role privileges
  // WARNING: This bypasses Row Level Security (RLS)
  _supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  })
  
  return _supabaseAdmin
}

// Export as a getter to ensure lazy initialization
export const supabaseAdmin = new Proxy({} as SupabaseClient, {
  get(_, prop) {
    return getSupabaseAdmin()[prop as keyof SupabaseClient]
  }
})

// Helper function to verify this is only used server-side
export function ensureServerSide() {
  if (typeof window !== 'undefined') {
    throw new Error('SECURITY ERROR: Admin client must only be used server-side')
  }
}
