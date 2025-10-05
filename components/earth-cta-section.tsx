"use client"

import { useEffect, useRef, useState } from "react"
import Image from "next/image"
import { cn } from "../lib/utils"
import { OrbitLine } from "./orbit-line"

export function EarthCallToActionSection() {
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
    <section
      ref={sectionRef}
      className="relative py-24 pl-0 pr-6 bg-gradient-to-b from-background via-secondary/10 to-background overflow-hidden"
    >
      <div className="relative w-full">
        {/* Orbit lines */}
        <div
          className={cn(
            "relative transition-all duration-1000",
            isVisible ? "opacity-100 scale-100" : "opacity-0 scale-90",
          )}
        >
          <OrbitLine className="w-5/6 h-auto" />
          
          {/* Chapter I: Kingdom of the Sun - Top of outermost orbit */}
          <div 
            className={cn(
              "absolute transition-all duration-1000 delay-200 z-10",
              isVisible ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-4"
            )}
            style={{ top: '13%', left: '56%', transform: 'translate(-50%, -50%)' }}
          >
            <Image src="/images/kingdom-sun.png" alt="Kingdom of the Sun" width={400} height={150} />
          </div>

          {/* Chapter II: The Hidden War - Right side of second outermost orbit */}
          <div 
            className={cn(
              "absolute transition-all duration-1000 delay-300 z-10",
              isVisible ? "opacity-100 translate-x-0" : "opacity-0 translate-x-4"
            )}
            style={{ top: '34%', left: '55%', transform: 'translateY(-50%)' }}
          >
            <Image src="/images/hidden-war.png" alt="The Hidden War" width={400} height={300} />
          </div>

          {/* Chapter III: When Flare Breaks Free - Right side of second innermost orbit */}
          <div 
            className={cn(
              "absolute transition-all duration-1000 delay-400 z-10",
              isVisible ? "opacity-100 translate-x-0" : "opacity-0 translate-x-4"
            )}
            style={{ top: '51%', left:'46%', transform: 'translateY(-50%)' }}
          >
            <Image src="/images/flare-breaks-free.png" alt="When Flare Breaks Free" width={400} height={300} />
          </div>

          {/* Outro: The Legacy - Bottom right near outermost orbit */}
          <div 
            className={cn(
              "absolute transition-all duration-1000 delay-500 z-10",
              isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
            )}
            style={{ bottom: '13%', right: '25%' }}
          >
            <Image src="/images/legacy.png" alt="The Legacy" width={400} height={300} />
          </div>
        </div>
      </div>
    </section>
  )
}
