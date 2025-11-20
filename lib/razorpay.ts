import Razorpay from 'razorpay'

// Lazy-initialize Razorpay client only when needed to avoid build-time errors
let razorpayInstance: Razorpay | null = null

function getRazorpayClient(): Razorpay {
  if (!razorpayInstance) {
    const razorpayKeyId = process.env.RAZORPAY_KEY_ID || 'placeholder-key'
    const razorpaySecret = process.env.RAZORPAY_SECRET || 'placeholder-secret'
    
    razorpayInstance = new Razorpay({
      key_id: razorpayKeyId,
      key_secret: razorpaySecret,
    })
  }
  return razorpayInstance
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