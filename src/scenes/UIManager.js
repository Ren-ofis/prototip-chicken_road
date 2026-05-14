// UIManager.js - Manages all UI elements and displays
export default class UIManager {
  constructor(scene) {
    this.scene = scene;
    this.bettingPanel = null;
    this.gameUIPanel = null;
    this.multiplierText = null;
    this.winningsText = null;
    this.balanceText = null;
    this.laneText = null;
  }

  showBettingPanel(onBetCallback, callbackContext) {
    const container = this.scene.add.container(960, 540);
    
    // Semi-transparent background
    const bg = this.scene.add.rectangle(0, 0, 1920, 1080, 0x000000, 0.7);
    
    // Betting panel
    const panel = this.scene.add.rectangle(0, 0, 600, 500, 0x1a2d4d);
    panel.setStrokeStyle(4, 0x00ffff);
    
    // Title
    const title = this.scene.add.text(0, -180, "PLACE YOUR BET", {
      fontSize: 36,
      fill: "#00ffff",
      fontFamily: "Arial Black",
    }).setOrigin(0.5);
    
    // Bet amount text
    const amountText = this.scene.add.text(0, -80, "$100", {
      fontSize: 48,
      fill: "#00ff88",
      fontFamily: "Arial Black",
    }).setOrigin(0.5);
    
    let betAmount = 100;
    
    // Bet buttons
    const minusBtn = this.createBetButton(this.scene, -150, 0, "-", () => {
      betAmount = Math.max(10, betAmount - 50);
      amountText.setText(`$${betAmount}`);
    });
    
    const plusBtn = this.createBetButton(this.scene, 150, 0, "+", () => {
      betAmount = Math.min(5000, betAmount + 50);
      amountText.setText(`$${betAmount}`);
    });
    
    // Quick bet buttons
    const bet100 = this.createQuickBet(this.scene, -150, 100, "$100", 100, amountText, () => { betAmount = 100; });
    const bet500 = this.createQuickBet(this.scene, 0, 100, "$500", 500, amountText, () => { betAmount = 500; });
    const bet1000 = this.createQuickBet(this.scene, 150, 100, "$1000", 1000, amountText, () => { betAmount = 1000; });
    
    // Confirm button
    const confirmBtn = this.scene.add.rectangle(0, 170, 250, 70, 0x2d5d2e);
    confirmBtn.setStrokeStyle(3, 0x00ff88);
    confirmBtn.setInteractive({ useHandCursor: true });
    
    const confirmText = this.scene.add.text(0, 170, "CONFIRM BET", {
      fontSize: 24,
      fill: "#00ff88",
      fontFamily: "Arial Black",
    }).setOrigin(0.5);
    
    confirmBtn.on('pointerover', () => {
      confirmBtn.setFillStyle(0x3d7d3e);
    });
    
    confirmBtn.on('pointerout', () => {
      confirmBtn.setFillStyle(0x2d5d2e);
    });
    
    confirmBtn.on('pointerdown', () => {
      this.bettingPanel.destroy();
      onBetCallback.call(callbackContext, betAmount);
    });
    
    container.add([bg, panel, title, amountText, minusBtn, plusBtn, bet100, bet500, bet1000, confirmBtn, confirmText]);
    this.bettingPanel = container;
  }

  createBetButton(scene, x, y, label, callback) {
    const btn = scene.add.rectangle(x, y, 80, 60, 0x3d3d5c);
    btn.setStrokeStyle(2, 0xaa00ff);
    btn.setInteractive({ useHandCursor: true });
    
    const text = scene.add.text(x, y, label, {
      fontSize: 28,
      fill: "#aa00ff",
      fontFamily: "Arial Black",
    }).setOrigin(0.5);
    
    btn.on('pointerdown', callback);
    
    return btn;
  }

  createQuickBet(scene, x, y, label, amount, amountText, callback) {
    const btn = scene.add.rectangle(x, y, 100, 50, 0x2d3d5c);
    btn.setStrokeStyle(2, 0x00aaff);
    btn.setInteractive({ useHandCursor: true });
    
    const text = scene.add.text(x, y, label, {
      fontSize: 16,
      fill: "#00aaff",
      fontFamily: "Arial",
    }).setOrigin(0.5);
    
    btn.on('pointerdown', () => {
      amountText.setText(label);
      callback();
    });
    
    return btn;
  }

  hideBettingPanel() {
    if (this.bettingPanel) {
      this.bettingPanel.destroy();
      this.bettingPanel = null;
    }
  }

  showGameUI(betAmount, gameMode) {
    // Multiplier display
    this.multiplierText = this.scene.add.text(100, 50, "1.00x", {
      fontSize: 48,
      fill: "#ffaa00",
      fontFamily: "Arial Black",
      shadow: { offsetX: 3, offsetY: 3, color: "#000", blur: 6, fill: true },
    });
    
    // Winnings display
    this.winningsText = this.scene.add.text(100, 120, "$0", {
      fontSize: 32,
      fill: "#00ff88",
      fontFamily: "Arial",
    });
    
    // Balance display
    this.balanceText = this.scene.add.text(1820, 50, "Balance: $0", {
      fontSize: 28,
      fill: "#00ffff",
      fontFamily: "Arial",
    }).setOrigin(1, 0);
    
    // Lanes crossed
    this.laneText = this.scene.add.text(1820, 110, "Lanes: 0", {
      fontSize: 28,
      fill: "#aa00ff",
      fontFamily: "Arial",
    }).setOrigin(1, 0);
    
    // Bet amount display
    this.scene.add.text(100, 180, `Bet: $${betAmount}`, {
      fontSize: 28,
      fill: "#ff6688",
      fontFamily: "Arial",
    });
    
    // Game mode indicator
    this.scene.add.text(100, 240, `Mode: ${gameMode.toUpperCase()}`, {
      fontSize: 24,
      fill: "#888888",
      fontFamily: "Arial",
    });
    
    // Cash out instruction
    this.scene.add.text(960, 1030, "Press SPACEBAR to CASH OUT | Click lanes to move", {
      fontSize: 20,
      fill: "#666666",
      fontFamily: "Arial",
    }).setOrigin(0.5);
  }

  updateMultiplier(multiplier) {
    if (this.multiplierText) {
      this.multiplierText.setText(`${multiplier.toFixed(2)}x`);
    }
  }

  update(balance, multiplier) {
    if (this.balanceText) {
      this.balanceText.setText(`Balance: $${balance}`);
    }
    
    if (this.winningsText) {
      const currentBet = this.scene.gameBalance ? this.scene.gameBalance.getCurrentBet() : 0;
      const winnings = Math.floor(currentBet * multiplier);
      this.winningsText.setText(`Winnings: $${winnings}`);
    }
    
    if (this.laneText) {
      this.laneText.setText(`Lanes: ${this.scene.currentLane || 0}`);
    }
  }

  showCrashEffect() {
    if (this.multiplierText) {
      this.scene.tweens.add({
        targets: this.multiplierText,
        scale: 1.5,
        duration: 200,
        yoyo: true,
      });
    }
  }

  showWinEffect() {
    if (this.winningsText) {
      this.scene.tweens.add({
        targets: this.winningsText,
        scale: 1.5,
        duration: 300,
        yoyo: true,
      });
    }
  }
}
