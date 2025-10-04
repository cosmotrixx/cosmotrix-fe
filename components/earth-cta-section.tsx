"use client"

import { useEffect, useRef, useState } from "react"
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
      <div className="w-full">
        <div
          className={cn(
            "flex justify-start items-center transition-all duration-1000",
            isVisible ? "opacity-100 scale-100" : "opacity-0 scale-90",
          )}
        >
            <OrbitLine className="w-full h-auto" />
        </div>
      </div>
    </section>
  )
}
