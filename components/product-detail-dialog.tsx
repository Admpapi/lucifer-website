"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import Image from "next/image"
import { ShoppingCart, CreditCard, Plus, Minus } from "lucide-react"
import { useCart } from "@/contexts/cart-context"
import { useState } from "react"
import { useStripe } from "@/components/stripe-provider"
import confetti from "canvas-confetti"

interface ProductDetailDialogProps {
  isOpen: boolean
  onClose: () => void
  product: {
    id: string
    title: string
    price: number
    image: string
    tags: string[]
    description?: string
    stripePriceId: string
    stock?: number
  }
}

export default function ProductDetailDialog({ isOpen, onClose, product }: ProductDetailDialogProps) {
  const { addToCart } = useCart()
  const [added, setAdded] = useState(false)
  const [quantity, setQuantity] = useState(1)

  const handleQuantityChange = (change: number) => {
    const newQuantity = quantity + change
    if (newQuantity >= 1 && newQuantity <= 99) {
      setQuantity(newQuantity)
    }
  }

  const handleAddToCart = () => {
    for (let i = 0; i < quantity; i++) {
      addToCart({
        id: product.id,
        title: product.title,
        price: product.price,
        image: product.image,
        stripePriceId: product.stripePriceId,
      })
    }
    setAdded(true)

    // 🎉 Epic confetti explosion for multiple items!
    const count = quantity > 5 ? 200 : quantity * 50
    confetti({
      particleCount: count,
      spread: 100,
      origin: { y: 0.6 },
      colors: ['#0080FF', '#FFFFFF', '#00BFFF', '#4169E1']
    })

    setTimeout(() => setAdded(false), 2000)
  }

  const totalPrice = product.price * quantity

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl w-[95vw] max-h-[95vh] overflow-y-auto bg-gradient-to-br from-card via-card to-card/50 p-0 border-2 border-primary/20">
        <div className="p-6 md:p-10">
          <DialogHeader className="mb-8">
            <DialogTitle className="text-3xl md:text-5xl font-bold bg-gradient-to-r from-white via-primary to-white bg-clip-text text-transparent">
              {product.title}
            </DialogTitle>
            <div className="flex items-center gap-3 mt-3 flex-wrap">
              <span className="px-4 py-1.5 bg-green-500/20 text-green-400 rounded-full text-sm font-bold border border-green-500/30 flex items-center gap-2">
                <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
                {product.stock ? `${product.stock} In Stock` : '✓ In Stock'}
              </span>
              {product.tags.slice(0, 2).map((tag) => (
                <Badge key={tag} variant="secondary" className="bg-primary/10 text-primary border border-primary/30">
                  {tag}
                </Badge>
              ))}
            </div>
          </DialogHeader>

          <div className="grid md:grid-cols-[1.2fr_1fr] gap-8 lg:gap-12">
            <div className="space-y-6">
              <div className="relative aspect-video rounded-2xl overflow-hidden bg-gradient-to-br from-primary/5 to-primary/20 shadow-2xl border-2 border-primary/10 group">
                <Image
                  src={product.image}
                  alt={product.title}
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </div>

              <div className="bg-gradient-to-r from-muted/50 to-muted/30 rounded-xl p-6 border border-border">
                <h3 className="text-lg font-bold mb-3 text-primary">Product Description</h3>
                <p className="text-foreground/90 leading-relaxed">
                  {product.description || "High-quality product with premium features and excellent performance. This product includes everything you need to get started, with full documentation and lifetime support."}
                </p>
              </div>
            </div>

            <div className="bg-gradient-to-br from-card to-muted/20 rounded-2xl p-6 border-2 border-primary/20 shadow-xl">
              <div className="space-y-6">
                <div className="flex items-baseline justify-between">
                  <div>
                    <div className="text-sm text-muted-foreground mb-1">Unit Price</div>
                    <div className="text-3xl font-bold text-foreground">
                      €{product.price.toFixed(2)}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm text-muted-foreground mb-1">Total</div>
                    <div className="text-4xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
                      €{totalPrice.toFixed(2)}
                    </div>
                  </div>
                </div>

                <div className="bg-muted/30 rounded-xl p-4 border border-border">
                  <div className="text-sm font-medium text-muted-foreground mb-3">Quantity</div>
                  <div className="flex items-center gap-4">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => handleQuantityChange(-1)}
                      disabled={quantity <= 1}
                      className="h-12 w-12 rounded-xl border-2 hover:border-primary hover:bg-primary/10"
                    >
                      <Minus className="h-5 w-5" />
                    </Button>
                    <div className="flex-1">
                      <input
                        type="number"
                        value={quantity}
                        onChange={(e) => {
                          const val = parseInt(e.target.value) || 1
                          if (val >= 1 && val <= 99) setQuantity(val)
                        }}
                        className="w-full text-center text-2xl font-bold bg-card rounded-xl py-3 border-2 border-border focus:border-primary focus:outline-none transition-colors"
                        min="1"
                        max="99"
                      />
                    </div>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => handleQuantityChange(1)}
                      disabled={quantity >= 99}
                      className="h-12 w-12 rounded-xl border-2 hover:border-primary hover:bg-primary/10"
                    >
                      <Plus className="h-5 w-5" />
                    </Button>
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-3 mt-6">
                <Button
                  size="lg"
                  className="w-full bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 h-16 text-lg font-bold rounded-xl shadow-lg shadow-primary/20 transition-all duration-300 hover:scale-[1.02]"
                  onClick={handleAddToCart}
                  disabled={added}
                >
                  <ShoppingCart className="mr-2 h-6 w-6" />
                  {added ? "✓ Added to Cart!" : "Add to Cart"}
                </Button>

                <Button
                  size="lg"
                  variant="outline"
                  className="w-full h-14 text-lg border-2 border-primary/30 hover:bg-primary/10 rounded-xl font-semibold"
                  onClick={onClose}
                >
                  <CreditCard className="mr-2 h-6 w-6" />
                  Buy Now
                </Button>
              </div>

              <div className="mt-6 bg-gradient-to-br from-green-500/10 to-green-500/5 rounded-xl p-5 border border-green-500/20 space-y-3">
                <p className="text-sm font-semibold flex items-center gap-2 text-green-400">
                  <span className="text-lg">✓</span> Instant delivery
                </p>
                <p className="text-sm font-semibold flex items-center gap-2 text-green-400">
                  <span className="text-lg">✓</span> Lifetime updates
                </p>
                <p className="text-sm font-semibold flex items-center gap-2 text-green-400">
                  <span className="text-lg">✓</span> 24/7 support
                </p>
                <p className="text-sm font-semibold flex items-center gap-2 text-green-400">
                  <span className="text-lg">✓</span> Full documentation
                </p>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
