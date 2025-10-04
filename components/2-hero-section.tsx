"use client"

import { useEffect, useRef, useState } from "react"

export function HeroSection() {
  const sectionRef = useRef<HTMLElement>(null)
  const [opacity, setOpacity] = useState(1)
  const [isMounted, setIsMounted] = useState(false)

  // Set mounted state to prevent hydration mismatch
  useEffect(() => {
    setIsMounted(true)
  }, [])

  useEffect(() => {
    const handleScroll = () => {
      if (!sectionRef.current) return
      
      const scrolled = window.scrollY
      const windowHeight = window.innerHeight
      const sectionTop = sectionRef.current.offsetTop
      const sectionHeight = sectionRef.current.offsetHeight
      
      // Calculate section center position
      const sectionCenter = sectionTop + (sectionHeight / 2)
      // Calculate viewport center position
      const viewportCenter = scrolled + (windowHeight / 2)
      
      // Distance from viewport center to section center
      const distanceFromCenter = Math.abs(viewportCenter - sectionCenter)
      
      // Maximum distance for fade calculation (half viewport height)
      const maxDistance = windowHeight / 2
      
      let newOpacity = 1
      
      if (distanceFromCenter <= maxDistance) {
        // Calculate opacity based on distance from center
        // Peak opacity (1) when perfectly centered, fades as it moves away
        newOpacity = 1 - (distanceFromCenter / maxDistance)
      } else {
        // Completely hidden when too far from center
        newOpacity = 0
      }
      
      setOpacity(Math.max(0, Math.min(1, newOpacity)))
    }

    window.addEventListener("scroll", handleScroll)
    // Check initial scroll position
    handleScroll()
    
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <section
      ref={sectionRef}
      id="home"
      className="relative min-h-screen flex items-center justify-center overflow-hidden transition-opacity duration-150"
      style={{ opacity }}
    >
      {/* Animated stars background - only render on client to avoid hydration mismatch */}
      {isMounted && (
        <div className="absolute inset-0">
          {[...Array(50)].map((_, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 bg-foreground/50 rounded-full animate-pulse"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 3}s`,
                animationDuration: `${2 + Math.random() * 3}s`,
              }}
            />
          ))}
        </div>
      )}


      <div className="relative z-10 text-center px-6">
        <h1 className="text-6xl md:text-8xl font-bold text-primary animate-pulse-glow">Earth needs you.</h1>
      </div>
    </section>
  )
}
