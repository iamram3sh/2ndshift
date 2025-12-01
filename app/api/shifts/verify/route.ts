import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import crypto from 'crypto'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || ''
const razorpayKeySecret = process.env.RAZORPAY_KEY_SECRET || ''

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      purchase_id,
    } = body

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature || !purchase_id) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Verify signature
    const expectedSignature = crypto
      .createHmac('sha256', razorpayKeySecret)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest('hex')

    if (expectedSignature !== razorpay_signature) {
      return NextResponse.json(
        { error: 'Invalid signature' },
        { status: 400 }
      )
    }

    // Initialize Supabase
    if (!supabaseUrl || !supabaseServiceKey) {
      return NextResponse.json(
        { error: 'Database not configured' },
        { status: 503 }
      )
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    // Get the purchase record
    const { data: purchase, error: purchaseError } = await supabase
      .from('shifts_purchases')
      .select('*, package:shifts_packages(*)')
      .eq('id', purchase_id)
      .single()

    if (purchaseError || !purchase) {
      return NextResponse.json(
        { error: 'Purchase not found' },
        { status: 404 }
      )
    }

    if (purchase.status === 'completed') {
      return NextResponse.json(
        { error: 'Purchase already completed' },
        { status: 400 }
      )
    }

    // Update purchase record
    const { error: updateError } = await supabase
      .from('shifts_purchases')
      .update({
        razorpay_payment_id,
        razorpay_signature,
        status: 'completed',
        completed_at: new Date().toISOString(),
      })
      .eq('id', purchase_id)

    if (updateError) {
      console.error('Error updating purchase:', updateError)
      return NextResponse.json(
        { error: 'Failed to update purchase' },
        { status: 500 }
      )
    }

    // Get current balance
    const { data: balance } = await supabase
      .from('shifts_balance')
      .select('*')
      .eq('user_id', purchase.user_id)
      .single()

    const currentBalance = balance?.balance || 0
    const newBalance = currentBalance + purchase.shifts_amount

    // Update or create balance
    if (balance) {
      await supabase
        .from('shifts_balance')
        .update({
          balance: newBalance,
          lifetime_purchased: (balance.lifetime_purchased || 0) + purchase.shifts_amount,
          updated_at: new Date().toISOString(),
        })
        .eq('user_id', purchase.user_id)
    } else {
      await supabase
        .from('shifts_balance')
        .insert({
          user_id: purchase.user_id,
          balance: purchase.shifts_amount,
          lifetime_purchased: purchase.shifts_amount,
        })
    }

    // Log transaction
    await supabase
      .from('shifts_transactions')
      .insert({
        user_id: purchase.user_id,
        type: 'purchase',
        amount: purchase.shifts_amount,
        balance_after: newBalance,
        description: `Purchased ${purchase.shifts_amount} Shifts`,
        payment_id: purchase_id,
      })

    return NextResponse.json({
      success: true,
      new_balance: newBalance,
      shifts_added: purchase.shifts_amount,
    })
  } catch (error) {
    console.error('Error in verify API:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
