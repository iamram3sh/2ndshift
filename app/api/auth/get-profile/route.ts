import { NextRequest, NextResponse } from 'next/server'
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { supabaseAdmin } from '@/lib/supabase/admin'

export async function POST(request: NextRequest) {
  try {
    const { userId } = await request.json()
    
    if (!userId) {
      return NextResponse.json(
        { error: 'User ID required' },
        { status: 400 }
      )
    }
    
    // Create supabase client with auth - await cookies in Next.js 15+
    const cookieStore = await cookies()
    const supabase = createRouteHandlerClient({ cookies: () => cookieStore })
    
    // Verify the requesting user
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user || user.id !== userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }
    
    // Use admin client to bypass RLS and fetch profile
    const { data: profile, error } = await supabaseAdmin
      .from('users')
      .select('user_type, full_name, email')
      .eq('id', userId)
      .single()
    
    if (error || !profile) {
      console.log('Profile not found, creating new profile for user:', userId)
      
      // Try to create profile if it doesn't exist using admin client
      const { data: newProfile, error: insertError } = await supabaseAdmin
        .from('users')
        .insert({
          id: userId,
          email: user.email!,
          full_name: user.user_metadata?.full_name || user.email?.split('@')[0] || 'User',
          user_type: user.user_metadata?.user_type || 'worker',
          profile_visibility: 'public'
        })
        .select('user_type, full_name, email')
        .single()
      
      if (insertError) {
        console.error('Profile creation error:', insertError)
        
        // If duplicate, try to fetch again
        if (insertError.message?.includes('duplicate')) {
          const { data: retryProfile } = await supabaseAdmin
            .from('users')
            .select('user_type, full_name, email')
            .eq('id', userId)
            .single()
          
          if (retryProfile) {
            return NextResponse.json({ profile: retryProfile })
          }
        }
        
        return NextResponse.json(
          { error: 'Failed to create profile: ' + insertError.message },
          { status: 500 }
        )
      }
      
      if (newProfile) {
        return NextResponse.json({ profile: newProfile })
      }
      
      return NextResponse.json(
        { error: 'Profile creation failed' },
        { status: 500 }
      )
    }
    
    return NextResponse.json({ profile })
  } catch (error: any) {
    console.error('Get profile error:', error)
    return NextResponse.json(
      { error: 'Internal server error: ' + (error.message || 'Unknown error') },
      { status: 500 }
    )
  }
}
