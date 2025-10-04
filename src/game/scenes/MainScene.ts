import { Phaser } from '../phaser';
import { Player } from '../gameobjects/Player';

export class MainScene extends Phaser.Scene {
  private cursors!: Phaser.Types.Input.Keyboard.CursorKeys;
  private player!: Player;

  constructor() {
    super({ key: 'MainScene' });
  }

  preload() {
    // Create a simple colored rectangle for the player
    this.load.image('player', 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==');
    
    // Create ground
    this.load.image('ground', 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==');
  }

  create() {
    // Create ground
    const platforms = this.physics.add.staticGroup();
    platforms.create(400, 568, 'ground').setScale(800, 64).refreshBody();

    // Create player
    this.player = new Player(this, 100, 450);

    // Player physics
    this.physics.add.collider(this.player, platforms);

    // Create cursor keys
    this.cursors = this.input.keyboard!.createCursorKeys();

    // Add some text
    this.add.text(16, 16, 'Cosmotrix Game!', {
      fontSize: '32px',
      color: '#000'
    });

    this.add.text(16, 60, 'Use arrow keys to move', {
      fontSize: '16px',
      color: '#000'
    });
  }

  update() {
    this.player.update(this.cursors);
  }
}