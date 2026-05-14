# Game Flow & Architecture

## Complete Game Flow Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                    Application Startup                      │
│                     phaserMain.js                           │
│              (Initialize Phaser with config)                │
└────────────────────────┬────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────┐
│                   Preload Scene                             │
│                   preload.js                                │
│  • Generate chicken sprite texture                          │
│  • Generate car sprite textures                             │
│  • Load localStorage game state                             │
│  • Initialize if first run                                  │
└────────────────────────┬────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────┐
│                    MENU SCENE                               │
│                   Menu.js                                   │
│  ┌─────────────────────────────────────────────────────┐   │
│  │  Display Game Title                                 │   │
│  │  Display Player Stats:                              │   │
│  │  • Balance: $X                                       │   │
│  │  • Games Played: X                                  │   │
│  │  • Win Rate: X%                                     │   │
│  │  • Highest Multiplier: X.XXx                        │   │
│  │  • Biggest Win: $X                                  │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                             │
│  ┌─────────────────────────────────────────────────────┐   │
│  │  Game Mode Selection (Player Chooses):              │   │
│  │                                                      │   │
│  │  [MANUAL MODE]    [AUTO MODE]    [ENDLESS MODE]    │   │
│  │                                                      │   │
│  │  Manual: Player controls all timing                │   │
│  │  Auto: Auto cash-out at target                     │   │
│  │  Endless: Free play, high score mode               │   │
│  └─────────────────────────────────────────────────────┘   │
└────────────┬─────────────────┬──────────────┬───────────────┘
             │                 │              │
         Manual           Auto Mode        Endless
             │                 │              │
             ▼                 ▼              ▼
┌──────────────────────────────────────────────────────────────┐
│                   GAME SCENE                                 │
│                   Game.js                                    │
│                                                              │
│  PHASE 1: BETTING                                            │
│  ┌──────────────────────────────────────────────────────┐  │
│  │ Show Betting Panel (UIManager)                       │  │
│  │  ┌──────────────────────────────────────────────┐   │  │
│  │  │ Current Balance: $X                          │   │  │
│  │  │ Bet Amount: $[100]                           │   │  │
│  │  │ Buttons: [-] [+]                             │   │  │
│  │  │ Quick Bets: [$100] [$500] [$1000]            │   │  │
│  │  │ [CONFIRM BET]                                │   │  │
│  │  └──────────────────────────────────────────────┘   │  │
│  └──────────────────────────────────────────────────────┘  │
│                         │                                   │
│                    User Clicks                              │
│                   Confirm Bet                               │
│                         │                                   │
│                         ▼                                   │
│  ┌──────────────────────────────────────────────────────┐  │
│  │ Deduct Bet from Balance (GameBalance)                │  │
│  │ Set Game State to Active                             │  │
│  │ Reset Current Lane to 0                              │  │
│  │ Reset Multiplier to 1.0x                             │  │
│  │ Hide Betting Panel                                   │  │
│  └──────────────────────────────────────────────────────┘  │
│                         │                                   │
│                         ▼                                   │
│  PHASE 2: GAMEPLAY                                          │
│  ┌──────────────────────────────────────────────────────┐  │
│  │ Show Game HUD (UIManager)                            │  │
│  │  ┌──────────────────────────────────────────────┐   │  │
│  │  │ Top-Left:                                    │   │  │
│  │  │ • Multiplier: 1.00x                          │   │  │
│  │  │ • Winnings: $0                               │   │  │
│  │  │ • Bet: $100                                  │   │  │
│  │  │                                              │   │  │
│  │  │ Top-Right:                                   │   │  │
│  │  │ • Balance: $900                              │   │  │
│  │  │ • Lanes: 0                                   │   │  │
│  │  └──────────────────────────────────────────────┘   │  │
│  │                                                      │  │
│  │ Chicken at start position (bottom of road)          │  │
│  │ Road with 12 visible lanes of traffic               │  │
│  │ Vehicles moving at various speeds                   │  │
│  └──────────────────────────────────────────────────────┘  │
│                         │                                   │
│                    ╔════╩════╗                              │
│                    ▼         ▼                              │
│             [Click Move] [Press SPACEBAR]                  │
│                    │         │                              │
│         MOVE: -1/0/+1        │                              │
│                    │         │                              │
│                    ▼         │                              │
│    Lane Progression Loop      │                              │
│   (Repeats Until End)         │                              │
│    ┌─────────────────────┐   │                              │
│    │ 1. Animate move     │   │                              │
│    │    (500ms tween)    │   │                              │
│    │                     │   │                              │
│    │ 2. Wait for collision                │                              │
│    │    check (600ms)    │   │                              │
│    │                     │   │                              │
│    │ 3. If collision:    │   │                              │
│    │    CRASH            │   │                              │
│    │    (see below)      │   │                              │
│    │                     │   │                              │
│    │ 4. Update lane      │   │                              │
│    │    currentLane++    │   │                              │
│    │                     │   │                              │
│    │ 5. Calculate        │   │                              │
│    │    multiplier       │   │                              │
│    │    = formula(lane)  │   │                              │
│    │                     │   │                              │
│    │ 6. Update UI        │   │                              │
│    │    multiplierText   │   │                              │
│    │    winningsText     │   │                              │
│    │                     │   │                              │
│    │ 7. Enable player    │   │                              │
│    │    for next move    │   │                              │
│    │                     │   │                              │
│    │ 8. Loop back to     │   │                              │
│    │    wait for input   │   │                              │
│    └──────────┬──────────┘   │                              │
│               │               │                              │
│               └─ Repeat ──┘   │                              │
│                           │   │                              │
│                ┌──────────┴─┐ │                              │
│                ▼            ▼ │                              │
│    CRASH SCENARIO    CASH-OUT SCENARIO                      │
│                                                              │
│    ┌─────────────────┐      ┌──────────────┐               │
│    │ Chicken hit by  │      │ Player presses               │
│    │ vehicle during  │      │ SPACEBAR at  │               │
│    │ move detection  │      │ any time     │               │
│    │                 │      │              │               │
│    │ • Spin 180°     │      │ • Calculate  │               │
│    │   (300ms)       │      │   winnings   │               │
│    │ • Fade out      │      │ • Add to     │               │
│    │ • Camera shake  │      │   balance    │               │
│    │ • Lose bet      │      │ • Record win │               │
│    │                 │      │ • Update     │               │
│    │ → Game Over     │      │   stats      │               │
│    │   (1500ms)      │      │              │               │
│    └────────┬────────┘      └──────┬───────┘               │
│             │                      │                        │
│             ▼                      ▼                        │
│    LOST RESULT              WINNING RESULT                  │
│    "Lanes: 5"               "Lanes: 7"                      │
│    "Multiplier: 3.5x"       "Multiplier: 5.5x"             │
│    "Winnings: $0"           "Winnings: $550"               │
│    "GAME OVER"              "YOU WIN!"                      │
└──────────────┬───────────────────┬──────────────────────────┘
               │                   │
               └───────┬───────────┘
                       │
                       ▼
