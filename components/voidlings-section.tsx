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
      <div className="container mx-auto max-w-5xl">
        <div className="flex flex-col items-center gap-10 md:gap-14">
          {/* Top voidling */}
          <span className="block w-full">
            <p
              className="text-left text-lg md:text-xl italic"
              style={{
                background: 'linear-gradient(90deg, #E33E07 0%, #FFCF00 40%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              The Voidlings have stolen the Sun&apos;s storms.
            </p>
          </span>
          <div
            className={cn(
              "transition-all duration-1000",
              isVisible ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-4",
            )}
          >
            <Voidling className="w-[260px] h-[260px] md:w-[420px] md:h-[420px]" />
          </div>

          {/* Central text span containing both lines */}

          {/* Bottom voidling */}
          <div
            className={cn(
              "transition-all duration-1000 delay-150",
              isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4",
            )}
          >
            <Voidling2 flipped className="w-[300px] h-[300px] md:w-[520px] md:h-[520px]" />
            <p
              className="text-right text-lg md:text-xl italic mt-10 md:mt-16"
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
