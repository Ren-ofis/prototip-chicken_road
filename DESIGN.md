# 🐔 Chicken Crossing - Game Design Document

## 1. Overview

**Chicken Crossing** is a high-stakes gambling simulation game where players guide a brave chicken across an endless road, dodging traffic while watching their potential winnings multiply. The game combines the addictive mechanics of crash-style betting games with classic arcade road-crossing gameplay.

**Target Audience**: Ages 18+, casual gamers, mobile gamers, fans of gambling simulations

**Platform**: Web browser (desktop and mobile)

**Language**: JavaScript with Phaser 3 framework

---

## 2. Core Gameplay Loop

### Phase 1: Betting
1. Player enters game scene
2. Betting panel appears
3. Player selects bet amount ($10 - $5000)
4. Player confirms bet
5. Game begins

### Phase 2: Crossing
1. Chicken appears at starting position (bottom of road)
2. Player clicks to move chicken through traffic lanes
3. For each successful lane crossing:
   - Multiplier increases
   - Winnings display updates
   - Player can cash out anytime
4. If hit by vehicle → crash → lose bet
5. If reach end of road → game over (auto cash-out)

### Phase 3: Results
1. Result screen shows:
   - Win/Lose status
   - Lanes crossed
   - Final multiplier
   - Winnings amount
2. Stats updated and saved
3. Return to menu or play again

---

## 3. Game Mechanics

### 3.1 Movement System

**Input**: Click screen in three zones
- **Left 30%**: Move chicken left (±300px)
- **Middle 40%**: Move chicken forward (advance one lane)
- **Right 30%**: Move chicken right (±300px)

**Constraints**:
- X boundary: [200px, 1720px]
- One move per 600ms (animation + collision check)
- Y changes by 90px per lane

**Animation**: 500ms smooth tween (Quad.inOut easing)

### 3.2 Collision Detection

**Type**: Axis-Aligned Bounding Box (AABB)

```
Chicken width: 60px
Vehicle width: 120px
Hit = overlapping on any frame
```

**Detection timing**: 600ms after move completes

**Result**: Immediate crash animation and game over

### 3.3 Multiplier System

**Progressive scaling based on lanes crossed**:

```
Lanes 1-5:   Linear: 1.1x per lane
  1 lane = 1.1x
  5 lanes = 5.5x

Lanes 6-10:  Moderate: +0.3x per lane
  6 lanes = 1.8x
  10 lanes = 3.0x

Lanes 11-15: Steep: +0.6x per lane
  11 lanes = 3.6x
  15 lanes = 6.0x

Lanes 16+:   Extreme: +1.2x per lane
  20 lanes = 10.8x
  30 lanes = 22.8x
```

**Payout**: `Winnings = Floor(BetAmount × Multiplier)`

### 3.4 Cash-Out Mechanic

**Activation**: Press SPACEBAR at any time during gameplay

**Effect**:
1. Game pauses
2. Winnings calculated
3. Balance updated
4. Results screen shown

**Timing**: Instant (no delay)

**Strategy**: Player must balance risk vs. reward

### 3.5 Difficulty Progression

**Increases as player advances**:

| Lane Range | Vehicle Speed | Count/Lane | Density |
|-----------|----------------|-----------|---------|
| 1-3 | 2-3 px/frame | 2-3 | Low |
| 4-6 | 3-4 px/frame | 3-4 | Medium |
| 7-10 | 4-5 px/frame | 4-5 | High |
| 11-15 | 5-6 px/frame | 5+ | Very High |
| 16+ | 6+ px/frame | 6+ | Extreme |

---

## 4. Game Modes

### 4.1 Manual Mode (Default)
- Player controls all movement
- Player decides when to cash out
- Full control, full risk
- Best for engaging players
- Recommended for beginners

### 4.2 Auto Mode
- Player sets target multiplier
- Game auto-cashes when reached
- Hands-off experience
- Removes decision paralysis
- Good for testing risk tolerance

### 4.3 Endless Mode
- No betting (free to play)
- Pure survival challenge
- Tracks high score
- No financial risk
- Perfect for practice

