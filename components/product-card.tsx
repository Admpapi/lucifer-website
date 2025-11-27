"use client"

import { useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Image from "next/image"
import { useStripe } from "@stripe/react-stripe-js"
import { Loader2, ShoppingCart, Eye } from "lucide-react"
import { useCart } from "@/contexts/cart-context"
import ProductDetailDialog from "./product-detail-dialog"
import confetti from "canvas-confetti"

interface ProductCardProps {
  id?: string
  title: string
  price: number
  image: string
  tags: string[]
  isNew?: boolean
  description?: string
  stripePriceId: string
  downloadLink?: string
  stock?: number
}

export default function ProductCard({
  id,
  title,
  price,
  image,
  tags,
  isNew,
  description,
  stripePriceId,
  downloadLink,
  stock,
}: ProductCardProps) {
  const stripe = useStripe()
  const { addToCart } = useCart()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [showDialog, setShowDialog] = useState(false)
  const [added, setAdded] = useState(false)

  const productId = id || stripePriceId

  const handleBuyNow = async () => {
    if (!stripe) {
      setError("Stripe hasn't loaded yet. Please try again in a moment.")
      return
    }

    setIsLoading(true)
    setError(null)

    try {
      const response = await fetch("/api/create-checkout-session", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ priceId: stripePriceId }),
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const session = await response.json()

      if (session.error) {
        throw new Error(session.error)
      }

      if (!session.id) {
        throw new Error("No session ID returned from the server")
      }

      const result = await stripe.redirectToCheckout({
        sessionId: session.id,
      })

      if (result.error) {
        throw result.error
      }
    } catch (error) {
      console.error("Error during checkout:", error)
      setError(error instanceof Error ? error.message : "An unknown error occurred")
    } finally {
      setIsLoading(false)
    }
  }

  const handleAddToCart = () => {
    addToCart({
      id: productId,
      title,
      price,
      image,
      stripePriceId,
    })
    setAdded(true)

    // 🎉 Confetti explosion!
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#0080FF', '#FFFFFF', '#00BFFF']
    })

    setTimeout(() => setAdded(false), 2000)
  }

  // For free products (downloadLink exists)
  if (downloadLink) {
    return (
      <Card className="overflow-hidden transition-all duration-500 hover:scale-105 hover:shadow-2xl hover:shadow-primary/20 hover:border-primary bg-card border-border transform-gpu hover:rotate-1">
        <div className="relative aspect-[16/9] bg-muted">
          <Image src={image || "/placeholder.svg"} alt={title} fill className="object-cover" />
          {isNew && <Badge className="absolute top-2 right-2 bg-primary">NEW</Badge>}
        </div>
        <CardContent className="p-4">
          <h3 className="font-semibold text-lg mb-2">{title}</h3>
          {description && <p className="text-sm text-muted-foreground mb-2">{description}</p>}
          <div className="flex gap-2 flex-wrap">
            {tags.map((tag) => (
              <Badge key={tag} variant="secondary">
                {tag}
              </Badge>
            ))}
          </div>
        </CardContent>
        <CardFooter className="p-4 pt-0">
          <a href={downloadLink} target="_blank" rel="noopener noreferrer" className="w-full">
            <Button className="w-full bg-primary hover:bg-primary/90">
              Download Free
            </Button>
          </a>
        </CardFooter>
      </Card>
    )
  }

  return (
    <>
      <ProductDetailDialog
        isOpen={showDialog}
        onClose={() => setShowDialog(false)}
        product={{
          id: productId,
          title,
          price,
          image,
          tags,
          description,
          stripePriceId,
          stock,
        }}
      />
      <Card className="overflow-hidden transition-all duration-500 hover:scale-105 hover:shadow-2xl hover:shadow-primary/20 hover:border-primary bg-card border-border transform-gpu hover:rotate-1">
        <div className="relative aspect-[16/9] bg-muted">
          <Image src={image || "/placeholder.svg"} alt={title} fill className="object-cover" />
          {isNew && <Badge className="absolute top-2 right-2 bg-primary">NEW</Badge>}
        </div>
        <CardContent className="p-4">
          <h3 className="font-semibold text-lg mb-2">{title}</h3>
          {description && <p className="text-sm text-muted-foreground mb-2">{description}</p>}
          <div className="flex gap-2 flex-wrap">
            {tags.map((tag) => (
              <Badge key={tag} variant="secondary">
                {tag}
              </Badge>
            ))}
          </div>
        </CardContent>
        <CardFooter className="p-4 pt-0 flex flex-col gap-2">
          <div className="flex justify-between items-center mb-1">
            <span className="font-bold text-lg text-primary">€{price.toFixed(2)}</span>
          </div>
          <div className="flex gap-2">
            <Button
              onClick={() => setShowDialog(true)}
              variant="outline"
              className="flex-1"
              size="sm"
            >
              <Eye className="mr-1 h-4 w-4" />
              Details
            </Button>
            <Button
              onClick={handleAddToCart}
              className="flex-1 bg-primary hover:bg-primary/90"
              size="sm"
              disabled={added}
            >
              <ShoppingCart className="mr-1 h-4 w-4" />
              {added ? "Added!" : "Add"}
            </Button>
          </div>
          {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
        </CardFooter>
      </Card>
    </>
  )
}

