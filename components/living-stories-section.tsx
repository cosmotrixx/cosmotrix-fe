"use client"

import { useEffect, useRef, useState } from "react"
import Image from "next/image"
import { cn } from "../lib/utils"

type AuroraTab = "northern" | "southern"
type CMETab = "ccor1" | "lascoC2" | "lascoC3"

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "https://cosmotrix-be.vercel.app"

export function LivingStoriesSection() {
  const sectionRef = useRef<HTMLElement>(null)
  const [isVisible, setIsVisible] = useState(false)
  const [auroraTab, setAuroraTab] = useState<AuroraTab>("northern")
  const [cmeTab, setCmeTab] = useState<CMETab>("ccor1")
  
  // Image URLs state
  const [suvImage, setSuvImage] = useState<string>("")
  const [auroraNorthImage, setAuroraNorthImage] = useState<string>("")
  const [auroraSouthImage, setAuroraSouthImage] = useState<string>("")
  const [cmeCcor1Image, setCmeCcor1Image] = useState<string>("")
  const [cmeLascoC2Image, setCmeLascoC2Image] = useState<string>("")
  const [cmeLascoC3Image, setCmeLascoC3Image] = useState<string>("")
  
  // Loading states
  const [isLoadingSuv, setIsLoadingSuv] = useState(true)
  const [isLoadingAurora, setIsLoadingAurora] = useState(true)
  const [isLoadingCme, setIsLoadingCme] = useState(true)

  // Fetch SUV image
  useEffect(() => {
    const fetchSuv = async () => {
      try {
        console.log('Fetching SUV from:', `${API_BASE_URL}/api/suv`)
        const response = await fetch(`${API_BASE_URL}/api/suv`, {
          method: 'GET',
          headers: {
            'Accept': 'application/json',
          },
        })
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }
        
        const result = await response.json()
        console.log('SUV result:', result)
        
        if (result.success && result.data?.video_url) {
          setSuvImage(result.data.video_url)
        }
      } catch (error) {
        console.error("Error fetching SUV image:", error)
      } finally {
        setIsLoadingSuv(false)
      }
    }
    fetchSuv()
  }, [])

  // Fetch Aurora images
  useEffect(() => {
    const fetchAurora = async () => {
      try {
        console.log('Fetching Aurora from:', `${API_BASE_URL}/api/aurora`)
        const [northResponse, southResponse] = await Promise.all([
          fetch(`${API_BASE_URL}/api/aurora?hemisphere=north`, {
            method: 'GET',
            headers: { 'Accept': 'application/json' },
          }),
          fetch(`${API_BASE_URL}/api/aurora?hemisphere=south`, {
            method: 'GET',
            headers: { 'Accept': 'application/json' },
          }),
        ])
        
        if (!northResponse.ok) {
          throw new Error(`Aurora North HTTP error! status: ${northResponse.status}`)
        }
        if (!southResponse.ok) {
          throw new Error(`Aurora South HTTP error! status: ${southResponse.status}`)
        }
        
        const northResult = await northResponse.json()
        const southResult = await southResponse.json()
        
        console.log('Aurora North result:', northResult)
        console.log('Aurora South result:', southResult)
        
        if (northResult.success && northResult.data?.video_url) {
          setAuroraNorthImage(northResult.data.video_url)
        }
        if (southResult.success && southResult.data?.video_url) {
          setAuroraSouthImage(southResult.data.video_url)
        }
      } catch (error) {
        console.error("Error fetching Aurora images:", error)
      } finally {
        setIsLoadingAurora(false)
      }
    }
    fetchAurora()
  }, [])

  // Fetch CME images
  useEffect(() => {
    const fetchCme = async () => {
      try {
        console.log('Fetching CME from:', `${API_BASE_URL}/api/cme`)
        const [ccor1Response, lascoC2Response, lascoC3Response] = await Promise.all([
          fetch(`${API_BASE_URL}/api/cme?type=ccor1`, {
            method: 'GET',
            headers: { 'Accept': 'application/json' },
          }),
          fetch(`${API_BASE_URL}/api/cme?type=lasco-c2`, {
            method: 'GET',
            headers: { 'Accept': 'application/json' },
          }),
          fetch(`${API_BASE_URL}/api/cme?type=lasco-c3`, {
            method: 'GET',
            headers: { 'Accept': 'application/json' },
          }),
        ])
        
        if (!ccor1Response.ok) {
          throw new Error(`CME CCOR1 HTTP error! status: ${ccor1Response.status}`)
        }
        if (!lascoC2Response.ok) {
          throw new Error(`CME LASCO-C2 HTTP error! status: ${lascoC2Response.status}`)
        }
        if (!lascoC3Response.ok) {
          throw new Error(`CME LASCO-C3 HTTP error! status: ${lascoC3Response.status}`)
        }
        
        const ccor1Result = await ccor1Response.json()
        const lascoC2Result = await lascoC2Response.json()
        const lascoC3Result = await lascoC3Response.json()
        
        console.log('CME CCOR1 result:', ccor1Result)
        console.log('CME LASCO-C2 result:', lascoC2Result)
        console.log('CME LASCO-C3 result:', lascoC3Result)
        
        if (ccor1Result.success && ccor1Result.data?.video_url) {
          setCmeCcor1Image(ccor1Result.data.video_url)
        }
        if (lascoC2Result.success && lascoC2Result.data?.video_url) {
          setCmeLascoC2Image(lascoC2Result.data.video_url)
        }
        if (lascoC3Result.success && lascoC3Result.data?.video_url) {
          setCmeLascoC3Image(lascoC3Result.data.video_url)
        }
      } catch (error) {
        console.error("Error fetching CME images:", error)
      } finally {
        setIsLoadingCme(false)
      }
    }
    fetchCme()
  }, [])

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

  return (
    <section ref={sectionRef} className="relative min-h-screen flex items-center justify-center py-24 px-6">
      <div className="container mx-auto max-w-6xl">
        <div
          className={cn(
            "text-center mb-16 transition-all duration-1000",
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10",
          )}
        >
          <p className="text-xl md:text-2xl text-foreground/80 mb-2"></p>
          <h2 className="text-4xl md:text-6xl font-bold text-foreground">Real time NOAA's data about CME and solar activity</h2>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {/* THE SUN (EUV) Card */}
          <div
            className={cn(
              "bg-card border border-border rounded-lg p-6 transition-all duration-1000",
              isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10",
            )}
          >
            <div className="mb-4">
              <h3 className="text-sm font-bold text-foreground mb-3">THE SUN (EUV)</h3>
              <div className="flex gap-1 p-1 bg-muted rounded-lg">
                <div className="flex-1 px-3 py-1.5 text-xs font-medium rounded-md bg-background text-foreground shadow-sm cursor-default">
                  SUVI 304Å
                </div>
              </div>
            </div>
            <div className="aspect-square bg-black rounded-lg overflow-hidden mb-4 flex items-center justify-center relative">
              {isLoadingSuv ? (
                <>
                  <div className="absolute inset-0 bg-black blur-md opacity-50" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-2/3 h-2/3 rounded-full bg-[#fa6d02] blur-xl opacity-70 animate-pulse" />
                  </div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-24 h-24 rounded-full border-2 border-[#fa6d02]/50" />
                  </div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-16 h-16 border-4 border-white/20 border-t-white rounded-full animate-spin" />
                  </div>
                </>
              ) : suvImage ? (
                <Image src={suvImage} alt="SUV 304Å" fill className="object-cover" unoptimized />
              ) : (
                <div className="w-3/4 h-3/4 rounded-full bg-[#fa6d02] shadow-2xl shadow-[#fa6d02]/50" />
              )}
            </div>
          </div>

          {/* THE AURORA Card with Tabs */}
          <div
            className={cn(
              "bg-card border border-border rounded-lg p-6 transition-all duration-1000",
              isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10",
            )}
            style={{ transitionDelay: "200ms" }}
          >
            <div className="mb-4">
              <h3 className="text-sm font-bold text-foreground mb-3">THE AURORA</h3>
              <div className="flex gap-1 p-1 bg-muted rounded-lg">
                <button
                  onClick={() => setAuroraTab("northern")}
                  className={cn(
                    "flex-1 px-3 py-1.5 text-xs font-medium rounded-md transition-all",
                    auroraTab === "northern"
                      ? "bg-background text-foreground shadow-sm"
                      : "text-muted-foreground hover:text-foreground",
                  )} 
                >
                  Northern
                </button>
                <button
                  onClick={() => setAuroraTab("southern")}
                  className={cn(
                    "flex-1 px-3 py-1.5 text-xs font-medium rounded-md transition-all",
                    auroraTab === "southern"
                      ? "bg-background text-foreground shadow-sm"
                      : "text-muted-foreground hover:text-foreground",
                  )}
                >
                  Southern
                </button>
              </div>
            </div>
            <div className="aspect-square bg-gradient-to-br from-blue-950 via-indigo-900 to-black rounded-lg overflow-hidden mb-4 relative">
              {isLoadingAurora ? (
                <>
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-950 via-indigo-900 to-black blur-md opacity-50" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className={cn(
                      "w-2/3 h-2/3 rounded-full transition-all duration-500 animate-pulse",
                      auroraTab === "northern" 
                        ? "bg-gradient-to-br from-green-400 via-emerald-500 to-teal-600 blur-xl opacity-70" 
                        : "bg-gradient-to-br from-pink-400 via-purple-500 to-violet-600 blur-xl opacity-70"
                    )} />
                  </div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className={cn(
                      "w-24 h-24 rounded-full border-2 transition-colors duration-500",
                      auroraTab === "northern" ? "border-green-400/50" : "border-pink-400/50"
                    )} />
                  </div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-16 h-16 border-4 border-white/20 border-t-white rounded-full animate-spin" />
                  </div>
                </>
              ) : (
                <Image 
                  src={auroraTab === "northern" ? auroraNorthImage : auroraSouthImage} 
                  alt={`Aurora ${auroraTab === "northern" ? "North" : "South"}`}
                  fill
                  className="object-cover transition-opacity duration-500"
                  unoptimized
                />
              )}
            </div>
          </div>

          {/* CORONAL MASS EJECTIONS Card with Tabs */}
          <div
            className={cn(
              "bg-card border border-border rounded-lg p-6 transition-all duration-1000",
              isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10",
            )}
            style={{ transitionDelay: "400ms" }}
          >
            <div className="mb-4">
              <h3 className="text-sm font-bold text-foreground mb-3">CORONAL MASS EJECTIONS</h3>
              <div className="flex gap-1 p-1 bg-muted rounded-lg">
                <button
                  onClick={() => setCmeTab("ccor1")}
                  className={cn(
                    "flex-1 px-2 py-1.5 text-xs font-medium rounded-md transition-all",
                    cmeTab === "ccor1"
                      ? "bg-background text-foreground shadow-sm"
                      : "text-muted-foreground hover:text-foreground",
                  )}
                >
                  CCOR-1
                </button>
                <button
                  onClick={() => setCmeTab("lascoC2")}
                  className={cn(
                    "flex-1 px-2 py-1.5 text-xs font-medium rounded-md transition-all",
                    cmeTab === "lascoC2"
                      ? "bg-background text-foreground shadow-sm"
                      : "text-muted-foreground hover:text-foreground",
                  )}
                >
                  C2
                </button>
                <button
                  onClick={() => setCmeTab("lascoC3")}
                  className={cn(
                    "flex-1 px-2 py-1.5 text-xs font-medium rounded-md transition-all",
                    cmeTab === "lascoC3"
                      ? "bg-background text-foreground shadow-sm"
                      : "text-muted-foreground hover:text-foreground",
                  )}
                >
                  C3
                </button>
              </div>
            </div>
            <div className="aspect-square bg-black rounded-lg overflow-hidden mb-4 relative">
              {isLoadingCme ? (
                <>
                  <div className="absolute inset-0 bg-black blur-md opacity-50" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-12 h-12 rounded-full bg-white shadow-2xl shadow-white/50 animate-pulse" />
                  </div>
                  <div className={cn(
                    "absolute inset-0 transition-all duration-500",
                    cmeTab === "ccor1" && "bg-gradient-radial from-transparent via-orange-500/20 to-orange-600/40",
                    cmeTab === "lascoC2" && "bg-gradient-radial from-transparent via-blue-500/20 to-blue-600/40",
                    cmeTab === "lascoC3" && "bg-gradient-radial from-transparent via-purple-500/20 to-purple-600/40",
                  )}>
                    <div className="absolute top-1/4 right-1/4 w-16 h-16 bg-white/30 rounded-full blur-xl" />
                    <div className="absolute bottom-1/3 left-1/3 w-20 h-20 bg-white/20 rounded-full blur-2xl" />
                  </div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-16 h-16 border-4 border-white/20 border-t-white rounded-full animate-spin" />
                  </div>
                </>
              ) : (
                <Image 
                  src={
                    cmeTab === "ccor1" ? cmeCcor1Image :
                    cmeTab === "lascoC2" ? cmeLascoC2Image :
                    cmeLascoC3Image
                  } 
                  alt={`CME ${cmeTab.toUpperCase()}`}
                  fill
                  className="object-cover transition-opacity duration-500"
                  unoptimized
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
