"use client"

import { useEffect, useRef, useState } from "react"
import { cn } from "../lib/utils"

export function VoidlingsSection() {
  const sectionRef = useRef<HTMLElement>(null)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
        }
      },
      { threshold: 0.3 },
    )

    if (sectionRef.current) {
      observer.observe(sectionRef.current)
    }

    return () => observer.disconnect()
  }, [])

  return (
    <section ref={sectionRef} className="relative min-h-screen flex items-center justify-center py-24 px-6">
      <div className="container mx-auto max-w-6xl">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Left side - First sun */}
          <div
            className={cn(
              "text-center transition-all duration-1000",
              isVisible ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-10",
            )}
          >
            <p className="text-lg md:text-xl text-accent italic mb-8">The Voidlings have stolen the Sun's storms.</p>
            <div className="relative inline-block">
              <div className="w-48 h-48 md:w-64 md:h-64 rounded-full bg-gradient-to-br from-primary via-accent to-primary animate-pulse-glow relative overflow-hidden">
                {/* Swirl patterns */}
                <div className="absolute inset-0 opacity-40">
                  <div className="absolute top-1/4 left-1/4 w-16 h-16 border-4 border-primary-foreground/30 rounded-full" />
                  <div className="absolute bottom-1/3 right-1/4 w-12 h-12 border-4 border-primary-foreground/30 rounded-full" />
                </div>
                {/* Flares */}
                <div className="absolute -top-4 left-1/2 w-1 h-12 bg-accent rotate-45" />
                <div className="absolute -right-4 top-1/2 w-12 h-1 bg-accent" />
                <div className="absolute -bottom-4 left-1/3 w-1 h-12 bg-accent -rotate-45" />
                <div className="absolute -left-4 top-1/3 w-12 h-1 bg-accent rotate-12" />
              </div>
            </div>
          </div>

          {/* Right side - Second sun */}
          <div
            className={cn(
              "text-center transition-all duration-1000 delay-300",
              isVisible ? "opacity-100 translate-x-0" : "opacity-0 translate-x-10",
            )}
          >
            <div className="relative inline-block mb-8">
              <div className="w-48 h-48 md:w-64 md:h-64 rounded-full bg-gradient-to-br from-accent via-primary to-accent animate-pulse-glow relative overflow-hidden">
                {/* Swirl patterns */}
                <div className="absolute inset-0 opacity-40">
                  <div className="absolute top-1/3 right-1/4 w-20 h-20 border-4 border-primary-foreground/30 rounded-full" />
                  <div className="absolute bottom-1/4 left-1/3 w-14 h-14 border-4 border-primary-foreground/30 rounded-full" />
                </div>
                {/* Flares - more dramatic */}
                <div className="absolute -top-6 right-1/3 w-2 h-16 bg-accent rotate-12" />
                <div className="absolute -right-6 top-1/4 w-16 h-2 bg-accent -rotate-12" />
                <div className="absolute -bottom-6 left-1/2 w-2 h-16 bg-accent rotate-45" />
                <div className="absolute -left-6 bottom-1/3 w-16 h-2 bg-accent" />
              </div>
            </div>
            <p className="text-lg md:text-xl text-accent italic">They will unleash them all at once.</p>
          </div>
        </div>
      </div>
    </section>
  )
}
