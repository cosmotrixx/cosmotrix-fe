/**
 * Example component showing how to use chapter completion
 * You can integrate this logic into your story/chapter pages
 */

"use client"

import { useRouter } from "next/navigation"
import { completeChapter } from "../lib/chapter-progress"
import { Button } from "./ui/button"

interface ChapterCompletionProps {
  chapterId: string
  onComplete?: () => void
}

export function ChapterCompletion({ chapterId, onComplete }: ChapterCompletionProps) {
  const router = useRouter()

  const handleCompleteChapter = () => {
    // Mark the chapter as completed
    completeChapter(chapterId)
    
    // Call optional callback
    onComplete?.()
    
    // Optionally redirect back to the chapter selection
    // router.push('/#chapters')
    
    // Or show a success message
    console.log(`Chapter ${chapterId} completed!`)
  }

  return (
    <div className="flex flex-col items-center gap-4 p-6">
      <h2 className="text-2xl font-bold">Chapter Complete!</h2>
      <p className="text-muted-foreground">
        You've finished this chapter. The next chapter is now unlocked.
      </p>
      <Button onClick={handleCompleteChapter} size="lg">
        Continue to Next Chapter
      </Button>
    </div>
  )
}

/**
 * Usage example in a chapter page:
 * 
 * import { ChapterCompletion } from '@/components/chapter-completion'
 * 
 * export default function ChapterPage() {
 *   return (
 *     <div>
 *       <h1>Chapter Content</h1>
 *       {/* Your chapter content here *\/}
 *       
 *       {/* At the end of the chapter *\/}
 *       <ChapterCompletion 
 *         chapterId="prologue"
 *         onComplete={() => {
 *           // Optional: Additional actions after completion
 *         }}
 *       />
 *     </div>
 *   )
 * }
 */
