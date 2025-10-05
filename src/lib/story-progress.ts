import { StoryProgress, StoryChapter } from '@/types/story';
import { 
  getProgressFromCookie, 
  saveProgressToCookie, 
  unlockNextChapter,
  isChapterUnlockedByProgress 
} from './cookie-progress';

export function getStoredProgress(): StoryProgress {
  return getProgressFromCookie();
}

export function saveProgress(progress: StoryProgress): void {
  saveProgressToCookie(progress);
}

export function markChapterCompleted(chapterNumber: number): StoryProgress {
  const currentProgress = getProgressFromCookie();
  return unlockNextChapter(currentProgress, chapterNumber);
}

export function updateLastSlideViewed(chapterId: string, slideId: string): void {
  const progress = getProgressFromCookie();
  progress.lastSlideViewed[chapterId] = slideId;
  saveProgressToCookie(progress);
}

export function saveUserName(userName: string): void {
  const progress = getProgressFromCookie();
  progress.userName = userName;
  saveProgressToCookie(progress);
}

export function isChapterUnlocked(chapterNumber: number): boolean {
  const progress = getProgressFromCookie();
  return isChapterUnlockedByProgress(chapterNumber, progress);
}

export function getChapterProgress(chapters: StoryChapter[]): StoryChapter[] {
  const progress = getProgressFromCookie();
  
  return chapters.map(chapter => ({
    ...chapter,
    unlocked: isChapterUnlockedByProgress(chapter.number, progress),
    completed: progress.completedChapters.includes(chapter.number)
  }));
}