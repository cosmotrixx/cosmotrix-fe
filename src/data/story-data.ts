import { StoryChapter } from '@/types/story';
import { parseSubtitleFile, groupSubtitlesByPage, generateChapterSlides } from '@/lib/subtitle-parser';

// Import subtitle files as strings (in a real app, you'd load these from files)
const prologueSubtitles = `# Prologue Subtitles

1-1: Luna kept her father's pocket watch, the only memory left after he disappeared during a mysterious cosmic storm.
1-2-luna: Why did my father have to die in that war? What was really happening back then?
2-1: Suddenly, the watch glowed. It opened a portal. Luna was pulled in.
6-1-luna: Where am I?`;

const chapter1Subtitles = `# Chapter 1 Subtitles

1-1: Within the blazing heart of the Sun, there lies a kingdom ruled by a powerful king. This kingdom is split into two great realms: Flare and CME!
2-1: It is the king's duty to guard the Flare and CME, keeping them bound within the Sun.
3-1: But a villain arose—Pedroz. With his sinister influence, he twisted the Flares and CMEs to serve his plan: an invasion of Earth.`;

const chapter2Subtitles = `# Chapter 2 - The Hidden War Subtitles

1-1: Pedroz was once a guardian, but his heart turned dark. He discovered the Voidlings, alien shadows who feed on cosmic storms. Together, they built a plan: trap the Sun's power, Flare and CMEs, then unleash it all at once… to shatter Earth.
3-1: First, Pedroz showed the Flares how to attack. They went into the power-up machine—starting at Level A, then B, then C and M—getting stronger and stronger until they reached their super form: the mighty Level X Flares!
4-1: Second, CME—the colossal bubble of the Sun's corona—builds its power, ready to unleash a storm of particles. With each surge of strength, the warning light turns—from green… to red.
5-1: United, CME and the Flares become an unstoppable force—unleashing radiation storms that erupt into torrents of proton flux!`;

const chapter3Subtitles = `# Chapter 3 - The Earth Subtitles

1-1: Flori, one of the Flares, discovered how evil Pedroz really was. She fled to Earth to warn them.
2-1: Whoops! Flori bumped right into a pilot soaring through the sky!
3-1: The pilot loses signals. The plane tumbled down and landed on the ground with a crash!
4-1: The pilot quickly called NASA, a brave team that checks what's going on in space! The researchers tried to investigate, but even their signal was lost. So, they chose James, one of the bravest astronauts, to go up into space and find out what was happening.
4-2: James started his adventure. He flew up through the sky and into space!
5-1: Pedroz saw James's rocket. He started shooting flares and CMEs at him!
6-1: The signal began to break up. The Telecom Sector got worried because the satellite wasn't working well.
7-1: Suddenly, the electricity failed—throwing the power sector into panic.
8-1: James tumbled down to Earth, landing right inside the colorful aurora in the sky.`;

// Parse subtitles
const prologueSubtitleMap = groupSubtitlesByPage(parseSubtitleFile(prologueSubtitles));
const chapter1SubtitleMap = groupSubtitlesByPage(parseSubtitleFile(chapter1Subtitles));
const chapter2SubtitleMap = groupSubtitlesByPage(parseSubtitleFile(chapter2Subtitles));
const chapter3SubtitleMap = groupSubtitlesByPage(parseSubtitleFile(chapter3Subtitles));

// Define image files for each chapter - include all available images
const prologueImages = [
  '[1.0] Prolog.png',   // Page 1
  '[1.1] Prolog.png',   // Page 2
  '[2.0] Prolog.png',   // Page 3
  '[2.1] Prolog.png',   // Page 4
  '[2.2] Prolog.png',   // Page 5
  '[3.0] Prolog.png'    // Page 6
];

const chapter1Images = [
  '[1.0] Chapter 1.png',  // Page 1
  '[2.0] Chapter 1.png',  // Page 2
  '[3.0] Chapter 1.png',  // Page 3
];

// For chapters 2 and 3, use the actual available images
const chapter2Images = [
  '10.png',  // Page 1
  '11.png',  // Page 2
  '12.png',  // Page 3
  '13.png',  // Page 4
  '14.png',  // Page 5
  '15.png'  // Page 6
];

