export default class Main extends Phaser.Scene {
  constructor() { super("Main"); }

  create() {
    this.ch = this.add.image(60, 600, "chicken").setScale(-0.1, 0.1);
    this.mh = this.add.image(400, 600, "manhole").setScale(0.1);
    this.rb = this.add.image(400, 450, "roadBarrier").setScale(0.3);
  }
  update() {

  }
}