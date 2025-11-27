"use client"

import { useCart } from "@/contexts/cart-context"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import Image from "next/image"
import Link from "next/link"
import { Trash2, Plus, Minus, ShoppingBag, Tag } from "lucide-react"
import { useRouter } from "next/navigation"
import { useState } from "react"

export default function CartPage() {
  const { cart, removeFromCart, updateQuantity, clearCart, cartTotal } = useCart()
  const router = useRouter()
  const [discountCode, setDiscountCode] = useState("")
  const [appliedDiscount, setAppliedDiscount] = useState<{ code: string; percentage: number } | null>(null)
  const [discountError, setDiscountError] = useState("")

  // Available discount codes
  const discountCodes: { [key: string]: number } = {
    "LUCIFER20": 20,
    "WELCOME10": 10,
    "SAVE15": 15,
  }

  const handleApplyDiscount = () => {
    const code = discountCode.toUpperCase().trim()
    if (discountCodes[code]) {
      setAppliedDiscount({ code, percentage: discountCodes[code] })
      setDiscountError("")
    } else {
      setAppliedDiscount(null)
      setDiscountError("Invalid discount code")
    }
  }

  const discountAmount = appliedDiscount ? (cartTotal * appliedDiscount.percentage) / 100 : 0
  const finalTotal = cartTotal - discountAmount

  const handleCheckout = async () => {
    if (cart.length === 0) return

    try {
      const items = cart.map(item => ({
        priceId: item.stripePriceId,
        quantity: item.quantity,
      }))

      const response = await fetch("/api/create-checkout-session", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          items,
          discountCode: appliedDiscount?.code || null,
        }),
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const session = await response.json()

      if (session.error) {
        throw new Error(session.error)
      }

      if (!session.url) {
        throw new Error("No checkout URL returned from the server")
      }

      // Redirect to Stripe Checkout
      window.location.href = session.url
    } catch (error) {
      console.error("Error during checkout:", error)
      alert("Er is een fout opgetreden tijdens het afrekenen. Probeer het opnieuw.")
    }
  }

  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center px-4">
        <ShoppingBag className="h-24 w-24 text-muted-foreground mb-6" />
        <h1 className="text-3xl font-bold mb-2">Your Cart is Empty</h1>
        <p className="text-muted-foreground mb-8">Add some products to get started!</p>
        <Link href="/products">
          <Button size="lg" className="bg-primary hover:bg-primary/90">
            Browse Products
          </Button>
        </Link>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background py-24 px-4">
      <div className="container mx-auto max-w-6xl">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold">Shopping Cart</h1>
          <Button variant="outline" onClick={clearCart} className="border-destructive text-destructive hover:bg-destructive/10">
            Clear Cart
          </Button>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {cart.map((item) => (
              <Card key={item.id} className="p-4 bg-card border-border">
                <div className="flex gap-4">
                  <div className="relative h-24 w-24 flex-shrink-0 rounded-lg overflow-hidden bg-muted">
                    <Image
                      src={item.image}
                      alt={item.title}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="flex-grow">
                    <h3 className="font-semibold text-lg mb-1">{item.title}</h3>
                    <p className="text-primary font-semibold mb-2">
                      €{item.price.toFixed(2)}
                    </p>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      >
                        <Minus className="h-4 w-4" />
                      </Button>
                      <span className="w-12 text-center font-medium">
                        {item.quantity}
                      </span>
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  <div className="flex flex-col items-end justify-between">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => removeFromCart(item.id)}
                      className="text-destructive hover:text-destructive hover:bg-destructive/10"
                    >
                      <Trash2 className="h-5 w-5" />
                    </Button>
                    <p className="font-bold text-lg">
                      €{(item.price * item.quantity).toFixed(2)}
                    </p>
                  </div>
                </div>
              </Card>
            ))}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <Card className="p-6 bg-card border-border sticky top-24">
              <h2 className="text-2xl font-bold mb-6">Order Summary</h2>

              {/* Discount Code Input */}
              <div className="mb-6">
                <label className="text-sm font-medium mb-2 block">Discount Code</label>
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <Input
                      type="text"
                      placeholder="Enter code"
                      value={discountCode}
                      onChange={(e) => setDiscountCode(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && handleApplyDiscount()}
                      className="pl-10"
                    />
                    <Tag className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  </div>
                  <Button
                    onClick={handleApplyDiscount}
                    variant="outline"
                    className="border-primary/30 hover:bg-primary/10"
                  >
                    Apply
                  </Button>
                </div>
                {discountError && (
                  <p className="text-sm text-destructive mt-2">{discountError}</p>
                )}
                {appliedDiscount && (
                  <div className="mt-2 flex items-center gap-2 text-sm text-green-400">
                    <Tag className="h-4 w-4" />
                    <span>Code "{appliedDiscount.code}" applied ({appliedDiscount.percentage}% off)</span>
                  </div>
                )}
              </div>

              <div className="space-y-4 mb-6">
                <div className="flex justify-between text-muted-foreground">
                  <span>Subtotal</span>
                  <span>€{cartTotal.toFixed(2)}</span>
                </div>
                {appliedDiscount && (
                  <div className="flex justify-between text-green-400">
                    <span>Discount ({appliedDiscount.percentage}%)</span>
                    <span>-€{discountAmount.toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between text-muted-foreground">
                  <span>Tax</span>
                  <span>€0.00</span>
                </div>
                <div className="border-t border-border pt-4">
                  <div className="flex justify-between text-xl font-bold">
                    <span>Total</span>
                    <span className="text-primary">€{finalTotal.toFixed(2)}</span>
                  </div>
                </div>
              </div>
              <Button
                size="lg"
                className="w-full bg-primary hover:bg-primary/90 mb-4"
                onClick={handleCheckout}
              >
                Proceed to Checkout
              </Button>
              <Link href="/products">
                <Button variant="outline" size="lg" className="w-full">
                  Continue Shopping
                </Button>
              </Link>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
