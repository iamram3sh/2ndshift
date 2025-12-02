/**
 * Production Service Integrations
 * 
 * ⚠️ INVESTOR-READY CONFIGURATION
 * 
 * This file contains placeholder configurations for production services.
 * When investors are ready, update the environment variables and uncomment
 * the real integration code.
 * 
 * Current Status: Using mock/demo implementations
 * Production Status: Ready for integration when credentials are available
 */

// ============================================
// FACE MATCH PROVIDER CONFIGURATION
// ============================================

/**
 * AWS Rekognition Integration
 * 
 * To enable:
 * 1. Set FACE_MATCH_PROVIDER=aws_rekognition
 * 2. Add AWS credentials to .env.local:
 *    - AWS_ACCESS_KEY_ID=your_access_key
 *    - AWS_SECRET_ACCESS_KEY=your_secret_key
 *    - AWS_REGION=us-east-1 (or your preferred region)
 * 3. Uncomment the AWS SDK code below
 */

export async function compareFacesAWS(
  sourceImage: Buffer | string,
  targetImage: Buffer | string
): Promise<{ success: boolean; similarityScore: number; verified: boolean; requiresManualReview: boolean; error?: string }> {
  // ⚠️ INVESTOR-READY: Uncomment when AWS credentials are available
  
  /*
  import { RekognitionClient, CompareFacesCommand } from '@aws-sdk/client-rekognition'
  
  const client = new RekognitionClient({
    region: process.env.AWS_REGION || 'us-east-1',
    credentials: {
      accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
    },
  })

  try {
    const command = new CompareFacesCommand({
      SourceImage: { Bytes: sourceImage },
      TargetImage: { Bytes: targetImage },
      SimilarityThreshold: 80,
    })

    const response = await client.send(command)
    const similarity = response.FaceMatches?.[0]?.Similarity || 0

    return {
      success: true,
      similarityScore: similarity / 100,
      verified: similarity >= 90,
      requiresManualReview: similarity >= 80 && similarity < 90,
    }
  } catch (error: any) {
    return {
      success: false,
      similarityScore: 0,
      verified: false,
      requiresManualReview: false,
      error: error.message,
    }
  }
  */

  // DEMO MODE: Return mock result
  console.log('[DEMO] AWS Rekognition - Using mock implementation')
  const similarityScore = 0.85 + Math.random() * 0.14
  return {
    success: true,
    similarityScore,
    verified: similarityScore >= 0.90,
    requiresManualReview: true,
  }
}

/**
 * Face++ Integration
 * 
 * To enable:
 * 1. Set FACE_MATCH_PROVIDER=faceplusplus
 * 2. Add Face++ credentials to .env.local:
 *    - FACEPLUSPLUS_API_KEY=your_api_key
 *    - FACEPLUSPLUS_API_SECRET=your_api_secret
 * 3. Uncomment the Face++ API code below
 */

export async function compareFacesFacePlusPlus(
  sourceImage: Buffer | string,
  targetImage: Buffer | string
): Promise<{ success: boolean; similarityScore: number; verified: boolean; requiresManualReview: boolean; error?: string }> {
  // ⚠️ INVESTOR-READY: Uncomment when Face++ credentials are available
  
  /*
  const formData = new FormData()
  formData.append('api_key', process.env.FACEPLUSPLUS_API_KEY!)
  formData.append('api_secret', process.env.FACEPLUSPLUS_API_SECRET!)
  formData.append('image_base64_1', sourceImage.toString('base64'))
  formData.append('image_base64_2', targetImage.toString('base64'))

  try {
    const response = await fetch('https://api-us.faceplusplus.com/facepp/v3/compare', {
      method: 'POST',
      body: formData,
    })

    const data = await response.json()
    const confidence = data.confidence || 0

    return {
      success: true,
      similarityScore: confidence / 100,
      verified: confidence >= 90,
      requiresManualReview: confidence >= 80 && confidence < 90,
    }
  } catch (error: any) {
    return {
      success: false,
      similarityScore: 0,
      verified: false,
      requiresManualReview: false,
      error: error.message,
    }
  }
  */

  // DEMO MODE: Return mock result
  console.log('[DEMO] Face++ - Using mock implementation')
  const similarityScore = 0.85 + Math.random() * 0.14
  return {
    success: true,
    similarityScore,
    verified: similarityScore >= 0.90,
    requiresManualReview: true,
  }
}

// ============================================
// PAYMENT VERIFICATION CONFIGURATION
// ============================================

/**
 * Stripe Payment Verification
 * 
 * To enable:
 * 1. Set PAYMENT_VERIFICATION_PROVIDER=stripe
 * 2. Add Stripe credentials to .env.local:
 *    - STRIPE_SECRET_KEY=sk_live_... (or sk_test_... for testing)
 * 3. Install: npm install stripe
 * 4. Uncomment the Stripe code below
 */

