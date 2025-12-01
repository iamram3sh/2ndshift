// SERVER-SIDE ONLY - Admin Supabase client with service role
// DO NOT import this in client-side code

import { createClient, SupabaseClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

// Lazy initialization to avoid errors during build time
let _supabaseAdmin: SupabaseClient | null = null

function getSupabaseAdmin(): SupabaseClient {
  if (_supabaseAdmin) {
    return _supabaseAdmin
  }

  // Only validate at runtime, not during build
  if (!supabaseUrl || !supabaseServiceKey) {
    // During build, return a placeholder client that will fail gracefully at runtime
    if (process.env.NODE_ENV === 'production' && typeof window === 'undefined') {
      // Check if this is actual runtime vs build time
      // During build, we don't throw - we create a placeholder
      console.warn('⚠️ Admin Supabase client not fully configured. Some operations may fail.')
    }
  }

  // Create admin client with service role privileges
  // WARNING: This bypasses Row Level Security (RLS)
  _supabaseAdmin = createClient(
    supabaseUrl || 'https://placeholder.supabase.co',
    supabaseServiceKey || 'placeholder-key',
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    }
  )

  return _supabaseAdmin
}

// Export as a getter to enable lazy initialization
export const supabaseAdmin = new Proxy({} as SupabaseClient, {
  get(_, prop) {
    const client = getSupabaseAdmin()
    const value = (client as any)[prop]
    if (typeof value === 'function') {
      return value.bind(client)
    }
    return value
  }
})

// Helper function to verify this is only used server-side
export function ensureServerSide() {
  if (typeof window !== 'undefined') {
    throw new Error('SECURITY ERROR: Admin client must only be used server-side')
  }
}