const chapter3Images = [
  '16.png',  // Page 1
  '17.png',  // Page 2
  '18.png',  // Page 3
  '20.png',  // Page 4
  '21.png',  // Page 5
  '22.png',  // Page 6
  '23.png',  // Page 7
  '24.png'  // Page 8
];

// Audio files for each chapter - maps to subtitle lines, not pages
// Can use objects for time segments: { file: 'audio.mp3', startTime: 0, endTime: 5 }
const prologueAudio = [
  'V01 Cosmotrix.mp3',  // Page 1, Line 1 (Narrator)
  'V02 Cosmotrix.mp3',  // Page 1, Line 2 (Luna)
  'V03-1.mp3',  // Page 2, Line 1 (Narrator)
  null,
  null,                  
  null,
  'V03-2.mp3'

];

const chapter1Audio = [
  'V04 Cosmotrix.mp3',  // Page 1
  'V05 Cosmotrix.mp3',  // Page 2
  'V06 Cosmotrix.mp3'   // Page 3
];

const chapter2Audio = [
  'V07 Cosmotrix.mp3',  // Page 1
  null,
  'V08 Cosmotrix.mp3',  // Page 2
  'V09 Cosmotrix.mp3',  // Page 3
  'V10 Cosmotrix.mp3',  // Page 4
  null,                 // Page 5 - no audio
  null                  // Page 6 - no audio
];

const chapter3Audio = [
  'V11 Cosmotrix.mp3',  // Page 1
  'V12 Cosmotrix.mp3',  // Page 2
  'V13 Cosmotrix.mp3',  // Page 3
  'V14 Cosmotrix.mp3',  // Page 4
  'V15 Cosmotrix.mp3',  // Page 5
  'V16 Cosmotrix.mp3',  // Page 6
  'V17 Cosmotrix.mp3',  // Page 7
  'V18 Cosmotrix.mp3',  // Page 8
  'V19 Cosmotrix.mp3'   // Page 9
];

export const STORY_CHAPTERS: StoryChapter[] = [
  {
    id: 'prologue',
    number: 0,
    title: 'Prologue: The Invisible War',
    description: 'Luna discovers her father\'s mysterious past through a magical pocket watch.',
    thumbnailUrl: '/images/chapters/prologue/[1.0] Prolog.png',
    bgColor: 'from-purple-500 to-blue-400',
    textColor: 'text-white',
    unlocked: true,
    completed: false,
    slides: generateChapterSlides('prologue', prologueImages, prologueSubtitleMap, prologueAudio)
  },
  {
    id: 'chapter-1',
    number: 1,
    title: 'Kingdom of the Sun',
    description: 'Within the Sun\'s heart lies a kingdom ruled by a powerful king, but evil threatens the realm.',
    thumbnailUrl: '/images/chapters/chapter1/[1.0] Chapter 1.png',
    bgColor: 'from-orange-500 to-yellow-400',
    textColor: 'text-white',
    unlocked: false,
    completed: false,
    slides: generateChapterSlides('chapter1', chapter1Images, chapter1SubtitleMap, chapter1Audio)
  },
  {
    id: 'chapter-2',
    number: 2,
    title: 'The Hidden War',
    description: 'Pedroz corrupts the Flares and CMEs, building an army to invade Earth.',
    thumbnailUrl: '/images/chapters/chapter2/10.png',
    bgColor: 'from-red-500 to-purple-600',
    textColor: 'text-white',
    unlocked: false,
    completed: false,
    slides: generateChapterSlides('chapter2', chapter2Images, chapter2SubtitleMap, chapter2Audio)
  },
  {
    id: 'chapter-3',
    number: 3,
    title: 'When Flare Breaks Free',
    description: 'Flori warns Earth of the danger, but chaos erupts as the cosmic war reaches our planet.',
    thumbnailUrl: '/images/chapters/chapter3/17.png',
    bgColor: 'from-blue-500 to-green-500',
    textColor: 'text-white',
    unlocked: false,
    completed: false,
    slides: generateChapterSlides('chapter3', chapter3Images, chapter3SubtitleMap, chapter3Audio)
  }
];