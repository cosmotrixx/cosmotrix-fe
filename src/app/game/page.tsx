'use client';

import { useEffect, useRef, useState } from 'react';
import dynamic from 'next/dynamic';
import { StarField } from '@/components/backgrounds/star-field';

// Dynamically import the Game component to avoid SSR issues
const GameComponent = dynamic(() => Promise.resolve(GameComponentInner), {
  ssr: false,
  loading: () => (
    <div className="w-full h-screen flex items-center justify-center bg-black relative overflow-hidden">
      <StarField 
        opacity={0.6}
        numParticles={150}
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
      <div className="text-center relative z-10">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-purple-500 mx-auto mb-4"></div>
        <p className="text-white text-lg">Loading Cosmotrix Game...</p>
      </div>
    </div>
  )
});

function GameComponentInner() {
  const gameRef = useRef<any>(null); // Changed from Phaser.Game to any
  const containerRef = useRef<HTMLDivElement>(null);
  const [gameLoaded, setGameLoaded] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Only run on client side
    if (typeof window === 'undefined') return;

    // Dynamic import to avoid SSR issues
    const loadGame = async () => {
      try {
        // Import Phaser and game modules dynamically
        const [Phaser, { Game, gameConfig }] = await Promise.all([
          import('phaser'),
          import('@/game')
        ]);

        if (containerRef.current && !gameRef.current) {
          try {
            // Create the Phaser game instance with updated config
            gameRef.current = new Game({
              ...gameConfig,
              width: 800,
              height: 600,
              parent: containerRef.current,
              // Add responsive scaling
              scale: {
                mode: Phaser.Scale.FIT,
                autoCenter: Phaser.Scale.CENTER_BOTH,
                width: 800,
                height: 600
              }
            });
            setGameLoaded(true);
          } catch (err) {
            console.error('Failed to initialize game:', err);
            setError('Failed to load game. Please refresh the page.');
          }
        }
      } catch (err) {
        console.error('Failed to load game modules:', err);
        setError('Failed to load game modules. Please check your connection.');
      }
    };

    loadGame();

    // Cleanup function
    return () => {
      if (gameRef.current) {
        try {
          gameRef.current.destroy(true);
          gameRef.current = null;
        } catch (err) {
          console.error('Error destroying game:', err);
        }
      }
    };
  }, []);

  if (error) {
    return (
      <div className="w-full h-screen flex items-center justify-center bg-black relative overflow-hidden">
        <StarField 
          opacity={0.4}
          numParticles={100}
          colors={["#ff6b6b", "#ffd93d", "#6bcf7f", "#4d96ff"]}
          particleSize={1.5}
          speed={0.2}
          enableConnections={true}
          connectionDistance={120}
          connectionOpacity={0.05}
          enableHover={false}
          enableClick={false}
          className="z-0"
        />
        <div className="text-center max-w-md p-6 relative z-10">
          <div className="text-6xl mb-4">🎮</div>
          <h2 className="text-red-400 text-xl font-bold mb-2">Game Error</h2>
          <p className="text-gray-300 mb-4">{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors"
          >
            Reload Game
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-black relative overflow-hidden p-4">
      {/* Animated starfield background */}
      <StarField 
        opacity={0.8}
        numParticles={200}
        colors={["#ffffff", "#ffd700", "#87ceeb", "#ff69b4", "#98fb98"]}
        shapes={["circle", "star"]}
        particleSize={2}
        particleOpacity={0.6}
        speed={0.5}
        direction="none"
        enableConnections={true}
        connectionDistance={150}
        connectionOpacity={0.12}
        connectionWidth={0.8}
        enableHover={true}
        enableClick={true}
        hoverMode="bubble"
        clickMode="repulse"
        enableSizeAnimation={true}
        enableOpacityAnimation={true}
        animationSpeed={1.2}
        className="z-0"
      />

      {/* Game Title */}
      <div className="text-center mb-8 relative z-10">
        <h1 className="text-4xl md:text-5xl font-bold text-white mb-2">
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">
            Cosmotrix
          </span>{' '}
          <span className="text-cyan-400">Game</span>
        </h1>
        <p className="text-gray-300 text-lg">Space Weather Adventure</p>
      </div>

      {/* Game Container */}
      <div className="relative shadow-2xl z-10">
        {/* Container with border */}
        <div 
          className="relative mx-auto"
          style={{ 
            width: '900px', 
            height: '600px',
          }}
        >
          {/* Black background layer - behind everything */}
          <div
            className="absolute inset-0"
            style={{
              width: '100%',
              height: '100%',
              backgroundColor: '#000000',
              borderRadius: '8px',
              zIndex: 0, // Bottom layer
            }}
          />

          {/* Game canvas container - positioned to fit inside the border */}
          <div
            ref={containerRef}
            className="absolute"
            style={{
              top: '120px',    // Adjust based on your arcade.png top border
              left: '220px',   // Adjust based on your arcade.png left border  
              width: '460px',  // Playable area width
              height: '300px', // Playable area height
              zIndex: 1,       // Game behind the border
              borderRadius: '4px',
              overflow: 'hidden'
            }}
          />

          {/* Border overlay - on top of the game */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              width: '100%',
              height: '100%',
              backgroundImage: 'url(/images/arcade.png)',
              backgroundSize: '100% 100%',
              backgroundRepeat: 'no-repeat',
              zIndex: 10, // Higher z-index to appear on top
            }}
          />

          {/* Loading overlay */}
          {!gameLoaded && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/60 backdrop-blur-sm z-20 rounded-lg">
              <div className="text-center">
                <div className="animate-pulse text-4xl mb-4">🚀</div>
                <p className="text-white">Initializing game...</p>
              </div>
            </div>
          )}
        </div>

        {/* Game controls hint */}
        {gameLoaded && (
          <div className="mt-6 text-center">
            <div className="inline-flex items-center space-x-4 text-sm text-gray-400 bg-black/30 backdrop-blur-sm px-6 py-3 rounded-full">
              <span>🎮 Use arrow keys or WASD to move</span>
              <span>•</span>
              <span>🚀 Spacebar to shoot</span>
              <span>•</span>
              <span>⏸️ P to pause</span>
            </div>
          </div>
        )}
      </div>

      {/* Back to home button */}
      <div className="mt-8 relative z-10">
        <a 
          href="/" 
          className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-medium rounded-lg transition-all duration-300 shadow-lg hover:shadow-xl"
        >
          <span className="mr-2">←</span>
          Back to Home
        </a>
      </div>
    </div>
  );
}

export default function GamePage() {
  return <GameComponent />;
}