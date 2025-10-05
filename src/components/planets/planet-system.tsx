'use client';

import { useState, useEffect } from 'react';
import { Lock, CheckCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { getProgressFromCookie, isPlanetUnlockedByProgress } from '@/lib/cookie-progress';
import { StoryProgress } from '@/types/story';

interface Planet {
  id: string;
  number: number;
  name: string;
  description: string;
  chapterId: string;
  thumbnailUrl: string;
  bgColor: string;
  textColor: string;
}

const PLANETS: Planet[] = [
  {
    id: 'planet-prologue',
    number: 0,
    name: 'Luna\'s Home',
    description: 'Where Luna discovers her father\'s mysterious past through a magical pocket watch.',
    chapterId: 'prologue',
    thumbnailUrl: '/images/chapters/prologue/[1.0] Prolog.png',
    bgColor: 'from-purple-500 to-blue-400',
    textColor: 'text-white'
  },
  {
    id: 'planet-chapter1',
    number: 1,
    name: 'Kingdom of the Sun',
    description: 'Within the Sun\'s heart lies a kingdom ruled by a powerful king, but evil threatens the realm.',
    chapterId: 'chapter-1',
    thumbnailUrl: '/images/chapters/chapter1/[1.0] Chapter 1.png',
    bgColor: 'from-orange-500 to-yellow-400',
    textColor: 'text-white'
  },
  {
    id: 'planet-chapter2',
    number: 2,
    name: 'The Hidden War',
    description: 'Pedroz corrupts the Flares and CMEs, building an army to invade Earth.',
    chapterId: 'chapter-2',
    thumbnailUrl: '/images/chapters/chapter2/10.png',
    bgColor: 'from-red-500 to-purple-600',
    textColor: 'text-white'
  },
  {
    id: 'planet-chapter3',
    number: 3,
    name: 'When Flare Breaks Free',
    description: 'Flori warns Earth of the danger, but chaos erupts as the cosmic war reaches our planet.',
    chapterId: 'chapter-3',
    thumbnailUrl: '/images/chapters/chapter3/17.png',
    bgColor: 'from-blue-500 to-green-500',
    textColor: 'text-white'
  }
];

interface PlanetSystemProps {
  onPlanetSelect: (chapterId: string) => void;
}

export function PlanetSystem({ onPlanetSelect }: PlanetSystemProps) {
  const [progress, setProgress] = useState<StoryProgress | null>(null);

  useEffect(() => {
    setProgress(getProgressFromCookie());
  }, []);

  if (!progress) {
    return <div className="min-h-screen flex items-center justify-center text-white">Loading...</div>;
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <div className="w-full max-w-6xl">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-4">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-yellow-400">
              Planet System
            </span>
          </h1>
          <p className="text-xl text-gray-300 mb-6">
            Travel through the cosmic realms and discover the invisible war in the sky
          </p>
          
          {/* Progress Bar */}
          <div className="max-w-md mx-auto">
            <div className="flex justify-between text-sm text-gray-400 mb-2">
              <span>Progress</span>
              <span>{Math.round(progress.totalProgress)}%</span>
            </div>
            <div className="w-full bg-gray-800 rounded-full h-3">
              <div 
                className="bg-gradient-to-r from-orange-500 to-yellow-400 h-3 rounded-full transition-all duration-500"
                style={{ width: `${progress.totalProgress}%` }}
              />
            </div>
          </div>
        </div>

        {/* Planets Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {PLANETS.map((planet, index) => (
            <PlanetCard
              key={planet.id}
              planet={planet}
              progress={progress}
              onClick={() => onPlanetSelect(planet.chapterId)}
              delay={index * 200}
            />
          ))}
        </div>

        {/* Back to Stories */}
        <div className="text-center mt-12">
          <button
            onClick={() => window.history.back()}
            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-orange-500 to-yellow-400 hover:from-orange-600 hover:to-yellow-500 text-white font-bold rounded-lg transition-all duration-300"
          >
            Back to Stories
          </button>
        </div>
      </div>
    </div>
  );
}

interface PlanetCardProps {
  planet: Planet;
  progress: StoryProgress;
  onClick: () => void;
  delay: number;
}

function PlanetCard({ planet, progress, onClick, delay }: PlanetCardProps) {
  const [isVisible, setIsVisible] = useState(false);
  const isUnlocked = isPlanetUnlockedByProgress(planet.number, progress);
  const isCompleted = progress.completedChapters.includes(planet.number);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), delay);
    return () => clearTimeout(timer);
  }, [delay]);

  return (
    <div
      className={cn(
        "group relative overflow-hidden rounded-2xl border-2 transition-all duration-700 cursor-pointer",
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8",
        isUnlocked 
          ? "border-white/20 hover:border-white/40 hover:scale-105 bg-gradient-to-br from-white/5 to-white/10"
          : "border-gray-700/50 bg-gradient-to-br from-gray-800/30 to-gray-900/30",
        isCompleted && "border-orange-500/50 bg-gradient-to-br from-orange-600/10 to-yellow-600/10"
      )}
      onClick={isUnlocked ? onClick : undefined}
    >
      {/* Background Image */}
      <div className="relative h-48 overflow-hidden">
        <img
          src={planet.thumbnailUrl}
          alt={planet.name}
          className={cn(
            "w-full h-full object-cover transition-all duration-500",
            isUnlocked ? "grayscale-0 group-hover:scale-110" : "grayscale"
          )}
        />
        
        {/* Overlay */}
        <div className={cn(
          "absolute inset-0 transition-opacity duration-300",
          isUnlocked 
            ? "bg-gradient-to-t from-black/60 via-black/20 to-transparent"
            : "bg-gradient-to-t from-black/80 via-black/60 to-black/40"
        )} />

        {/* Planet Number */}
        <div className="absolute top-4 left-4">
          <div className={cn(
            "w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg",
            isUnlocked
              ? `bg-gradient-to-br ${planet.bgColor} text-white shadow-lg`
              : "bg-gray-700 text-gray-400"
          )}>
            {planet.number}
          </div>
        </div>

        {/* Status Icons */}
        <div className="absolute top-4 right-4">
          {!isUnlocked && (
            <div className="p-2 bg-black/60 backdrop-blur-sm rounded-full">
              <Lock className="w-5 h-5 text-gray-400" />
            </div>
          )}
          {isCompleted && (
            <div className="p-2 bg-orange-600/80 backdrop-blur-sm rounded-full">
              <CheckCircle className="w-5 h-5 text-white" />
            </div>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        <h3 className={cn(
          "text-xl font-bold mb-2",
          isUnlocked ? "text-white" : "text-gray-500"
        )}>
          {planet.name}
        </h3>
        <p className={cn(
          "text-sm leading-relaxed",
          isUnlocked ? "text-gray-300" : "text-gray-600"
        )}>
          {planet.description}
        </p>

        {/* Action Hint */}
        {isUnlocked && !isCompleted && (
          <div className="mt-4 flex items-center gap-2 text-sm text-orange-400">
            <span>Click to explore</span>
          </div>
        )}
        
        {isCompleted && (
          <div className="mt-4 flex items-center gap-2 text-sm text-orange-400">
            <CheckCircle className="w-4 h-4" />
            <span>Completed</span>
          </div>
        )}

        {!isUnlocked && (
          <div className="mt-4 flex items-center gap-2 text-sm text-gray-500">
            <Lock className="w-4 h-4" />
            <span>Complete previous planets to unlock</span>
          </div>
        )}
      </div>
    </div>
  );
}