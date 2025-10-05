"use client"

import { useState, useEffect } from "react"
import Image from "next/image"

export function Navigation() {
  const [isScrolled, setIsScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 flex justify-center pt-[55px] transition-all duration-300">
      <div 
        className="flex items-center justify-between gap-12 px-8 py-3 rounded-full transition-all duration-300 w-full"
        style={{
          background: 'rgba(255, 255, 255, 0.2)',
          backdropFilter: 'blur(25px)',
          WebkitBackdropFilter: 'blur(25px)',
          minWidth: 'fit-content',
          maxWidth: '1240px',
        }}
      >
        {/* Logo on the left */}
        <a href="#home" className="flex items-center shrink-0 mb-1">
          <Image 
            src="/images/cosmotrix_purple_full.svg" 
            alt="Cosmotrix Logo" 
            width={150} 
            height={30}
            className="h-8 w-auto"
            priority
          />
        </a>

        {/* Menu items on the right */}
        <div className="flex items-center gap-12">
          <a href="#home" className="text-sm font-medium text-white hover:text-white/80 transition-colors whitespace-nowrap">
            Home
          </a>
          <a href="/story" className="text-sm font-medium text-white/60 hover:text-white/80 transition-colors whitespace-nowrap">
            Story
          </a>
          <a href="/characters" className="text-sm font-medium text-white/60 hover:text-white/80 transition-colors whitespace-nowrap">
            Characters
          </a>
          <a href="/game" className="text-sm font-medium text-white/60 hover:text-white/80 transition-colors whitespace-nowrap">
            Game
          </a>
          <a href="/about" className="text-sm font-medium text-white/60 hover:text-white/80 transition-colors whitespace-nowrap">
          About
        </a>
        </div>
      </div>
    </nav>
  )
}