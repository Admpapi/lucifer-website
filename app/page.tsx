"use client"

import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { ChevronRight } from "lucide-react"
import Link from "next/link"
import ProductCard from "@/components/product-card"
import ReviewScroll from "@/components/review-scroll"
import PartnerGrid from "@/components/partner-grid"
import { Shield, Zap, ShieldCheck } from "lucide-react"
import { products } from "@/data/site-data"
import Image from "next/image"

export default function Home() {

  return (
    <>
      {/* Hero Section */}
      <section className="py-12 md:py-24 lg:py-32">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            <div className="space-y-4 sm:space-y-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="inline-block rounded-full bg-primary/10 px-4 py-1.5 text-sm text-primary border border-primary/20"
              >
                20% Discount! Use code: LUCIFER20
              </motion.div>
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight"
              >
                Premium Gaming Accounts
                <span className="text-primary"> with Lucifer</span>
              </motion.h1>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="text-base sm:text-lg md:text-xl text-muted-foreground"
              >
                The #1 destination for quality accounts, spoofers, cheats & more. Instant delivery, secure transactions, 24/7 support.
              </motion.p>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="flex flex-col sm:flex-row gap-4"
              >
                <Link href="/products" className="w-full sm:w-auto">
                  <Button size="lg" className="w-full sm:w-auto bg-primary hover:bg-primary/90">
                    View Products
                    <ChevronRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
                <Button
                  size="lg"
                  variant="outline"
                  className="w-full sm:w-auto border-primary/50 text-primary hover:bg-primary/10"
                >
                  View Documentation
                </Button>
              </motion.div>
            </div>
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.6 }}
              className="relative mt-8 lg:mt-0 flex items-center justify-center"
            >
              <div className="relative w-full aspect-video overflow-visible">
                <Image
                  src="/lucifer.webp"
                  alt="Lucifer"
                  fill
                  className="object-contain scale-125"
                  style={{
                    maskImage: 'radial-gradient(ellipse at center, rgba(0,0,0,1) 40%, rgba(0,0,0,0.7) 70%, rgba(0,0,0,0) 100%)',
                    WebkitMaskImage: 'radial-gradient(ellipse at center, rgba(0,0,0,1) 40%, rgba(0,0,0,0.7) 70%, rgba(0,0,0,0) 100%)',
                  }}
                />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-12 md:py-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            <div className="p-6 rounded-lg bg-card border border-border hover:border-primary/50 transition-colors">
              <Shield className="w-12 h-12 text-primary mb-4" />
              <h3 className="text-xl font-semibold mb-2">Event Protection</h3>
              <p className="text-sm sm:text-base text-muted-foreground">
              Advanced server event protection ensures that your server remains safe
              from malicious attacks.
              </p>
            </div>
            <div className="p-6 rounded-lg bg-card border border-border hover:border-primary/50 transition-colors">
              <Zap className="w-12 h-12 text-primary mb-4" />
              <h3 className="text-xl font-semibold mb-2">High Performance</h3>
              <p className="text-sm sm:text-base text-muted-foreground">
              Optimized code ensures minimal impact on server performance and
                resources.
              </p>
            </div>
            <div className="p-6 rounded-lg bg-card border border-border hover:border-primary/50 transition-colors">
              <ShieldCheck className="w-12 h-12 text-primary mb-4" />
              <h3 className="text-xl font-semibold mb-2">Secure files</h3>
              <p className="text-sm sm:text-base text-muted-foreground">
              Built-in lock system against leakers without backdoors
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-12 md:py-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold mb-4">
              Featured <span className="text-primary">Products</span>
            </h2>
            <p className="text-sm sm:text-base text-muted-foreground">
              Our most popular and newest additions to the collection
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {products.map((product, index) => (
              <ProductCard
                key={index}
                title={product.title}
                price={product.price}
                image={product.image}
                tags={product.tags}
                isNew={product.isNew}
                stripePriceId={product.stripePriceId}
                stock={product.stock}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Partners Section */}
      <section className="py-12 md:py-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <PartnerGrid />
        </div>
      </section>

      {/* Reviews Section */}
      <section className="py-12 md:py-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold mb-4">What Our Customers Say</h2>
            <p className="text-sm sm:text-base text-muted-foreground">Read reviews from server owners and developers</p>
          </div>
          <ReviewScroll />
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col sm:flex-row justify-between items-center">
            <p className="text-sm text-muted-foreground mb-4 sm:mb-0">© 2025 Lucifer. All rights reserved.</p>
            <Link href="/terms-of-service">
              <Button variant="link" className="text-sm text-muted-foreground hover:text-primary">
                Terms of Service
              </Button>
            </Link>
          </div>
        </div>
      </footer>
    </>
  )
}

