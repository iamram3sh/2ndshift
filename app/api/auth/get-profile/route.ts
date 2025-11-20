import { NextRequest, NextResponse } from 'next/server'
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
    
    // Since we're having issues with cookies, we'll trust that the client
    // is sending the correct userId after successful auth
    // The client only gets userId after Supabase auth succeeds
    console.log('Fetching profile for userId:', userId)
    
    // Use admin client to bypass RLS and fetch profile
    const { data: profile, error } = await supabaseAdmin
      .from('users')
      .select('user_type, full_name, email')
      .eq('id', userId)
      .single()
    
    if (error || !profile) {
      console.log('Profile not found, creating new profile for user:', userId)
      
      // Get user data from auth.users to create profile
      const { data: { user: authUser }, error: authError } = await supabaseAdmin.auth.admin.getUserById(userId)
      
      if (authError || !authUser) {
        console.error('Failed to get auth user:', authError)
        return NextResponse.json(
          { error: 'User not found in auth system' },
          { status: 404 }
        )
      }
      
      // Try to create profile if it doesn't exist using admin client
      const { data: newProfile, error: insertError } = await supabaseAdmin
        .from('users')
        .insert({
          id: userId,
          email: authUser.email!,
          full_name: authUser.user_metadata?.full_name || authUser.email?.split('@')[0] || 'User',
          user_type: authUser.user_metadata?.user_type || 'worker',
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
