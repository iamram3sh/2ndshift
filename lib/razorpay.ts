import Razorpay from 'razorpay'

const razorpayKeyId = process.env.RAZORPAY_KEY_ID || 'placeholder-key'
const razorpaySecret = process.env.RAZORPAY_SECRET || 'placeholder-secret'

export const razorpay = new Razorpay({
  key_id: razorpayKeyId,
  key_secret: razorpaySecret,
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