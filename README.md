# 🐔 Chicken Crossing - The Ultimate Gambling Game

A high-octane, browser-based crash-style gambling game where you guide a brave chicken across an endless road dodging traffic!

## 🎮 Game Features

### Core Gameplay
- **Crash-Style Betting**: Place bets and watch your multiplier grow as you progress further
- **Progressive Multiplier System**: Increases exponentially with each lane crossed
- **Cash-Out Mechanic**: Secure your winnings anytime by pressing SPACEBAR
- **Risk Management**: One wrong move and you lose it all!

### Game Modes
1. **Manual Mode** - Full control: Click lanes to move left/right/forward, press SPACEBAR to cash out
2. **Auto Mode** - Set a target multiplier and the game auto-cashes out when reached
3. **Endless Mode** - No betting, just survive for leaderboard glory

### Visual & Audio
- Neon arcade aesthetic with smooth animations
- Dynamic camera shake and slowmo on close calls
- Particle effects for crashes and wins
- Sound effects (when enabled)
- 60 FPS smooth gameplay

### Player Progression
- **Persistent Balance**: Play with demo currency
- **Statistics Tracking**:
  - Total games played
  - Win/loss ratio
  - Highest multiplier achieved
  - Biggest win
- **localStorage Integration**: Your progress is saved automatically

## 📊 Multiplier Formula

The multiplier grows progressively as you cross more lanes:

```
Lanes 0:   1.00x
Lanes 1-5: 1.10x per lane
Lanes 6-10: 1.50x + (lanes-5) × 0.30x
Lanes 11-15: 3.00x + (lanes-10) × 0.60x
Lanes 16+: 6.00x + (lanes-15) × 1.20x
```

Example progression:
- 1 lane = 1.1x
- 5 lanes = 2.0x
- 10 lanes = 5.0x
- 15 lanes = 15.0x

## 🎯 How to Play

### Manual Mode
1. Enter the main menu
2. Select "MANUAL MODE"
3. Place your bet (use +/- buttons or quick presets)
4. Click the left/right edges to move sideways, center to move forward
5. Guide the chicken through incoming traffic
6. Press SPACEBAR anytime to cash out and secure your winnings
7. If hit by a vehicle, you lose your bet

### Auto Mode
1. Same as Manual, but also set your target multiplier
2. The chicken will auto-cashout when the target is reached
3. Great for hands-off gambling

### Endless Mode
1. No betting - pure survival mode
2. Try to beat your high score
3. Compete on the global leaderboard

## 🏗️ Project Architecture

```
src/
├── phaserMain.js       # Game config and initialization
├── preload.js          # Asset loading and game state initialization
├── scenes/
│   ├── AssetGenerator.js # Procedural sprite generation
│   ├── Chicken.js       # Player character entity
│   ├── Game.js          # Main gameplay scene
│   ├── GameBalance.js   # Betting and currency system
│   ├── GameOver.js      # End screen scene
│   ├── GameState.js     # Global state management
│   ├── Menu.js          # Main menu scene
│   ├── Road.js          # Lane system and collision detection
│   └── UIManager.js     # UI rendering and updates
```

### Key Systems

**GameState.js**
- Manages player balance, stats, and preferences
- Handles localStorage persistence
- Provides state queries for UI updates

**GameBalance.js**
- Tracks current bet
- Calculates winnings based on multiplier
- Updates balance on wins/losses

**Road.js**
- Generates and manages traffic lanes
- Creates vehicles with varying speeds
- Handles collision detection

**UIManager.js**
- Renders betting panel
- Updates live multiplier display
- Shows winnings and balance
- Provides win/crash animations

**Chicken.js**
- Player character with physics
- Movement animations
- Crash and death animations

## 🎨 Visual Design

### Color Scheme (Neon Arcade)
- Primary: `#00ff88` (Bright Green)
- Secondary: `#ffaa00` (Orange)
- Accent: `#aa00ff` (Magenta)
- Background: `#0f0f1e` (Deep Purple)
- Danger: `#ff3366` (Red)

### Animation Standards
- Move duration: 500ms (smooth lane crossing)
- Collision check delay: 600ms
- Win effect: 300ms scale animation
- Camera shake on crash: 300ms, 0.02 intensity

## 🔧 Technical Details

### Built With
- **Engine**: Phaser 3.88
- **Language**: JavaScript (ES6 Modules)
- **Build Tool**: Vite
- **Storage**: localStorage (no backend required)

### Browser Support
- Works on all modern browsers (Chrome, Firefox, Safari, Edge)
- Mobile responsive (tested on iPad and phones)
- Touch controls supported

### Performance
- Targets 60 FPS
- Minimal physics calculations (arcade physics)
- Efficient sprite pooling for vehicles
- Optimized collision detection

## 📱 Mobile Support

The game is fully responsive:
- Touch-based controls
- Adapts to various screen sizes
- Landscape and portrait support
- Optimized button sizes for touch

## 🎮 Controls

| Action | Desktop | Mobile |
|--------|---------|--------|
| Move Left | Click left side | Tap left |
| Move Right | Click right side | Tap right |
| Move Forward | Click center | Tap center |
| Cash Out | SPACEBAR | Tap icon |
| Select Bet | Click button | Tap button |

## 💾 Data Storage

All data is stored in browser localStorage:
```javascript
{
  balance: 1000,           // Demo currency balance
  totalGames: 0,           // All-time games played
  wins: 0,                 // All-time wins
  losses: 0,               // All-time losses
  highestMultiplier: 1,    // Best multiplier ever achieved
  biggestWin: 0,           // Largest payout ever won
  gameMode: "manual",      // Last played mode
  soundEnabled: true       // Audio preference
}
```

## 🚀 Development

### Installation
```bash
npm install
```

### Development Server
```bash
npm run dev
```

### Build for Production
```bash
npm run build
```

## 📈 Difficulty Scaling

The game gradually increases difficulty:
- Vehicle speeds increase with lane progression
- Traffic density increases (more cars per lane)
- Lane spacing decreases (tighter gaps)
- Vehicle spawn patterns become more complex

## 🏆 Leaderboard Integration

Future roadmap:
- Cloud-based leaderboards
- Achievement system
- Seasonal events
- Tournament modes

## ⚠️ Responsible Gaming Notice

This is a **demo/educational game using fake currency only**. It demonstrates gambling mechanics for educational purposes. Please gamble responsibly and never use real money in gambling games.

## 📝 License

MIT License - Feel free to use and modify!

## 🤝 Contributing

Contributions welcome! Areas for enhancement:
- More visual themes
- Power-ups and special events
- Multi-player features
- Sound effect creation
- Advanced difficulty modes

---

**Happy Chicken Crossing!** 🐔🚗💨
