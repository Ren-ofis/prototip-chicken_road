import { AssetGenerator } from "./AssetGenerator.js";

export default class Preload extends Phaser.Scene {
  constructor() { super("Preload"); }

  preload() {
    // Create graphics for chicken
    const chickenGfx = this.make.graphics({ x: 0, y: 0, create: true });
    AssetGenerator.createChickenTexture(chickenGfx);
    chickenGfx.generateTexture("chicken", 100, 60);
    chickenGfx.destroy();
    
    // Create graphics for car
    const carGfx = this.make.graphics({ x: 0, y: 0, create: true });
    AssetGenerator.createCarTexture(carGfx);
    carGfx.generateTexture("car", 100, 70);
    carGfx.destroy();
    
    // Audio assets (will fail gracefully if not available)
    // this.load.audio("moveSound", "assets/sounds/move.wav");
    // this.load.audio("cashoutSound", "assets/sounds/cashout.wav");
    // this.load.audio("crashSound", "assets/sounds/crash.wav");
    // this.load.audio("winSound", "assets/sounds/win.wav");
    // this.load.audio("bgm", "assets/sounds/bgm.wav");
  }

  create() {
    // Load game state from localStorage
    this.loadGameState();
    this.scene.start("Menu");
  }

  loadGameState() {
    const savedState = localStorage.getItem("chickenGameState");
    if (!savedState) {
      const initialState = {
        balance: 1000,
        totalGames: 0,
        wins: 0,
        losses: 0,
        highestMultiplier: 1,
        biggestWin: 0,
        gameMode: "manual",
        soundEnabled: true,
      };
      localStorage.setItem("chickenGameState", JSON.stringify(initialState));
    }
  }
}