import { NextResponse } from "next/server"
import Stripe from "stripe"

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const sessionId = searchParams.get("session_id")

  if (!sessionId) {
    return NextResponse.json({ error: "Missing session_id" }, { status: 400 })
  }

  try {
    const session = await stripe.checkout.sessions.retrieve(sessionId, {
      expand: ["line_items"],
    })

    const orderDetails = {
      productName: session.line_items?.data[0]?.description,
      amount: session.amount_total ? session.amount_total / 100 : 0,
      orderId: session.payment_intent,
    }

    return NextResponse.json(orderDetails)
  } catch (err: any) {
    return NextResponse.json({ error: { message: err.message } }, { status: 500 })
  }
}

