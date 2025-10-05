"use client"

import { useState, useEffect } from "react"

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
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled ? "bg-background/80 backdrop-blur-lg border-b border-border" : "bg-transparent"}`}
    >
        <div className="flex items-center justify-center gap-8">
          <a href="#home" className="text-sm font-medium text-foreground/80 hover:text-primary transition-colors">
            Home
          </a>
          {/* <a href="#story" className="text-sm font-medium text-foreground/80 hover:text-primary transition-colors">
            Story
          </a> */}
          <a href="/story" className="text-sm font-medium text-foreground/80 hover:text-primary transition-colors">
            Story
          </a>
          <a href="#characters" className="text-sm font-medium text-foreground/80 hover:text-primary transition-colors">
            Characters
          </a>
          <a href="game" className="text-sm font-medium text-foreground/80 hover:text-primary transition-colors">
            Game
          </a>
          <a href="#team" className="text-sm font-medium text-foreground/80 hover:text-primary transition-colors">
            About Us
          </a>
      </div>
    </nav>
  )
}