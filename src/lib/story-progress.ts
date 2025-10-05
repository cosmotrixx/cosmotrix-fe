import { StoryProgress, StoryChapter } from '@/types/story';

const STORAGE_KEY = 'cosmotrix-story-progress';

export function getStoredProgress(): StoryProgress {
  if (typeof window === 'undefined') {
    return {
      currentChapter: 1,
      completedChapters: [],
      lastSlideViewed: {},
      totalProgress: 0,
      badges: [],
      isCertified: false,
      gameUnlocked: false,
      userName: undefined
    };
  }

  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const progress = JSON.parse(stored);
      // Ensure new fields exist for backward compatibility
      return {
        badges: [],
        isCertified: false,
        gameUnlocked: false,
        userName: undefined,
        ...progress
      };
    }
  } catch (error) {
    console.error('Error reading story progress:', error);
  }

  return {
    currentChapter: 1,
    completedChapters: [],
    lastSlideViewed: {},
    totalProgress: 0,
    badges: [],
    isCertified: false,
    gameUnlocked: false,
    userName: undefined
  };
}

export function saveProgress(progress: StoryProgress): void {
  if (typeof window === 'undefined') return;
  
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
  } catch (error) {
    console.error('Error saving story progress:', error);
  }
}

export function markChapterCompleted(chapterNumber: number): void {
  const progress = getStoredProgress();
  
  if (!progress.completedChapters.includes(chapterNumber)) {
    progress.completedChapters.push(chapterNumber);
    progress.currentChapter = Math.min(chapterNumber + 1, 4); // Assuming max 4 chapters
    progress.totalProgress = (progress.completedChapters.length / 3) * 100; // 3 total chapters
    
    // Award chapter badge
    const badgeId = `chapter-${chapterNumber}-complete`;
    if (!progress.badges.includes(badgeId)) {
      progress.badges.push(badgeId);
    }
    
    // Check for certification (all 3 chapters completed)
    if (progress.completedChapters.length >= 3 && !progress.isCertified) {
      progress.isCertified = true;
      progress.certificationDate = new Date().toISOString();
      progress.gameUnlocked = true;
      
      // Award certification badge
      const certBadge = 'solar-sentinel-certified';
      if (!progress.badges.includes(certBadge)) {
        progress.badges.push(certBadge);
      }
    }
    
    saveProgress(progress);
  }
}

export function updateLastSlideViewed(chapterId: string, slideId: string): void {
  const progress = getStoredProgress();
  progress.lastSlideViewed[chapterId] = slideId;
  saveProgress(progress);
}

export function isChapterUnlocked(chapterNumber: number): boolean {
  if (chapterNumber === 1) return true; // First chapter always unlocked
  
  const progress = getStoredProgress();
  return progress.completedChapters.includes(chapterNumber - 1);
}

export function getChapterProgress(chapters: StoryChapter[]): StoryChapter[] {
  const progress = getStoredProgress();
  
  return chapters.map(chapter => ({
    ...chapter,
    unlocked: isChapterUnlocked(chapter.number),
    completed: progress.completedChapters.includes(chapter.number)
  }));
}

export function saveUserName(name: string): void {
  const progress = getStoredProgress();
  progress.userName = name.trim();
  saveProgress(progress);
}