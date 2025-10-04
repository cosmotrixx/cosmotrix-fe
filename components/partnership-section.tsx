"use client"

import { useEffect, useRef, useState } from "react"
import { cn } from "../lib/utils"

export function PartnershipSection() {
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
      className="relative py-24 px-6 bg-gradient-to-b from-background via-secondary/20 to-background"
    >
      <div className="container mx-auto max-w-4xl text-center">
        <h2
          className={cn(
            "text-3xl md:text-4xl font-bold mb-12 transition-all duration-1000",
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10",
          )}
        >
          <span className="text-foreground">In Partnership </span>
          <span className="text-primary">with</span>
        </h2>

        <div className="flex items-center justify-center gap-12 md:gap-16 flex-wrap">
          {[
            { name: "NOAA", delay: 0 },
            { name: "NASA", delay: 200 },
            { name: "ESA", delay: 400 },
          ].map((partner, index) => (
            <div
              key={index}
              className={cn("transition-all duration-1000", isVisible ? "opacity-100 scale-100" : "opacity-0 scale-75")}
              style={{ transitionDelay: `${partner.delay}ms` }}
            >
              <div className="w-24 h-24 md:w-32 md:h-32 rounded-full bg-card border-2 border-primary/30 flex items-center justify-center hover:border-primary transition-colors">
                <span className="text-2xl md:text-3xl font-bold text-primary">{partner.name}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
