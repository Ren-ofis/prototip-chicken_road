// Chicken.js - The player character
export default class Chicken extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x, y) {
    super(scene, x, y, "chicken");
    scene.add.existing(this);
    scene.physics.add.existing(this);
    
    this.setScale(0.15);
    this.setCollideWorldBounds(true);
    this.body.setSize(80, 80);
    
    this.startX = x;
    this.startY = y;
    this.currentLane = 0;
  }

  moveTo(newX, laneIndex) {
    const laneHeight = 90;
    const targetY = 900 - (laneIndex * laneHeight);
    
    this.scene.tweens.add({
      targets: this,
      x: newX,
      y: targetY,
      duration: 500,
      ease: "Quad.inOut",
    });
    
    this.currentLane = laneIndex;
  }

  crash() {
    // Shake and spin animation
    this.scene.tweens.add({
      targets: this,
      angle: 180,
      duration: 300,
      ease: "Quad.in",
    });
    
    this.scene.cameras.main.shake(300, 0.02);
    
    // Fade out
    this.scene.tweens.add({
      targets: this,
      alpha: 0.3,
      duration: 500,
      delay: 300,
    });
  }

  resetPosition() {
    this.x = this.startX;
    this.y = this.startY;
    this.angle = 0;
    this.alpha = 1;
    this.currentLane = 0;
  }
}
