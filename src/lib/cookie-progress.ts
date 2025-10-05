import Cookies from 'js-cookie';
import { StoryProgress } from '@/types/story';

const PROGRESS_COOKIE_KEY = 'cosmotrix_story_progress';
const COOKIE_EXPIRES_DAYS = 365; // 1 year

export function getProgressFromCookie(): StoryProgress {
  try {
    const cookieData = Cookies.get(PROGRESS_COOKIE_KEY);
    if (cookieData) {
      const progress = JSON.parse(cookieData);
      return {
        currentChapter: progress.currentChapter || 0,
        completedChapters: progress.completedChapters || [],
        lastSlideViewed: progress.lastSlideViewed || {},
        totalProgress: progress.totalProgress || 0,
        badges: progress.badges || [],
        isCertified: progress.isCertified || false,
        certificationDate: progress.certificationDate,
        gameUnlocked: progress.gameUnlocked || false,
        userName: progress.userName
      };
    }
  } catch (error) {
    console.warn('Failed to parse progress cookie:', error);
  }
  
  // Default progress
  return {
    currentChapter: 0,
    completedChapters: [],
    lastSlideViewed: {},
    totalProgress: 0,
    badges: [],
    isCertified: false,
    gameUnlocked: false
  };
}

export function saveProgressToCookie(progress: StoryProgress): void {
  try {
    const cookieData = JSON.stringify(progress);
    Cookies.set(PROGRESS_COOKIE_KEY, cookieData, { 
      expires: COOKIE_EXPIRES_DAYS,
      sameSite: 'lax'
    });
  } catch (error) {
    console.error('Failed to save progress cookie:', error);
  }
}

export function clearProgressCookie(): void {
  Cookies.remove(PROGRESS_COOKIE_KEY);
}

export function isChapterUnlockedByProgress(chapterNumber: number, progress: StoryProgress): boolean {
  // Prologue (chapter 0) is always unlocked
  if (chapterNumber === 0) return true;
  
  // Other chapters require the previous chapter to be completed
  return progress.completedChapters.includes(chapterNumber - 1);
}

export function calculateProgress(completedChapters: number[], totalChapters: number): number {
  return (completedChapters.length / totalChapters) * 100;
}

export function unlockNextChapter(currentProgress: StoryProgress, completedChapter: number): StoryProgress {
  const newCompletedChapters = [...currentProgress.completedChapters];
  if (!newCompletedChapters.includes(completedChapter)) {
    newCompletedChapters.push(completedChapter);
  }
  
  // Calculate total progress (4 chapters: 0, 1, 2, 3)
  const totalProgress = calculateProgress(newCompletedChapters, 4);
  
  // Check if all chapters are completed
  const allChaptersCompleted = newCompletedChapters.length === 4;
  
  const updatedProgress: StoryProgress = {
    ...currentProgress,
    completedChapters: newCompletedChapters,
    currentChapter: Math.min(completedChapter + 1, 3),
    totalProgress,
    isCertified: allChaptersCompleted,
    certificationDate: allChaptersCompleted && !currentProgress.isCertified 
      ? new Date().toISOString() 
      : currentProgress.certificationDate,
    gameUnlocked: allChaptersCompleted
  };
  
  saveProgressToCookie(updatedProgress);
  return updatedProgress;
}