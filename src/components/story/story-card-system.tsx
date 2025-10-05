'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { Lock, Play, Pause, Volume2, VolumeX, CheckCircle, Trophy } from 'lucide-react';
import { cn } from '@/lib/utils';
import { StoryChapter, StorySlide, StoryProgress } from '@/types/story';
import { getStoredProgress, saveProgress, markChapterCompleted, updateLastSlideViewed, getChapterProgress, saveUserName } from '@/lib/story-progress';
import { STORY_CHAPTERS } from '@/data/story-data';
import { CertificationModal } from './certification-modal';

export function StoryCardSystem() {
  const [chapters, setChapters] = useState<StoryChapter[]>(STORY_CHAPTERS);
  const [selectedChapter, setSelectedChapter] = useState<StoryChapter | null>(null);
  const [showCertificationModal, setShowCertificationModal] = useState(false);
  const [progress, setProgress] = useState<StoryProgress>({
    currentChapter: 1,
    completedChapters: [],
    lastSlideViewed: {},
    totalProgress: 0,
    badges: [],
    isCertified: false,
    gameUnlocked: false,
    userName: undefined
  });

  // Load progress on mount
  useEffect(() => {
    const storedProgress = getStoredProgress();
    setProgress(storedProgress);
    setChapters(getChapterProgress(STORY_CHAPTERS));
  }, []);

  const handleChapterSelect = (chapter: StoryChapter) => {
    if (chapter.unlocked) {
      setSelectedChapter(chapter);
    }
  };

  const handleChapterComplete = (chapterNumber: number) => {
    markChapterCompleted(chapterNumber);
    const updatedProgress = getStoredProgress();
    setProgress(updatedProgress);
    setChapters(getChapterProgress(STORY_CHAPTERS));
    setSelectedChapter(null);
    
    // Show certification modal if all chapters are completed
    if (updatedProgress.isCertified) {
      setTimeout(() => {
        setShowCertificationModal(true);
      }, 1000);
    }
  };

  const handleCertificateClick = () => {
    setShowCertificationModal(true);
  };

  if (selectedChapter) {
    return (
      <StoryCardViewer 
        chapter={selectedChapter} 
        onComplete={() => handleChapterComplete(selectedChapter.number)}
        onBack={() => setSelectedChapter(null)}
      />
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <div className="w-full max-w-6xl">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-4">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-yellow-400">
              Stories
            </span>
          </h1>
          <p className="text-xl text-gray-300 mb-6">
            Unlock the chapters one by one to discover the invisible war in the sky
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

        {/* Chapters Grid */}
        <div className="grid md:grid-cols-3 gap-8">
          {chapters.map((chapter, index) => (
            <ChapterCard
              key={chapter.id}
              chapter={chapter}
              onClick={() => handleChapterSelect(chapter)}
              delay={index * 200}
            />
          ))}
        </div>

        {/* Completion Message */}
        {progress.completedChapters.length === chapters.length && (
          <div className="text-center mt-16">
            <div className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-orange-500/20 to-yellow-400/20 backdrop-blur-sm rounded-full border border-orange-500/30">
              <Trophy className="w-6 h-6 text-orange-400" />
              <span className="text-xl font-semibold text-white">
                🎉 Congratulations! You're now a certified Solar Sentinel!
              </span>
            </div>
            
            <p className="text-gray-300 mt-4 mb-6">
              {progress.userName 
                ? `Well done, ${progress.userName}! Your certificate is ready for download.`
                : "Create your personalized certificate by adding your name."
              }
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={handleCertificateClick}
                className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-orange-500 to-yellow-400 hover:from-orange-600 hover:to-yellow-500 text-white font-bold rounded-lg transition-all duration-300 shadow-lg"
                type="button"
              >
                <Trophy className="w-5 h-5" />
                {progress.userName ? 'View Certificate' : 'Create Certificate'}
              </button>
              
              <a
                href="/game"
                className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-bold rounded-lg transition-all duration-300"
              >
                <span>🎮</span>
                Play Bonus Game
              </a>
            </div>
          </div>
        )}
      </div>

      {/* Certification Modal */}
      {showCertificationModal && (
        <CertificationModal 
          isOpen={showCertificationModal}
          onClose={() => setShowCertificationModal(false)}
        />
      )}
    </div>
  );
}

interface ChapterCardProps {
  chapter: StoryChapter;
  onClick: () => void;
  delay: number;
}

function ChapterCard({ chapter, onClick, delay }: ChapterCardProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), delay);
    return () => clearTimeout(timer);
  }, [delay]);

  return (
    <div
      className={cn(
        "group relative overflow-hidden rounded-2xl border-2 transition-all duration-700 cursor-pointer",
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8",
        chapter.unlocked 
          ? "border-white/20 hover:border-white/40 hover:scale-105 bg-gradient-to-br from-white/5 to-white/10"
          : "border-gray-700/50 bg-gradient-to-br from-gray-800/30 to-gray-900/30",
        chapter.completed && "border-green-500/50 bg-gradient-to-br from-green-600/10 to-blue-600/10"
      )}
      onClick={onClick}
    >
      {/* Background Image */}
      <div className="relative h-48 overflow-hidden">
        <Image
          src={chapter.thumbnailUrl}
          alt={chapter.title}
          fill
          className={cn(
            "object-cover transition-all duration-500",
            chapter.unlocked ? "grayscale-0 group-hover:scale-110" : "grayscale"
          )}
        />
        
        {/* Overlay */}
        <div className={cn(
          "absolute inset-0 transition-opacity duration-300",
          chapter.unlocked 
            ? "bg-gradient-to-t from-black/60 via-black/20 to-transparent"
            : "bg-gradient-to-t from-black/80 via-black/60 to-black/40"
        )} />

        {/* Chapter Number */}
        <div className="absolute top-4 left-4">
          <div className={cn(
            "w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg",
            chapter.unlocked
              ? `bg-gradient-to-br ${chapter.bgColor} text-white shadow-lg`
              : "bg-gray-700 text-gray-400"
          )}>
            {chapter.number}
          </div>
        </div>

        {/* Status Icons */}
        <div className="absolute top-4 right-4">
          {!chapter.unlocked && (
            <div className="p-2 bg-black/60 backdrop-blur-sm rounded-full">
              <Lock className="w-5 h-5 text-gray-400" />
            </div>
          )}
          {chapter.completed && (
            <div className="p-2 bg-green-600/80 backdrop-blur-sm rounded-full">
              <CheckCircle className="w-5 h-5 text-white" />
            </div>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        <h3 className={cn(
          "text-xl font-bold mb-2",
          chapter.unlocked ? "text-white" : "text-gray-500"
        )}>
          {chapter.title}
        </h3>
        <p className={cn(
          "text-sm leading-relaxed",
          chapter.unlocked ? "text-gray-300" : "text-gray-600"
        )}>
          {chapter.description}
        </p>

        {/* Action Hint */}
        {chapter.unlocked && !chapter.completed && (
          <div className="mt-4 flex items-center gap-2 text-sm text-orange-400">
            <Play className="w-4 h-4" />
            <span>Click to start</span>
          </div>
        )}
        
        {chapter.completed && (
          <div className="mt-4 flex items-center gap-2 text-sm text-green-400">
            <CheckCircle className="w-4 h-4" />
            <span>Completed</span>
          </div>
        )}

        {!chapter.unlocked && (
          <div className="mt-4 flex items-center gap-2 text-sm text-gray-500">
            <Lock className="w-4 h-4" />
            <span>Complete previous chapters to unlock</span>
          </div>
        )}
      </div>
    </div>
  );
}

interface StoryCardViewerProps {
  chapter: StoryChapter;
  onComplete: () => void;
  onBack: () => void;
}

function StoryCardViewer({ chapter, onComplete, onBack }: StoryCardViewerProps) {
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showSubtitles, setShowSubtitles] = useState(true);
  const [audioEnabled, setAudioEnabled] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const slideRefs = useRef<(HTMLDivElement | null)[]>([]);

  const currentSlide = chapter.slides[currentSlideIndex];
  const isLastSlide = currentSlideIndex === chapter.slides.length - 1;

  // Auto-advance slides when playing
  useEffect(() => {
    if (!isPlaying || !currentSlide) return;

    const timer = setTimeout(() => {
      if (isLastSlide) {
        setIsPlaying(false);
        // Mark chapter as completed
        setTimeout(() => {
          onComplete();
        }, 1000);
      } else {
        setCurrentSlideIndex(prev => prev + 1);
      }
    }, currentSlide.duration || 4000);

    return () => clearTimeout(timer);
  }, [isPlaying, currentSlideIndex, currentSlide, isLastSlide, onComplete]);

  // Scroll-based navigation
  useEffect(() => {
    const handleScroll = () => {
      if (!containerRef.current || isPlaying) return;

      const container = containerRef.current;
      const scrollTop = container.scrollTop;
      const slideHeight = container.clientHeight;
      const newSlideIndex = Math.round(scrollTop / slideHeight);
      
      if (newSlideIndex !== currentSlideIndex && newSlideIndex >= 0 && newSlideIndex < chapter.slides.length) {
        setCurrentSlideIndex(newSlideIndex);
        updateLastSlideViewed(chapter.id, chapter.slides[newSlideIndex].id);
      }
    };

    const container = containerRef.current;
    if (container) {
      container.addEventListener('scroll', handleScroll);
      return () => container.removeEventListener('scroll', handleScroll);
    }
  }, [currentSlideIndex, chapter, isPlaying]);

  const togglePlayback = () => {
    setIsPlaying(!isPlaying);
  };

  const goToSlide = (index: number) => {
    setCurrentSlideIndex(index);
    if (containerRef.current) {
      const slideHeight = containerRef.current.clientHeight;
      containerRef.current.scrollTo({
        top: index * slideHeight,
        behavior: 'smooth'
      });
    }
  };

  return (
    <div className="fixed inset-0 bg-black z-50">
      {/* Controls Header */}
      <div className="absolute top-0 left-0 right-0 z-10 bg-gradient-to-b from-black/80 to-transparent p-6">
        <div className="flex items-center justify-between max-w-6xl mx-auto">
          <button
            onClick={onBack}
            className="flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm hover:bg-white/20 text-white rounded-lg transition-all"
          >
            <span>←</span>
            Back to Chapters
          </button>

          <div className="text-center">
            <h2 className="text-xl font-bold text-white">{chapter.title}</h2>
            <p className="text-sm text-gray-300">
              Slide {currentSlideIndex + 1} of {chapter.slides.length}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowSubtitles(!showSubtitles)}
              className={cn(
                "p-2 rounded-lg transition-all",
                showSubtitles ? "bg-white/20 text-white" : "bg-white/10 text-gray-400"
              )}
              title="Toggle subtitles"
            >
              Aa
            </button>
            
            <button
              onClick={() => setAudioEnabled(!audioEnabled)}
              className={cn(
                "p-2 rounded-lg transition-all",
                audioEnabled ? "bg-white/20 text-white" : "bg-white/10 text-gray-400"
              )}
              title="Toggle audio"
            >
              {audioEnabled ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
            </button>

            <button
              onClick={togglePlayback}
              className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-orange-500 to-yellow-400 hover:from-orange-600 hover:to-yellow-500 text-white font-medium rounded-lg transition-all"
            >
              {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
              {isPlaying ? 'Pause' : 'Play'}
            </button>
          </div>
        </div>
      </div>

      {/* Story Card Container */}
      <div
        ref={containerRef}
        className="h-full overflow-y-auto snap-y snap-mandatory scrollbar-hide"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {chapter.slides.map((slide, index) => (
          <div
            key={slide.id}
            ref={(el) => { slideRefs.current[index] = el; }}
            className="h-screen flex items-center justify-center snap-start relative"
          >
            {/* Slide Background */}
            <div className="absolute inset-0">
              <Image
                src={slide.imageUrl}
                alt={`Slide ${index + 1}`}
                fill
                className="object-cover"
                priority={index === 0}
              />
              <div className="absolute inset-0 bg-black/40" />
            </div>

            {/* Slide Content */}
            <div className="relative z-10 text-center max-w-4xl mx-auto px-6">
              {showSubtitles && (
                <div className="bg-black/60 backdrop-blur-sm rounded-2xl p-8 border border-white/20">
                  <p className="text-2xl md:text-3xl font-medium text-white leading-relaxed">
                    {slide.subtitle}
                  </p>
                </div>
              )}
            </div>

            {/* Slide Indicator */}
            <div className="absolute bottom-8 left-1/2 -translate-x-1/2">
              <div className={cn(
                "px-4 py-2 bg-black/60 backdrop-blur-sm rounded-full text-white text-sm",
                index === currentSlideIndex && "bg-orange-500/80"
              )}>
                {index + 1} / {chapter.slides.length}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Progress Indicator */}
      <div className="absolute bottom-6 right-6 z-10">
        <div className="flex flex-col gap-2">
          {chapter.slides.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={cn(
                "w-3 h-3 rounded-full transition-all",
                index === currentSlideIndex 
                  ? "bg-orange-400 scale-125" 
                  : "bg-white/40 hover:bg-white/60"
              )}
            />
          ))}
        </div>
      </div>

      {/* Completion Message */}
      {isLastSlide && !isPlaying && (
        <div className="absolute inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-20">
          <div className="text-center">
            <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-green-400 to-blue-500 rounded-full flex items-center justify-center">
              <CheckCircle className="w-12 h-12 text-white" />
            </div>
            <h3 className="text-3xl font-bold text-white mb-4">Chapter Complete!</h3>
            <p className="text-xl text-gray-300 mb-8">
              You've finished &quot;{chapter.title}&quot;
            </p>
            <button
              onClick={onComplete}
              className="px-8 py-3 bg-gradient-to-r from-orange-500 to-yellow-400 hover:from-orange-600 hover:to-yellow-500 text-white font-bold rounded-lg transition-all"
            >
              Continue to Next Chapter
            </button>
          </div>
        </div>
      )}
    </div>
  );
}