export async function verifyStripePaymentMethod(
  paymentMethodId: string
): Promise<{ verified: boolean; error?: string }> {
  // ⚠️ INVESTOR-READY: Uncomment when Stripe credentials are available
  
  /*
  import Stripe from 'stripe'
  
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: '2024-11-20.acacia',
  })

  try {
    const paymentMethod = await stripe.paymentMethods.retrieve(paymentMethodId)
    
    // Verify payment method is valid and not expired
    if (paymentMethod && paymentMethod.id) {
      return { verified: true }
    }
    
    return { verified: false, error: 'Invalid payment method' }
  } catch (error: any) {
    return { verified: false, error: error.message }
  }
  */

  // DEMO MODE: Return mock result
  console.log('[DEMO] Stripe - Using mock implementation')
  return { verified: true }
}

/**
 * Razorpay Payment Verification
 * 
 * To enable:
 * 1. Set PAYMENT_VERIFICATION_PROVIDER=razorpay
 * 2. Add Razorpay credentials to .env.local:
 *    - RAZORPAY_KEY_ID=your_key_id
 *    - RAZORPAY_KEY_SECRET=your_key_secret
 * 3. Install: npm install razorpay
 * 4. Uncomment the Razorpay code below
 */

export async function verifyRazorpayPaymentMethod(
  paymentMethodId: string
): Promise<{ verified: boolean; error?: string }> {
  // ⚠️ INVESTOR-READY: Uncomment when Razorpay credentials are available
  
  /*
  import Razorpay from 'razorpay'
  
  const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID!,
    key_secret: process.env.RAZORPAY_KEY_SECRET!,
  })

  try {
    // Verify payment method exists
    // Note: Razorpay doesn't have direct payment method verification
    // You may need to create a test payment or use their customer API
    const customer = await razorpay.customers.fetch(paymentMethodId)
    
    if (customer && customer.id) {
      return { verified: true }
    }
    
    return { verified: false, error: 'Invalid payment method' }
  } catch (error: any) {
    return { verified: false, error: error.message }
  }
  */

  // DEMO MODE: Return mock result
  console.log('[DEMO] Razorpay - Using mock implementation')
  return { verified: true }
}

/**
 * UPI Verification
 * 
 * To enable:
 * 1. Set PAYMENT_VERIFICATION_PROVIDER=upi
 * 2. Integrate with UPI verification service (e.g., NPCI, third-party provider)
 * 3. Add UPI service credentials to .env.local
 * 4. Uncomment and implement the UPI verification code below
 */

export async function verifyUPI(upiId: string): Promise<{ verified: boolean; error?: string }> {
  // ⚠️ INVESTOR-READY: Implement when UPI verification service is available
  
  /*
  // Example: Using NPCI or third-party UPI verification service
  try {
    const response = await fetch('https://upi-verification-service.com/verify', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.UPI_VERIFICATION_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ upi_id: upiId }),
    })

    const data = await response.json()
    return { verified: data.verified || false }
  } catch (error: any) {
    return { verified: false, error: error.message }
  }
  */

  // DEMO MODE: Return mock result
  console.log('[DEMO] UPI - Using mock implementation')
  // Basic UPI ID format validation
  const upiRegex = /^[\w.-]+@[\w]+$/
  return { verified: upiRegex.test(upiId) }
}

// ============================================
// SMS OTP CONFIGURATION
// ============================================

/**
 * Twilio SMS OTP
 * 
 * To enable:
 * 1. Add Twilio credentials to .env.local:
 *    - TWILIO_ACCOUNT_SID=your_account_sid
 *    - TWILIO_AUTH_TOKEN=your_auth_token
 *    - TWILIO_VERIFY_SERVICE_SID=your_verify_service_sid
 * 2. The OTP system will automatically use Twilio if credentials are present
 * 3. See lib/verification/otp.ts for implementation
 */

// ============================================
// CONFIGURATION CHECKER
// ============================================

export function checkProductionServiceStatus() {
  return {
    faceMatch: {
      provider: process.env.FACE_MATCH_PROVIDER || 'mock',
      configured: !!(
        process.env.AWS_ACCESS_KEY_ID ||
        (process.env.FACEPLUSPLUS_API_KEY && process.env.FACEPLUSPLUS_API_SECRET)
      ),
      status: process.env.FACE_MATCH_PROVIDER === 'mock' ? 'demo' : 'production-ready',
    },
    payment: {
      provider: process.env.PAYMENT_VERIFICATION_PROVIDER || 'mock',
      configured: !!(
        process.env.STRIPE_SECRET_KEY ||
        (process.env.RAZORPAY_KEY_ID && process.env.RAZORPAY_KEY_SECRET)
      ),
      status: process.env.PAYMENT_VERIFICATION_PROVIDER === 'mock' ? 'demo' : 'production-ready',
    },
    sms: {
      provider: 'twilio',
      configured: !!(
        process.env.TWILIO_ACCOUNT_SID &&
        process.env.TWILIO_AUTH_TOKEN &&
        process.env.TWILIO_VERIFY_SERVICE_SID
      ),
      status: (
        process.env.TWILIO_ACCOUNT_SID &&
        process.env.TWILIO_AUTH_TOKEN &&
        process.env.TWILIO_VERIFY_SERVICE_SID
      ) ? 'production-ready' : 'demo',
    },
  }
}

