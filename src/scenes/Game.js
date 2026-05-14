import GameState from "./GameState.js";
import Chicken from "./Chicken.js";
import Road from "./Road.js";
import UIManager from "./UIManager.js";
import GameBalance from "./GameBalance.js";

export default class Game extends Phaser.Scene {
  constructor() { super("Game"); }

  create() {
    this.cameras.main.setBackgroundColor("#0f0f1e");
    
    // Initialize systems
    this.gameState = new GameState();
    this.gameBalance = new GameBalance(this.gameState);
    this.uiManager = new UIManager(this);
    
    // Create game objects
    this.chicken = new Chicken(this, 960, 900);
    this.road = new Road(this);
    
    // Game state
    this.currentLane = 0;
    this.maxLane = 0;
    this.gameMode = this.gameState.getGameMode();
    this.isGameActive = false;
    this.currentBet = 0;
    this.multiplier = 1.0;
    this.canMove = false;
    
    // UI state
    this.uiManager.showBettingPanel(this.onBetPlaced.bind(this), this);
    
    // Input handling
    this.input.on('pointerdown', this.handleInput.bind(this));
    this.input.keyboard.on('keydown-SPACE', this.handleCashOut.bind(this));
  }

  onBetPlaced(bet) {
    this.currentBet = bet;
    this.gameBalance.placeBet(bet);
    this.isGameActive = true;
    this.canMove = true;
    this.currentLane = 0;
    this.maxLane = 0;
    this.multiplier = 1.0;
    
    this.uiManager.hideBettingPanel();
    this.uiManager.showGameUI(this.currentBet, this.gameMode);
    
    // Reset road
    this.road.reset();
    this.chicken.resetPosition();
  }

  handleInput(pointer) {
    if (!this.isGameActive || !this.canMove) return;
    
    const clickX = pointer.x;
    const gameWidth = 1920;
    
    if (clickX < gameWidth * 0.3) {
      // Move left
      this.moveLane(-1);
    } else if (clickX > gameWidth * 0.7) {
      // Move right
      this.moveLane(1);
    } else {
      // Move forward
      this.moveLane(0);
    }
  }

  moveLane(direction) {
    if (!this.canMove || !this.isGameActive) return;
    
    const newX = this.chicken.x + (direction * 300);
    const clampedX = Phaser.Math.Clamp(newX, 200, 1720);
    
    this.chicken.moveTo(clampedX, this.currentLane);
    this.currentLane++;
    this.maxLane = Math.max(this.maxLane, this.currentLane);
    
    // Update multiplier
    this.multiplier = this.calculateMultiplier(this.currentLane);
    this.uiManager.updateMultiplier(this.multiplier);
    
    // Play move sound
    this.playSound("moveSound");
    
    // Check for collision
    this.canMove = false;
    this.time.delayedCall(600, () => {
      if (this.isGameActive) {
        if (this.road.checkCollision(this.chicken.x, this.currentLane)) {
          this.handleCrash();
        } else {
          this.canMove = true;
        }
      }
    });
  }

  handleCrash() {
    this.isGameActive = false;
    this.canMove = false;
    
    this.playSound("crashSound");
    this.chicken.crash();
    this.gameBalance.loseBet();
    this.gameState.recordLoss();
    
    this.uiManager.showCrashEffect();
    
    this.time.delayedCall(1500, () => {
      this.scene.start("GameOver", {
        result: "lose",
        multiplier: this.multiplier,
        winnings: 0,
        lanes: this.maxLane,
      });
    });
  }

  handleCashOut() {
    if (!this.isGameActive) return;
    
    this.isGameActive = false;
    this.canMove = false;
    
    const winnings = Math.floor(this.currentBet * this.multiplier);
    this.gameBalance.cashOut(winnings);
    this.gameState.recordWin(this.multiplier, winnings);
    
    this.playSound("cashoutSound");
    this.playSound("winSound");
    this.uiManager.showWinEffect();
    
    this.time.delayedCall(1000, () => {
      this.scene.start("GameOver", {
        result: "win",
        multiplier: this.multiplier,
        winnings: winnings,
        lanes: this.maxLane,
      });
    });
  }

  calculateMultiplier(lanes) {
    // Progressive scaling
    if (lanes === 0) return 1.0;
    if (lanes <= 5) return 1.1 * lanes;
    if (lanes <= 10) return 1.5 + (lanes - 5) * 0.3;
    if (lanes <= 15) return 3.0 + (lanes - 10) * 0.6;
    return 6.0 + (lanes - 15) * 1.2;
  }

  playSound(key) {
    if (this.gameState.isSoundEnabled()) {
      try {
        this.sound.play(key);
      } catch (e) {
        // Sound not loaded
      }
    }
  }

  update() {
    this.road.update();
    this.uiManager.update(this.gameBalance.getBalance(), this.multiplier);
  }
}
