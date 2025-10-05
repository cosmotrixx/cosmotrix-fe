export interface AudioSegment {
  file: string;
  startTime?: number;
  endTime?: number;
}

export interface StorySubtitle {
  id: string;
  text: string;
  duration?: number; // Duration to display this subtitle in milliseconds
  speaker?: 'narrator' | 'luna' | 'character'; // Who is speaking
  audioUrl?: string; // Direct audio URL for this subtitle
  audioSegment?: AudioSegment; // Audio segment with timing info
}

export interface StorySlide {
  id: string;
  imageUrl: string;
  subtitles: StorySubtitle[];
  audioUrl?: string;
  duration?: number; // Total duration to display this slide in milliseconds
}

export interface StoryChapter {
  id: string;
  number: number;
  title: string;
  description: string;
  slides: StorySlide[];
  unlocked: boolean;
  completed: boolean;
  thumbnailUrl: string;
  bgColor: string;
  textColor: string;
}

export interface StoryProgress {
  currentChapter: number;
  completedChapters: number[];
  lastSlideViewed: { [chapterId: string]: string };
  totalProgress: number; // 0-100
  badges: string[]; // Badge IDs earned
  isCertified: boolean; // Whether user has completed all chapters
  certificationDate?: string; // ISO date string when certified
  gameUnlocked: boolean; // Whether bonus game content is unlocked
  userName?: string; // User's name for the certificate
}

export interface StoryCardState {
  isPlaying: boolean;
  currentSlide: number;
  scrollPosition: number;
  audioPlaying: boolean;
  showSubtitles: boolean;
}