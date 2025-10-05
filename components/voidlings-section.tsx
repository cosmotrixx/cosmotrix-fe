"use client"

import { useEffect, useRef, useState } from "react"
import { cn } from "../lib/utils"
import { Voidling } from "./voidling"
import { Voidling2 } from "./voidling2"

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
    <section ref={sectionRef} className="relative min-h-screen flex items-center justify-center py-16 md:py-24 px-6">
      <div className="container mx-auto max-w-7xl">
        <div className="flex flex-col">
          {/* Top row: text left, voidling right */}
          <div className="flex flex-col md:flex-row items-center justify-between">
            <p
              className={cn(
                "text-left text-lg md:text-xl italic max-w-md transition-all duration-1000",
                isVisible ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-4"
              )}
              style={{
                background: 'linear-gradient(90deg, #E33E07 0%, #FFCF00 40%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              The Voidlings have stolen the Sun&apos;s storms.
            </p>
            <div
              className={cn(
                "transition-all duration-1000",
                isVisible ? "opacity-100 translate-x-0" : "opacity-0 translate-x-4",
              )}
            >
              <Voidling className="w-[600px] h-[600px]" />
            </div>
          </div>

          {/* Bottom row: voidling left, text right */}
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div
              className={cn(
                "transition-all duration-1000 delay-150 order-2 md:order-1",
                isVisible ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-4",
              )}
            >
              <Voidling2 flipped className="w-[600px] h-[600px]" />
            </div>
            <p
              className={cn(
                "text-right text-lg md:text-xl italic max-w-md transition-all duration-1000 delay-150 order-1 md:order-2",
                isVisible ? "opacity-100 translate-x-0" : "opacity-0 translate-x-4"
              )}
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
