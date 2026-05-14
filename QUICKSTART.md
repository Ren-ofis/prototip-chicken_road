# 🐔 Quick Start Guide - Chicken Crossing

Get up and running in 5 minutes!

## 1. Installation

```bash
# Navigate to project directory
cd prototip-chicken_road

# Install dependencies (if not already done)
npm install
```

## 2. Run the Game

```bash
# Start development server
npm run dev

# Game will be available at:
# http://localhost:5173
```

## 3. First Game

1. **Open** the game in your browser
2. **Click** "MANUAL MODE" button
3. **Adjust** bet amount (use +/- buttons or presets)
4. **Click** "CONFIRM BET" button
5. **Guide chicken** by clicking lanes:
   - **Left edge** = move left
   - **Center** = move forward
   - **Right edge** = move right
6. **Press SPACEBAR** to cash out when multiplier looks good
7. **Avoid traffic** to keep your winnings!

## 4. Game Modes Explained

### Manual Mode
- You control all movement and cash-out timing
- Highest risk/reward
- Best for experienced players

### Auto Mode
- Set target multiplier, game auto-cashes at that point
- Less stressful
- Good for learning

### Endless Mode
- Free play with no betting
- Practice your skills
- Compete for high score

## 5. Understanding the Multiplier

- **Start**: 1.0x (your bet)
- **After 1 lane**: 1.1x (10% profit)
- **After 5 lanes**: 5.5x (450% profit!)
- **After 10 lanes**: 3.0x (risky but rewarding)
- **After 15 lanes**: 6.0x (very risky)

**Formula**: Winnings = Bet × Multiplier

**Example**: $100 bet × 5.5x multiplier = $550 winnings

## 6. Controls at a Glance

| Action | Key/Click |
|--------|-----------|
| Move Left | Click left 30% of screen |
| Move Forward | Click center |
| Move Right | Click right 30% |
| Cash Out | Press SPACEBAR |
| Confirm Bet | Click button |
| Select Mode | Click button |

## 7. Tips for Success

✅ **DO:**
- Start with small bets ($100-$200) to learn
- Cash out early to build a bankroll
- Aim for 2-5 lanes on first attempts
- Use Auto Mode to practice
- Check your win rate in stats

❌ **DON'T:**
- Bet more than 10% of your balance
- Get greedy chasing high multipliers
- Ignore traffic patterns
- Play when tired
- Expect to win every game

## 8. Game Settings

Click the **⚙️ SETTINGS** button on menu to:
- Toggle sound on/off
- View current preferences

## 9. Your Progress

All your stats are automatically saved:
- Current balance
- Games played
- Win/loss ratio
- Highest multiplier
- Biggest win

These stats persist even after closing the browser!

## 10. Troubleshooting

### Game won't start
- Refresh page (F5)
- Clear browser cache
- Check console for errors (F12)

### Chicken moves wrong
- Ensure you're clicking correct screen area
- Try clicking more to the left/right/center
- Check if screen is responsive

### Can't place bet
- Make sure you have enough balance
- Try smaller bet amount
- Refresh and try again

### No sound
- Check that sound is enabled in settings
- Check browser volume
- Mute might be enabled

### Progress not saving
- Check if localStorage is disabled
- Try a different browser
- Check browser storage space

## 11. Build for Production

To create optimized build:

```bash
npm run build

# Output in /dist folder
# Ready to deploy to any static host
```

## 12. File Guide

| File | Purpose |
|------|---------|
| `index.html` | Main page |
| `src/phaserMain.js` | Game config |
| `src/scenes/Game.js` | Gameplay logic |
| `src/scenes/Menu.js` | Main menu |
| `src/scenes/GameOver.js` | Results screen |
| `README.md` | Full documentation |
| `DESIGN.md` | Game design document |
| `DEVELOPER.md` | Technical reference |
| `API.md` | Method reference |

## 13. Common Issues & Fixes

### Issue: Chicken stuck on road
**Fix**: Press F5 to refresh. Your balance is saved!

### Issue: Multiplier not updating
**Fix**: Check console (F12) for errors. Refresh page.

### Issue: Slow performance
**Fix**: Close other tabs. Lower browser zoom to 100%.

### Issue: Mobile controls not working
**Fix**: Tap with more precision. Use landscape mode.

## 14. Advanced Tips

- **Bankroll Management**: Never bet more than 5% of balance
- **Hot Streaks**: Cash out quick wins to build momentum
- **Risk Assessment**: Higher lanes = exponentially harder
- **Pattern Recognition**: Observe traffic patterns before moving
- **Practice**: Endless Mode helps you learn without risk

## 15. Next Steps

1. Play 10 games and watch your stats
2. Try all three game modes
3. Aim for a 50%+ win rate
4. Build balance to $5,000+
5. Achieve a 10x+ multiplier
6. Read DESIGN.md for strategy tips

## 16. Feedback & Issues

Found a bug? Have suggestions?

1. Check the README.md for known issues
2. Review DEVELOPER.md for technical details
3. Check browser console (F12) for errors
4. Try clearing localStorage: `localStorage.clear()`

## 17. Credits

- **Engine**: Phaser 3
- **Build Tool**: Vite
- **Language**: JavaScript (ES6)
- **UI Plugin**: rexUI

---

## Quick Reference Card

```
MULTIPLIER FORMULA
─────────────────
Lanes 1-5:   1.1x per lane
Lanes 6-10:  +0.3x per lane  
Lanes 11-15: +0.6x per lane
Lanes 16+:   +1.2x per lane

TIMING
──────
Move delay:     500ms
Collision check: 600ms
Game over:      1500ms

CONTROLS
────────
Click left:     Move left (-300px)
Click center:   Move forward (+1 lane)
Click right:    Move right (+300px)
SPACEBAR:       CASH OUT

STARTING BALANCE
────────────────
$1,000 (demo currency, non-recharging)

WIN CONDITIONS
──────────────
✓ Reach desired multiplier and cash out
✓ In Endless Mode: longest distance
```

---

**Ready to play? Open http://localhost:5173 in your browser!**

🐔 Happy Crossing! 🚗💨

For detailed information, see:
- 📖 **README.md** - Full game documentation
- 🎮 **DESIGN.md** - Game design & strategy
- 💻 **DEVELOPER.md** - Technical details
- 🔌 **API.md** - Method reference
