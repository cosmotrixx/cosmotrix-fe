'use client';

import { useEffect, useRef } from 'react';
import { Game, gameConfig } from '@/game';

export default function GameComponent() {
  const gameRef = useRef<Phaser.Game | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (containerRef.current && !gameRef.current) {
      // Create the Phaser game instance
      gameRef.current = new Game({
        ...gameConfig,
        parent: containerRef.current
      });
    }

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
      <div 
        ref={containerRef} 
        className="border-2 border-gray-300 rounded-lg"
        style={{ width: '800px', height: '600px' }}
      />
    </div>
  );
}