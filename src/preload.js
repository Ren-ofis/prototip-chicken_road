export default class Preload extends Phaser.Scene {
  constructor() { super("Preload"); }
  preload() {
    this.load.image("chicken", "assets/chicken.png");
    this.load.image("manhole", "assets/manhole_cover.png");
    this.load.image("roadBarrier", "assets/roadBarrier.png");
  }
  create() { this.scene.start("Main"); }
}