┌──────────────────────────────────────────────────────────────┐
│                   GAME OVER SCENE                            │
│                   GameOver.js                                │
│                                                              │
│  ┌────────────────────────────────────────────────────────┐ │
│  │                 RESULT SCREEN                           │ │
│  │                                                         │ │
│  │  If WIN (green):                                       │ │
│  │  ╔════════════════════════════════════════════════╗   │ │
│  │  ║         🎉 YOU WIN! 🎉                         ║   │ │
│  │  ║                                                ║   │ │
│  │  ║ Lanes Crossed:      7                          ║   │ │
│  │  ║ Final Multiplier:   5.50x                      ║   │ │
│  │  ║ Winnings:           $550 ✨                    ║   │ │
│  │  ╚════════════════════════════════════════════════╝   │ │
│  │                                                         │ │
│  │  If LOSS (red):                                        │ │
│  │  ╔════════════════════════════════════════════════╗   │ │
│  │  ║         💥 GAME OVER 💥                        ║   │ │
│  │  ║                                                ║   │ │
│  │  ║ Lanes Crossed:      3                          ║   │ │
│  │  ║ Final Multiplier:   1.30x                      ║   │ │
│  │  ║ Bet Lost           ($100)                      ║   │ │
│  │  ╚════════════════════════════════════════════════╝   │ │
│  │                                                         │ │
│  │  [PLAY AGAIN]                 [MAIN MENU]             │ │
│  └────────────────────────────────────────────────────────┘ │
│                                                              │
│  Update Stats (GameState):                                  │
│  • totalGames++                                             │
│  • If win: wins++                                           │
│  • If loss: losses++                                        │
│  • If win multiplier > highest: highest = multiplier        │
│  • If win amount > biggest: biggest = amount                │
│  • Save to localStorage                                     │
└──────────────┬──────────────────────────┬───────────────────┘
               │                          │
         Play Again               Return to Menu
               │                          │
               └──────────┬───────────────┘
                          │
              Return to MENU SCENE ─── Loop ───┐
                          │                    │
                          └────────────────────┘
