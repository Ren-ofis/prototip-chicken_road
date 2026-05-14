# 🐔 Chicken Crossing - Developer Guide

## Project Structure

```
src/
├── phaserMain.js              # Entry point - Game configuration
├── preload.js                 # Asset loading and initialization
└── scenes/
    ├── AssetGenerator.js      # Procedural texture generation
    ├── Chicken.js             # Player character entity
    ├── Game.js                # Main gameplay scene
    ├── GameBalance.js         # Betting and wallet system
    ├── GameOver.js            # End screen and results
    ├── GameState.js           # Global state management
    ├── Menu.js                # Main menu and stats display
    ├── Road.js                # Traffic lanes and collision
    └── UIManager.js           # UI rendering and updates
```

## System Overview

### 1. Game Initialization Flow
```
phaserMain.js (config) 
    ↓
preload.js (load assets, initialize state)
    ↓
Menu.js (show main menu)
    ↓
Game.js (start gameplay) OR GameOver.js (show results)
```

### 2. Game Loop During Gameplay
```
Game.js create()
    ├─ Initialize GameState (load from localStorage)
    ├─ Initialize GameBalance (betting system)
    ├─ Initialize UIManager (UI renderer)
    ├─ Create Chicken entity
    ├─ Create Road with lanes and vehicles
    └─ Show betting panel

↓ Player places bet ↓

Game.js update() loop (60 FPS)
    ├─ Road.update() - Move vehicles
    ├─ UIManager.update() - Update displays
    └─ Input handling - Player movement or cash out
```

## Key Components

### GameState.js
Manages all persistent game state with localStorage:

```javascript
// Save/load automatically on changes
const state = new GameState();
state.getStats()                    // Get current stats
state.recordWin(multiplier, amount) // Record a win
state.recordLoss()                  // Record a loss
state.setGameMode(mode)             // Change game mode
state.toggleSound()                 // Toggle audio
```

### GameBalance.js
Tracks betting and winnings:

```javascript
const balance = new GameBalance(gameState);
balance.placeBet(amount)    // Deduct bet from balance
balance.cashOut(winnings)   // Add winnings to balance
balance.loseBet()           // Confirm bet loss
balance.getBalance()        // Get current balance
```

### Road.js
Generates traffic and handles collisions:

```javascript
const road = new Road(scene);
road.update()                   // Move all vehicles
road.checkCollision(x, lane)    // Check if chicken hit
road.reset()                    // Clear and regenerate
```

**Lane Structure:**
- 12 lanes total (0-11 from bottom to top)
- Each lane has 2-4 vehicles
- Speed increases with lane number: `2 + (laneIndex * 0.2)`
- Direction is random per lane
- Vehicles wrap around screen edges

### UIManager.js
Renders all UI elements:

```javascript
ui.showBettingPanel(callback)       // Show betting dialog
ui.hideBettingPanel()               // Hide betting dialog
ui.showGameUI(bet, mode)            // Show in-game UI
ui.updateMultiplier(multiplier)     // Update multiplier display
ui.update(balance, multiplier)      // Update all displays
ui.showCrashEffect()                // Show crash animation
ui.showWinEffect()                  // Show win animation
```

### Chicken.js
Player character entity:

```javascript
chicken.moveTo(x, laneIndex)    // Animate move to new lane
chicken.crash()                 // Death animation
chicken.resetPosition()         // Reset to start position
```

## Gameplay Mechanics

### Multiplier Calculation
```javascript
calculateMultiplier(lanes) {
  if (lanes === 0) return 1.0;
  if (lanes <= 5) return 1.1 * lanes;
  if (lanes <= 10) return 1.5 + (lanes - 5) * 0.3;
  if (lanes <= 15) return 3.0 + (lanes - 10) * 0.6;
  return 6.0 + (lanes - 15) * 1.2;
}
```

### Movement System
- Click left/right (outer 30% of screen) to move sideways
- Click center (middle 40%) to move forward
- All moves are clamped to valid X range: [200, 1720]
- Movement is animated over 500ms
- Collision check happens after move completes (600ms)

### Collision Detection
```javascript
// Simple AABB collision
chickenLeft < vehicleRight && chickenRight > vehicleLeft
```

**Dimensions:**
- Chicken width: 60px
- Vehicle width: 120px
- Lane height: 90px

### State Management

**Game states:**
- `!isGameActive` - Betting or game over
- `isGameActive && !canMove` - Animation or collision check
- `isGameActive && canMove` - Player can act

**Betting states:**
- `currentBet` - Amount risked
- `multiplier` - Current payout multiple
- `maxLane` - Furthest lane reached

## Data Persistence

All data is stored in `localStorage["chickenGameState"]`:

