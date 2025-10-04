"use client"

import { useEffect, useRef, useState } from "react"
import { cn } from "../lib/utils"

export function LivingStoriesSection() {
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
        <div
          className={cn(
            "text-center mb-16 transition-all duration-1000",
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10",
          )}
        >
          <p className="text-xl md:text-2xl text-foreground/80 mb-2">Not numbers. Not static charts.</p>
          <h2 className="text-4xl md:text-6xl font-bold text-foreground">But living stories of the Sun</h2>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {[
            {
              title: "THE SUN (EUV)",
              subtitle: "SDI-A 131A 171A 193A 284A 304A Thematic",
              image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-Okp8xCp5XYuH6HexGvQZs7BP9u0xxU.png",
              delay: 0,
            },
            {
              title: "THE AURORA",
              subtitle: "Northern Hemisphere Southern Hemisphere",
              image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-Okp8xCp5XYuH6HexGvQZs7BP9u0xxU.png",
              delay: 200,
            },
            {
              title: "CORONAL MASS EJECTIONS",
              subtitle: "GOES-19 CCOR-1 LASCO C2 LASCO C3",
              image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-Okp8xCp5XYuH6HexGvQZs7BP9u0xxU.png",
              delay: 400,
            },
          ].map((item, index) => (
            <div
              key={index}
              className={cn(
                "bg-card border border-border rounded-lg p-6 transition-all duration-1000",
                isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10",
              )}
              style={{ transitionDelay: `${item.delay}ms` }}
            >
              <div className="mb-4">
                <h3 className="text-sm font-bold text-foreground mb-1">{item.title}</h3>
                <p className="text-xs text-muted-foreground">{item.subtitle}</p>
              </div>
              <div className="aspect-square bg-muted rounded-lg overflow-hidden mb-4">
                <img src={item.image || "/placeholder.svg"} alt={item.title} className="w-full h-full object-cover" />
              </div>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center">
                  <svg className="w-4 h-4 text-secondary-foreground" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8 5v14l11-7z" />
                  </svg>
                </div>
                <div className="flex-1 h-1 bg-secondary rounded-full" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