```

---

## Data Flow

### Game State Flow
```
localStorage
    ↓
GameState (load)
    ↓
Menu Scene (display stats)
    ↓
Game Scene (use state)
    ↓
Betting (modify balance)
    ↓
Gameplay (modify multiplier)
    ↓
GameOver (record result)
    ↓
GameState (save stats)
    ↓
localStorage (persist)
```

### UI Update Flow
```
Game.currentLane ──→ calculate multiplier
                              ↓
                    UIManager.updateMultiplier()
                              ↓
                    Update Display
                     (every frame)
                              ↓
                    Player sees live updates
```

### Collision Detection Flow
```
Player moves
    ↓
Chicken animates (500ms)
    ↓
Wait for move (600ms)
    ↓
Check all vehicles in current lane
    ↓
AABB collision test
    ↓
If collision: crash
If no collision: allow next move
```

---

## System Architecture

### Core Systems

**GameState** (State Management)
- Stores: balance, stats, preferences
- Operations: read, write, save
- Persistence: localStorage
- Used by: All scenes

**GameBalance** (Betting)
- Tracks: current bet, balance changes
- Operations: place bet, cash out, lose
- Calculation: multiplier × bet = winnings
- Used by: Game scene

**Road** (Traffic)
- Manages: lanes, vehicles, movement
- Operations: update positions, collision check
- Physics: simple movement, no physics engine
- Used by: Game scene

**UIManager** (Rendering)
- Displays: all UI elements
- Operations: show panels, update text, animations
- Rendering: Phaser text and containers
- Used by: All scenes

**Chicken** (Player Entity)
- Type: Physics sprite
- Operations: move, animate, crash
- Physics: arcade physics body
- Used by: Game scene

---

## Event Flow

### Input Events
```
Player clicks screen
    ↓
Game.handleInput() called
    ↓
Determine click zone (left/center/right)
    ↓
Call Game.moveLane(direction)
    ↓
    └─→ Animate chicken
    └─→ Schedule collision check
    └─→ Disable further input
```

### Game Events
```
Game state changes
    ↓
Update relevant systems
    ↓
Update UI display
    ↓
Save state to localStorage
    ↓
Trigger next game phase
```

### Scene Transitions
```
Scene A (active)
    ↓
Determine next scene
    ↓
Shutdown Scene A (cleanup)
    ↓
Start Scene B (initialization)
```

---

## Key Timing

```
Movement Sequence (600ms total):
├─ 0-500ms:  Animate chicken to new position
├─ 500-600ms: Check for collision
├─ 600ms:     Enable next move

Game Over Sequence:
├─ Crash detected
├─ 0-300ms:   Crash animation
├─ 300-1500ms: Wait for impact
├─ 1500ms:    Show game over screen

Round Timing (typical):
├─ 3-5 seconds: Player makes moves
├─ 1 second:    Cash-out animation
├─ 2-3 seconds: Game over screen display
├─ Total: 6-11 seconds per round
```

---

## Performance Considerations

### Per-Frame (60 FPS = 16.67ms per frame)
```
Update Road (move vehicles)    ~2ms
Update UI (text updates)       ~1ms
Input handling                 <1ms
Physics calculations           <1ms
Rendering (Phaser)             ~5ms
Available headroom              ~7ms
```

### Memory
```
Textures                        ~5MB
Game objects (50-60)            ~2MB
State data                       <1MB
Total target: <50MB
```

---

## Error Handling

### Graceful Degradation
- Sound not available → Continue without audio
- localStorage disabled → Game still works (stats lost)
- Animation interrupted → Fall back to instant
- Physics error → Continue with fallback

### Input Validation
- Bet amount checked against balance
- Lane index clamped to valid range
- Position clamped to screen bounds
- All clicks validated before processing

---

**This architecture allows for:**
✅ Easy feature additions
✅ Clear separation of concerns
✅ Testable systems
✅ Responsive gameplay
✅ Persistent progression
✅ Mobile compatibility
✅ Performance optimization

