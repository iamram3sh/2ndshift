/**
 * Test script to verify registration and login functionality
 * Run with: tsx scripts/test-registration-login.ts
 */

import apiClient from '../lib/apiClient'

const BASE_URL = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'

async function testRegistrationAndLogin() {
  console.log('🧪 Testing Registration and Login Flow\n')

  // Generate unique email for testing
  const timestamp = Date.now()
  const testEmail = `test-${timestamp}@example.com`
  const testPassword = 'Test1234!'
  const testName = 'Test User'

  try {
    // Test 1: Register as Worker
    console.log('1️⃣ Testing Worker Registration...')
    const workerRegisterResult = await apiClient.register({
      role: 'worker',
      email: testEmail,
      password: testPassword,
      name: testName,
    })

    if (workerRegisterResult.error) {
      console.error('❌ Worker registration failed:', workerRegisterResult.error)
      return
    }

    if (workerRegisterResult.data?.user && workerRegisterResult.data?.access_token) {
      console.log('✅ Worker registration successful!')
      console.log('   User ID:', workerRegisterResult.data.user.id)
      console.log('   Email:', workerRegisterResult.data.user.email)
      console.log('   Role:', workerRegisterResult.data.user.role)
      console.log('   Access Token:', workerRegisterResult.data.access_token.substring(0, 20) + '...')
    } else {
      console.error('❌ Worker registration response missing user or token')
      return
    }

    // Test 2: Login with registered credentials
    console.log('\n2️⃣ Testing Login...')
    const loginResult = await apiClient.login(testEmail, testPassword)

    if (loginResult.error) {
      console.error('❌ Login failed:', loginResult.error)
      return
    }

    if (loginResult.data?.user && loginResult.data?.access_token) {
      console.log('✅ Login successful!')
      console.log('   User ID:', loginResult.data.user.id)
      console.log('   Email:', loginResult.data.user.email)
      console.log('   Role:', loginResult.data.user.role)
      console.log('   Access Token:', loginResult.data.access_token.substring(0, 20) + '...')
    } else {
      console.error('❌ Login response missing user or token')
      return
    }

    // Test 3: Get current user (verify token works)
    console.log('\n3️⃣ Testing Get Current User...')
    const meResult = await apiClient.getCurrentUser()

    if (meResult.error) {
      console.error('❌ Get current user failed:', meResult.error)
      return
    }

    if (meResult.data?.user) {
      console.log('✅ Get current user successful!')
      console.log('   User ID:', meResult.data.user.id)
      console.log('   Email:', meResult.data.user.email)
      console.log('   Role:', meResult.data.user.role)
    } else {
      console.error('❌ Get current user response missing user')
      return
    }

    // Test 4: Register as Client
    console.log('\n4️⃣ Testing Client Registration...')
    const clientEmail = `client-${timestamp}@example.com`
    const clientRegisterResult = await apiClient.register({
      role: 'client',
      email: clientEmail,
      password: testPassword,
      name: 'Test Client',
    })

    if (clientRegisterResult.error) {
      console.error('❌ Client registration failed:', clientRegisterResult.error)
      return
    }

    if (clientRegisterResult.data?.user && clientRegisterResult.data?.access_token) {
      console.log('✅ Client registration successful!')
      console.log('   User ID:', clientRegisterResult.data.user.id)
      console.log('   Email:', clientRegisterResult.data.user.email)
      console.log('   Role:', clientRegisterResult.data.user.role)
    } else {
      console.error('❌ Client registration response missing user or token')
      return
    }

    // Test 5: Login as Client
    console.log('\n5️⃣ Testing Client Login...')
    const clientLoginResult = await apiClient.login(clientEmail, testPassword)

    if (clientLoginResult.error) {
      console.error('❌ Client login failed:', clientLoginResult.error)
      return
    }

    if (clientLoginResult.data?.user && clientLoginResult.data?.access_token) {
      console.log('✅ Client login successful!')
      console.log('   User ID:', clientLoginResult.data.user.id)
      console.log('   Email:', clientLoginResult.data.user.email)
      console.log('   Role:', clientLoginResult.data.user.role)
    } else {
      console.error('❌ Client login response missing user or token')
      return
    }

    console.log('\n✅ All tests passed! Registration and login are working correctly.')
    console.log('\n📝 Test Credentials:')
    console.log(`   Worker: ${testEmail} / ${testPassword}`)
    console.log(`   Client: ${clientEmail} / ${testPassword}`)

  } catch (error: any) {
    console.error('❌ Test failed with error:', error.message)
    console.error(error)
  }
}

// Run tests
testRegistrationAndLogin()
