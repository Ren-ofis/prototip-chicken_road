# API Reference - Chicken Crossing

Quick reference for all public methods and properties.

## GameState

Global game state management with localStorage persistence.

```javascript
const state = new GameState();

// Queries
state.getStats()              // Returns: { balance, totalGames, winRate, highestMultiplier, biggestWin, gameMode }
state.getBalance()            // Returns: number
state.getGameMode()           // Returns: "manual" | "auto" | "endless"
state.isSoundEnabled()        // Returns: boolean

// Setters
state.setBalance(amount)      // Sets balance (saves to localStorage)
state.setGameMode(mode)       // Sets game mode (saves to localStorage)
state.toggleSound()           // Toggles sound on/off (saves to localStorage)

// Record game results
state.recordWin(multiplier, winnings)  // Increments wins, updates stats
state.recordLoss()                     // Increments losses

// Internal
state.loadState()             // Loads from localStorage
state.saveState()             // Saves to localStorage
state.getDefaultState()       // Returns initial state object
```

## GameBalance

Manages betting and winnings calculations.

```javascript
const balance = new GameBalance(gameState);

// Betting operations
balance.placeBet(amount)      // Returns: boolean (success/fail)
balance.cashOut(winnings)     // Adds winnings to balance
balance.loseBet()             // Confirms bet loss (already deducted)

// Queries
balance.getBalance()          // Returns: number
balance.getCurrentBet()       // Returns: number
```

## Road

Traffic system and collision detection.

```javascript
const road = new Road(scene);

// Updates
road.update()                 // Called every frame to move vehicles

// Queries
road.checkCollision(chickenX, laneIndex)  // Returns: boolean

// Reset
road.reset()                  // Clears all vehicles and regenerates

// Properties
road.lanes[]                  // Array of lane objects
road.lanes[i].y               // Y position of lane
road.lanes[i].vehicles[]      // Array of vehicle objects
road.lanes[i].speed           // Vehicle speed for this lane
road.lanes[i].direction       // Direction: 1 (right) or -1 (left)
```

## UIManager

All UI rendering and updates.

```javascript
const ui = new UIManager(scene);

// Panels
ui.showBettingPanel(callback, context)      // Shows betting dialog
ui.hideBettingPanel()                       // Hides betting dialog
ui.showGameUI(betAmount, gameMode)          // Shows in-game HUD

// Updates
ui.updateMultiplier(multiplier)             // Updates multiplier display
ui.update(balance, multiplier)              // Updates all displays

// Effects
ui.showCrashEffect()                        // Crash animation on UI
ui.showWinEffect()                          // Win animation on UI

// Helpers (internal)
ui.createBetButton(scene, x, y, label, callback)
ui.createQuickBet(scene, x, y, label, amount, amountText, callback)
```

## Chicken

Player character entity.

```javascript
const chicken = new Chicken(scene, x, y);

// Movement
chicken.moveTo(newX, laneIndex)             // Animate to new position
chicken.crash()                             // Death animation

// Reset
chicken.resetPosition()                     // Return to start

// Properties (read-only)
chicken.x                                   // Current X position
chicken.y                                   // Current Y position
chicken.angle                               // Current rotation
chicken.alpha                               // Current opacity
chicken.currentLane                         // Current lane index
chicken.startX, chicken.startY              // Starting position
```

## Game Scene

Main gameplay orchestration.

```javascript
const game = new Game(); // extends Phaser.Scene

// Properties
game.gameState            // GameState instance
game.gameBalance          // GameBalance instance
game.uiManager            // UIManager instance
game.chicken              // Chicken entity
game.road                 // Road system
game.currentLane          // Current lane (0-11)
game.maxLane              // Furthest lane reached
game.multiplier           // Current multiplier
game.isGameActive         // Is game running?
game.canMove              // Can player move?
game.currentBet           // Bet amount placed

// Methods
game.moveLane(direction)           // Move: -1 (left), 0 (forward), 1 (right)
game.handleCashOut()               // Process cash out
game.handleCrash()                 // Process crash
game.calculateMultiplier(lanes)    // Get multiplier for lane count
game.playSound(key)                // Play sound if enabled

// Callbacks
game.onBetPlaced(bet)              // Called when bet is confirmed
game.handleInput(pointer)           // Called on screen click
```

