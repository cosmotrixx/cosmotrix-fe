"use client"

import { useRef } from 'react';

export function TeachingAssistantSection() {
    const sectionRef = useRef<HTMLElement>(null);
  return (
    <section ref={sectionRef} className="relative min-h-screen w-full flex items-center justify-center overflow-hidden bg-gradient-to-b from-black to-[#1a0b2e] py-20 px-6">
      <div className="max-w-7xl w-full mx-auto">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="space-y-6">
            <p className="text-white/80 text-lg font-light tracking-wide">
              get documents
            </p>
            <h2 className="text-5xl lg:text-6xl font-bold">
              <span className="bg-gradient-to-r from-orange-400 via-yellow-400 to-yellow-500 bg-clip-text text-transparent">
                teaching assistant
              </span>
            </h2>
            <p className="text-white/70 text-lg leading-relaxed max-w-xl">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
            </p>
          </div>

          {/* Right Content - Stacked Cards */}
          <div className="relative flex items-center justify-center lg:justify-end">
            <div className="relative w-full max-w-md aspect-[3/4]">
              {/* Back Card - Blue */}
              <div 
                className="absolute top-8 -right-4 w-full h-full rounded-3xl bg-gradient-to-br from-blue-600 to-blue-800 shadow-2xl"
                style={{
                  transform: 'rotate(8deg)',
                }}
              />
              
              {/* Middle Card - Purple/Blue */}
              <div 
                className="absolute top-4 -right-2 w-full h-full rounded-3xl bg-gradient-to-br from-purple-500 to-blue-700 shadow-2xl"
                style={{
                  transform: 'rotate(4deg)',
                }}
              />
              
              {/* Front Card - Purple */}
              <div className="relative w-full h-full rounded-3xl bg-gradient-to-br from-purple-500 via-purple-600 to-purple-700 shadow-2xl overflow-hidden">
                {/* Placeholder for card content */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-white/20 text-2xl font-bold">
                    Content Area
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
