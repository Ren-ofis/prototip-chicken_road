export default class Main extends Phaser.Scene {
  constructor() { super("Main"); }

  create() {
    this.ch = this.add.image(60, 600, "chicken").setScale(-0.1, 0.1);
    this.mh = this.add.image(400, 600, "manhole").setScale(0.1);
    this.rb = this.add.image(400, 450, "roadBarrier").setScale(0.3);
    this.car = this.add.image(400, 450, "car").setScale(0.1).setAngle(90);

    // Listen for any click/tap on the screen
    this.input.on('pointerdown', () => {
      this.ch.x += 150;
    });
    
  }
  update() {
  }
}