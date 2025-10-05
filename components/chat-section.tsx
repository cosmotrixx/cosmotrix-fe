"use client"

import type React from "react"
import { useEffect, useMemo, useRef, useState } from "react"
import { ChevronLeft, ChevronRight, Send, Sparkles, StopCircle } from "lucide-react"
import { cn } from "../lib/utils"
import { Button } from "./ui/button"
import { Card, CardContent } from "./ui/card"
import { Input } from "./ui/input"
import Image from "next/image"

type Role = "user" | "assistant" | "system"

type Message = {
  role: Role
  content: string
}

type ChatResponse = {
  response: string
  thread_id: string
  status: string
}

type CharacterKey =
  | "pilot"
  | "powerOperator"
  | "astronaut"
  | "satelliteOperator"
  | "emergencyCoordinator"
  | "scientist"

type Character = {
  key: CharacterKey
  name: string
  title: string
  endpoint: string
  greeting: string
  colorClass: string
  image: string
}

// Resolve backend base URL
const API_BASE =
  process.env.NEXT_PUBLIC_BACKEND_URL ||
  (typeof window !== "undefined" && window.location.hostname === "localhost"
    ? "http://localhost:3000"
    : "")


const CHARACTERS: Character[] = [
  {
    key: "pilot",
    name: "Captain Rina",
    title: "Pilot",
    endpoint: "/api/characters/pilot",
    greeting: "Clear skies. What would you like to know about flying through space weather?",
    colorClass:
      "from-violet-600/30 to-purple-500/20 dark:from-violet-500/30 dark:to-fuchsia-500/10",
    image: "/images/professions/Rina.png",
  },
  {
    key: "powerOperator",
    name: "Ibrahim",
    title: "Power Operator",
    endpoint: "/api/characters/power-operator",
    greeting: "Control room online. Ask about grid stability and geomagnetic storms.",
    colorClass:
      "from-fuchsia-600/30 to-purple-500/20 dark:from-fuchsia-500/30 dark:to-violet-500/10",
    image: "/images/professions/Ibrahim.png",
  },
  {
    key: "astronaut",
    name: "Dr. Elena",
    title: "Astronaut",
    endpoint: "/api/characters/astronaut",
    greeting: "Crew nominal. Curious about life and safety in orbit during solar events?",
    colorClass:
      "from-indigo-600/30 to-purple-500/20 dark:from-indigo-500/30 dark:to-purple-500/10",
    image: "/images/professions/Elena.png",
  },
  {
    key: "satelliteOperator",
    name: "Budi",
    title: "Satellite Operator",
    endpoint: "/api/characters/satellite-operator",
    greeting: "Telemetry green (mostly). Ask me about satellite anomalies and recovery.",
    colorClass:
      "from-purple-600/30 to-fuchsia-500/20 dark:from-purple-500/30 dark:to-pink-500/10",
    image: "/images/professions/Budi.png",
  },
  {
    key: "emergencyCoordinator",
    name: "Arief",
    title: "Emergency Coordinator",
    endpoint: "/api/characters/emergency-coordinator",
    greeting: "Operations ready. Want to know how we keep people safe when comms wobble?",
    colorClass:
      "from-fuchsia-600/30 to-indigo-500/20 dark:from-fuchsia-500/30 dark:to-indigo-500/10",
    image: "/images/professions/Arief.png",
  },
  {
    key: "scientist",
    name: "Dr. Maya",
    title: "Scientist",
    endpoint: "/api/characters/scientist",
    greeting: "Forecast desk here. Ask anything about flares, CMEs, and predictions.",
    colorClass:
      "from-purple-600/30 to-blue-500/20 dark:from-purple-500/30 dark:to-blue-500/10",
    image: "/images/professions/Maya.png",
  },
]

