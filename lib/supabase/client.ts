import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { createClient } from '@supabase/supabase-js'

// Create Supabase client with environment variables
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || ''

export const supabase = supabaseUrl && supabaseAnonKey 
  ? createClientComponentClient()
  : createClient(
      'https://placeholder.supabase.co',
      'placeholder-key',
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false
        }
      }
    )

// For server-side operations
export const supabaseAdmin = supabaseUrl && supabaseServiceKey
  ? createClient(
      supabaseUrl,
      supabaseServiceKey,
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false
        }
      }
    )
  : createClient(
      'https://placeholder.supabase.co',
      'placeholder-key',
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false
        }
      }
    )