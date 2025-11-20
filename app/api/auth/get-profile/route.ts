import { NextRequest, NextResponse } from 'next/server'
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'

export async function POST(request: NextRequest) {
  try {
    const { userId } = await request.json()
    
    if (!userId) {
      return NextResponse.json(
        { error: 'User ID required' },
        { status: 400 }
      )
    }
    
    // Create supabase client with auth
    const supabase = createRouteHandlerClient({ cookies })
    
    // Verify the requesting user
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user || user.id !== userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }
    
    // Fetch profile (this uses the authenticated session, bypassing RLS issues)
    const { data: profile, error } = await supabase
      .from('users')
      .select('user_type, full_name, email')
      .eq('id', userId)
      .single()
    
    if (error || !profile) {
      // Try to create profile if it doesn't exist
      const { error: insertError } = await supabase
        .from('users')
        .insert({
          id: userId,
          email: user.email!,
          full_name: user.user_metadata?.full_name || user.email?.split('@')[0] || 'User',
          user_type: user.user_metadata?.user_type || 'worker',
          profile_visibility: 'public'
        })
      
      if (insertError && !insertError.message?.includes('duplicate')) {
        console.error('Profile creation error:', insertError)
      }
      
      // Retry fetch
      const { data: retryProfile } = await supabase
        .from('users')
        .select('user_type, full_name, email')
        .eq('id', userId)
        .single()
      
      if (retryProfile) {
        return NextResponse.json({ profile: retryProfile })
      }
      
      return NextResponse.json(
        { error: 'Profile not found' },
        { status: 404 }
      )
    }
    
    return NextResponse.json({ profile })
  } catch (error) {
    console.error('Get profile error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
