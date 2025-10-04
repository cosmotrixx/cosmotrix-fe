"use client"

import { useEffect, useRef, useState } from "react"
import { cn } from "../lib/utils"

export function ChaptersSection() {
  const sectionRef = useRef<HTMLElement>(null)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
        }
      },
      { threshold: 0.2 },
    )

    if (sectionRef.current) {
      observer.observe(sectionRef.current)
    }

    return () => observer.disconnect()
  }, [])

  const chapters = [
    {
      number: "I",
      title: "Kingdom of the Sun",
      description: "Meet Flare, CME, Solar Wind, and Aurora — elemental children of the Sun.",
      position: { top: "10%", left: "50%" },
      color: "from-accent to-primary",
    },
    {
      number: "II",
      title: "The Hidden War",
      description: "Learn how invisible storms disrupt Earth: power, GPS, satellites, and more",
      position: { top: "35%", right: "20%" },
      color: "from-primary to-accent",
    },
    {
      number: "III",
      title: "When Flare Breaks Free",
      description: "See the real impact on pilots, astronauts, farmers, and scientists.",
      position: { top: "60%", left: "30%" },
      color: "from-accent to-primary",
    },
    {
      number: "IV",
      title: "The Legacy",
      description: "Take your place as the next Solar Sentinel.",
      position: { bottom: "10%", right: "30%" },
      color: "from-primary to-accent",
    },
  ]

  return (
    <section
      ref={sectionRef}
      id="chapters"
      className="relative min-h-screen flex items-center justify-center py-24 px-6"
    >
      <div className="container mx-auto max-w-6xl">
        <div className="relative aspect-square max-w-4xl mx-auto">
          {/* Orbital rings */}
          {[1, 2, 3, 4].map((ring) => (
            <div
              key={ring}
              className={cn(
                "absolute inset-0 border border-border/30 rounded-full transition-all duration-1000",
                isVisible ? "opacity-100 scale-100" : "opacity-0 scale-75",
              )}
              style={{
                margin: `${ring * 8}%`,
                transitionDelay: `${ring * 100}ms`,
              }}
            />
          ))}

          {/* Chapters */}
          {chapters.map((chapter, index) => (
            <div
              key={index}
              className={cn(
                "absolute transition-all duration-1000",
                isVisible ? "opacity-100 scale-100" : "opacity-0 scale-0",
              )}
              style={{
                ...chapter.position,
                transform: "translate(-50%, -50%)",
                transitionDelay: `${(index + 1) * 200}ms`,
              }}
            >
              <div className="relative group cursor-pointer">
                {/* Planet/Node */}
                <div
                  className={cn(
                    "w-20 h-20 md:w-24 md:h-24 rounded-full bg-gradient-to-br",
                    chapter.color,
                    "animate-pulse-glow flex items-center justify-center",
                  )}
                >
                  <span className="text-2xl font-bold text-primary-foreground">{chapter.number}</span>
                </div>

                {/* Info card */}
                <div className="absolute top-full left-1/2 -translate-x-1/2 mt-4 w-64 bg-card border border-border rounded-lg p-4 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                  <h3 className="text-sm font-bold text-primary mb-1">
                    Chapter {chapter.number}. {chapter.title}
                  </h3>
                  <p className="text-xs text-muted-foreground leading-relaxed">{chapter.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
