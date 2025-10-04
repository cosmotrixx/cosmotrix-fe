"use client"

import { useEffect, useRef, useState } from "react"
import { cn } from "../lib/utils"

export function BuiltWithSection() {
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
          <span className="text-foreground">Built </span>
          <span className="text-white font-light">with</span>
        </h2>

        <div 
          className="w-full flex items-center justify-center gap-12 md:gap-16 py-8 md:py-10 backdrop-blur-sm" 
          style={{ 
            background: 'radial-gradient(ellipse 100% 300% at 50% 50%, #21001D 0%, rgba(67, 224, 247, 1) 100%)'
          }}
        >
          {[
            { name: "Technology 1", delay: 0, icon: "🚀" },
            { name: "Technology 2", delay: 200, icon: "⚡" },
            { name: "Technology 3", delay: 400, icon: "🎯" },
          ].map((tech, index) => (
            <div
              key={index}
              className={cn("transition-all duration-1000", isVisible ? "opacity-100 scale-100" : "opacity-0 scale-75")}
              style={{ transitionDelay: `${tech.delay}ms` }}
            >
              <div className="w-24 h-24 md:w-32 md:h-32 flex items-center justify-center text-6xl">
                {tech.icon}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
