"use client"

import Image from "next/image"
import { partners } from "@/data/site-data"

export default function PartnerGrid() {
  return (
    <div className="w-full">
      <h2 className="text-center text-sm uppercase tracking-wider text-muted-foreground mb-12">Our Partners</h2>
      <div className="flex justify-center">
        <div className="flex items-center justify-center space-x-12">
          {partners.map((partner, i) => (
            <div key={i} className="flex-shrink-0 w-16 h-16">
              <Image
                src={partner.logo || "/placeholder.svg"}
                alt={`${partner.name} logo`}
                width={64}
                height={64}
                className="object-contain hover:scale-110 transition-transform duration-300 filter brightness-100 hover:brightness-125"
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

