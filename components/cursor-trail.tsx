"use client"

import { useEffect, useState } from "react"

export default function CursorTrail() {
  const [trails, setTrails] = useState<{id: number, x: number, y: number}[]>([])

  useEffect(() => {
    let id = 0
    const handleMouseMove = (e: MouseEvent) => {
      const newTrail = {
        id: id++,
        x: e.clientX,
        y: e.clientY,
      }
      setTrails(prev => [...prev.slice(-10), newTrail])
    }

    window.addEventListener("mousemove", handleMouseMove)
    return () => window.removeEventListener("mousemove", handleMouseMove)
  }, [])

  useEffect(() => {
    if (trails.length > 0) {
      const timer = setTimeout(() => {
        setTrails(prev => prev.slice(1))
      }, 100)
      return () => clearTimeout(timer)
    }
  }, [trails])

  return (
    <div className="fixed inset-0 pointer-events-none z-50">
      {trails.map((trail, index) => (
        <div
          key={trail.id}
          className="absolute w-2 h-2 rounded-full bg-primary animate-ping"
          style={{
            left: trail.x,
            top: trail.y,
            opacity: (index + 1) / trails.length * 0.5,
            transform: 'translate(-50%, -50%)',
          }}
        />
      ))}
    </div>
  )
}