## Menu Scene

Main menu and statistics display.

```javascript
const menu = new Menu(); // extends Phaser.Scene

// Methods
menu.createModeButton(label, x, y, callback)      // Create game mode button
menu.createSmallButton(label, x, y, callback)     // Create settings button
menu.toggleSettings()                             // Toggle sound
```

## GameOver Scene

End-game results display.

```javascript
const gameover = new GameOver(); // extends Phaser.Scene

// Init data
gameover.init({ result, multiplier, winnings, lanes })
// result: "win" | "lose"
// multiplier: final multiplier achieved
// winnings: amount won (0 if lose)
// lanes: number of lanes crossed
```

## Preload Scene

Asset loading and initialization.

```javascript
const preload = new Preload(); // extends Phaser.Scene

// Methods
preload.loadGameState()       // Initialize localStorage if needed
```

## AssetGenerator

Procedural texture generation.

```javascript
import { AssetGenerator } from "./AssetGenerator.js";

// Static methods
AssetGenerator.createChickenTexture(graphics)     // Generate chicken sprite
AssetGenerator.createCarTexture(graphics)         // Generate car sprite
```

---

## Constants & Formulas

### Multiplier Calculation
```javascript
if (lanes === 0) return 1.0;
if (lanes <= 5) return 1.1 * lanes;
if (lanes <= 10) return 1.5 + (lanes - 5) * 0.3;
if (lanes <= 15) return 3.0 + (lanes - 10) * 0.6;
return 6.0 + (lanes - 15) * 1.2;
```

### Vehicle Speed
```javascript
speed = 2 + (laneIndex * 0.2)
```

### Vehicle Count per Lane
```javascript
count = 2 + Math.floor(laneIndex / 3)
```

### Movement Clamping
```javascript
newX = Phaser.Math.Clamp(newX, 200, 1720)
```

### Screen Zones
```javascript
Left zone:   x < 1920 * 0.3  (left 30%)
Center zone: 1920 * 0.3 <= x <= 1920 * 0.7
Right zone:  x > 1920 * 0.7  (right 30%)
```

### Collision Detection
```javascript
chickenLeft < vehicleRight && chickenRight > vehicleLeft
```

---

## Common Patterns

### Execute action after bet
```javascript
game.uiManager.showBettingPanel((bet) => {
  game.currentBet = bet;
  game.gameBalance.placeBet(bet);
  game.isGameActive = true;
});
```

### Update UI every frame
```javascript
game.uiManager.update(game.gameBalance.getBalance(), game.multiplier);
```

### Check collision after move
```javascript
if (game.road.checkCollision(game.chicken.x, game.currentLane)) {
  game.handleCrash();
}
```

### Save player progress
```javascript
game.gameState.recordWin(game.multiplier, winnings);
game.gameState.saveState(); // Already called automatically
```

### Get all player stats
```javascript
const stats = game.gameState.getStats();
console.log(`Win rate: ${stats.winRate.toFixed(1)}%`);
```

---

## Error Handling

Most methods fail gracefully:

```javascript
// Safe bet placement
if (!balance.placeBet(amount)) {
  console.log("Insufficient balance");
}

// Safe sound playback
try {
  game.playSound("moveSound");
} catch (e) {
  console.log("Sound not available");
}
```

---

## Type Signatures

```typescript
// GameState
getStats(): { balance: number, totalGames: number, winRate: number, ... }
setBalance(amount: number): void
recordWin(multiplier: number, winnings: number): void

// GameBalance
placeBet(amount: number): boolean
cashOut(winnings: number): void
getBalance(): number

// Road
checkCollision(x: number, lane: number): boolean
update(): void
reset(): void

// Chicken
moveTo(x: number, lane: number): void
crash(): void
resetPosition(): void

// Game
moveLane(direction: -1|0|1): void
calculateMultiplier(lanes: number): number
```

---

**For more details, see DEVELOPER.md or examine the source code comments.**
