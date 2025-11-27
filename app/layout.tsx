import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import SiteHeader from "@/components/site-header"
import StripeProvider from "@/components/stripe-provider"
import { CartProvider } from "@/contexts/cart-context"
import WelcomePopup from "@/components/welcome-popup"
import Snowfall from "@/components/snowfall"
import Chatbot from "@/components/chatbot"
import AnimatedBackground from "@/components/animated-background"
import CursorTrail from "@/components/cursor-trail"
import PurchaseNotification from "@/components/purchase-notification"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Lucifer",
  description: "Premium FiveM scripts and modifications for your server",
  generator: "v0.dev",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="dark">
      <head>
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no"
        />
        {/* Favicon toevoegen */}
        <link rel="icon" href="/favicon.ico" type="image/x-icon" />
      </head>
      <body className={inter.className}>
        <CartProvider>
          <StripeProvider>
            <AnimatedBackground />
            <CursorTrail />
            <Snowfall />
            <WelcomePopup />
            <Chatbot />
            <PurchaseNotification />
            <div className="min-h-screen bg-background flex flex-col">
              <SiteHeader />
              <main className="flex-grow">{children}</main>
            </div>
          </StripeProvider>
        </CartProvider>
      </body>
    </html>
  )
}

import "./globals.css"
