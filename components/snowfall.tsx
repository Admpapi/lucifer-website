"use client"

import { useEffect, useState } from "react"

interface Snowflake {
  id: number
  left: number
  animationDuration: number
  opacity: number
  size: number
}

export default function Snowfall() {
  const [snowflakes, setSnowflakes] = useState<Snowflake[]>([])

  useEffect(() => {
    // Create snowflakes
    const flakes: Snowflake[] = []
    for (let i = 0; i < 50; i++) {
      flakes.push({
        id: i,
        left: Math.random() * 100,
        animationDuration: Math.random() * 3 + 2, // 2-5 seconds
        opacity: Math.random() * 0.6 + 0.4, // 0.4-1.0
        size: Math.random() * 10 + 5, // 5-15px
      })
    }
    setSnowflakes(flakes)
  }, [])

  return (
    <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
      {snowflakes.map((flake) => (
        <div
          key={flake.id}
          className="snowflake absolute text-white"
          style={{
            left: `${flake.left}%`,
            animationDuration: `${flake.animationDuration}s`,
            opacity: flake.opacity,
            fontSize: `${flake.size}px`,
          }}
        >
          ❄
        </div>
      ))}
      <style jsx>{`
        @keyframes fall {
          0% {
            top: -10%;
            transform: translateX(0) rotate(0deg);
          }
          100% {
            top: 100%;
            transform: translateX(100px) rotate(360deg);
          }
        }

        .snowflake {
          animation: fall linear infinite;
          user-select: none;
        }

        @media (prefers-reduced-motion: reduce) {
          .snowflake {
            animation: none;
          }
        }
      `}</style>
    </div>
  )
}
