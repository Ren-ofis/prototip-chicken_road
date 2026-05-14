export default class GameOver extends Phaser.Scene {
  constructor() { super("GameOver"); }

  init(data) {
    this.result = data.result;
    this.multiplier = data.multiplier;
    this.winnings = data.winnings;
    this.lanes = data.lanes;
  }

  create() {
    this.cameras.main.setBackgroundColor("#0f0f1e");

    const isWin = this.result === "win";
    const titleColor = isWin ? "#00ff88" : "#ff3366";
    const title = isWin ? "🎉 YOU WIN! 🎉" : "💥 GAME OVER 💥";

    // Title
    this.add.text(960, 200, title, {
      fontSize: 80,
      fill: titleColor,
      fontFamily: "Arial Black",
      shadow: { offsetX: 6, offsetY: 6, color: "#000", blur: 10, fill: true },
    }).setOrigin(0.5);

    // Stats
    const statsY = 400;
    const spacing = 80;

    this.add.text(960, statsY, `Lanes Crossed: ${this.lanes}`, {
      fontSize: 36,
      fill: "#00ffff",
      fontFamily: "Arial",
    }).setOrigin(0.5);

    this.add.text(960, statsY + spacing, `Final Multiplier: ${this.multiplier.toFixed(2)}x`, {
      fontSize: 36,
      fill: "#ffaa00",
      fontFamily: "Arial",
    }).setOrigin(0.5);

    if (isWin) {
      this.add.text(960, statsY + spacing * 2, `Winnings: $${this.winnings}`, {
        fontSize: 48,
        fill: "#00ff88",
        fontFamily: "Arial Black",
        shadow: { offsetX: 4, offsetY: 4, color: "#000", blur: 8, fill: true },
      }).setOrigin(0.5);
    } else {
      this.add.text(960, statsY + spacing * 2, `Bet Lost`, {
        fontSize: 48,
        fill: "#ff3366",
        fontFamily: "Arial Black",
        shadow: { offsetX: 4, offsetY: 4, color: "#000", blur: 8, fill: true },
      }).setOrigin(0.5);
    }

    // Continue button
    this.createButton("PLAY AGAIN", 600, 850, () => {
      this.scene.start("Game");
    });

    this.createButton("MAIN MENU", 1320, 850, () => {
      this.scene.start("Menu");
    });
  }

  createButton(label, x, y, callback) {
    const button = this.add.container(x, y);
    
    const bg = this.add.rectangle(0, 0, 380, 90, 0x2d3561);
    bg.setStrokeStyle(3, 0x00ddff);
    bg.setInteractive({ useHandCursor: true });
    
    const text = this.add.text(0, 0, label, {
      fontSize: 28,
      fill: "#00ddff",
      fontFamily: "Arial Black",
    }).setOrigin(0.5);

    button.add([bg, text]);

    bg.on('pointerover', () => {
      bg.setFillStyle(0x3d4571);
      bg.setStrokeStyle(3, 0x00ffff);
    });

    bg.on('pointerout', () => {
      bg.setFillStyle(0x2d3561);
      bg.setStrokeStyle(3, 0x00ddff);
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
}
