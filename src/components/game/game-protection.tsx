'use client';

import { useEffect, useState } from 'react';
import { Lock } from 'lucide-react';
import { getProgressFromCookie } from '@/lib/cookie-progress';
import { StoryProgress } from '@/types/story';

interface GameProtectionProps {
  children: React.ReactNode;
}

export function GameProtection({ children }: GameProtectionProps) {
  const [progress, setProgress] = useState<StoryProgress | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const progressData = getProgressFromCookie();
    setProgress(progressData);
    setIsLoading(false);
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-white">Loading...</div>
      </div>
    );
  }

  if (!progress?.gameUnlocked) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6">
        <div className="max-w-2xl text-center">
          <div className="mb-8">
            <div className="w-24 h-24 bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-6">
              <Lock className="w-12 h-12 text-gray-400" />
            </div>
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">
              Game Locked
            </h1>
            <p className="text-xl text-gray-300 mb-8">
              Complete the entire storyline to unlock the bonus game as your reward.
            </p>
          </div>

          {/* Progress Information */}
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-8 border border-gray-700 mb-8">
            <h2 className="text-2xl font-bold text-white mb-4">Your Progress</h2>
            
            <div className="mb-6">
              <div className="flex justify-between text-sm text-gray-400 mb-2">
                <span>Story Completion</span>
                <span>{Math.round(progress?.totalProgress || 0)}%</span>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-3">
                <div 
                  className="bg-gradient-to-r from-orange-500 to-yellow-400 h-3 rounded-full transition-all duration-500"
                  style={{ width: `${progress?.totalProgress || 0}%` }}
                />
              </div>
            </div>

            <div className="text-left space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-gray-300">Prologue: The Invisible War</span>
                <div className={`w-4 h-4 rounded-full ${
                  progress?.completedChapters.includes(0) 
                    ? 'bg-orange-400' 
                    : 'bg-gray-600'
                }`} />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-300">Chapter 1: Kingdom of the Sun</span>
                <div className={`w-4 h-4 rounded-full ${
                  progress?.completedChapters.includes(1) 
                    ? 'bg-orange-400' 
                    : 'bg-gray-600'
                }`} />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-300">Chapter 2: The Hidden War</span>
                <div className={`w-4 h-4 rounded-full ${
                  progress?.completedChapters.includes(2) 
                    ? 'bg-orange-400' 
                    : 'bg-gray-600'
                }`} />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-300">Chapter 3: When Flare Breaks Free</span>
                <div className={`w-4 h-4 rounded-full ${
                  progress?.completedChapters.includes(3) 
                    ? 'bg-orange-400' 
                    : 'bg-gray-600'
                }`} />
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/story"
              className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-orange-500 to-yellow-400 hover:from-orange-600 hover:to-yellow-500 text-white font-bold rounded-lg transition-all duration-300"
            >
              Continue Story
            </a>
            <a
              href="/planets"
              className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white font-bold rounded-lg transition-all duration-300"
            >
              Explore Planets
            </a>
            <a
              href="/"
              className="inline-flex items-center gap-2 px-6 py-3 bg-white/10 hover:bg-white/20 text-white font-medium rounded-lg transition-all duration-300"
            >
              Back to Home
            </a>
          </div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}