import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import Razorpay from 'razorpay'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || ''
const razorpayKeyId = process.env.RAZORPAY_KEY_ID || ''
const razorpayKeySecret = process.env.RAZORPAY_KEY_SECRET || ''

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { package_id, user_id } = body

    if (!package_id || !user_id) {
      return NextResponse.json(
        { error: 'Package ID and User ID are required' },
        { status: 400 }
      )
    }

    // Check if Razorpay is configured
    if (!razorpayKeyId || !razorpayKeySecret) {
      return NextResponse.json(
        { error: 'Payment gateway not configured' },
        { status: 503 }
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

    // Get the package
    const { data: pkg, error: pkgError } = await supabase
      .from('shifts_packages')
      .select('*')
      .eq('id', package_id)
      .single()

    if (pkgError || !pkg) {
      return NextResponse.json(
        { error: 'Package not found' },
        { status: 404 }
      )
    }

    // Initialize Razorpay
    const razorpay = new Razorpay({
      key_id: razorpayKeyId,
      key_secret: razorpayKeySecret,
    })

    // Create Razorpay order
    const order = await razorpay.orders.create({
      amount: pkg.price_inr, // Amount in paise
      currency: 'INR',
      receipt: `shifts_${Date.now()}`,
      notes: {
        user_id,
        package_id,
        shifts_amount: pkg.shifts_amount.toString(),
      },
    })

    // Create purchase record
    const { data: purchase, error: purchaseError } = await supabase
      .from('shifts_purchases')
      .insert({
        user_id,
        package_id,
        shifts_amount: pkg.shifts_amount,
        amount_paid: pkg.price_inr,
        razorpay_order_id: order.id,
        status: 'pending',
      })
      .select()
      .single()

    if (purchaseError) {
      console.error('Error creating purchase record:', purchaseError)
      return NextResponse.json(
        { error: 'Failed to create purchase record' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      order_id: order.id,
      amount: pkg.price_inr,
      currency: 'INR',
      key: razorpayKeyId,
      purchase_id: purchase.id,
      package: {
        name: pkg.name,
        shifts_amount: pkg.shifts_amount,
      },
    })
  } catch (error) {
    console.error('Error in purchase API:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
