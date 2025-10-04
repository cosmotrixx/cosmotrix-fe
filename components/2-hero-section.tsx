"use client"

import { useEffect, useRef, useState } from "react"
import { StarField } from "./backgrounds/star-field"

export function HeroSection() {
  const sectionRef = useRef<HTMLElement>(null)
  const [opacity, setOpacity] = useState(1)

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
      {/* Dense starfield with connections */}
      <StarField 
        opacity={opacity} 
        numParticles={300}
        particleSize={3}
        speed={0.5}
        enableConnections={true}
        connectionDistance={150}
        className="z-2"
      />

      <div className="relative z-10 text-center px-6">
        <h1 className="text-6xl md:text-8xl font-bold text-primary animate-pulse-glow">Earth needs you.</h1>
      </div>
    </section>
  )
}
