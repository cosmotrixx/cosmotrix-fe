"use client"

import Image from "next/image"
import { useEffect, useRef, useState } from "react"
import { cn } from "../lib/utils"
import { StarField } from "./backgrounds/star-field"

export function StoryHeroSection() {
  const sectionRef = useRef<HTMLElement>(null)
  const [isVisible, setIsVisible] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const [backgroundOpacity, setBackgroundOpacity] = useState(1)

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

  useEffect(() => {
    const handleScroll = () => {
      if (!sectionRef.current) return
      
      const scrolled = window.scrollY
      const windowHeight = window.innerHeight
      const sectionHeight = sectionRef.current.offsetHeight
      const sectionTop = sectionRef.current.offsetTop
      
      // Update scroll state for header
      setIsScrolled(scrolled > 50)
      
      // Calculate background opacity based on section visibility
      const sectionBottom = sectionTop + sectionHeight
      const viewportBottom = scrolled + windowHeight
      
      // Start fading when 70% of section is scrolled past
      const fadeStart = sectionHeight * 0.7
      const fadeEnd = sectionHeight
      
      if (scrolled <= fadeStart) {
        // Fully visible
        setBackgroundOpacity(1)
      } else if (scrolled >= fadeEnd) {
        // Fully faded
        setBackgroundOpacity(0)
      } else {
        // Fading out
        const fadeProgress = (scrolled - fadeStart) / (fadeEnd - fadeStart)
        setBackgroundOpacity(1 - fadeProgress)
      }
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
      className={cn(
        "relative min-h-[150vh] flex items-center justify-center py-24 px-6 overflow-hidden transition-all duration-300",
        isScrolled ? "bg-background/80 backdrop-blur-lg border-border" : "bg-transparent",
      )}
    >
      {/* Background with fade effect */}
      <div 
        className="absolute inset-0 transition-opacity duration-300"
        style={{
          backgroundImage: "url('/images/bg-1.png')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          opacity: backgroundOpacity
        }}
      />
      
      {/* Interactive constellation */}
      <StarField 
        opacity={backgroundOpacity * 0.8}
        numParticles={100}
        enableHover={true}
        enableClick={true}
        hoverMode="grab"
        clickMode="repulse"
        connectionDistance={100}
        connectionOpacity={0.2}
        colors={["#ffffff", "#ffd700", "#87ceeb"]}
        className="z-2"
      />
      
      {/* Optional overlay that also fades */}
      <div 
        className="absolute inset-0 bg-black/20 z-0 transition-opacity duration-300"
        style={{ opacity: backgroundOpacity }}
      />
      
      {/* Your existing content with higher z-index */}
      <div className="container mx-auto max-w-5xl relative z-10 -mt-32">
        <div
          className={cn(
            "text-center transition-all duration-1000",
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10",
          )}
        >
          {/* Subtitle text */}
          <div className="mb-2 flex justify-center">
            <h2 className="text-[50px] font-light text-white leading-tight">
              a Clock, a Secret, and
            </h2>
          </div>

          {/* Main title with gradient text */}
          <div className="mb-2 flex justify-center">
            <h1 className="text-[80px] font-bold leading-tight">
              <span className="bg-gradient-to-r from-orange-500 via-yellow-400 to-yellow-300 bg-clip-text text-transparent">
                an Invisible War
              </span>
              <span className="text-white"> in the Sky</span>
            </h1>
          </div>

          <p className="text-[20px] font-normal text-white max-w-3xl mx-auto leading-relaxed">
            Step into Luna&apos;s world. With the power of AI, IoT, and magical data, kids become heroes in a story where
            science meets adventure.
          </p>
        </div>

        {/* Character silhouette */}
        <div
          className={cn(
            "mt-8 flex justify-start ml-8 md:ml-16 lg:ml-24 transition-all duration-1000 delay-500",
            isVisible ? "opacity-100 scale-100" : "opacity-0 scale-75",
          )}
        >
          <div className="relative w-56 h-56 md:w-72 md:h-72 lg:w-80 lg:h-80">
            <Image
              src="/images/silhouette-1.png"
              alt="Character silhouette"
              fill
              className="object-contain animate-pulse-glow"
            />
          </div>
        </div>
      </div>
    </section>
  )
}
