"use client"

import { useEffect, useRef, useState } from "react"
import Image from "next/image"
import { cn } from "../lib/utils"
import { OrbitLine } from "./orbit-line"
import { getChapterProgress, isChapterUnlocked, completeChapter } from "../lib/chapter-progress"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "./ui/alert-dialog"

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
    title: 'Prologue',
    image: '/images/prologue.png',
    position: { top: '5%', left: '26%', transform: 'translate(-50%, -50%)' },
    delay: 'delay-200'
  },
  {
    id: 'kingdom-sun',
    title: 'Kingdom of The Sun',
    image: '/images/kingdom-sun.png',
    position: { top: '13%', left: '45%', transform: 'translateY(-50%)' },
    delay: 'delay-300'
  },
  {
    id: 'hidden-war',
    title: 'Hidden War',
    image: '/images/hidden-war.png',
    position: { top: '35%', left: '56%', transform: 'translateY(-50%)' },
    delay: 'delay-400'
  },
  {
    id: 'flare-breaks-free',
    title: 'When the flare breaks free',
    image: '/images/flare-breaks-free.png',
    position: { bottom: '43%', right: '30%' },
    delay: 'delay-500'
  }
]

export function EarthCallToActionSection() {
  const sectionRef = useRef<HTMLElement>(null)
  const [isVisible, setIsVisible] = useState(false)
  const [unlockedChapters, setUnlockedChapters] = useState<Set<string>>(new Set())
  const [currentChapter, setCurrentChapter] = useState<string>('')
  const [showLockedDialog, setShowLockedDialog] = useState(false)
  const [lockedChapterInfo, setLockedChapterInfo] = useState<{ title: string; previousChapter: string }>({
    title: '',
    previousChapter: ''
  })

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
    // Check which chapters are unlocked and get current chapter
    const unlocked = new Set<string>()
    chapters.forEach(chapter => {
      if (isChapterUnlocked(chapter.id)) {
        unlocked.add(chapter.id)
      }
    })
    setUnlockedChapters(unlocked)
    
    // Get current chapter from progress
    const progress = getChapterProgress()
    setCurrentChapter(progress.currentChapter)
  }, [])

  const handleChapterClick = (chapterId: string, chapterTitle: string, chapterIndex: number) => {
    if (unlockedChapters.has(chapterId)) {
      // Navigate to chapter or handle click
      console.log(`Navigating to chapter: ${chapterId}`)
      // You can add navigation logic here
      // Example: router.push(`/chapter/${chapterId}`)
    } else {
      // Show popup for locked chapter
      const previousChapter = chapterIndex > 0 ? chapters[chapterIndex - 1].title : ''
      setLockedChapterInfo({
        title: chapterTitle,
        previousChapter: previousChapter
      })
      setShowLockedDialog(true)
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
          {chapters.map((chapter, index) => {
            const isUnlocked = unlockedChapters.has(chapter.id)
            const isCurrent = chapter.id === currentChapter
            
            return (
              <div
                key={chapter.id}
                className={cn(
                  "absolute transition-all duration-1000 z-10",
                  chapter.delay,
                  isVisible ? "opacity-100 translate-y-0 translate-x-0" : "opacity-0 -translate-y-4",
                  isUnlocked
                    ? "cursor-pointer hover:scale-105 hover:z-20"
                    : "grayscale opacity-50 cursor-pointer",
                  isCurrent && isUnlocked && "animate-pulse-glow"
                )}
                style={chapter.position}
                onClick={() => handleChapterClick(chapter.id, chapter.title, index)}
                title={isUnlocked ? chapter.title : `Complete previous chapter to unlock ${chapter.title}`}
              >
                <div className={cn(
                  "relative",
                  isCurrent && isUnlocked && "animate-flicker"
                )}>
                  <Image
                    src={chapter.image}
                    alt={chapter.title}
                    width={400}
                    height={chapter.id === 'prologue' ? 150 : 300}
                    className="transition-transform duration-300"
                  />
                  {isCurrent && isUnlocked && (
                    <>
                      {/* Pulsing ring indicator */}
                      <div className="absolute inset-0 -m-4 rounded-full border-4 border-yellow-400/60 animate-ping pointer-events-none" />
                      <div className="absolute inset-0 -m-2 rounded-full border-0 border-yellow-300/80 animate-pulse pointer-events-none" />
                      {/* Glow effect */}
                      <div className="absolute inset-0 -m-8 rounded-full blur-xl animate-pulse pointer-events-none" />
                    </>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Locked Chapter Dialog */}
      <AlertDialog open={showLockedDialog} onOpenChange={setShowLockedDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>🔒 Chapter Locked</AlertDialogTitle>
            <AlertDialogDescription asChild>
              <div className="space-y-3">
                <p className="text-base">
                  <strong>{lockedChapterInfo.title}</strong> is currently locked.
                </p>
                <p>
                  You need to complete <strong>{lockedChapterInfo.previousChapter}</strong> first to unlock this chapter.
                </p>
                <p className="text-sm text-muted-foreground">
                  Complete the previous chapters in order to progress through the story.
                </p>
              </div>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction>Got it!</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </section>
  )
}
