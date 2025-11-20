import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')
  const next = requestUrl.searchParams.get('next') || '/login'

  if (code) {
    const supabase = createRouteHandlerClient({ cookies })
    
    try {
      await supabase.auth.exchangeCodeForSession(code)
      
      // Redirect to login with success message
      return NextResponse.redirect(
        new URL('/login?verified=true', requestUrl.origin)
      )
    } catch (error) {
      console.error('Email confirmation error:', error)
      // Redirect to login with error
      return NextResponse.redirect(
        new URL('/login?error=verification_failed', requestUrl.origin)
      )
    }
  }

  // If no code, redirect to home
  return NextResponse.redirect(new URL('/', requestUrl.origin))
}
