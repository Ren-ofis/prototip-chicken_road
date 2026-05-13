export default class Main extends Phaser.Scene {
  constructor() { super("Main"); }

  create() {
    this.ch = this.add.image(60, 600, "chicken").setScale(-0.1, 0.1);
  }
  update() {

  }
}