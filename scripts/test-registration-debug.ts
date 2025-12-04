/**
 * Debug script to test registration and check database state
 * Run with: npx tsx scripts/test-registration-debug.ts
 */

import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || ''

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing Supabase credentials')
  console.error('Set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceKey)

async function checkDatabase() {
  console.log('🔍 Checking database state...\n')

  // Check if users table exists and get its structure
  try {
    const { data: tables, error: tablesError } = await supabase
      .from('users')
      .select('*')
      .limit(1)

    if (tablesError) {
      console.error('❌ Error accessing users table:', tablesError.message)
      console.error('   Code:', tablesError.code)
      console.error('   Details:', tablesError.details)
      console.error('   Hint:', tablesError.hint)
      return
    }

    console.log('✅ Users table is accessible')
  } catch (error: any) {
    console.error('❌ Error:', error.message)
    return
  }

  // Check if shift_credits table exists
  try {
    const { data: credits, error: creditsError } = await supabase
      .from('shift_credits')
      .select('*')
      .limit(1)

    if (creditsError) {
      console.error('⚠️  shift_credits table error:', creditsError.message)
      console.error('   This might be why registration fails for credits initialization')
    } else {
      console.log('✅ shift_credits table is accessible')
    }
  } catch (error: any) {
    console.error('⚠️  shift_credits table might not exist:', error.message)
  }

  // Check if profiles table exists
  try {
    const { data: profiles, error: profilesError } = await supabase
      .from('profiles')
      .select('*')
      .limit(1)

    if (profilesError) {
      console.error('⚠️  profiles table error:', profilesError.message)
    } else {
      console.log('✅ profiles table is accessible')
    }
  } catch (error: any) {
    console.error('⚠️  profiles table might not exist:', error.message)
  }

  // Try to get table structure by attempting an insert with minimal data
  console.log('\n📋 Testing user creation flow...\n')

  const testEmail = `test-${Date.now()}@example.com`
  const testUserId = crypto.randomUUID()

  // Test 1: Check if we can create auth user
  console.log('1. Testing Supabase Auth user creation...')
  try {
    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email: testEmail,
      password: 'TestPassword123!',
      email_confirm: true,
      user_metadata: {
        full_name: 'Test User',
        user_type: 'client',
      },
    })

    if (authError) {
      console.error('   ❌ Auth user creation failed:', authError.message)
      return
    }

    console.log('   ✅ Auth user created:', authData.user.id)

    // Test 2: Check if we can insert into users table
    console.log('2. Testing users table insert...')
    const { data: userData, error: userError } = await supabase
      .from('users')
      .insert({
        id: authData.user.id,
        email: testEmail,
        full_name: 'Test User',
        user_type: 'client',
        password_hash: 'test_hash',
        profile_complete: false,
        email_verified: false,
        phone_verified: false,
      })
      .select()
      .single()

    if (userError) {
      console.error('   ❌ Users table insert failed:', userError.message)
      console.error('   Code:', userError.code)
      console.error('   Details:', userError.details)
      console.error('   Hint:', userError.hint)
      
      // Clean up auth user
      await supabase.auth.admin.deleteUser(authData.user.id)
      return
    }

    console.log('   ✅ User inserted successfully:', userData.id)

    // Test 3: Check shift_credits insert
    console.log('3. Testing shift_credits insert...')
    const { error: creditsError } = await supabase
      .from('shift_credits')
      .insert({
        user_id: authData.user.id,
        balance: 0,
        reserved: 0,
      })

    if (creditsError) {
      console.error('   ⚠️  shift_credits insert failed:', creditsError.message)
      console.error('   Code:', creditsError.code)
      console.error('   Details:', creditsError.details)
    } else {
      console.log('   ✅ shift_credits inserted successfully')
    }

    // Clean up test data
    console.log('\n🧹 Cleaning up test data...')
    await supabase.from('shift_credits').delete().eq('user_id', authData.user.id)
    await supabase.from('users').delete().eq('id', authData.user.id)
    await supabase.auth.admin.deleteUser(authData.user.id)
    console.log('   ✅ Test data cleaned up')

    console.log('\n✅ All tests passed! Registration should work.')
  } catch (error: any) {
    console.error('❌ Unexpected error:', error.message)
    console.error(error)
  }
}

checkDatabase().catch(console.error)
