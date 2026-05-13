export default class Preload extends Phaser.Scene {
  constructor() { super("Preload"); }
  preload() {
    this.load.image("chicken", "assets/chicken.png");
  }
  create() { this.scene.start("Main"); }
}