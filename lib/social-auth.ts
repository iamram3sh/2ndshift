// Social Authentication Configuration for 2ndShift

export interface SocialAuthProvider {
  name: string
  id: 'google' | 'linkedin' | 'github' | 'apple'
  clientId: string
  clientSecret: string
  redirectUri: string
  scope: string[]
  authorizationUrl: string
  tokenUrl: string
  userInfoUrl: string
}

// Google OAuth Configuration
export const googleAuthConfig: SocialAuthProvider = {
  name: 'Google',
  id: 'google',
  clientId: process.env.GOOGLE_CLIENT_ID || '',
  clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
  redirectUri: `${process.env.NEXT_PUBLIC_APP_URL}/auth/callback/google`,
  scope: ['openid', 'email', 'profile'],
  authorizationUrl: 'https://accounts.google.com/o/oauth2/v2/auth',
  tokenUrl: 'https://oauth2.googleapis.com/token',
  userInfoUrl: 'https://www.googleapis.com/oauth2/v2/userinfo',
}

// LinkedIn OAuth Configuration
export const linkedinAuthConfig: SocialAuthProvider = {
  name: 'LinkedIn',
  id: 'linkedin',
  clientId: process.env.LINKEDIN_CLIENT_ID || '',
  clientSecret: process.env.LINKEDIN_CLIENT_SECRET || '',
  redirectUri: `${process.env.NEXT_PUBLIC_APP_URL}/auth/callback/linkedin`,
  scope: ['r_liteprofile', 'r_emailaddress'],
  authorizationUrl: 'https://www.linkedin.com/oauth/v2/authorization',
  tokenUrl: 'https://www.linkedin.com/oauth/v2/accessToken',
  userInfoUrl: 'https://api.linkedin.com/v2/me',
}

// Generate OAuth authorization URL
export function getAuthorizationUrl(provider: SocialAuthProvider, state: string): string {
  const params = new URLSearchParams({
    client_id: provider.clientId,
    redirect_uri: provider.redirectUri,
    response_type: 'code',
    scope: provider.scope.join(' '),
    state: state,
  })

  if (provider.id === 'google') {
    params.append('access_type', 'offline')
    params.append('prompt', 'consent')
  }

  return `${provider.authorizationUrl}?${params.toString()}`
}

// Exchange authorization code for access token
export async function exchangeCodeForToken(
  provider: SocialAuthProvider,
  code: string
): Promise<{ accessToken: string; refreshToken?: string }> {
  const params = new URLSearchParams({
    client_id: provider.clientId,
    client_secret: provider.clientSecret,
    code: code,
    redirect_uri: provider.redirectUri,
    grant_type: 'authorization_code',
  })

  const response = await fetch(provider.tokenUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: params.toString(),
  })

  if (!response.ok) {
    throw new Error('Failed to exchange code for token')
  }

  const data = await response.json()
  return {
    accessToken: data.access_token,
    refreshToken: data.refresh_token,
  }
}

// Get user info from provider
export async function getUserInfo(
  provider: SocialAuthProvider,
  accessToken: string
): Promise<{
  id: string
  email: string
  name: string
  picture?: string
}> {
  const response = await fetch(provider.userInfoUrl, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  })

  if (!response.ok) {
    throw new Error('Failed to fetch user info')
  }

  const data = await response.json()

  // Normalize response based on provider
  if (provider.id === 'google') {
    return {
      id: data.id,
      email: data.email,
      name: data.name,
      picture: data.picture,
    }
  } else if (provider.id === 'linkedin') {
    // LinkedIn returns data differently
    return {
      id: data.id,
      email: data.email || '', // Need to fetch separately
      name: `${data.firstName} ${data.lastName}`,
    }
  }

  throw new Error('Unsupported provider')
}

// Generate secure state parameter using cryptographically secure random
export function generateState(): string {
  if (typeof window !== 'undefined' && window.crypto && window.crypto.getRandomValues) {
    // Browser environment - use Web Crypto API
    const array = new Uint8Array(32)
    window.crypto.getRandomValues(array)
    return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('')
  } else if (typeof require !== 'undefined') {
    // Node environment - use crypto module
    const crypto = require('crypto')
    return crypto.randomBytes(32).toString('hex')
  }
  throw new Error('No secure random number generator available')
}

// Verify state parameter using constant-time comparison to prevent timing attacks
export function verifyState(state: string, storedState: string): boolean {
  if (state.length !== storedState.length) {
    return false
  }
  
  // Constant-time comparison
  let result = 0
  for (let i = 0; i < state.length; i++) {
    result |= state.charCodeAt(i) ^ storedState.charCodeAt(i)
  }
  
  return result === 0
}

// Social login button component props
export interface SocialLoginButtonProps {
  provider: 'google' | 'linkedin'
  onClick: () => void
  disabled?: boolean
}

// Helper to initiate social login
export function initiateSocialLogin(provider: 'google' | 'linkedin') {
  const state = generateState()
  
  // Store state in sessionStorage
  if (typeof window !== 'undefined') {
    sessionStorage.setItem('oauth_state', state)
  }

  const config = provider === 'google' ? googleAuthConfig : linkedinAuthConfig
  const authUrl = getAuthorizationUrl(config, state)

  // Redirect to provider
  window.location.href = authUrl
}
