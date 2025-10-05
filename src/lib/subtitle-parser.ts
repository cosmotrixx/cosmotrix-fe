import { StorySubtitle, StorySlide } from '@/types/story';

interface ParsedSubtitle {
  pageNumber: number;
  subtitleNumber: number;
  text: string;
  speaker?: 'narrator' | 'luna' | 'character';
}

export interface AudioSegment {
  file: string;
  startTime?: number;
  endTime?: number;
}

export function parseSubtitleFile(content: string): ParsedSubtitle[] {
  const lines = content.split('\n').filter(line => line.trim() && !line.startsWith('#'));
  const subtitles: ParsedSubtitle[] = [];

  for (const line of lines) {
    // Parse format: 1-1: Text (narrator) or 1-1-luna: Text or 1-1-V01: Text (narrator with voice ID) or 1-1-V02-luna: Text (luna with voice ID) or 1-1-continue: Text
    const match = line.match(/^(\d+)-(\d+)(?:-(luna|character|continue|V\d+(?:-luna)?|V\d+(?:-character)?))?\s*:\s*(.+)$/);
    if (match) {
      const [, pageNum, subtitleNum, speakerOrVoice, text] = match;
      
      let speaker: 'narrator' | 'luna' | 'character' = 'narrator';
      let voiceId: string | undefined;
      let continueAudio = false;
      
      if (speakerOrVoice) {
        if (speakerOrVoice === 'luna') {
          speaker = 'luna';
        } else if (speakerOrVoice === 'character') {
          speaker = 'character';
        } else if (speakerOrVoice === 'continue') {
          continueAudio = true;
        } else if (speakerOrVoice.startsWith('V')) {
          // Handle V01, V02, V03-luna, etc.
          const voiceMatch = speakerOrVoice.match(/^(V\d+)(?:-(luna|character))?$/);
          if (voiceMatch) {
            voiceId = voiceMatch[1];
            if (voiceMatch[2] === 'luna') {
              speaker = 'luna';
            } else if (voiceMatch[2] === 'character') {
              speaker = 'character';
            } else {
              speaker = 'narrator';
            }
          }
        }
      }
      
      subtitles.push({
        pageNumber: parseInt(pageNum),
        subtitleNumber: parseInt(subtitleNum),
        text: text.trim(),
        speaker
      });
    }
  }

  return subtitles;
}

export function groupSubtitlesByPage(subtitles: ParsedSubtitle[]): Map<number, StorySubtitle[]> {
  const grouped = new Map<number, StorySubtitle[]>();

  for (const subtitle of subtitles) {
    if (!grouped.has(subtitle.pageNumber)) {
      grouped.set(subtitle.pageNumber, []);
    }
    
    grouped.get(subtitle.pageNumber)!.push({
      id: `${subtitle.pageNumber}-${subtitle.subtitleNumber}`,
      text: subtitle.text,
      duration: 4000, // Default 4 seconds per subtitle
      speaker: subtitle.speaker
    });
  }

  return grouped;
}

export function generateChapterSlides(
  chapterName: string, 
  imageFiles: string[], 
  subtitleMap: Map<number, StorySubtitle[]>,
  audioFiles?: (string | AudioSegment | null)[]
): StorySlide[] {
  const slides: StorySlide[] = [];

  // Sort image files naturally - handle both numbered and special filenames
  const sortedImages = imageFiles
    .filter(file => file.endsWith('.png'))
    .sort((a, b) => {
      // Extract numbers from filenames for sorting
      const getNumber = (filename: string) => {
        // Handle special format like "[1.0] Chapter 1.png"
        const specialMatch = filename.match(/\[(\d+(?:\.\d+)?)\]/);
        if (specialMatch) {
          return parseFloat(specialMatch[1]);
        }
        // Handle regular numbers like "10.png"
        const regularMatch = filename.match(/(\d+)\.png$/);
        if (regularMatch) {
          return parseInt(regularMatch[1]);
        }
        return 0;
      };
      return getNumber(a) - getNumber(b);
    });

  // Track audio index across all subtitles
  let audioIndex = 0;

  // Create slides for ALL images, regardless of whether they have subtitles
  sortedImages.forEach((imageFile, index) => {
    const pageNumber = index + 1;
    const subtitles = subtitleMap.get(pageNumber);
    
    // If no subtitles exist for this page, create a default empty subtitle
    const finalSubtitles = subtitles || [
      {
        id: `${pageNumber}-1`,
        text: '', // Empty text for images without subtitles
        duration: 4000,
        speaker: 'narrator' as const
      }
    ];

    // Assign audio files to each subtitle
    const subtitlesWithAudio = finalSubtitles.map(subtitle => {
      const audioFile = audioFiles?.[audioIndex];
      audioIndex++; // Move to next audio file for next subtitle
      
      let audioUrl: string | undefined;
      let audioSegment: AudioSegment | undefined;
      
      if (audioFile) {
        if (typeof audioFile === 'string') {
          audioUrl = `/audio/${audioFile}`;
        } else {
          // It's an AudioSegment object
          audioUrl = `/audio/${audioFile.file}`;
          audioSegment = audioFile;
        }
      }
      
      return {
        ...subtitle,
        audioUrl,
        audioSegment
      };
    });

    slides.push({
      id: `slide-${chapterName}-${pageNumber}`,
      imageUrl: `/images/chapters/${chapterName}/${imageFile}`,
      subtitles: subtitlesWithAudio,
      duration: subtitlesWithAudio.reduce((total, sub) => total + (sub.duration || 4000), 0)
    });
  });

  return slides;
}