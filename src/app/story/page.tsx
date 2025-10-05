'use client';

import { StoryCardSystem } from '@/components/story/story-card-system';
import { StarField } from '@/components/backgrounds/star-field';

export default function StoryPage() {
  return (
    <div className="min-h-screen bg-black relative overflow-hidden">
      {/* Background starfield */}
      <StarField 
        opacity={0.4}
        numParticles={100}
        colors={["#ffffff", "#ffd700", "#87ceeb", "#ff69b4"]}
        particleSize={1.5}
        speed={0.3}
        enableConnections={true}
        connectionDistance={100}
        connectionOpacity={0.1}
        enableHover={false}
        enableClick={false}
        className="z-0"
      />
      
      {/* Story Card System */}
      <div className="relative z-10">
        <StoryCardSystem />
      </div>

      {/* Back to home button */}
      <div className="fixed top-6 left-6 z-50">
        <a 
          href="/" 
          className="inline-flex items-center px-4 py-2 bg-black/60 backdrop-blur-sm hover:bg-black/80 text-white font-medium rounded-lg transition-all duration-300 border border-white/20 hover:border-white/40"
        >
          <span className="mr-2">←</span>
          Back to Home
        </a>
      </div>
    </div>
  );
}