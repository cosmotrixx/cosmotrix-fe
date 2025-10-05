/**
 * Utility functions for managing chapter progression using session cookies
 */

const COOKIE_NAME = 'chapter_progress'

export interface ChapterProgress {
  completedChapters: string[]
  currentChapter: string
}

/**
 * Get the current chapter progression from session cookies
 */
export function getChapterProgress(): ChapterProgress {
  if (typeof window === 'undefined') {
    return { completedChapters: [], currentChapter: 'prologue' }
  }

  const cookies = document.cookie.split('; ')
  const progressCookie = cookies.find(cookie => cookie.startsWith(`${COOKIE_NAME}=`))
  
  if (!progressCookie) {
    // Default: only prologue is unlocked
    return { completedChapters: [], currentChapter: 'prologue' }
  }

  try {
    const value = progressCookie.split('=')[1]
    const decoded = decodeURIComponent(value)
    return JSON.parse(decoded)
  } catch (error) {
    console.error('Failed to parse chapter progress:', error)
    return { completedChapters: [], currentChapter: 'prologue' }
  }
}

/**
 * Save chapter progression to session cookies
 */
export function saveChapterProgress(progress: ChapterProgress): void {
  if (typeof window === 'undefined') return

  const value = encodeURIComponent(JSON.stringify(progress))
  // Session cookie (no max-age or expires) - will be deleted when browser closes
  document.cookie = `${COOKIE_NAME}=${value}; path=/; SameSite=Strict`
}

/**
 * Mark a chapter as completed and unlock the next one
 */
export function completeChapter(chapterId: string): void {
  const progress = getChapterProgress()
  
  if (!progress.completedChapters.includes(chapterId)) {
    progress.completedChapters.push(chapterId)
  }
  
  // Define chapter order
  const chapterOrder = ['prologue', 'kingdom-sun', 'hidden-war', 'flare-breaks-free']
  const currentIndex = chapterOrder.indexOf(chapterId)
  
  if (currentIndex !== -1 && currentIndex < chapterOrder.length - 1) {
    progress.currentChapter = chapterOrder[currentIndex + 1]
  }
  
  saveChapterProgress(progress)
}

/**
 * Check if a chapter is unlocked
 */
export function isChapterUnlocked(chapterId: string): boolean {
  const progress = getChapterProgress()
  
  // Define chapter order
  const chapterOrder = ['prologue', 'kingdom-sun', 'hidden-war', 'flare-breaks-free']
  const chapterIndex = chapterOrder.indexOf(chapterId)
  
  if (chapterIndex === -1) return false
  if (chapterIndex === 0) return true // First chapter is always unlocked
  
  // Check if previous chapter is completed
  const previousChapter = chapterOrder[chapterIndex - 1]
  return progress.completedChapters.includes(previousChapter)
}

/**
 * Reset chapter progression (for testing/debugging)
 */
export function resetChapterProgress(): void {
  if (typeof window === 'undefined') return
  document.cookie = `${COOKIE_NAME}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT`
}
