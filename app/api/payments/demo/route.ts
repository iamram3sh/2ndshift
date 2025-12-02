/**
 * Demo Payment Simulator
 * Simulates Razorpay payment for staging/demo environment
 */

import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  if (process.env.NODE_ENV === 'production' && !process.env.ALLOW_DEMO_PAYMENTS) {
    return NextResponse.json(
      { error: 'Demo payments not allowed in production' },
      { status: 403 }
    );
  }

  try {
    const body = await request.json();
    const { amount, currency = 'INR', description } = body;

    // Simulate payment processing delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Always succeed in demo mode
    const paymentId = `demo_pay_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const orderId = `demo_order_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    return NextResponse.json({
      success: true,
      payment_id: paymentId,
      order_id: orderId,
      amount,
      currency,
      status: 'captured',
      description: description || 'Demo payment',
      demo: true,
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Payment simulation failed' },
      { status: 500 }
    );
  }
}
