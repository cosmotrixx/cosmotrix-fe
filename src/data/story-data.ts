import { StoryChapter } from '@/types/story';

export const STORY_CHAPTERS: StoryChapter[] = [
  {
    id: 'chapter-1',
    number: 1,
    title: 'Kingdom of the Sun',
    description: 'Meet Flare, CME, Solar Wind, and Aurora — elemental children of the Sun.',
    thumbnailUrl: '/images/chapters.png',
    bgColor: 'from-orange-500 to-yellow-400',
    textColor: 'text-white',
    unlocked: true,
    completed: false,
    slides: [
      {
        id: 'slide-1-1',
        imageUrl: '/images/story-hero.png',
        subtitle: 'In the heart of our solar system, the Sun reigns supreme...',
        duration: 4000
      },
      {
        id: 'slide-1-2',
        imageUrl: '/images/hero-bg.png',
        subtitle: 'But within its fiery core, four powerful entities were born.',
        duration: 4000
      },
      {
        id: 'slide-1-3',
        imageUrl: '/images/voidlings.png',
        subtitle: 'Flare, the explosive and unpredictable energy burst.',
        duration: 4000
      },
      {
        id: 'slide-1-4',
        imageUrl: '/images/data-viz.png',
        subtitle: 'CME, the massive magnetic storm.',
        duration: 4000
      },
      {
        id: 'slide-1-5',
        imageUrl: '/images/partnerships.png',
        subtitle: 'Solar Wind, the constant stream of charged particles.',
        duration: 4000
      },
      {
        id: 'slide-1-6',
        imageUrl: '/images/bg-1.png',
        subtitle: 'And Aurora, the beautiful light dancer.',
        duration: 4000
      },
      {
        id: 'slide-1-7',
        imageUrl: '/images/silhouette-1.png',
        subtitle: 'Together, they hold the power to affect all life on Earth.',
        duration: 5000
      }
    ]
  },
  {
    id: 'chapter-2',
    number: 2,
    title: 'The Hidden War',
    description: 'Learn how invisible storms disrupt Earth: power, GPS, satellites, and more.',
    thumbnailUrl: '/images/data-viz.png',
    bgColor: 'from-purple-600 to-blue-500',
    textColor: 'text-white',
    unlocked: false,
    completed: false,
    slides: [
      {
        id: 'slide-2-1',
        imageUrl: '/images/data-viz.png',
        subtitle: 'Far from the Sun, Earth seems peaceful and protected...',
        duration: 4000
      },
      {
        id: 'slide-2-2',
        imageUrl: '/images/hero-bg.png',
        subtitle: 'But invisible forces are constantly at work.',
        duration: 4000
      },
      {
        id: 'slide-2-3',
        imageUrl: '/images/partnerships.png',
        subtitle: 'Pilots lose radio contact mid-flight.',
        duration: 4000
      },
      {
        id: 'slide-2-4',
        imageUrl: '/images/arcade.png',
        subtitle: 'GPS systems fail, leaving travelers lost.',
        duration: 4000
      },
      {
        id: 'slide-2-5',
        imageUrl: '/images/voidlings.png',
        subtitle: 'Power grids flicker and fail across continents.',
        duration: 4000
      },
      {
        id: 'slide-2-6',
        imageUrl: '/images/bg-1.png',
        subtitle: 'Satellites go dark, cutting communication.',
        duration: 5000
      }
    ]
  },
  {
    id: 'chapter-3',
    number: 3,
    title: 'When Flare Breaks Free',
    description: 'See the real impact on pilots, astronauts, farmers, and scientists.',
    thumbnailUrl: '/images/voidlings.png',
    bgColor: 'from-red-500 to-orange-500',
    textColor: 'text-white',
    unlocked: false,
    completed: false,
    slides: [
      {
        id: 'slide-3-1',
        imageUrl: '/images/voidlings.png',
        subtitle: 'When Flare breaks free from the Sun\'s embrace...',
        duration: 4000
      },
      {
        id: 'slide-3-2',
        imageUrl: '/images/hero-bg.png',
        subtitle: 'The effects ripple across space and time.',
        duration: 4000
      },
      {
        id: 'slide-3-3',
        imageUrl: '/images/partnerships.png',
        subtitle: 'Captain Sarah feels her instruments fail at 30,000 feet.',
        duration: 4000
      },
      {
        id: 'slide-3-4',
        imageUrl: '/images/story-hero.png',
        subtitle: 'Astronaut Mike watches his station\'s systems go offline.',
        duration: 4000
      },
      {
        id: 'slide-3-5',
        imageUrl: '/images/data-viz.png',
        subtitle: 'Farmer John\'s GPS-guided tractors stop working.',
        duration: 4000
      },
      {
        id: 'slide-3-6',
        imageUrl: '/images/bg-1.png',
        subtitle: 'Scientists worldwide scramble to understand and predict.',
        duration: 4000
      },
      {
        id: 'slide-3-7',
        imageUrl: '/images/silhouette-1.png',
        subtitle: 'The invisible war affects everyone, everywhere.',
        duration: 5000
      }
    ]
  }
];