export default class Preload extends Phaser.Scene {
  constructor() { super("Preload"); }
  preload() {


  }
  create() { this.scene.start("Main"); }
}