"use client"

import { motion } from "framer-motion"
import ProductCard from "@/components/product-card"
import { Button } from "@/components/ui/button"
import { ChevronRight } from "lucide-react"
import Link from "next/link"
import { unlockedScripts } from "@/data/site-data"

export default function UnlockedScriptsPage() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 100,
      },
    },
  }

  return (
    <div className="min-h-screen bg-background">
      <main className="pt-16 pb-16">
        <section className="py-24">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h1 className="text-4xl font-bold mb-4">
              <span className="text-primary">Scripts</span>
              </h1>
              <p className="text-muted-foreground">Free scripts to enhance your FiveM server</p>
            </div>
            <motion.div
              className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              {unlockedScripts.map((script, index) => (
                <motion.div key={index} variants={itemVariants}>
                  <ProductCard
                    title={script.title}
                    price={0}
                    image={script.image}
                    tags={script.tags}
                    isNew={false}
                    downloadLink={script.downloadLink}
                    description={script.description}
                  />
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>
        <section className="py-24">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold mb-4">Need more advanced features?</h2>
            <p className="text-muted-foreground mb-8">
              Check out our premium scripts for more powerful and customizable options.
            </p>
            <Link href="/products">
              <Button size="lg" className="bg-primary hover:bg-primary/90">
                View Premium Scripts
                <ChevronRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </section>
      </main>
      <footer className="border-t border-border">
        <div className="container mx-auto px-4 py-8">
          <div className="flex justify-between items-center">
            <p className="text-sm text-muted-foreground">© 2025 Lucifer. All rights reserved.</p>
            <Link href="/terms-of-service">
              <Button variant="link" className="text-sm text-muted-foreground hover:text-primary">
                Terms of Service
              </Button>
            </Link>
          </div>
        </div>
      </footer>
    </div>
  )
}

