// Type declarations for Phaser game objects
declare global {
  namespace Phaser {
    namespace GameObjects {
      interface GameObjectFactory {
        player(x: number, y: number): import('@/game/gameobjects/Player').Player;
      }
    }
  }
}

export {};