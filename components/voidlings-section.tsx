"use client"

import { useEffect, useRef, useState } from "react"
import { cn } from "../lib/utils"
import { Voidling } from "./voidling"

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
            <p 
              className="text-lg md:text-xl italic mb"
              style={{
                background: 'linear-gradient(90deg, #E33E07 0%, #FFCF00 40%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              The Voidlings have stolen the Sun&apos;s storms.
            </p>
            <div className="relative inline-block">
              <Voidling className="w-128 h-128 md:w-192 md:h-192" />
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
              <Voidling flipped className="w-128 h-128 md:w-192 md:h-192" />
            </div>
            <p 
              className="text-lg md:text-xl italic"
              style={{
                background: 'linear-gradient(90deg, #E33E07 0%, #FFCF00 40%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              They will unleash them all at once.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
