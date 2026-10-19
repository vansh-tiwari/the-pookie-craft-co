import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { amount, currency = "INR", receipt, customer } = body;

    const keyId = process.env.RAZORPAY_KEY_ID;
    const keySecret = process.env.RAZORPAY_KEY_SECRET;

    if (!keyId || !keySecret) {
      return NextResponse.json(
        {
          error: "Razorpay credentials not configured in environment.",
          message:
            "Phase 1 WhatsApp/Instagram checkout is active. To enable Razorpay, supply RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET in .env.local",
        },
        { status: 501 }
      );
    }

    // In Phase 2: Call Razorpay Orders API
    // const auth = Buffer.from(`${keyId}:${keySecret}`).toString("base64");
    // const res = await fetch("https://api.razorpay.com/v1/orders", { ... });

    return NextResponse.json({
      success: true,
      order_id: "order_mock_" + Math.random().toString(36).substring(2, 9),
      amount: Math.round(amount * 100), // paise
      currency,
      receipt: receipt || "rcpt_" + Date.now(),
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Internal order creation error", details: String(error) },
      { status: 500 }
    );
  }
}
