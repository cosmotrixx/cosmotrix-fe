"use client"

import { useRef } from "react";

export function DocumentationSection() {
    const sectionRef = useRef<HTMLElement>(null);
  return (
    <section ref={sectionRef} className="relative min-h-screen w-full flex items-center justify-center overflow-hidden py-20 px-6">
      <div className="max-w-7xl w-full mx-auto">
        <div className="space-y-12">
          {/* Section Title */}
          <div className="text-center space-y-4">
            <h2 className="text-5xl lg:text-6xl font-bold">
              <span className="bg-gradient-to-r from-orange-500 via-yellow-400 to-yellow-300 bg-clip-text text-transparent">
                Documentation
              </span>
            </h2>
          </div>

          {/* Video Embed */}
          <div className="relative w-full max-w-5xl mx-auto">
            <div className="relative aspect-video rounded-2xl overflow-hidden shadow-2xl border border-purple-500/30">
              <iframe
                className="w-full h-full"
                src="https://www.youtube.com/embed/mjLlNM3EISQ"
                title="Cosmotrix Documentation"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
