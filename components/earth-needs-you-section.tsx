"use client"

import { useEffect, useRef, useState } from "react"
import { cn } from "../lib/utils"

export function EarthNeedsYouSection() {
  const sectionRef = useRef<HTMLElement>(null)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
        }
      },
      { threshold: 0.5 },
    )

    if (sectionRef.current) {
      observer.observe(sectionRef.current)
    }

    return () => observer.disconnect()
  }, [])

  return (
    <section
      ref={sectionRef}
      className="relative py-16 px-6 overflow-hidden"
    >
      <div className="absolute inset-0 bg-gradient-to-b from-background via-secondary/20 to-background -z-10" />
      <div className="container mx-auto max-w-4xl text-center">
        <h2
          className={cn(
            "text-4xl md:text-5xl lg:text-6xl font-bold transition-all duration-1000",
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10",
          )}
        >
          <span className="text-[30px] font-medium text-primary animate-pulse-glow">Earth needs you.</span>
        </h2>
      </div>
    </section>
  )
}
