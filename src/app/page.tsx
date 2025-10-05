"use client"

import { useEffect, useState, lazy, Suspense } from "react"

// Lazy load ALL components
const Navigation = lazy(() => import("../../components/navigation").then(mod => ({ default: mod.Navigation })))
const StoryHeroSection = lazy(() => import("../../components/1-story-hero-section").then(mod => ({ default: mod.StoryHeroSection })))
const HeroSection = lazy(() => import("../../components/2-hero-section").then(mod => ({ default: mod.HeroSection })))
const PartnershipSection = lazy(() => import("../../components/partnership-section").then(mod => ({ default: mod.PartnershipSection })))
const BuiltWithSection = lazy(() => import("../../components/built-with-section").then(mod => ({ default: mod.BuiltWithSection })))
const VoidlingsSection = lazy(() => import("../../components/voidlings-section").then(mod => ({ default: mod.VoidlingsSection })))
const EarthNeedsYouSection = lazy(() => import("../../components/earth-needs-you-section").then(mod => ({ default: mod.EarthNeedsYouSection })))
const EarthCallToActionSection = lazy(() => import("@/components/earth-cta-section").then(mod => ({ default: mod.EarthCallToActionSection })))
const LivingStoriesSection = lazy(() => import("@/components/living-stories-section").then(mod => ({ default: mod.LivingStoriesSection })))
const ChatSection = lazy(() => import("../../components/chat-section").then(mod => ({ default: mod.ChatSection })))
const ThreeDSection = lazy(() => import("../../components/3d-section"))

// Loading skeleton component
const SectionSkeleton = () => (
  <div className="w-full h-screen flex items-center justify-center bg-transparent">
    <div className="animate-pulse text-white/50">Loading...</div>
  </div>
)

export default function Home() {
  const [scrollProgress, setScrollProgress] = useState(0)

  useEffect(() => {
    const handleScroll = () => {
      const totalScroll = document.documentElement.scrollHeight - window.innerHeight
      const currentScroll = window.scrollY
      setScrollProgress((currentScroll / totalScroll) * 100)
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <main className="relative overflow-x-hidden">
      {/* All sections are now lazy loaded */}
      <Suspense fallback={<SectionSkeleton />}>
        <StoryHeroSection />
      </Suspense>
      
      <Suspense fallback={<SectionSkeleton />}>
        <Navigation />
      </Suspense>
      
      <Suspense fallback={<SectionSkeleton />}>
        <HeroSection />
      </Suspense>
      
      <Suspense fallback={<SectionSkeleton />}>
        <PartnershipSection />
      </Suspense>
      
      <Suspense fallback={<SectionSkeleton />}>
        <BuiltWithSection />
      </Suspense>
      
      <Suspense fallback={<SectionSkeleton />}>
        <VoidlingsSection />
      </Suspense>
      
      <Suspense fallback={<SectionSkeleton />}>
        <EarthNeedsYouSection />
      </Suspense>
      
      <Suspense fallback={<SectionSkeleton />}>
        <EarthCallToActionSection />
      </Suspense>
      
      <Suspense fallback={<SectionSkeleton />}>
        <LivingStoriesSection />
      </Suspense>
      
      <Suspense fallback={<SectionSkeleton />}>
        <ChatSection />
      </Suspense>
      
      <Suspense fallback={<SectionSkeleton />}>
        <ThreeDSection />
      </Suspense>
    </main>
  )
}