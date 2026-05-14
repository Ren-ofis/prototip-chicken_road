import GameState from "./GameState.js";

export default class Menu extends Phaser.Scene {
  constructor() { super("Menu"); }

  create() {
    this.cameras.main.setBackgroundColor("#0f0f1e");
    this.gameState = new GameState();

    // Title
    this.add.text(960, 150, "🐔 CHICKEN CROSSING", {
      fontSize: 72,
      fill: "#00ff88",
      fontFamily: "Arial Black",
      shadow: { offsetX: 4, offsetY: 4, color: "#000", blur: 8, fill: true },
    }).setOrigin(0.5);

    this.add.text(960, 240, "THE ULTIMATE GAMBLING EXPERIENCE", {
      fontSize: 32,
      fill: "#ffaa00",
      fontFamily: "Arial",
      shadow: { offsetX: 2, offsetY: 2, color: "#000", blur: 6, fill: true },
    }).setOrigin(0.5);

    // Stats display
    const stats = this.gameState.getStats();
    const statsY = 360;
    const statsSpacing = 60;

    this.add.text(400, statsY, `💰 Balance: $${stats.balance}`, {
      fontSize: 28,
      fill: "#00ffff",
      fontFamily: "Arial",
    }).setOrigin(0.5);

    this.add.text(400, statsY + statsSpacing, `📊 Games: ${stats.totalGames}`, {
      fontSize: 24,
      fill: "#aaaaff",
      fontFamily: "Arial",
    }).setOrigin(0.5);

    this.add.text(400, statsY + statsSpacing * 2, `✅ Win Rate: ${stats.winRate.toFixed(1)}%`, {
      fontSize: 24,
      fill: "#aaaaff",
      fontFamily: "Arial",
    }).setOrigin(0.5);

    this.add.text(1520, statsY, `🔥 Highest: ${stats.highestMultiplier.toFixed(2)}x`, {
      fontSize: 28,
      fill: "#ff6688",
      fontFamily: "Arial",
    }).setOrigin(0.5);

    this.add.text(1520, statsY + statsSpacing, `💎 Biggest Win: $${stats.biggestWin}`, {
      fontSize: 24,
      fill: "#aaaaff",
      fontFamily: "Arial",
    }).setOrigin(0.5);

    this.add.text(1520, statsY + statsSpacing * 2, `🎮 Mode: ${stats.gameMode}`, {
      fontSize: 24,
      fill: "#aaaaff",
      fontFamily: "Arial",
    }).setOrigin(0.5);

    // Game mode buttons
    this.createModeButton("MANUAL MODE", 500, 750, () => {
      this.gameState.setGameMode("manual");
      this.scene.start("Game");
    });

    this.createModeButton("AUTO MODE", 960, 750, () => {
      this.gameState.setGameMode("auto");
      this.scene.start("Game");
    });

    this.createModeButton("ENDLESS MODE", 1420, 750, () => {
      this.gameState.setGameMode("endless");
      this.scene.start("Game");
    });

    // Settings button
    this.createSmallButton("⚙️ SETTINGS", 960, 900, () => {
      this.toggleSettings();
    });

    // Instructions
    this.add.text(960, 1000, "Click lanes to move | Press CASH OUT to secure winnings", {
      fontSize: 18,
      fill: "#888888",
      fontFamily: "Arial",
    }).setOrigin(0.5);
  }

  createModeButton(label, x, y, callback) {
    const button = this.add.container(x, y);
    
    const bg = this.add.rectangle(0, 0, 350, 80, 0x1a4d2e);
    bg.setStrokeStyle(3, 0x00ff88);
    bg.setInteractive({ useHandCursor: true });
    
    const text = this.add.text(0, 0, label, {
      fontSize: 24,
      fill: "#00ff88",
      fontFamily: "Arial Black",
    }).setOrigin(0.5);

    button.add([bg, text]);

    bg.on('pointerover', () => {
      bg.setFillStyle(0x2d7a3d);
      bg.setStrokeStyle(3, 0x00ffaa);
    });

    bg.on('pointerout', () => {
      bg.setFillStyle(0x1a4d2e);
      bg.setStrokeStyle(3, 0x00ff88);
    });

    bg.on('pointerdown', () => {
      this.tweens.add({
        targets: button,
        scale: 0.95,
        duration: 100,
        yoyo: true,
      });
      callback();
    });
  }

  createSmallButton(label, x, y, callback) {
    const button = this.add.container(x, y);
    
    const bg = this.add.rectangle(0, 0, 250, 60, 0x3d3d5c);
    bg.setStrokeStyle(2, 0xaa00ff);
    bg.setInteractive({ useHandCursor: true });
    
    const text = this.add.text(0, 0, label, {
      fontSize: 18,
      fill: "#aa00ff",
      fontFamily: "Arial",
    }).setOrigin(0.5);

    button.add([bg, text]);

    bg.on('pointerover', () => {
      bg.setFillStyle(0x4d4d6c);
      bg.setStrokeStyle(2, 0xcc00ff);
    });

    bg.on('pointerout', () => {
      bg.setFillStyle(0x3d3d5c);
      bg.setStrokeStyle(2, 0xaa00ff);
    });

    bg.on('pointerdown', callback);
  }

  toggleSettings() {
    this.gameState.toggleSound();
    console.log("Sound toggled:", this.gameState.isSoundEnabled());
  }
}
