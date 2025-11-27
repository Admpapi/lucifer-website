import { NextResponse } from "next/server"
import Stripe from "stripe"

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)

// Discount codes mapping
const discountCodes: { [key: string]: number } = {
  "LUCIFER20": 20,
  "WELCOME10": 10,
  "SAVE15": 15,
}

export async function POST(req: Request) {
  try {
    const { priceId, items, discountCode } = await req.json()

    // Support both single item and cart checkout
    let lineItems: Stripe.Checkout.SessionCreateParams.LineItem[] = []

    if (items && Array.isArray(items)) {
      // Cart checkout with multiple items
      lineItems = items.map((item: { priceId: string; quantity: number }) => ({
        price: item.priceId,
        quantity: item.quantity,
      }))
    } else if (priceId) {
      // Single item checkout
      lineItems = [
        {
          price: priceId,
          quantity: 1,
        },
      ]
    } else {
      return NextResponse.json({ error: "Missing price ID or items" }, { status: 400 })
    }

    // Get the origin from the request headers, or use a fallback URL
    const origin = req.headers.get("origin") || process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"

    const sessionParams: Stripe.Checkout.SessionCreateParams = {
      payment_method_types: ["card", "ideal", "paypal"],
      line_items: lineItems,
      mode: "payment",
      success_url: `${origin}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/products`,
    }

    // Apply discount code if valid
    if (discountCode && discountCodes[discountCode.toUpperCase()]) {
      const discountPercentage = discountCodes[discountCode.toUpperCase()]

      // Create a coupon for the discount
      try {
        const coupon = await stripe.coupons.create({
          percent_off: discountPercentage,
          duration: "once",
          name: discountCode.toUpperCase(),
        })

        sessionParams.discounts = [{ coupon: coupon.id }]
      } catch (couponError: any) {
        console.error("Error creating coupon:", couponError)
        // Continue without discount if coupon creation fails
      }
    }

    const session = await stripe.checkout.sessions.create(sessionParams)

    return NextResponse.json({ id: session.id, url: session.url })
  } catch (err: any) {
    console.error("Error creating checkout session:", err)
    return NextResponse.json(
      { error: err.message || "An error occurred while creating the checkout session" },
      { status: 500 },
    )
  }
}

