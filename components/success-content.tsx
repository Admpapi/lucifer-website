"use client"

import { useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Loader2 } from "lucide-react"

export default function SuccessContent() {
  const [isLoading, setIsLoading] = useState(true)
  const [orderDetails, setOrderDetails] = useState<any>(null)
  const searchParams = useSearchParams()
  const sessionId = searchParams.get("session_id")

  useEffect(() => {
    if (sessionId) {
      fetch(`/api/order-details?session_id=${sessionId}`)
        .then((res) => res.json())
        .then((data) => {
          setOrderDetails(data)
          setIsLoading(false)
        })
        .catch((err) => {
          console.error("Error fetching order details:", err)
          setIsLoading(false)
        })
    }
  }, [sessionId])

  if (isLoading) {
    return (
      <div className="text-center max-w-2xl mx-auto p-6">
        <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
        <p>Loading order details...</p>
      </div>
    )
  }

  return (
    <div className="text-center max-w-2xl mx-auto p-6">
      <h1 className="text-4xl font-bold mb-4">Thank You for Your Purchase!</h1>
      <p className="text-xl mb-8">Your order has been successfully processed.</p>
      {orderDetails && (
        <div className="bg-card p-6 rounded-lg mb-8">
          <h2 className="text-2xl font-semibold mb-4">Order Details</h2>
          <p>
            <strong>Product:</strong> {orderDetails.productName}
          </p>
          <p>
            <strong>Amount:</strong> €{orderDetails.amount.toFixed(2)}
          </p>
          <p>
            <strong>Order ID:</strong> {orderDetails.orderId}
          </p>
        </div>
      )}
      <p className="mb-8">
        You will receive an email with your order details and instructions on how to access your purchased script(s).
      </p>
      <Link href="/products">
        <Button size="lg" className="bg-sky-300 hover:bg-sky-300/90 text-gray-900">
          Back to Products
        </Button>
      </Link>
    </div>
  )
}