---

## 5. Progression & Rewards

### 5.1 Starter Balance
- **Initial**: $1,000 demo currency
- **Purpose**: Demo gambling mechanics safely
- **Renewal**: Never (keeps player engaged or finished)

### 5.2 Statistics Tracked
- Total games played
- Win/loss count
- Win rate %
- Highest multiplier achieved
- Biggest single win
- Current balance

### 5.3 Achievements (Future)
- "First Win" - Win first game
- "High Roller" - Bet $1000+
- "Millionaire" - Balance reaches $100,000
- "Lucky Streak" - Win 10 games in a row
- "The Chicken Master" - Reach 20 lanes
- "Extreme Risk" - Achieve 50x multiplier

---

## 6. Visual Design

### 6.1 Art Style
- **Theme**: Neon arcade + cartoon
- **Palette**: Bright neon colors with dark background
- **Sprites**: Simple, colorful, low-poly aesthetic
- **Animation**: Smooth, 60 FPS
- **Effects**: Particles, screen shake, glow

### 6.2 Color Scheme
```
Primary Green (success):    #00ff88 (RGB: 0, 255, 136)
Secondary Orange (caution): #ffaa00 (RGB: 255, 170, 0)
Accent Magenta (danger):    #aa00ff (RGB: 170, 0, 255)
Cyan (information):         #00ffff (RGB: 0, 255, 255)
Dark Background:            #0f0f1e (RGB: 15, 15, 30)
Button Hover:               Lighter shade of button color
```

### 6.3 UI Elements

**Main Menu**:
- Large glowing title
- Player stats display (4 widgets)
- 3 game mode buttons
- Settings button

**Betting Panel**:
- Semi-transparent overlay
- Centered panel
- +/- buttons for fine tuning
- Quick bet presets ($100, $500, $1000)
- Confirm button

**Game HUD**:
- Top-left: Multiplier (large, gold)
- Top-left: Projected winnings (green)
- Top-right: Current balance (cyan)
- Top-right: Lanes crossed (magenta)
- Center: Instruction text
- Bottom: Cash out hint

**Game Over Screen**:
- Large result title (green for win, red for loss)
- Stats breakdown
- Buttons: "Play Again" and "Menu"

### 6.4 Animations

**Movement**: 500ms smooth tween
**Collision**: Spin 180° + camera shake (300ms)
**Win effect**: Scale pulse on winnings text
**Menu transitions**: Fade 300ms
**Button hover**: Fill color shift, no lag

---

## 7. Audio Design

### 7.1 Sound Effects (When Enabled)
- **Move**: Soft "beep" or "pop"
- **Close call**: Brief warning sound
- **Crash**: Impact sound + reverb
- **Cash out**: Confirmation "ding"
- **Win**: Triumphant chime
- **Menu click**: Light tap sound

### 7.2 Background Music
- Looping electronic soundtrack
- Ambient but not distracting
- Increases tempo on higher lanes
- Toggleable in settings

### 7.3 Audio Settings
- Master volume slider
- Music on/off toggle
- SFX on/off toggle
- Default: All enabled

---

## 8. Control Scheme

### 8.1 Desktop
| Action | Input |
|--------|-------|
| Move left | Click left 30% of screen |
| Move center | Click center 40% of screen |
| Move right | Click right 30% of screen |
| Cash out | Press SPACEBAR |
| Menu select | Mouse click |
| Quit game | Close tab |

### 8.2 Mobile/Touch
| Action | Input |
|--------|-------|
| Move left | Tap left 30% |
| Move center | Tap center |
| Move right | Tap right 30% |
| Cash out | Tap icon / Double tap |
| Menu select | Tap button |
| Scroll | Vertical swipe (menus) |

---

## 9. Game Balance

### 9.1 Win Rate Target
- Expected: ~40-45% for average player
- Skilled: ~60%+ (good timing and risk management)
- Unskilled: ~20% (poor decision making)

### 9.2 Payout Balance
- **Safe play** (1-2 lanes): 1.1-1.2x (10-20% profit)
- **Medium risk** (5 lanes): 5.5x (450% profit)
- **High risk** (10 lanes): 3.0x (200% profit)
- **Extreme risk** (15+ lanes): 6x+ (500%+ profit, very risky)

