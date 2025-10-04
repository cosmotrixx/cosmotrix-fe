"use client"

import { useEffect, useRef, useState } from "react"
import { cn } from "../lib/utils"
import { NoaaLogo } from "./noaa-logo"
import { NasaLogo } from "./nasa-logo"
import { EsaLogo } from "./esa-logo"

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
      className="relative py-24 overflow-hidden"
    >
      <div className="absolute inset-0 bg-gradient-to-b from-background via-secondary/20 to-background -z-10" />
      <div className="text-center">
        <h2
          className={cn(
            "text-3xl md:text-4xl font-bold mb-12 px-6 transition-all duration-1000",
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10",
          )}
        >
          <span className="text-foreground">In Partnership </span>
          <span className="text-white font-light">with</span>
        </h2>

        <div className="w-full flex items-center justify-center gap-12 md:gap-16 py-8 md:py-10 backdrop-blur-sm" style={{ background: 'radial-gradient(circle, #150737 0%, #E174D3 100%)' }}>
          {[
            { name: "NOAA", delay: 0, Logo: NoaaLogo },
            { name: "NASA", delay: 200, Logo: NasaLogo },
            { name: "ESA", delay: 400, Logo: EsaLogo },
          ].map((partner, index) => (
            <div
              key={index}
              className={cn("transition-all duration-1000", isVisible ? "opacity-100 scale-100" : "opacity-0 scale-75")}
              style={{ transitionDelay: `${partner.delay}ms` }}
            >
              <partner.Logo className="w-24 h-24 md:w-32 md:h-32 object-contain" />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
