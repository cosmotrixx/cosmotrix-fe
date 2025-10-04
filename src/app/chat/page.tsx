"use client"

import type React from "react"
import { useEffect, useMemo, useRef, useState } from "react"
import { ChevronLeft, ChevronRight, Send, Sparkles, StopCircle } from "lucide-react"

import { Button } from "../../../components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../../components/ui/card"
import { Input } from "../../../components/ui/input"
import { cn } from "../../../lib/utils"

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
}

// Resolve backend base URL. Prefer explicit env; fall back to sensible localhost or same-origin.
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
  },
  {
    key: "powerOperator",
    name: "Ibrahim",
    title: "Power Operator",
    endpoint: "/api/characters/power-operator",
    greeting: "Control room online. Ask about grid stability and geomagnetic storms.",
    colorClass:
      "from-fuchsia-600/30 to-purple-500/20 dark:from-fuchsia-500/30 dark:to-violet-500/10",
  },
  {
    key: "astronaut",
    name: "Dr. Elena",
    title: "Astronaut",
    endpoint: "/api/characters/astronaut",
    greeting: "Crew nominal. Curious about life and safety in orbit during solar events?",
    colorClass:
      "from-indigo-600/30 to-purple-500/20 dark:from-indigo-500/30 dark:to-purple-500/10",
  },
  {
    key: "satelliteOperator",
    name: "Budi",
    title: "Satellite Operator",
    endpoint: "/api/characters/satellite-operator",
    greeting: "Telemetry green (mostly). Ask me about satellite anomalies and recovery.",
    colorClass:
      "from-purple-600/30 to-fuchsia-500/20 dark:from-purple-500/30 dark:to-pink-500/10",
  },
  {
    key: "emergencyCoordinator",
    name: "Arief",
    title: "Emergency Coordinator",
    endpoint: "/api/characters/emergency-coordinator",
    greeting: "Operations ready. Want to know how we keep people safe when comms wobble?",
    colorClass:
      "from-fuchsia-600/30 to-indigo-500/20 dark:from-fuchsia-500/30 dark:to-indigo-500/10",
  },
  {
    key: "scientist",
    name: "Dr. Maya",
    title: "Scientist",
    endpoint: "/api/characters/scientist",
    greeting: "Forecast desk here. Ask anything about flares, CMEs, and predictions.",
    colorClass:
      "from-purple-600/30 to-blue-500/20 dark:from-purple-500/30 dark:to-blue-500/10",
  },
]

export default function ChatPage() {
  const [idx, setIdx] = useState(0)
  const character = CHARACTERS[idx]

  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState("")
  const [isSending, setIsSending] = useState(false)
  const [streamAbort, setStreamAbort] = useState<(() => void) | null>(null)
  const scrollRef = useRef<HTMLDivElement>(null)

  // Auto scroll to bottom on new messages
  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" })
  }, [messages])

  // Reset conversation when character changes (no persistence by design)
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
      const res = await fetch(`${API_BASE}${character.endpoint}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: [...messages, userMessage] }),
      })

      if (!res.ok) {
        const txt = await res.text()
        throw new Error(txt || `Request failed (${res.status})`)
      }
      const data: ChatResponse = await res.json()

      // Simulated streaming typing animation
      await streamAppend(data.response)
    } catch (err: unknown) {
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
    <div className="container mx-auto max-w-6xl px-4 py-8">
      <h1 className="mb-6 text-2xl font-semibold tracking-tight">Cosmotrix Chat</h1>

      <div className="grid gap-6 md:grid-cols-[360px_1fr]">
        {/* Left: character selector */}
        <Card className="relative overflow-hidden">
          <div
            className={cn(
              "pointer-events-none absolute -inset-1 rounded-xl bg-gradient-to-br",
              character.colorClass,
            )}
          />
          <CardHeader className="relative">
            <CardTitle className="text-lg">Select Profession</CardTitle>
            <CardDescription>Switch characters anytime</CardDescription>
          </CardHeader>
          <CardContent className="relative">
            <div className="flex items-center justify-between gap-2">
              <Button variant="ghost" size="icon-lg" onClick={handlePrev} aria-label="Previous">
                <ChevronLeft />
              </Button>
              <div className="flex flex-col items-center gap-4">
                <div className="size-40 rounded-xl border bg-gradient-to-br from-background/40 to-background/10 shadow-inner flex items-center justify-center">
                  {/* Placeholder avatar */}
                  <Sparkles className="size-10 text-primary" />
                </div>
                <div className="text-center">
                  <div className="text-base font-medium">{character.name}</div>
                  <div className="text-sm text-muted-foreground">{character.title}</div>
                </div>
              </div>
              <Button variant="ghost" size="icon-lg" onClick={handleNext} aria-label="Next">
                <ChevronRight />
              </Button>
            </div>

            <div className="mt-4 text-center text-xs text-muted-foreground">
              Endpoint: <code className="font-mono text-[10px]">{character.endpoint}</code>
            </div>
          </CardContent>
        </Card>

        {/* Right: chat panel */}
        <Card className="flex min-h-[540px] flex-col">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <span>{character.title}</span>
              <span className="text-muted-foreground">•</span>
              <span className="text-sm font-normal text-muted-foreground">{character.name}</span>
            </CardTitle>
            <CardDescription>
              {messages.length === 0 ? placeholderGreeting : "Ask another question or switch characters."}
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-1 flex-col gap-4 overflow-hidden">
            <div
              ref={scrollRef}
              className="flex-1 space-y-4 overflow-auto rounded-lg border bg-background/40 p-4"
            >
              {messages.length === 0 ? (
                <div className="text-sm text-muted-foreground">
                  Tip: your conversation isn&apos;t saved. Switching characters resets this panel.
                </div>
              ) : null}

              {messages.map((m, i) => (
                <div key={i} className={cn("flex w-full", m.role === "user" ? "justify-end" : "justify-start")}> 
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
                placeholder={`Message ${character.title}…`}
                disabled={isSending}
                className="flex-1"
                autoFocus
              />
              {streamAbort ? (
                <Button type="button" variant="outline" onClick={() => streamAbort?.()} title="Stop typing">
                  <StopCircle className="mr-1 size-4" /> Stop
                </Button>
              ) : null}
              <Button type="submit" disabled={isSending || !input.trim()}>
                <Send className="mr-1 size-4" /> Send
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
