import Razorpay from 'razorpay'

// Lazy-initialize Razorpay client only when needed to avoid build-time errors
let razorpayInstance: Razorpay | null = null

function getRazorpayClient(): Razorpay {
  if (!razorpayInstance) {
    const razorpayKeyId = process.env.RAZORPAY_KEY_ID || ''
    const razorpaySecret = process.env.RAZORPAY_SECRET || ''
    
    // Check if Razorpay is properly configured
    const isConfigured = 
      razorpayKeyId && 
      razorpaySecret &&
      !razorpayKeyId.includes('placeholder') &&
      !razorpaySecret.includes('placeholder') &&
      razorpayKeyId !== '' &&
      razorpaySecret !== ''
    
    if (!isConfigured) {
      if (process.env.NODE_ENV === 'production') {
        throw new Error('Razorpay credentials not configured. Set RAZORPAY_KEY_ID and RAZORPAY_SECRET environment variables.')
      }
      // In development, use placeholder but log warning
      console.warn('⚠️  Razorpay credentials not configured. Using placeholder. Payments will not work.')
    }
    
    razorpayInstance = new Razorpay({
      key_id: razorpayKeyId || 'rzp_test_placeholder',
      key_secret: razorpaySecret || 'placeholder_secret',
    })
  }
  return razorpayInstance
}

/**
 * Check if Razorpay is properly configured
 */
export function isRazorpayConfigured(): boolean {
  const keyId = process.env.RAZORPAY_KEY_ID || ''
  const secret = process.env.RAZORPAY_SECRET || ''
  
  return !!(
    keyId &&
    secret &&
    !keyId.includes('placeholder') &&
    !secret.includes('placeholder') &&
    keyId !== '' &&
    secret !== ''
  )
}

// Export for backward compatibility
export const razorpay = new Proxy({} as Razorpay, {
  get: (target, prop) => {
    const client = getRazorpayClient()
    return client[prop as keyof Razorpay]
  }
})

export interface PaymentBreakdown {
  grossAmount: number
  platformFee: number
  tdsAmount: number
  gstAmount: number
  netAmount: number
}

export function calculatePaymentBreakdown(contractAmount: number): PaymentBreakdown {
  const platformFeePercentage = 10 // 10%
  const tdsPercentage = 10 // 10%
  const gstPercentage = 18 // 18% on platform fee
  
  const platformFee = (contractAmount * platformFeePercentage) / 100
  const tdsAmount = (contractAmount * tdsPercentage) / 100
  const gstAmount = (platformFee * gstPercentage) / 100
  const netAmount = contractAmount - platformFee - tdsAmount
  
  return {
    grossAmount: contractAmount,
    platformFee,
    tdsAmount,
    gstAmount,
    netAmount: Math.round(netAmount * 100) / 100
  }
}