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
          className="w-full relative py-8 md:py-10 overflow-hidden"
          style={{ background: 'linear-gradient(90deg, #150737 0%, #2883A6 100%)' }}
        >
          <style jsx>{`
            @keyframes scroll {
              0% {
                transform: translateX(0);
              }
              100% {
                transform: translateX(-50%);
              }
            }
            .animate-scroll {
              animation: scroll 30s linear infinite;
            }
            .animate-scroll:hover {
              animation-play-state: paused;
            }
          `}</style>
          
          <div className="flex animate-scroll">
            {/* First set of logos */}
            {[
              { name: "Next.js", Comp: NextJSLogo },
              { name: "Blender", Comp: BlenderLogo },
              { name: "three.js", Comp: ThreeJSLogo },
              { name: "Phaser", Comp: PhaserLogo },
              { name: "Figma", Comp: FigmaLogo },
              { name: "Gemini", Comp: GeminiLogo },
              { name: "LangChain", Comp: LangChainLogo },
              { name: "Procreate", Comp: ProcreateLogo },
            ].map(({ name, Comp }, index) => (
              <div
                key={`first-${index}`}
                className={cn(
                  "flex-shrink-0 px-8 md:px-12 flex items-center justify-center text-muted-foreground transition-opacity duration-1000",
                  isVisible ? "opacity-100" : "opacity-0"
                )}
              >
                <Comp className="h-8 md:h-10 w-auto" />
              </div>
            ))}
            
            {[
              { name: "Next.js", Comp: NextJSLogo },
              { name: "Blender", Comp: BlenderLogo },
              { name: "three.js", Comp: ThreeJSLogo },
              { name: "Phaser", Comp: PhaserLogo },
              { name: "Figma", Comp: FigmaLogo },
              { name: "Gemini", Comp: GeminiLogo },
              { name: "LangChain", Comp: LangChainLogo },
              { name: "Procreate", Comp: ProcreateLogo },
            ].map(({ name, Comp }, index) => (
              <div
                key={`second-${index}`}
                className={cn(
                  "flex-shrink-0 px-8 md:px-12 flex items-center justify-center text-muted-foreground transition-opacity duration-1000",
                  isVisible ? "opacity-100" : "opacity-0"
                )}
              >
                <Comp className="h-8 md:h-10 w-auto" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
