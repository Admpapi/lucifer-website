"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import ProductCard from "@/components/product-card";
import { Button } from "@/components/ui/button";
import { ChevronRight, SlidersHorizontal, X } from "lucide-react";
import Link from "next/link";
import { products } from "@/data/site-data";
import { Card } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type PriceRange = "all" | "under10" | "10to20" | "20to50" | "above50"
type SortOption = "popular" | "newest" | "price-low" | "price-high"

function ProductsContent() {
  const searchParams = useSearchParams()
  const searchQuery = searchParams.get("search") || ""
  const [filteredProducts, setFilteredProducts] = useState(products)
  const [selectedCategory, setSelectedCategory] = useState<string>("all")
  const [selectedPriceRange, setSelectedPriceRange] = useState<PriceRange>("all")
  const [sortBy, setSortBy] = useState<SortOption>("popular")
  const [showFilters, setShowFilters] = useState(false)

  // Get unique categories from products
  const categories = ["all", ...Array.from(new Set(products.flatMap(p => p.tags)))]

  // Filter and sort products
  useEffect(() => {
    let filtered = [...products]

    // Apply search filter
    if (searchQuery) {
      filtered = filtered.filter((product) =>
        product.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()))
      )
    }

    // Apply category filter
    if (selectedCategory !== "all") {
      filtered = filtered.filter((product) =>
        product.tags.includes(selectedCategory)
      )
    }

    // Apply price range filter
    switch (selectedPriceRange) {
      case "under10":
        filtered = filtered.filter((p) => p.price < 10)
        break
      case "10to20":
        filtered = filtered.filter((p) => p.price >= 10 && p.price < 20)
        break
      case "20to50":
        filtered = filtered.filter((p) => p.price >= 20 && p.price < 50)
        break
      case "above50":
        filtered = filtered.filter((p) => p.price >= 50)
        break
    }

    // Apply sorting
    switch (sortBy) {
      case "popular":
        // Assuming products are already sorted by popularity
        break
      case "newest":
        filtered = filtered.filter(p => p.isNew).concat(filtered.filter(p => !p.isNew))
        break
      case "price-low":
        filtered.sort((a, b) => a.price - b.price)
        break
      case "price-high":
        filtered.sort((a, b) => b.price - a.price)
        break
    }

    setFilteredProducts(filtered)
  }, [searchQuery, selectedCategory, selectedPriceRange, sortBy])

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

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
  };

  return (
    <div className="min-h-screen bg-background">
      <main className="pt-16 pb-16">
        <section className="py-12 md:py-24">
          <div className="container mx-auto px-4 sm:px-6">
            <div className="text-center mb-8 md:mb-12">
              <h1 className="text-3xl md:text-4xl font-bold mb-3 md:mb-4">
                {searchQuery ? `Search Results for "${searchQuery}"` : (
                  <>Our <span className="text-primary">Products</span></>
                )}
              </h1>
              <p className="text-sm md:text-base text-muted-foreground max-w-2xl mx-auto">
                {searchQuery ? `Found ${filteredProducts.length} product(s)` : "Enhance your experience with our Premium Products"}
              </p>
            </div>

            {/* Filters & Sort Bar */}
            <div className="mb-8">
              {/* Filter Bar Container */}
              <div className="bg-card/50 border border-border rounded-lg p-4">
                <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
                  <div className="flex items-center gap-3 flex-wrap w-full md:w-auto">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setShowFilters(!showFilters)}
                      className="md:hidden border-primary/30 hover:bg-primary/10"
                    >
                      <SlidersHorizontal className="h-4 w-4 mr-2" />
                      Filters
                    </Button>

                    {/* Desktop Filters */}
                    <div className="hidden md:flex items-center gap-3 flex-wrap">
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-muted-foreground font-medium">Category:</span>
                        <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                          <SelectTrigger className="w-44 bg-background border-border hover:border-primary/50 transition-colors">
                            <SelectValue placeholder="All Categories" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="all">All Categories</SelectItem>
                            {categories.filter(c => c !== "all").map((category) => (
                              <SelectItem key={category} value={category}>
                                {category}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="h-6 w-px bg-border" />

                      <div className="flex items-center gap-2">
                        <span className="text-sm text-muted-foreground font-medium">Price:</span>
                        <Select value={selectedPriceRange} onValueChange={(v) => setSelectedPriceRange(v as PriceRange)}>
                          <SelectTrigger className="w-44 bg-background border-border hover:border-primary/50 transition-colors">
                            <SelectValue placeholder="All Prices" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="all">All Prices</SelectItem>
                            <SelectItem value="under10">Under €10</SelectItem>
                            <SelectItem value="10to20">€10 - €20</SelectItem>
                            <SelectItem value="20to50">€20 - €50</SelectItem>
                            <SelectItem value="above50">Above €50</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    {/* Active Filters */}
                    {(selectedCategory !== "all" || selectedPriceRange !== "all") && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          setSelectedCategory("all")
                          setSelectedPriceRange("all")
                        }}
                        className="text-muted-foreground hover:text-foreground hover:bg-primary/10"
                      >
                        <X className="h-4 w-4 mr-1" />
                        Clear Filters
                      </Button>
                    )}
                  </div>

                  {/* Sort */}
                  <div className="flex items-center gap-2 w-full md:w-auto">
                    <span className="text-sm text-muted-foreground font-medium hidden md:inline">Sort:</span>
                    <Select value={sortBy} onValueChange={(v) => setSortBy(v as SortOption)}>
                      <SelectTrigger className="w-full md:w-52 bg-background border-border hover:border-primary/50 transition-colors">
                        <SelectValue placeholder="Sort by" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="popular">Most Popular</SelectItem>
                        <SelectItem value="newest">Newest</SelectItem>
                        <SelectItem value="price-low">Price: Low to High</SelectItem>
                        <SelectItem value="price-high">Price: High to Low</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            </div>

            {/* Mobile Filters */}
            {showFilters && (
              <Card className="p-5 mb-6 md:hidden bg-card/50 border-border">
                <div className="space-y-5">
                  <div>
                    <label className="text-sm font-medium mb-2 block text-muted-foreground">Category</label>
                    <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                      <SelectTrigger className="w-full bg-background border-border hover:border-primary/50 transition-colors">
                        <SelectValue placeholder="All Categories" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Categories</SelectItem>
                        {categories.filter(c => c !== "all").map((category) => (
                          <SelectItem key={category} value={category}>
                            {category}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="h-px bg-border" />

                  <div>
                    <label className="text-sm font-medium mb-2 block text-muted-foreground">Price Range</label>
                    <Select value={selectedPriceRange} onValueChange={(v) => setSelectedPriceRange(v as PriceRange)}>
                      <SelectTrigger className="w-full bg-background border-border hover:border-primary/50 transition-colors">
                        <SelectValue placeholder="All Prices" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Prices</SelectItem>
                        <SelectItem value="under10">Under €10</SelectItem>
                        <SelectItem value="10to20">€10 - €20</SelectItem>
                        <SelectItem value="20to50">€20 - €50</SelectItem>
                        <SelectItem value="above50">Above €50</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </Card>
            )}

            {/* Results Count */}
            <div className="mb-6">
              <p className="text-sm text-muted-foreground">
                Showing {filteredProducts.length} product{filteredProducts.length !== 1 ? 's' : ''}
              </p>
            </div>
            <motion.div
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              {filteredProducts.map((product, index) => (
                <motion.div key={index} variants={itemVariants}>
                  <ProductCard
                    title={product.title}
                    price={product.price}
                    image={product.image}
                    tags={product.tags}
                    isNew={product.isNew}
                    stripePriceId={product.stripePriceId}
                    stock={product.stock}
                  />
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* Custom packages section */}
        <section className="py-8 md:py-16">
          <div className="container mx-auto px-4 sm:px-6">
            <div className="bg-card rounded-lg border border-border p-6 md:p-8">
              <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                <div className="text-center md:text-left">
                  <h2 className="text-xl md:text-2xl font-bold mb-2">
                    Need a Custom Solution?
                  </h2>
                  <p className="text-sm md:text-base text-white text-muted-foreground max-w-md">
                    We offer tailor-made scripts to fit your server's unique
                    requirements.
                  </p>
                </div>
                <a
                  href="https://discord.gg/yxro"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full md:w-auto"
                >
                  <Button
                    size="lg"
                    className="w-full md:w-auto bg-primary hover:bg-primary/90"
                  >
                    Request a Quote
                    <ChevronRight className="ml-2 h-4 w-4" />
                  </Button>
                </a>
              </div>
            </div>
          </div>
        </section>

        <section className="py-12 md:py-24">
          <div className="container mx-auto px-4 sm:px-6 text-center">
            <h2 className="text-2xl md:text-3xl font-bold mb-3 md:mb-4">
              Can't find what you're looking for?
            </h2>
            <p className="text-sm md:text-base text-muted-foreground mb-6 md:mb-8 max-w-2xl mx-auto">
              We offer custom script development tailored to your server's
              needs.
            </p>
            <Button
              size="lg"
              className="w-full sm:w-auto bg-primary hover:bg-primary/90"
            >
              Request Custom Script
              <ChevronRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </section>
      </main>
      <footer className="border-t border-border">
        <div className="container mx-auto px-4 sm:px-6 py-6 md:py-8">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <p className="text-xs md:text-sm text-muted-foreground text-center sm:text-left">
              © 2025 Lucifer. All rights reserved.
            </p>
            <Link href="/terms-of-service">
              <Button
                variant="link"
                className="text-xs md:text-sm text-muted-foreground hover:text-primary"
              >
                Terms of Service
              </Button>
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default function ProductsPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-background flex items-center justify-center">Loading...</div>}>
      <ProductsContent />
    </Suspense>
  );
}