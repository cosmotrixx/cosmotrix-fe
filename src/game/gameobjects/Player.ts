import { Phaser } from '../phaser';

export class Player extends Phaser.Physics.Arcade.Sprite {
  private speed: number = 160;
  private jumpSpeed: number = 330;

  constructor(scene: Phaser.Scene, x: number, y: number) {
    super(scene, x, y, 'player');
    
    // Add this sprite to the scene
    scene.add.existing(this);
    scene.physics.add.existing(this);
    
    // Set up physics properties
    this.setBounce(0.2);
    this.setCollideWorldBounds(true);
    this.setTint(0x00ff00); // Green color
    this.setDisplaySize(32, 48);
  }

  update(cursors: Phaser.Types.Input.Keyboard.CursorKeys) {
    // Handle left and right movement
    if (cursors.left.isDown) {
      this.setVelocityX(-this.speed);
    } else if (cursors.right.isDown) {
      this.setVelocityX(this.speed);
    } else {
      this.setVelocityX(0);
    }

    // Handle jumping
    if (cursors.up.isDown && this.body!.touching.down) {
      this.setVelocityY(-this.jumpSpeed);
    }
  }

  // Method to change player color
  changeColor(color: number) {
    this.setTint(color);
  }

  // Method to increase speed
  boostSpeed(multiplier: number = 1.5) {
    this.speed *= multiplier;
  }

  // Method to reset speed
  resetSpeed() {
    this.speed = 160;
  }
}