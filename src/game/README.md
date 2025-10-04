# Cosmotrix Game

This directory contains the Phaser.js game implementation for the Cosmotrix project.

## Structure

```
src/game/
├── index.ts              # Main game configuration and Game class
├── scenes/               # Game scenes
│   └── MainScene.ts     # Main game scene
├── gameobjects/         # Game objects and entities
│   └── Player.ts        # Player character class
└── assets/              # Game assets (images, sounds, etc.)
```

## Features

- **Phaser.js Integration**: Uses Phaser 3 game framework
- **TypeScript Support**: Full TypeScript integration
- **Modular Architecture**: Organized into scenes and game objects
- **Physics System**: Arcade physics for movement and collisions
- **Next.js Integration**: Seamlessly integrated with Next.js React components

## Game Controls

- **Arrow Keys**: Move the player character
- **Up Arrow**: Jump
- **Left/Right Arrows**: Move left and right

## Getting Started

The game is automatically loaded when you navigate to `/game` route in the Next.js application.

## Adding New Features

1. **New Scenes**: Add new scene files in the `scenes/` directory
2. **Game Objects**: Create new game objects in the `gameobjects/` directory
3. **Assets**: Place game assets in the `assets/` directory
4. **Configuration**: Modify game settings in `index.ts`

## Current Implementation

The current implementation includes:
- A basic player character that can move and jump
- Simple physics with gravity and collision detection
- Keyboard controls
- Basic ground platform

## Next Steps

Consider adding:
- More game objects (enemies, collectibles, etc.)
- Multiple levels/scenes
- Sound effects and music
- Sprite animations
- Game UI elements
- Save/load functionality