export function ChatSection() {
  const sectionRef = useRef<HTMLElement>(null)
  const [isVisible, setIsVisible] = useState(false)
  const [idx, setIdx] = useState(0)
  const character = CHARACTERS[idx]

  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState("")
  const [isSending, setIsSending] = useState(false)
  const [streamAbort, setStreamAbort] = useState<(() => void) | null>(null)
  const scrollRef = useRef<HTMLDivElement>(null)

  // Intersection observer for animations
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
        }
      },
      { threshold: 0.2 },
    )

    if (sectionRef.current) {
      observer.observe(sectionRef.current)
    }

    return () => observer.disconnect()
  }, [])

  // Auto scroll to bottom on new messages
  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" })
  }, [messages])

  // Reset conversation when character changes
  useEffect(() => {
    setMessages([])
    setInput("")
  }, [character.key])

  const placeholderGreeting = useMemo(() => character.greeting, [character])

  const handlePrev = () => setIdx((p) => (p - 1 + CHARACTERS.length) % CHARACTERS.length)
  const handleNext = () => setIdx((p) => (p + 1) % CHARACTERS.length)

  async function sendMessage() {
    if (!input.trim() || isSending) return
    const userMessage: Message = { role: "user", content: input.trim() }
    setInput("")
    setMessages((m) => [...m, userMessage])
    setIsSending(true)

    try {
      const url = `${API_BASE}${character.endpoint}`
      console.log('🔍 Fetching:', url)
      console.log('📤 Sending messages:', [...messages, userMessage])
      
      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: [...messages, userMessage] }),
      })

      console.log('📥 Response status:', res.status)
      console.log('📥 Response headers:', Object.fromEntries(res.headers.entries()))

      if (!res.ok) {
        const txt = await res.text()
        console.error('❌ Error response:', txt)
        throw new Error(txt || `Request failed (${res.status})`)
      }
      const data: ChatResponse = await res.json()
      console.log('✅ Success:', data)

      // Simulated streaming typing animation
      await streamAppend(data.response)
    } catch (err: unknown) {
      console.error('❌ Fetch error:', err)
      const msg = err instanceof Error ? err.message : "unknown error"
      await streamAppend(`Sorry, something went wrong: ${msg}`)
    } finally {
      setIsSending(false)
      setStreamAbort(null)
    }
  }

  async function streamAppend(full: string) {
    const base: Message = { role: "assistant", content: "" }
    setMessages((m) => [...m, base])

    let i = 0
    let cancelled = false
    const abort = () => {
      cancelled = true
    }
    setStreamAbort(() => abort)

    await new Promise<void>((resolve) => {
      const push = () => {
        if (cancelled) return resolve()
        i = Math.min(i + Math.max(1, Math.floor(full.length / 120)), full.length)
        setMessages((m) => {
          const copy = [...m]
          const last = copy[copy.length - 1]
          if (last && last.role === "assistant") {
            copy[copy.length - 1] = { ...last, content: full.slice(0, i) }
          }
          return copy
        })
        if (i >= full.length) return resolve()
        setTimeout(push, 15) // typing cadence
      }
      setTimeout(push, 10)
    })
  }

  return (
    <section ref={sectionRef} className="relative min-h-screen flex items-center justify-center py-24 px-6">
      {/* Chat Interface Section */}
      <div
        className={cn(
          "transition-all duration-1000",
          isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10",
        )}
        style={{ transitionDelay: "600ms" }}
      >
        <div className="text-center mb-8">
          <p className="text-xl md:text-2xl text-foreground/80">
            You can ask anything you&apos;re <span className="font-bold text-foreground">curious</span> about
          </p>
        </div>

        <Card className="bg-muted/30 border-border/50 backdrop-blur-sm max-w-6xl mx-auto w-full">
          <CardContent className="p-6 md:p-8">
            <div className="grid md:grid-cols-[300px_1fr] gap-6 items-start">
              {/* Character Selector */}
              <div className="flex flex-col items-center gap-4">
                <div className="relative w-full">
                  <div
                    className={cn(
                      "pointer-events-none absolute -inset-1 rounded-xl bg-gradient-to-br opacity-50 blur",
                      character.colorClass,
                    )}
                  />
                  <div className="relative bg-background/80 backdrop-blur-sm rounded-lg p-4 border border-border/50">
                    <div className="flex items-center justify-between mb-4">
                      <Button variant="ghost" size="icon" onClick={handlePrev} aria-label="Previous">
                        <ChevronLeft className="size-5" />
                      </Button>
                      <div className="text-center px-2">
                        <div className="text-sm font-semibold text-foreground">{character.name}</div>
                        <div className="text-xs text-muted-foreground">{character.title}</div>
                      </div>
                      <Button variant="ghost" size="icon" onClick={handleNext} aria-label="Next">
                        <ChevronRight className="size-5" />
                      </Button>
                    </div>
                    <div className="w-full aspect-square rounded-lg border bg-gradient-to-br from-background/40 to-background/10 shadow-inner overflow-hidden">
                      <Image
                        src={character.image}
                        alt={`${character.name} - ${character.title}`}
                        width={200}
                        height={200}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div>
                </div>
                <p className="text-xs text-center text-muted-foreground px-2">{placeholderGreeting}</p>
              </div>

              {/* Chat Interface - unchanged */}
              <div className="flex flex-col gap-4 h-[400px]">
                <div
                  ref={scrollRef}
                  className="flex-1 min-h-0 space-y-3 overflow-auto rounded-lg border bg-background/60 backdrop-blur-sm p-4"
                >
                  {messages.length === 0 ? (
                    <div className="flex items-center justify-center h-full">
                      <p className="text-sm text-muted-foreground">Ask me anything about space weather...</p>
                    </div>
                  ) : null}

                  {messages.map((m, i) => (
                    <div
                      key={i}
                      className={cn("flex w-full", m.role === "user" ? "justify-end" : "justify-start")}
                    >
                      <div
                        className={cn(
                          "max-w-[85%] whitespace-pre-wrap rounded-xl px-3 py-2 text-sm shadow-sm",
                          m.role === "user"
                            ? "bg-primary text-primary-foreground"
                            : "bg-secondary text-secondary-foreground",
                        )}
                      >
                        {m.content}
                      </div>
                    </div>
                  ))}
                </div>

                <form
                  onSubmit={(e) => {
                    e.preventDefault()
                    sendMessage()
                  }}
                  className="flex items-center gap-2"
                >
                  <Input
                    value={input}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setInput(e.target.value)}
                    placeholder={`Ask ${character.title}...`}
                    disabled={isSending}
                    className="flex-1 bg-background/80"
                  />
                  {streamAbort ? (
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => streamAbort?.()}
                      title="Stop typing"
                      size="sm"
                    >
                      <StopCircle className="mr-1 size-4" /> Stop
                    </Button>
                  ) : null}
                  <Button type="submit" disabled={isSending || !input.trim()} size="sm">
                    <Send className="mr-1 size-4" /> Send
                  </Button>
                </form>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  )
}
