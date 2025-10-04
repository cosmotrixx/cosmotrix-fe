import { Phaser } from './phaser';
import Bootloader from '../starshake/src/scenes/bootloader';
import Outro from '../starshake/src/scenes/outro';
import Splash from '../starshake/src/scenes/splash';
import Transition from '../starshake/src/scenes/transition';
import GameScene from '../starshake/src/scenes/game';

export const gameConfig: Phaser.Types.Core.GameConfig = {
  type: Phaser.AUTO,
  width: 1000,
  height: 800,
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
  },
  autoRound: false,
  parent: 'phaser-game',
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { x: 0, y: 0 },
      debug: false
    }
  },
  scene: [Bootloader, Splash, Transition, GameScene, Outro]
};

export class Game extends Phaser.Game {
  constructor(config: Phaser.Types.Core.GameConfig) {
    super(config);
  }
}

export default Game;