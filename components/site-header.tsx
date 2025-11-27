"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ShoppingCart, DiscIcon as Discord, Menu, X, Search } from "lucide-react"
import Image from "next/image"
import { motion, AnimatePresence } from "framer-motion"
import { useCart } from "@/contexts/cart-context"
import { products } from "@/data/site-data"
import { useEffect, useRef } from "react"

const navItems = [
  { name: "Home", href: "/" },
  { name: "Products", href: "/products" },
  { name: "Scripts", href: "/unlocked-scripts" },
  { name: "Support", href: "/support" },
]

export default function SiteHeader() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [suggestions, setSuggestions] = useState<typeof products>([])
  const router = useRouter()
  const { cartCount } = useCart()
  const searchRef = useRef<HTMLDivElement>(null)

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen)

  // Update suggestions when search query changes
  useEffect(() => {
    if (searchQuery.trim()) {
      const filtered = products.filter((product) =>
        product.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()))
      ).slice(0, 5) // Show max 5 suggestions
      setSuggestions(filtered)
      setShowSuggestions(true)
    } else {
      setSuggestions([])
      setShowSuggestions(false)
    }
  }, [searchQuery])

  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowSuggestions(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      router.push(`/products?search=${encodeURIComponent(searchQuery)}`)
      setShowSuggestions(false)
    }
  }

  const handleSuggestionClick = (productTitle: string) => {
    setSearchQuery(productTitle)
    router.push(`/products?search=${encodeURIComponent(productTitle)}`)
    setShowSuggestions(false)
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/80 backdrop-blur-xl">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 flex h-16 items-center justify-between">
        <Link href="/" className="flex items-center space-x-3">
          <div className="relative">
            <Image
              src="/logo.png"
              alt="Lucifer Logo"
              width={40}
              height={40}
              className="w-10 h-10"
            />
          </div>
          <span className="font-bold text-xl md:text-2xl text-white animate-glow relative">
            LUCIFER
            {/* 3D Christmas Hat */}
            <span className="absolute -top-5 -right-2 animate-christmas-hat" style={{ transform: 'rotate(15deg)' }}>
              <div className="relative w-6 h-6">
                {/* Hat base (red part) */}
                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-0 border-l-[12px] border-r-[12px] border-b-[18px] border-l-transparent border-r-transparent border-b-red-600"
                  style={{
                    filter: 'drop-shadow(1px 1px 2px rgba(0,0,0,0.3))',
                  }}
                />
                {/* Hat shadow for 3D effect */}
                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-0 border-l-[12px] border-r-[12px] border-b-[18px] border-l-transparent border-r-transparent border-b-red-700 opacity-50"
                  style={{
                    transform: 'translateX(-45%) translateY(1px)',
                  }}
                />
                {/* White trim */}
                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-6 h-1.5 bg-white rounded-full"
                  style={{
                    boxShadow: '0 1px 2px rgba(0,0,0,0.2)',
                  }}
                />
                {/* Pom-pom */}
                <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-2.5 h-2.5 bg-white rounded-full animate-pom-pom"
                  style={{
                    boxShadow: '0 2px 4px rgba(0,0,0,0.2), inset -1px -1px 2px rgba(0,0,0,0.1)',
                  }}
                />
              </div>
            </span>
          </span>
          <style jsx>{`
            @keyframes glow {
              0%, 100% {
                text-shadow: 0 0 5px rgba(255, 255, 255, 0.5),
                             0 0 10px rgba(255, 255, 255, 0.3);
              }
              50% {
                text-shadow: 0 0 10px rgba(255, 255, 255, 0.8),
                             0 0 20px rgba(255, 255, 255, 0.5),
                             0 0 25px rgba(255, 255, 255, 0.3);
              }
            }
            .animate-glow {
              animation: glow 3s ease-in-out infinite;
            }
            @keyframes christmas-hat {
              0%, 100% {
                transform: rotate(15deg) translateY(0px);
              }
              25% {
                transform: rotate(12deg) translateY(-2px);
              }
              50% {
                transform: rotate(18deg) translateY(0px);
              }
              75% {
                transform: rotate(12deg) translateY(-2px);
              }
            }
            .animate-christmas-hat {
              animation: christmas-hat 2s ease-in-out infinite;
            }
            @keyframes pom-pom {
              0%, 100% {
                transform: scale(1);
              }
              50% {
                transform: scale(1.1);
              }
            }
            .animate-pom-pom {
              animation: pom-pom 1s ease-in-out infinite;
            }
          `}</style>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center justify-center flex-grow">
          <nav className="flex items-center space-x-4 lg:space-x-6 text-sm font-medium">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="transition-colors hover:text-foreground/80 text-foreground/60"
              >
                {item.name}
              </Link>
            ))}
          </nav>
        </div>

        {/* Mobile Menu Button */}
        <Button variant="ghost" size="icon" className="md:hidden" onClick={toggleMenu}>
          {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </Button>

        {/* Desktop Search & Icons */}
        <div className="hidden md:flex items-center space-x-4">
          <div ref={searchRef} className="relative">
            <form onSubmit={handleSearch} className="relative">
              <Input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => searchQuery && setShowSuggestions(true)}
                className="w-64 pl-10 bg-card border-border"
              />
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            </form>

            {/* Search Suggestions */}
            {showSuggestions && suggestions.length > 0 && (
              <div className="absolute top-full mt-2 w-full bg-card border border-border rounded-lg shadow-2xl z-50 overflow-hidden">
                {suggestions.map((product, index) => (
                  <button
                    key={index}
                    onClick={() => handleSuggestionClick(product.title)}
                    className="w-full px-4 py-3 text-left hover:bg-primary/10 transition-colors flex items-center gap-3 border-b border-border last:border-b-0"
                  >
                    <Search className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                    <div className="flex-grow min-w-0">
                      <p className="text-sm font-medium truncate">{product.title}</p>
                      <p className="text-xs text-muted-foreground">€{product.price.toFixed(2)}</p>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
          <Link href="/cart">
            <Button variant="ghost" size="icon" className="text-foreground/60 hover:text-foreground/80 relative">
              <ShoppingCart className="h-5 w-5" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-primary text-primary-foreground text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </Button>
          </Link>
          <Link href="https://discord.gg/yxro" target="_blank" rel="noopener noreferrer">
            <Button variant="ghost" size="icon" className="text-foreground/60 hover:text-foreground/80">
              <img src="https://i.imgur.com/o102VMz.png" alt="Discord Icon" className="h-5 w-5" />
            </Button>
          </Link>
        </div>
      </div>

      {/* Mobile Dropdown Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="md:hidden bg-background border-t border-border"
          >
            <div className="container mx-auto px-4 py-4 flex flex-col space-y-4">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="block py-2 text-foreground/60 hover:text-foreground/80"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.name}
                </Link>
              ))}
              <div className="mt-4">
                <form onSubmit={handleSearch}>
                  <div className="relative">
                    <Input
                      type="text"
                      placeholder="Search products..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-10 bg-card border-border"
                    />
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  </div>
                </form>

                {/* Mobile Search Suggestions */}
                {showSuggestions && suggestions.length > 0 && (
                  <div className="mt-2 bg-card border border-border rounded-lg overflow-hidden">
                    {suggestions.map((product, index) => (
                      <button
                        key={index}
                        onClick={() => {
                          handleSuggestionClick(product.title)
                          setIsMenuOpen(false)
                        }}
                        className="w-full px-4 py-3 text-left hover:bg-primary/10 transition-colors flex items-center gap-3 border-b border-border last:border-b-0"
                      >
                        <Search className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                        <div className="flex-grow min-w-0">
                          <p className="text-sm font-medium truncate">{product.title}</p>
                          <p className="text-xs text-muted-foreground">€{product.price.toFixed(2)}</p>
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>
              <div className="flex items-center space-x-4 mt-4">
                <Link href="/cart">
                  <Button variant="ghost" size="icon" className="text-foreground/60 hover:text-foreground/80 relative">
                    <ShoppingCart className="h-5 w-5" />
                    {cartCount > 0 && (
                      <span className="absolute -top-1 -right-1 bg-primary text-primary-foreground text-xs rounded-full h-5 w-5 flex items-center justify-center">
                        {cartCount}
                      </span>
                    )}
                  </Button>
                </Link>
                <Link href="https://discord.gg/yxro" target="_blank" rel="noopener noreferrer">
                  <Button variant="ghost" size="icon" className="text-foreground/60 hover:text-foreground/80">
                    <img src="https://i.imgur.com/o102VMz.png" alt="Discord Icon" className="h-5 w-5" />
                  </Button>
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}

