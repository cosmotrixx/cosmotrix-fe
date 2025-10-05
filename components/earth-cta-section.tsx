"use client"

import { useEffect, useRef, useState } from "react"
import Image from "next/image"
import { cn } from "../lib/utils"
import { OrbitLine } from "./orbit-line"
import { getChapterProgress, isChapterUnlocked, completeChapter } from "../lib/chapter-progress"

interface Chapter {
  id: string
  title: string
  image: string
  position: {
    top?: string
    bottom?: string
    left?: string
    right?: string
    transform?: string
  }
  delay: string
}

const chapters: Chapter[] = [
  {
    id: 'prologue',
    title: 'Kingdom of the Sun',
    image: '/images/prologue.png',
    position: { top: '5%', left: '26%', transform: 'translate(-50%, -50%)' },
    delay: 'delay-200'
  },
  {
    id: 'kingdom-sun',
    title: 'The Hidden War',
    image: '/images/kingdom-sun.png',
    position: { top: '13%', left: '45%', transform: 'translateY(-50%)' },
    delay: 'delay-300'
  },
  {
    id: 'hidden-war',
    title: 'When Flare Breaks Free',
    image: '/images/hidden-war.png',
    position: { top: '35%', left: '56%', transform: 'translateY(-50%)' },
    delay: 'delay-400'
  },
  {
    id: 'flare-breaks-free',
    title: 'The Legacy',
    image: '/images/flare-breaks-free.png',
    position: { bottom: '43%', right: '30%' },
    delay: 'delay-500'
  }
]

export function EarthCallToActionSection() {
  const sectionRef = useRef<HTMLElement>(null)
  const [isVisible, setIsVisible] = useState(false)
  const [unlockedChapters, setUnlockedChapters] = useState<Set<string>>(new Set())

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
    // Check which chapters are unlocked
    const unlocked = new Set<string>()
    chapters.forEach(chapter => {
      if (isChapterUnlocked(chapter.id)) {
        unlocked.add(chapter.id)
      }
    })
    setUnlockedChapters(unlocked)
  }, [])

  const handleChapterClick = (chapterId: string) => {
    if (unlockedChapters.has(chapterId)) {
      // Navigate to chapter or handle click
      console.log(`Navigating to chapter: ${chapterId}`)
      // You can add navigation logic here
      // Example: router.push(`/chapter/${chapterId}`)
    }
  }

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
          
          {/* Render all chapters dynamically */}
          {chapters.map((chapter) => {
            const isUnlocked = unlockedChapters.has(chapter.id)
            
            return (
              <div
                key={chapter.id}
                className={cn(
                  "absolute transition-all duration-1000 z-10",
                  chapter.delay,
                  isVisible ? "opacity-100 translate-y-0 translate-x-0" : "opacity-0 -translate-y-4",
                  isUnlocked
                    ? "cursor-pointer hover:scale-105 hover:z-20"
                    : "grayscale opacity-50 cursor-not-allowed",
                )}
                style={chapter.position}
                onClick={() => handleChapterClick(chapter.id)}
                title={isUnlocked ? chapter.title : `Complete previous chapter to unlock ${chapter.title}`}
              >
                <Image
                  src={chapter.image}
                  alt={chapter.title}
                  width={400}
                  height={chapter.id === 'prologue' ? 150 : 300}
                  className="transition-transform duration-300"
                />
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