### 9.3 Difficulty Curve
- Lanes 1-5: ~90% pass rate
- Lanes 6-10: ~70% pass rate
- Lanes 11-15: ~40% pass rate
- Lanes 16+: ~20% pass rate

### 9.4 Adjustment Knobs
If game is too easy:
- Increase vehicle speed
- Increase vehicle count
- Narrow safe zones

If game is too hard:
- Decrease vehicle speed
- Increase movement range
- Add power-ups

---

## 10. Monetization (N/A - Demo Only)

This is a **demo-only game** using fake currency. No real money transactions.

**Future considerations** (if monetization added):
- Premium cosmetics (skins, themes)
- Battle pass system
- Loot boxes (cosmetics only)
- Ads (optional for currency bonus)
- No loot box items affecting gameplay

---

## 11. Progression Timeline

### Week 1: MVP
- [x] Core movement system
- [x] Traffic generation
- [x] Collision detection
- [x] Multiplier calculation
- [x] Betting system
- [x] Basic UI

### Week 2: Polish
- [x] Visual effects
- [x] Animations
- [x] Sound system
- [x] Mobile responsiveness
- [x] Save/load system

### Week 3: Content
- [x] Multiple game modes
- [x] Statistics tracking
- [x] Menus and transitions
- [x] Documentation

### Week 4: Testing & Release
- [ ] Balance testing
- [ ] Bug fixes
- [ ] Performance optimization
- [ ] Public release

---

## 12. Player Engagement Loop

1. **Anticipation**: Wait for round to start
2. **Engagement**: Navigate through traffic
3. **Tension**: Each lane is riskier
4. **Decision**: Should I cash out or continue?
5. **Resolution**: Win/Lose result
6. **Reward**: Update stats and balance
7. **Restart**: "Just one more round..."

**Addictive elements**:
- Quick play sessions (2-5 minutes)
- "One more round" loop
- Progressive reward scaling
- Leaderboard competition (future)
- Achievement unlocks (future)

---

## 13. Accessibility

### 13.1 Difficulty Options
- Game mode selection (Manual/Auto/Endless)
- Adjustable bet ranges
- Speed settings (future)

### 13.2 Colorblind Support
- Avoid red/green-only indicators
- Use text labels + icons
- Customizable color themes (future)

### 13.3 Motor Control
- Large click targets (80px minimum)
- Touch-friendly spacing
- Keyboard controls supported
- No precise timing requirements

### 13.4 Audio
- Optional sound effects
- Captions on important events
- Visual feedback for all sounds

---

## 14. Performance Targets

- **FPS**: 60 FPS maintained
- **Load time**: <3 seconds
- **Memory**: <50MB during gameplay
- **Mobile**: Works on phones from 2020+
- **Browser**: Chrome, Firefox, Safari, Edge (latest 2 versions)

---

## 15. Future Enhancements

### Phase 2
- [ ] Power-ups (speed boost, shield, extra life)
- [ ] Obstacles (non-vehicle hazards)
- [ ] Weather effects
- [ ] Different road themes
- [ ] Customizable chicken skins

### Phase 3
- [ ] Multiplayer modes
- [ ] Leaderboards
- [ ] Daily challenges
- [ ] Events and tournaments
- [ ] Achievements system

### Phase 4
- [ ] Advanced statistics
- [ ] Replay system
- [ ] Custom difficulty presets
- [ ] Tournaments with prizes
- [ ] Social features

---

## Appendix: Glossary

- **Lane**: A horizontal row of traffic on the road
- **Multiplier**: The payout multiplier (e.g., 5x = 5 times the bet)
- **Cash out**: Securing winnings by exiting the current round
- **Crash**: Being hit by a vehicle (automatic loss)
- **Demo currency**: Fake in-game money ($) with no real value
- **AABB**: Axis-Aligned Bounding Box (simple collision detection)

---

**Document Version**: 1.0  
**Last Updated**: 2024  
**Status**: Final
