"use client"

import { useState, useEffect } from "react"
import Link from "next/link"

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
    <nav className="fixed left-1/2 transform -translate-x-1/2 top-4 z-50 w-[92%] max-w-[1100px] flex justify-center pointer-events-auto">
        <div className="w-full bg-white/6 backdrop-blur-md rounded-[26px] py-2 px-4 shadow-lg">
          <ul className="flex gap-7 justify-center items-center text-white font-medium">
            <li><Link href="#" className="text-white/90 px-2 py-1 rounded-md hover:bg-white/6 transition-transform transform hover:-translate-y-0.5 text-sm">Home</Link></li>
            <li><Link href="#" className="text-white/90 px-2 py-1 rounded-md hover:bg-white/6 transition-transform transform hover:-translate-y-0.5 text-sm">Story</Link></li>
            <li><Link href="#" className="text-white/90 px-2 py-1 rounded-md hover:bg-white/6 transition-transform transform hover:-translate-y-0.5 text-sm">Characters</Link></li>
            <li><Link href="#" className="text-white/90 px-2 py-1 rounded-md hover:bg-white/6 transition-transform transform hover:-translate-y-0.5 text-sm">Our AI</Link></li>
            <li><Link href="#" className="text-white/90 px-2 py-1 rounded-md hover:bg-white/6 transition-transform transform hover:-translate-y-0.5 text-sm">Game</Link></li>
          </ul>
        </div>
      </nav>
  )
}