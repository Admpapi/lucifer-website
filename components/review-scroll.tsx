"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Star } from "lucide-react"
import { reviews } from "@/data/site-data"

export default function ReviewScroll() {
  return (
    <div className="relative w-full overflow-hidden">
      <div className="flex animate-scroll">
        {[...reviews, ...reviews].map((review, i) => (
          <Card key={i} className="flex-shrink-0 w-[300px] mx-3 bg-background">
            <CardContent className="p-6">
              <div className="flex gap-1 mb-2">
                {Array.from({ length: review.rating }).map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-primary text-primary" />
                ))}
              </div>
              <p className="mb-4 text-muted-foreground">{review.text}</p>
              <p className="font-semibold">{review.name}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

