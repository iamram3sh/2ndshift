import Razorpay from 'razorpay'

const hasLiveCredentials =
  Boolean(process.env.RAZORPAY_KEY_ID) &&
  Boolean(process.env.RAZORPAY_SECRET) &&
  !String(process.env.RAZORPAY_KEY_ID).includes('placeholder')

type RazorpayOrdersCreateArgs = Parameters<Razorpay['orders']['create']>[0]
type RazorpayTransfersCreateArgs = Parameters<Razorpay['transfers']['create']>[0]

const createMockRazorpay = () => {
  const randomId = (prefix: string) => `${prefix}_${Math.random().toString(36).slice(2, 10)}`
  const log = (operation: string) => {
    console.warn(`[MockRazorpay] ${operation} invoked without live credentials. Update lib/razorpay.ts when ready.`)
  }

  return {
    orders: {
      create: async (payload: RazorpayOrdersCreateArgs) => {
        log('orders.create')
        return {
          id: randomId('order'),
          entity: 'order',
          amount: payload?.amount ?? 0,
          currency: payload?.currency ?? 'INR',
          receipt: payload?.receipt ?? randomId('receipt'),
          status: 'created',
          attempts: 0,
          notes: payload?.notes ?? {},
          created_at: Math.floor(Date.now() / 1000)
        }
      }
    },
    transfers: {
      create: async (payload: RazorpayTransfersCreateArgs) => {
        log('transfers.create')
        return {
          id: randomId('transfer'),
          entity: 'transfer',
          source: payload?.source ?? randomId('source'),
          amount: payload?.amount ?? 0,
          currency: payload?.currency ?? 'INR',
          status: 'processed',
          notes: payload?.notes ?? {},
          created_at: Math.floor(Date.now() / 1000)
        }
      }
    }
  }
}

// Lazy-initialize Razorpay client (mock or live) only when needed
let razorpayInstance: Razorpay | ReturnType<typeof createMockRazorpay> | null = null

function getRazorpayClient(): Razorpay {
  if (!razorpayInstance) {
    if (hasLiveCredentials) {
      razorpayInstance = new Razorpay({
        key_id: process.env.RAZORPAY_KEY_ID as string,
        key_secret: process.env.RAZORPAY_SECRET as string
      })
    } else {
      razorpayInstance = createMockRazorpay()
    }
  }
  return razorpayInstance as Razorpay
}

export const razorpay = new Proxy({} as Razorpay, {
  get: (_target, prop) => {
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