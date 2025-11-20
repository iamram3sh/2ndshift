// SERVER-SIDE ONLY - Admin Supabase client with service role
// DO NOT import this in client-side code

import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

// Strict validation for admin client
if (!supabaseUrl || !supabaseServiceKey) {
  if (process.env.NODE_ENV === 'production') {
    throw new Error('CRITICAL: Service role key must be configured for admin operations')
  }
  console.warn('⚠️ Admin Supabase client not configured. Admin operations will not work.')
}

// Create admin client with service role privileges
// WARNING: This bypasses Row Level Security (RLS)
export const supabaseAdmin = createClient(
  supabaseUrl || 'https://placeholder.supabase.co',
  supabaseServiceKey || 'placeholder-key',
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  }
)

// Helper function to verify this is only used server-side
export function ensureServerSide() {
  if (typeof window !== 'undefined') {
    throw new Error('SECURITY ERROR: Admin client must only be used server-side')
  }
}