```json
{
  "balance": 1000,
  "totalGames": 42,
  "wins": 18,
  "losses": 24,
  "highestMultiplier": 12.5,
  "biggestWin": 5000,
  "gameMode": "manual",
  "soundEnabled": true
}
```

Changes are saved automatically on:
- Bet placed/lost
- Game won
- Mode changed
- Sound toggled

## Input Handling

| Input | Handler | Effect |
|-------|---------|--------|
| `pointerdown` | `Game.handleInput()` | Move chicken |
| `SPACEBAR` | `Game.handleCashOut()` | Cash out and win |
| Button click | Various | Menu navigation |

## Animation Timings

```
Move animation:       500ms (Quad.inOut easing)
Collision check:      600ms delay after move
Crash animation:      300ms spin + 500ms fade
Camera shake:         300ms, 0.02 intensity
Win effect:           300ms scale animation
Transition delay:     1000-1500ms before result screen
```

## Difficulty Scaling

As lanes progress:
- Vehicle speed increases: `speed = 2 + (laneIndex * 0.2)`
- Vehicle count increases: `2 + Math.floor(laneIndex / 3)`
- Multiplier grows exponentially
- Risk increases with reward

## Styling Constants

### Colors
```
Primary Green:   #00ff88
Orange/Gold:     #ffaa00
Magenta:         #aa00ff
Cyan:            #00ffff
Background:      #0f0f1e
Button Hover:    Slightly lighter shade
```

### Text Styles
```
Title: 72px, Arial Black
Mode buttons: 24px, Arial Black
UI displays: 28-32px, Arial
Instructions: 18px, Arial
```

## Common Modifications

### Change Starting Balance
```javascript
// In preload.js - getDefaultState()
initialState.balance = 5000; // Default is 1000
```

### Adjust Multiplier Formula
```javascript
// In Game.js - calculateMultiplier()
if (lanes <= 5) return 1.2 * lanes; // Increased from 1.1
```

### Change Vehicle Speed
```javascript
// In Road.js - initialize()
speed: 3 + (i * 0.3), // Increased from 2 + (i * 0.2)
```

### Modify Bet Increments
```javascript
// In UIManager.js - createBetButton()
betAmount = Math.max(50, betAmount - 100); // Changed from 50
```

### Add New Game Mode
1. Add mode string to GameState default
2. Create new condition in UIManager.showBettingPanel()
3. Handle mode logic in Game.js gameplay
4. Add mode button to Menu.js

## Performance Optimization Tips

### Current Performance
- 60 FPS target
- ~50-60 game objects per frame
- Minimal physics calculations

### Optimization Opportunities
1. **Sprite pooling**: Reuse vehicle sprites instead of creating/destroying
2. **Batching**: Use containers for grouped UI elements
3. **Level-of-detail**: Reduce vehicle count at extreme lanes
4. **Memory**: Clear destroyed objects properly
5. **Rendering**: Use WebGL context for better performance

### Profiling
Use browser DevTools:
- Ctrl+Shift+I → Performance tab
- Record gameplay for 10 seconds
- Look for frame rate dips and memory leaks

## Debugging

### Console Logging
```javascript
console.log("Balance:", this.gameBalance.getBalance());
console.log("Multiplier:", this.multiplier);
console.log("Current lane:", this.currentLane);
console.log("Collision:", this.road.checkCollision(x, lane));
```

### Visual Debugging
```javascript
// Enable collision boxes in config
arcade: { debug: true }

// Log game state
console.log(JSON.parse(localStorage.getItem("chickenGameState")));
```

### Common Issues
- **Bet not registering**: Check `gameBalance.placeBet()` return value
- **Chicken not moving**: Verify `canMove` flag is true
- **Crashes not detected**: Check collision rectangle dimensions
- **UI not updating**: Ensure `UIManager.update()` is called every frame
- **State not persisting**: Check localStorage is not disabled

## Testing Checklist

- [ ] Can place bets in all denominations
- [ ] Chicken moves left/right/forward correctly
- [ ] Collision detection works accurately
- [ ] Multiplier increases properly
- [ ] Cash out saves winnings
- [ ] Crash loses bet correctly
- [ ] Game over screen shows correct stats
- [ ] Menu displays accurate statistics
- [ ] localStorage persists after refresh
- [ ] Sound toggles on/off
- [ ] Mobile touch controls work
- [ ] Frame rate stays at 60 FPS

## Future Enhancements

- [ ] Particle effects system
- [ ] Sound effects library
- [ ] Power-ups (speed boost, shield, 2x multiplier)
- [ ] Achievements/badges
- [ ] Leaderboard API integration
- [ ] Daily challenges
- [ ] Different themes/skins
- [ ] Tournament mode
- [ ] Replays system
- [ ] Custom bet presets

---

**Questions?** Check the main README.md or examine the source code comments!
