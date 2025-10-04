'use client';

import { useEffect, useRef } from 'react';
import dynamic from 'next/dynamic';

// Dynamically import the Game component to avoid SSR issues
const GameComponent = dynamic(() => Promise.resolve(GameComponentInner), {
  ssr: false,
  loading: () => <div className="w-full h-full flex items-center justify-center">Loading game...</div>
});

function GameComponentInner() {
  const gameRef = useRef<Phaser.Game | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Dynamic import to avoid SSR issues
    import('@/game').then(({ Game, gameConfig }) => {
      if (containerRef.current && !gameRef.current) {
        // Create the Phaser game instance with updated config
        gameRef.current = new Game({
          ...gameConfig,
          width: 800,
          height: 600,
          parent: containerRef.current
        });
      }
    });

    // Cleanup function
    return () => {
      if (gameRef.current) {
        gameRef.current.destroy(true);
        gameRef.current = null;
      }
    };
  }, []);

  return (
    <div className="w-full h-full flex flex-col items-center justify-center">
      <h1 className="text-2xl font-bold mb-4">Cosmotrix Game</h1>
      <div className="relative" style={{ width: '840px', height: '640px' }}>
        {/* Game container */}
        <div
          ref={containerRef}
          className="absolute top-5 left-5"
          style={{
            width: '800px',
            height: '600px',
            zIndex: 1
          }}
        />
        {/* Border overlay */}
        <div
          className="absolute top-0 left-0 pointer-events-none"
          style={{
            width: '840px',
            height: '640px',
            border: '20px solid transparent',
            borderImage: 'url(/assets/images/arcade.png) 20 fill stretch',
            borderImageSlice: '20 fill',
            zIndex: 10
          }}
        />
      </div>
    </div>
  );
}

export default function GamePage() {
  return <GameComponent />;
}