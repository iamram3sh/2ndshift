// app/api/payments/create-order/route.ts
import { NextResponse } from "next/server";

export async function POST() {
  // Temporary stub until Razorpay is configured
  return NextResponse.json(
    {
      success: false,
      message: "Payments are not configured yet. Please try again later.",
    },
    { status: 501 } // 501 = Not Implemented
  );
}
