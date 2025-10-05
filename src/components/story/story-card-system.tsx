'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { Lock, Play, Pause, Volume2, VolumeX, CheckCircle, Trophy } from 'lucide-react';
import { cn } from '@/lib/utils';
import { StoryChapter, StorySlide, StoryProgress } from '@/types/story';
import { getStoredProgress, saveProgress, markChapterCompleted, updateLastSlideViewed, getChapterProgress, saveUserName } from '@/lib/story-progress';
import { STORY_CHAPTERS } from '@/data/story-data';
import { CertificationModal } from './certification-modal';
import { useAudioController } from '@/hooks/use-audio-controller';

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
    <div className="min-h-screen flex items-center justify-center p-6 bg-[#150737]">
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
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-8 justify-items-center">
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
                className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-orange-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-bold rounded-lg transition-all duration-300"
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
        chapter.completed && "border-orange-500/50 bg-gradient-to-br from-orange-600/10 to-yellow-400/10"
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
          <div className="mt-4 flex items-center gap-2 text-sm text-orange-400">
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
  const [currentSubtitleIndex, setCurrentSubtitleIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showSubtitles, setShowSubtitles] = useState(true);
  const [audioEnabled, setAudioEnabled] = useState(true);
  const [imagesLoaded, setImagesLoaded] = useState<Set<number>>(new Set());
  const [allImagesLoaded, setAllImagesLoaded] = useState(false);
  const [showCompletionMessage, setShowCompletionMessage] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const slideRefs = useRef<(HTMLDivElement | null)[]>([]);

  // Audio controller
  const { playAudio, pauseAudio, stopAudio, setVolume } = useAudioController();

  const currentSlide = chapter.slides[currentSlideIndex];
  const currentSubtitle = currentSlide?.subtitles[currentSubtitleIndex];
  const isLastContentSlide = currentSlideIndex === chapter.slides.length - 1;
  const isCompletionSlide = currentSlideIndex === chapter.slides.length; // One slide beyond content
  const isLastSubtitle = currentSubtitleIndex === (currentSlide?.subtitles.length || 1) - 1;
  const totalSlides = chapter.slides.length + 1; // Include completion slide

  // Audio playback when subtitle changes
  useEffect(() => {
    if (audioEnabled && currentSubtitle?.audioUrl && (isPlaying || !isPlaying)) {
      playAudio(currentSubtitle);
    } else {
      pauseAudio();
    }
  }, [currentSlideIndex, currentSubtitleIndex, audioEnabled, currentSubtitle, playAudio, pauseAudio, isPlaying]);

  // Stop audio when component unmounts or chapter changes
  useEffect(() => {
    return () => {
      stopAudio();
    };
  }, [stopAudio, chapter.id]);

  // Auto-advance subtitles and slides when playing
  useEffect(() => {
    if (!isPlaying || !currentSlide || !currentSubtitle) return;

    const timer = setTimeout(() => {
      if (isLastSubtitle) {
        // Move to next slide or completion slide
        if (isLastContentSlide) {
          // Move to completion slide
          setCurrentSlideIndex(prev => prev + 1);
          setCurrentSubtitleIndex(0);
          setIsPlaying(false);
        } else {
          setCurrentSlideIndex(prev => prev + 1);
          setCurrentSubtitleIndex(0);
        }
      } else {
        // Move to next subtitle
        setCurrentSubtitleIndex(prev => prev + 1);
      }
    }, currentSubtitle.duration || 4000);

    return () => clearTimeout(timer);
  }, [isPlaying, currentSlideIndex, currentSubtitleIndex, currentSlide, currentSubtitle, isLastContentSlide, isLastSubtitle, allImagesLoaded, onComplete]);

  // Scroll-based navigation
  useEffect(() => {
    const handleScroll = () => {
      if (!containerRef.current || isPlaying) return;

      const container = containerRef.current;
      const scrollTop = container.scrollTop;
      const slideHeight = container.clientHeight;
      const newSlideIndex = Math.round(scrollTop / slideHeight);
      
      if (newSlideIndex !== currentSlideIndex && newSlideIndex >= 0 && newSlideIndex < totalSlides) {
        setCurrentSlideIndex(newSlideIndex);
        setCurrentSubtitleIndex(0); // Reset subtitle index when changing slides
        if (newSlideIndex < chapter.slides.length) {
          updateLastSlideViewed(chapter.id, chapter.slides[newSlideIndex].id);
        }
      }
    };

    const container = containerRef.current;
    if (container) {
      container.addEventListener('scroll', handleScroll);
      return () => container.removeEventListener('scroll', handleScroll);
    }
  }, [currentSlideIndex, chapter, isPlaying]);

  // Handle wheel/scroll events for subtitle navigation when not playing
  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      if (isPlaying || !currentSlide) return;

      // Small scroll for subtitle navigation
      if (Math.abs(e.deltaY) < 50) {
        e.preventDefault();
        
        if (e.deltaY > 0 && !isLastSubtitle) {
          // Scroll down - next subtitle
          setCurrentSubtitleIndex(prev => prev + 1);
        } else if (e.deltaY < 0 && currentSubtitleIndex > 0) {
          // Scroll up - previous subtitle
          setCurrentSubtitleIndex(prev => prev - 1);
        }
      }
    };

    const container = containerRef.current;
    if (container) {
      container.addEventListener('wheel', handleWheel, { passive: false });
      return () => container.removeEventListener('wheel', handleWheel);
    }
  }, [currentSlideIndex, currentSubtitleIndex, isPlaying, currentSlide, isLastSubtitle]);

  // Track when all images are loaded
  useEffect(() => {
    setAllImagesLoaded(imagesLoaded.size === chapter.slides.length);
  }, [imagesLoaded.size, chapter.slides.length]);

  // Handle keyboard navigation with arrow keys
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (isPlaying) return; // Don't allow keyboard navigation during auto-play

      switch (e.key) {
        case 'ArrowDown':
        case 'ArrowRight':
          e.preventDefault();
          if (!isLastSubtitle) {
            // Move to next subtitle
            setCurrentSubtitleIndex(prev => prev + 1);
          } else if (!isLastContentSlide) {
            // Move to next slide
            setCurrentSlideIndex(prev => prev + 1);
            setCurrentSubtitleIndex(0);
            // Scroll to next slide
            if (containerRef.current) {
              const slideHeight = containerRef.current.clientHeight;
              containerRef.current.scrollTo({
                top: (currentSlideIndex + 1) * slideHeight,
                behavior: 'smooth'
              });
            }
          } else if (!showCompletionMessage) {
            // Show completion slide
            setCurrentSlideIndex(chapter.slides.length);
            setCurrentSubtitleIndex(0);
            setShowCompletionMessage(true);
            if (containerRef.current) {
              const slideHeight = containerRef.current.clientHeight;
              containerRef.current.scrollTo({
                top: chapter.slides.length * slideHeight,
                behavior: 'smooth'
              });
            }
          }
          break;

        case 'ArrowUp':
        case 'ArrowLeft':
          e.preventDefault();
          if (currentSubtitleIndex > 0) {
            // Move to previous subtitle
            setCurrentSubtitleIndex(prev => prev - 1);
          } else if (currentSlideIndex > 0) {
            // Move to previous slide and set to last subtitle
            const prevSlideIndex = currentSlideIndex - 1;
            setCurrentSlideIndex(prevSlideIndex);
            const prevSlide = chapter.slides[prevSlideIndex];
            setCurrentSubtitleIndex(prevSlide.subtitles.length - 1);
            // Scroll to previous slide
            if (containerRef.current) {
              const slideHeight = containerRef.current.clientHeight;
              containerRef.current.scrollTo({
                top: prevSlideIndex * slideHeight,
                behavior: 'smooth'
              });
            }
          } else if (showCompletionMessage) {
            // Go back from completion to last content slide
            const lastSlideIndex = chapter.slides.length - 1;
            const lastSlide = chapter.slides[lastSlideIndex];
            setCurrentSlideIndex(lastSlideIndex);
            setCurrentSubtitleIndex(lastSlide.subtitles.length - 1);
            setShowCompletionMessage(false);
            if (containerRef.current) {
              const slideHeight = containerRef.current.clientHeight;
              containerRef.current.scrollTo({
                top: lastSlideIndex * slideHeight,
                behavior: 'smooth'
              });
            }
          }
          break;

        case ' ': // Spacebar to toggle play/pause
          e.preventDefault();
          togglePlayback();
          break;

        case 'Escape': // Escape to go back to chapters
          e.preventDefault();
          onBack();
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentSlideIndex, currentSubtitleIndex, isPlaying, isLastSubtitle, isLastContentSlide, chapter.slides]);

  // Handle image load
  const handleImageLoad = (slideIndex: number) => {
    setImagesLoaded(prev => new Set(prev).add(slideIndex));
  };

  const togglePlayback = () => {
    setIsPlaying(!isPlaying);
    if (!isPlaying && audioEnabled && currentSubtitle?.audioUrl) {
      playAudio(currentSubtitle);
    } else {
      pauseAudio();
    }
  };

  const toggleAudio = () => {
    const newAudioEnabled = !audioEnabled;
    setAudioEnabled(newAudioEnabled);
    if (!newAudioEnabled) {
      pauseAudio();
    } else if (currentSubtitle?.audioUrl) {
      playAudio(currentSubtitle);
    }
  };

  // Handle keyboard navigation with arrow keys
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (isPlaying) return; // Don't allow keyboard navigation during auto-play

      switch (e.key) {
        case 'ArrowDown':
        case 'ArrowRight':
          e.preventDefault();
          if (!isLastSubtitle) {
            // Move to next subtitle
            setCurrentSubtitleIndex(prev => prev + 1);
          } else if (!isLastContentSlide) {
            // Move to next slide
            setCurrentSlideIndex(prev => prev + 1);
            setCurrentSubtitleIndex(0);
            // Scroll to next slide
            if (containerRef.current) {
              const slideHeight = containerRef.current.clientHeight;
              containerRef.current.scrollTo({
                top: (currentSlideIndex + 1) * slideHeight,
                behavior: 'smooth'
              });
            }
          } else if (!isCompletionSlide) {
            // Show completion slide
            setCurrentSlideIndex(chapter.slides.length);
            setCurrentSubtitleIndex(0);
            if (containerRef.current) {
              const slideHeight = containerRef.current.clientHeight;
              containerRef.current.scrollTo({
                top: chapter.slides.length * slideHeight,
                behavior: 'smooth'
              });
            }
          }
          break;

        case 'ArrowUp':
        case 'ArrowLeft':
          e.preventDefault();
          if (currentSubtitleIndex > 0) {
            // Move to previous subtitle
            setCurrentSubtitleIndex(prev => prev - 1);
          } else if (currentSlideIndex > 0) {
            // Move to previous slide and set to last subtitle
            const prevSlideIndex = currentSlideIndex - 1;
            setCurrentSlideIndex(prevSlideIndex);
            const prevSlide = chapter.slides[prevSlideIndex];
            setCurrentSubtitleIndex(prevSlide.subtitles.length - 1);
            // Scroll to previous slide
            if (containerRef.current) {
              const slideHeight = containerRef.current.clientHeight;
              containerRef.current.scrollTo({
                top: prevSlideIndex * slideHeight,
                behavior: 'smooth'
              });
            }
          } else if (isCompletionSlide) {
            // Go back from completion to last content slide
            const lastSlideIndex = chapter.slides.length - 1;
            const lastSlide = chapter.slides[lastSlideIndex];
            setCurrentSlideIndex(lastSlideIndex);
            setCurrentSubtitleIndex(lastSlide.subtitles.length - 1);
            if (containerRef.current) {
              const slideHeight = containerRef.current.clientHeight;
              containerRef.current.scrollTo({
                top: lastSlideIndex * slideHeight,
                behavior: 'smooth'
              });
            }
          }
          break;

        case ' ': // Spacebar to toggle play/pause
          e.preventDefault();
          togglePlayback();
          break;

        case 'Escape': // Escape to go back to chapters
          e.preventDefault();
          onBack();
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentSlideIndex, currentSubtitleIndex, isPlaying, isLastSubtitle, isLastContentSlide, isCompletionSlide, chapter.slides, onBack]);

  const goToSlide = (index: number) => {
    setCurrentSlideIndex(index);
    setCurrentSubtitleIndex(0);
    if (containerRef.current) {
      const slideHeight = containerRef.current.clientHeight;
      containerRef.current.scrollTo({
        top: index * slideHeight,
        behavior: 'smooth'
      });
    }
  };

  const nextSubtitle = () => {
    if (!isLastSubtitle) {
      setCurrentSubtitleIndex(prev => prev + 1);
    } else if (!isLastContentSlide) {
      setCurrentSlideIndex(prev => prev + 1);
      setCurrentSubtitleIndex(0);
    } else if (!isCompletionSlide) {
      // Move to completion slide
      setCurrentSlideIndex(prev => prev + 1);
      setCurrentSubtitleIndex(0);
    }
  };

  const previousSubtitle = () => {
    if (currentSubtitleIndex > 0) {
      setCurrentSubtitleIndex(prev => prev - 1);
    } else if (currentSlideIndex > 0) {
      setCurrentSlideIndex(prev => prev - 1);
      const prevSlide = chapter.slides[currentSlideIndex - 1];
      setCurrentSubtitleIndex(prevSlide.subtitles.length - 1);
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
              {isCompletionSlide ? (
                <span className="text-orange-400">Chapter Complete!</span>
              ) : (
                <>
                  Slide {currentSlideIndex + 1} of {chapter.slides.length}
                  {currentSlide && currentSlide.subtitles.length > 1 && (
                    <span className="ml-2 text-orange-300">
                      (Subtitle {currentSubtitleIndex + 1} of {currentSlide.subtitles.length})
                    </span>
                  )}
                </>
              )}
            </p>
            {!allImagesLoaded && (
              <p className="text-xs text-yellow-300 mt-1">
                Loading images... ({imagesLoaded.size}/{chapter.slides.length})
              </p>
            )}
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
              onClick={toggleAudio}
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

      {/* Navigation Help */}
      {!isPlaying && (
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10">
          <div className="bg-black/60 backdrop-blur-sm rounded-lg px-4 py-2 text-white text-sm">
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1">
                <span className="text-orange-300">↑↓</span> or scroll to navigate
              </span>
              <span className="flex items-center gap-1">
                <span className="text-orange-300">Space</span> to play/pause
              </span>
              <span className="flex items-center gap-1">
                <span className="text-orange-300">Esc</span> to exit
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Story Card Container */}
      <div
        ref={containerRef}
        className="h-full overflow-y-auto snap-y snap-mandatory scrollbar-hide"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {/* Content Slides */}
        {chapter.slides.map((slide, index) => (
          <div
            key={slide.id}
            ref={(el) => { slideRefs.current[index] = el; }}
            className="h-screen flex items-end justify-center snap-start relative pb-20"
          >
            {/* Slide Background */}
            <div className="absolute inset-0">
              <Image
                src={slide.imageUrl}
                alt={`Slide ${index + 1}`}
                fill
                className="object-cover"
                priority={index === 0}
                onLoad={() => handleImageLoad(index)}
              />
              <div className="absolute inset-0 bg-black/40" />
            </div>

            {/* Slide Content */}
            <div className="relative z-10 text-center max-w-4xl mx-auto px-6">
              {showSubtitles && index === currentSlideIndex && currentSubtitle && currentSubtitle.text.trim() && (
                <div className={cn(
                  "backdrop-blur-sm rounded-xl p-6 border transition-all duration-300",
                  currentSubtitle.speaker === 'luna'
                    ? "bg-purple-900/70 border-purple-400/30"
                    : "bg-black/60 border-white/20"
                )}>
                  {/* Speaker indicator */}
                  {currentSubtitle.speaker === 'luna' && (
                    <div className="flex items-center justify-center gap-2 mb-4">
                      <div className="w-8 h-8 bg-purple-400 rounded-full flex items-center justify-center">
                        <span className="text-white font-bold text-sm">L</span>
                      </div>
                      <span className="text-purple-200 font-semibold">Luna</span>
                      {audioEnabled && currentSubtitle.audioUrl && (
                        <div className="flex items-center gap-1">
                          <Volume2 className="w-3 h-3 text-purple-300" />
                          <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse" />
                        </div>
                      )}
                    </div>
                  )}
                  
                  {/* Speaker indicator for narrator */}
                  {currentSubtitle.speaker === 'narrator' && (
                    <div className="flex items-center justify-center gap-2 mb-4">
                      <div className="w-8 h-8 bg-orange-400 rounded-full flex items-center justify-center">
                        <span className="text-white font-bold text-sm">N</span>
                      </div>
                      <span className="text-orange-200 font-semibold">Narrator</span>
                      {audioEnabled && currentSubtitle.audioUrl && (
                        <div className="flex items-center gap-1">
                          <Volume2 className="w-3 h-3 text-orange-300" />
                          <div className="w-2 h-2 bg-orange-400 rounded-full animate-pulse" />
                        </div>
                      )}
                    </div>
                  )}
                  
                  <p className={cn(
                    "text-lg md:text-xl font-medium leading-relaxed",
                    currentSubtitle.speaker === 'luna'
                      ? "text-purple-100 italic"
                      : "text-white"
                  )}>
                    {currentSubtitle.text}
                  </p>
                  
                  {/* Subtitle indicators */}
                  {slide.subtitles.length > 1 && (
                    <div className="flex justify-center gap-2 mt-6">
                      {slide.subtitles.map((_, subtitleIndex) => (
                        <button
                          key={subtitleIndex}
                          onClick={() => setCurrentSubtitleIndex(subtitleIndex)}
                          className={cn(
                            "w-3 h-3 rounded-full transition-all",
                            subtitleIndex === currentSubtitleIndex
                              ? "bg-orange-400"
                              : "bg-white/30 hover:bg-white/50"
                          )}
                        />
                      ))}
                    </div>
                  )}
                  
                  {/* Navigation arrows for subtitles */}
                  {!isPlaying && slide.subtitles.length > 1 && (
                    <div className="flex justify-center gap-4 mt-4">
                      <button
                        onClick={previousSubtitle}
                        disabled={currentSlideIndex === 0 && currentSubtitleIndex === 0}
                        className="p-2 bg-white/20 hover:bg-white/30 disabled:bg-white/10 disabled:opacity-50 rounded-full transition-all"
                      >
                        ←
                      </button>
                      <button
                        onClick={nextSubtitle}
                        disabled={isCompletionSlide}
                        className="p-2 bg-white/20 hover:bg-white/30 disabled:bg-white/10 disabled:opacity-50 rounded-full transition-all"
                      >
                        →
                      </button>
                    </div>
                  )}
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
              
              {/* Show loading message on last slide if images aren't loaded */}
              {index === currentSlideIndex && isLastContentSlide && isLastSubtitle && !allImagesLoaded && (
                <div className="mt-2 px-3 py-1 bg-yellow-600/80 backdrop-blur-sm rounded-full text-white text-xs">
                  Waiting for all images to load...
                </div>
              )}
            </div>
          </div>
        ))}

        {/* Completion Slide */}
        <div
          key="completion"
          ref={(el) => { slideRefs.current[chapter.slides.length] = el; }}
          className="h-screen flex items-end justify-center snap-start relative pb-20"
        >
          {/* Completion Background */}
          <div className="absolute inset-0 bg-gradient-to-br from-green-900 via-emerald-800 to-teal-900">
            <div className="absolute inset-0 bg-black/40" />
          </div>

          {/* Completion Content */}
          <div className="relative z-10 text-center max-w-4xl mx-auto px-6">
            <div className="bg-black/60 backdrop-blur-sm rounded-2xl p-12 border border-green-400/30">
              <div className="flex items-center justify-center mb-4">
                <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center">
                  <CheckCircle className="w-8 h-8 text-white" />
                </div>
              </div>
              
              <h2 className="text-2xl md:text-3xl font-bold text-orange-400 mb-3">
                Chapter Complete!
              </h2>
              
              <p className="text-lg md:text-xl text-white mb-6">
                You've finished "{chapter.title}"
              </p>
              
              <button
                onClick={() => {
                  setTimeout(() => {
                    onComplete();
                  }, 1000);
                }}
                className="px-8 py-4 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white font-bold rounded-lg text-xl transition-all duration-300 shadow-lg"
              >
                Continue to Next Chapter
              </button>
            </div>
          </div>

          {/* Completion Slide Indicator */}
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2">
            <div className="px-4 py-2 bg-green-500/80 backdrop-blur-sm rounded-full text-white text-sm">
              Complete!
            </div>
          </div>
        </div>
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

      {/* Progress Indicator */}
      <div className="absolute bottom-6 right-6 z-10">
        <div className="flex flex-col gap-2">
          {chapter.slides.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={cn(
                "w-3 h-8 rounded-full transition-all",
                index === currentSlideIndex ? "bg-orange-500" : "bg-white/30 hover:bg-white/50"
              )}
            />
          ))}
          {/* Completion slide indicator */}
          <button
            onClick={() => goToSlide(chapter.slides.length)}
            className={cn(
              "w-3 h-8 rounded-full transition-all",
              isCompletionSlide ? "bg-green-500" : "bg-white/30 hover:bg-white/50"
            )}
          />
        </div>
      </div>
    </div>
  );
}