"use client"

import { useRef, useState, useEffect } from 'react';
import Image from 'next/image';
import { X } from 'lucide-react';

type CardData = {
  id: number;
  title: string;
  subtitle: string;
  image: string;
  gradientFrom: string;
  gradientTo: string;
}

const CARDS: CardData[] = [
  {
    id: 1,
    title: "Prologue",
    subtitle: "The Invisible War",
    image: "/images/cards/prologue.png",
    gradientFrom: "from-purple-600",
    gradientTo: "to-purple-800",
  },
  {
    id: 2,
    title: "Chapter 1",
    subtitle: "Kingdom of The Sun",
    image: "/images/cards/chapter1.png",
    gradientFrom: "from-orange-500",
    gradientTo: "to-yellow-600",
  },
  {
    id: 3,
    title: "Chapter 2",
    subtitle: "The Hidden War",
    image: "/images/cards/chapter2.png",
    gradientFrom: "from-orange-600",
    gradientTo: "to-red-600",
  },
  {
    id: 4,
    title: "Chapter 3",
    subtitle: "When Flare Breaks Free",
    image: "/images/cards/chapter3.png",
    gradientFrom: "from-green-500",
    gradientTo: "to-teal-600",
  },
];

export function TeachingAssistantSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);
  const [fullscreenCard, setFullscreenCard] = useState<CardData | null>(null);

  // Disable body scroll when fullscreen is open
  useEffect(() => {
    if (fullscreenCard) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [fullscreenCard]);

  return (
    <>
      <section ref={sectionRef} className="relative min-h-screen w-full flex items-center justify-center overflow-hidden bg-gradient-to-b from-black to-[#1a0b2e] py-20 px-6">
        <div className="max-w-7xl w-full mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <div className="space-y-6">
              <h2 className="text-5xl lg:text-6xl font-bold">
                <span className="bg-gradient-to-r from-orange-400 via-yellow-400 to-yellow-500 bg-clip-text text-transparent">
                  Story Chapters
                </span>
              </h2>
              <p className="text-white/70 text-lg leading-relaxed max-w-xl">
                Follow Luna&apos;s journey through space weather phenomena. Each chapter explores the invisible forces that protect and threaten our planet. Hover to preview.
              </p>
            </div>

            {/* Right Content - Interactive Stacked Cards */}
            <div className="relative flex items-center justify-center lg:justify-end">
              <div className="relative w-full max-w-sm aspect-[9/14.5]">
                {CARDS.map((card, index) => {
                  const isHovered = hoveredCard === card.id;
                  const rotation = (CARDS.length - 1 - index) * 4;
                  const topOffset = (CARDS.length - 1 - index) * 2;
                  const rightOffset = (CARDS.length - 1 - index) * 1;
                  
                  return (
                    <div
                      key={card.id}
                      className="absolute w-full h-full rounded-3xl shadow-2xl cursor-pointer transition-all duration-300 ease-out overflow-hidden"
                      style={{
                        transform: isHovered 
                          ? `rotate(0deg) translateY(-20px) scale(1.05)` 
                          : `rotate(${rotation}deg)`,
                        top: isHovered ? '0' : `${topOffset * 2}rem`,
                        right: isHovered ? '0' : `${rightOffset}rem`,
                        zIndex: isHovered ? 50 : CARDS.length - index,
                      }}
                      onMouseEnter={() => setHoveredCard(card.id)}
                      onMouseLeave={() => setHoveredCard(null)}
                      onClick={() => setFullscreenCard(card)}
                    >
                      <div className={`relative w-full h-full bg-gradient-to-br ${card.gradientFrom} ${card.gradientTo}`}>
                        {/* Card Image */}
                        <Image
                          src={card.image}
                          alt={`${card.title}: ${card.subtitle}`}
                          fill
                          className="object-contain"
                          sizes="(max-width: 768px) 100vw, 400px"
                        />
                        
                        {/* Card Overlay with Title */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                        <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                          <p className="text-sm font-light text-yellow-300 mb-1">{card.title}</p>
                          <h3 className="text-2xl font-bold">{card.subtitle}</h3>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Fullscreen Modal */}
      {fullscreenCard && (
        <div 
          className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-sm flex items-center justify-center p-4 overflow-hidden animate-in fade-in duration-300"
          onClick={() => setFullscreenCard(null)}
        >
          {/* Close Button */}
          <button
            onClick={() => setFullscreenCard(null)}
            className="absolute top-4 right-4 z-[110] p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
            aria-label="Close"
          >
            <X className="w-6 h-6" />
          </button>

          {/* Fullscreen Card */}
          <div 
            className="relative h-[95vh] w-auto aspect-[9/16] rounded-2xl overflow-hidden shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <Image
              src={fullscreenCard.image}
              alt={`${fullscreenCard.title}: ${fullscreenCard.subtitle}`}
              fill
              className="object-cover rounded-2xl"
              priority
            />
          </div>
        </div>
      )}
    </>
  )
}
