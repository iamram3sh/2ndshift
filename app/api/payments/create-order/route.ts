import { NextRequest, NextResponse } from 'next/server'
import { razorpay, calculatePaymentBreakdown } from '@/lib/razorpay'
import { createServerSupabaseClient } from '@/lib/supabase/server'

export async function POST(request: NextRequest) {
  try {
    const { contractId, amount } = await request.json()
    
    const supabase = createServerSupabaseClient()
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Calculate breakdown
    const breakdown = calculatePaymentBreakdown(amount)

    // Create Razorpay order
    const order = await razorpay.orders.create({
      amount: breakdown.grossAmount * 100, // Convert to paise
      currency: 'INR',
      receipt: `contract_${contractId}`,
      notes: {
        contract_id: contractId,
        user_id: user.id
      }
    })

    // Store payment record
    const { data: payment, error } = await supabase
      .from('payments')
      .insert({
        contract_id: contractId,
        payment_from: user.id,
        gross_amount: breakdown.grossAmount,
        platform_fee: breakdown.platformFee,
        tds_deducted: breakdown.tdsAmount,
        gst_amount: breakdown.gstAmount,
        net_amount: breakdown.netAmount,
        razorpay_order_id: order.id,
        status: 'pending'
      })
      .select()
      .single()

    if (error) throw error

    return NextResponse.json({
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      breakdown,
      paymentId: payment.id
    })

  } catch (error) {
    console.error('Payment creation error:', error)
    return NextResponse.json(
      { error: 'Failed to create payment' },
      { status: 500 }
    )
  }
}