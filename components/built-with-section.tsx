"use client"

import { useEffect, useRef, useState } from "react"
import { cn } from "../lib/utils"
import NextJSLogo from "./logos/nextjs"
import BlenderLogo from "./logos/blender"
import ThreeJSLogo from "./logos/threejs"
import PhaserLogo from "./logos/phaser"
import FigmaLogo from "./logos/figma"
import GeminiLogo from "./logos/gemini"
import LangChainLogo from "./logos/langchain"
import ProcreateLogo from "./logos/procreate"

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
      <div
        className="absolute inset-0 -z-10"
      />
      <div className="text-center">
        <h2
          className={cn(
            "text-3xl md:text-4xl font-bold mb-12 px-6 transition-all duration-1000",
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10",
          )}
        >
          <span style={{ color: '#68A2AA' }}>Built </span>
          <span className="text-white font-light" style={{ color: '#68A2AA' }}>with</span>
        </h2>

        <div 
          className="w-full flex flex-wrap items-center justify-center gap-10 md:gap-16 py-8 md:py-10"
          style={{ background: 'linear-gradient(90deg, #150737 0%, #2883A6 100%)' }}
        >
          {[
            { name: "Next.js", delay: 0, Comp: NextJSLogo },
            { name: "Blender", delay: 100, Comp: BlenderLogo },
            { name: "three.js", delay: 200, Comp: ThreeJSLogo },
            { name: "Phaser", delay: 300, Comp: PhaserLogo },
            { name: "Figma", delay: 400, Comp: FigmaLogo },
            { name: "Gemini", delay: 500, Comp: GeminiLogo },
            { name: "LangChain", delay: 600, Comp: LangChainLogo },
            { name: "Procreate", delay: 700, Comp: ProcreateLogo },
          ].map(({ delay, Comp }, index) => (
            <div
              key={index}
              className={cn(
                "transition-all duration-1000 text-muted-foreground",
                isVisible ? "opacity-100 scale-100" : "opacity-0 scale-90"
              )}
              style={{ transitionDelay: `${delay}ms` }}
            >
              <Comp className="h-8 md:h-10 w-auto" />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
