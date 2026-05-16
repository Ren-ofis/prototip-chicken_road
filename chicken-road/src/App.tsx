import { useState, useEffect, useRef, useCallback } from 'react';
import Header from './components/Header.tsx';
import GameBoard from './components/GameBoard.tsx';
import Controls from './components/Controls.tsx';
import RTPPanel from './components/RTPPanel.tsx';
import { Difficulty, GameStatus, Car, Player } from './types.ts';
import { getMultipliersByDifficulty, DIFFICULTY_CONFIG, LANES_COUNT } from './constants.ts';
import { rollCrashLane, emptyStats, recordRound, mergeStats, simulateMixedStrategy, SessionStats } from './rtp.ts';

const CAR_PALETTE = ['#FACC15', '#FFFFFF', '#3B82F6', '#EF4444', '#10B981'];

const COIN_MULTIPLIERS = [1, 2, 5, 10, 12, 20, 50, 100, 200, 500, 1000];
const COIN_VALUES = [0.01, 0.02, 0.05, 0.10, 0.20, 0.50, 1.00, 2.00, 5.00, 10.00];
const MIN_BET_CONFIG = { mult: 12, val: 0.01 };
const MAX_BET_CONFIG = { mult: 200, val: 1.00 };

// Scrolling-road geometry (in % of the game container width).
const LANE_W = 8;
const ROAD_START = 18;
const RIGHT_SIDEWALK_W = 30;
const laneCenterPct = (lane: number) => ROAD_START + (lane - 1) * LANE_W + LANE_W / 2;
const clamp = (v: number, lo: number, hi: number) => Math.max(lo, Math.min(hi, v));
const scrollBounds = (lanes: number) => ({
  min: -(ROAD_START + lanes * LANE_W + RIGHT_SIDEWALK_W - 100),
  max: 0,
});

export default function App() {
  const [balance, setBalance] = useState(1000000);
  const [coinMultiplier, setCoinMultiplier] = useState(20);
  const [coinValue, setCoinValue] = useState(1.00);
  const bet = Math.round(coinMultiplier * coinValue * 100) / 100;
  const [difficulty, setDifficulty] = useState(Difficulty.MEDIUM);
  const [gameState, setGameState] = useState<GameStatus>(GameStatus.IDLE);
  const [player, setPlayer] = useState<Player>({ lane: 0, multiplier: 1 });
  const [cars, setCars] = useState<Car[]>([]);
  const [isGameOver, setIsGameOver] = useState(false);
  const [barriers, setBarriers] = useState<Set<number>>(new Set());
  const [sessionStats, setSessionStats] = useState<SessionStats>(() => emptyStats(LANES_COUNT));
  const [moveDelay, setMoveDelay] = useState(0);
  const [scrollX, setScrollX] = useState(0);
  const [scrollAnimated, setScrollAnimated] = useState(true);

  const requestRef = useRef<number>(null);
  const lastTimeRef = useRef<number>(0);
  const carIdCounter = useRef(0);
  const spawnTimer = useRef(0);
  const carsRef = useRef<Car[]>([]);
  const playerRef = useRef<Player>({ lane: 0, multiplier: 1 });
  const gameStateRef = useRef<GameStatus>(GameStatus.IDLE);
  const pendingTimeoutRef = useRef<number | null>(null);
  const crashLaneRef = useRef<number | null>(null);
  // Locks cashout during the brief death animation so a player cannot claim a
  // multiplier they did not actually survive to earn.
  const dyingRef = useRef<boolean>(false);
  // Blocks further advances until the just-placed barrier is visually finished
  // appearing. Prevents spam-clicking through lanes.
  const advanceLockRef = useRef<boolean>(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const dragStartXRef = useRef(0);
  const dragStartScrollRef = useRef(0);
  const dragMovedRef = useRef(false);
  const isDraggingRef = useRef(false);

  const spawnCar = useCallback((diff: Difficulty, currentCars: Car[]) => {
    const config = DIFFICULTY_CONFIG[diff];
    
    // Get occupied lanes
    const occupiedLanes = new Set(currentCars.map(car => car.lane));
    
    // Find available lanes (exclude lanes where chicken is at or has passed)
    const availableLanes = [];
    for (let i = 1; i <= LANES_COUNT; i++) {
      if (!occupiedLanes.has(i) && i > playerRef.current.lane) {
        availableLanes.push(i);
      }
    }
    
    // If no available lanes, don't spawn
    if (availableLanes.length === 0) return;
    
    // Pick random available lane
    const lane = availableLanes[Math.floor(Math.random() * availableLanes.length)];
    const direction = 'down';
    
    // Mix of cruisers and speeders so even slow difficulties have visible
    // traffic variety. Speeders cross noticeably faster, cruisers near base.
    const isSpeeder = Math.random() < 0.3;
    const speedMultiplier = isSpeeder
      ? 1.6 + Math.random() * 0.9
      : 0.75 + Math.random() * 0.5;

    const newCar: Car = {
      id: carIdCounter.current++,
      lane,
      y: -15,
      speed: config.baseSpeed * speedMultiplier,
      color: CAR_PALETTE[Math.floor(Math.random() * CAR_PALETTE.length)],
      direction,
      isExploded: false,
    };
    
    setCars((prev) => [...prev, newCar]);
  }, []);

  const update = useCallback((time: number) => {
    if (lastTimeRef.current !== undefined) {
      const deltaTime = Math.min(time - lastTimeRef.current, 50);
      const config = DIFFICULTY_CONFIG[difficulty];

      // Spawn cars
      spawnTimer.current += deltaTime / 1000;
      if (spawnTimer.current >= config.spawnRate) {
        spawnCar(difficulty, carsRef.current);
        spawnTimer.current = 0;
      }

      const speedFactor = deltaTime / 16.67;
      const playerLane = playerRef.current.lane;

      // Cars approaching from above brake at BLOCK_Y. Cars caught inside the
      // danger zone prefer to accelerate forward past the obstacle — but the
      // speed ramps up gradually (per-frame) rather than jumping, so the
      // motion reads as "flooring it" instead of warping. Reverse is reserved
      // for cars barely past BLOCK_Y, where backing up is genuinely shorter.
      const BLOCK_Y = 24;
      const CHICKEN_LANE_DANGER_END = 64;
      const PASSED_LANE_DANGER_END = 40;
      const REVERSE_BAND = 8;
      const REVERSE_MULT = 3;
      const ACCEL_RATE = 0.4;
      const MAX_DODGE_SPEED = 4.0;

      setCars((prev) =>
        prev
          .map((car) => {
            if (car.isExploded) return car;

            let nextY = car.y + car.speed * speedFactor;
            let nextSpeed = car.speed;

            const isKillerCar = car.isKiller === true;
            let dangerEndY: number | null = null;
            if (!isKillerCar) {
              if (playerLane > 0 && car.lane === playerLane) {
                dangerEndY = CHICKEN_LANE_DANGER_END;
              } else if (car.lane < playerLane) {
                dangerEndY = PASSED_LANE_DANGER_END;
              }
            }

            if (dangerEndY !== null) {
              if (car.y < BLOCK_Y) {
                nextY = Math.min(nextY, BLOCK_Y);
              } else if (car.y < dangerEndY) {
                if (car.y - BLOCK_Y < REVERSE_BAND) {
                  const reverseAmount = Math.max(car.speed, 1.0) * speedFactor * REVERSE_MULT;
                  nextY = Math.max(car.y - reverseAmount, BLOCK_Y);
                } else {
                  nextSpeed = Math.min(car.speed + ACCEL_RATE * speedFactor, MAX_DODGE_SPEED);
                  nextY = car.y + nextSpeed * speedFactor;
                }
              }
            }

            return { ...car, y: nextY, speed: nextSpeed };
          })
          .filter((car) => car.y > -20 && car.y < 120),
      );
    }
    lastTimeRef.current = time;
    requestRef.current = requestAnimationFrame(update);
  }, [difficulty, spawnCar]);

  useEffect(() => {
    requestRef.current = requestAnimationFrame(update);
    return () => {
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
    };
  }, [update]);

  useEffect(() => {
    carsRef.current = cars;
  }, [cars]);

  useEffect(() => {
    playerRef.current = player;
  }, [player]);

  useEffect(() => {
    gameStateRef.current = gameState;
  }, [gameState]);

  useEffect(() => {
    if (isDraggingRef.current) return;
    const { min, max } = scrollBounds(LANES_COUNT);
    const focusLane = player.lane === 0 ? 1 : player.lane;
    setScrollAnimated(true);
    setScrollX(clamp(50 - laneCenterPct(focusLane), min, max));
  }, [player.lane]);

  const handleGameOver = () => {
    // Cancel any pending cashout
    if (pendingTimeoutRef.current !== null) {
      clearTimeout(pendingTimeoutRef.current);
      pendingTimeoutRef.current = null;
    }

    dyingRef.current = false;
    advanceLockRef.current = false;

    setSessionStats((prev) => recordRound(prev, bet, 0, crashLaneRef.current));

    setGameState(GameStatus.GAMEOVER);
    setIsGameOver(true);
    // Don't modify balance since they already paid the bet
    setTimeout(() => {
      setGameState(GameStatus.IDLE);
      setIsGameOver(false);
      setPlayer({ lane: 0, multiplier: 1 });
      setCars([]); // Clear cars on reset
      setBarriers(new Set());
    }, 2000);
  };

  const onPlay = () => {
    if (balance < bet) return;
    setBalance(balance - bet);
    crashLaneRef.current = rollCrashLane(difficulty);
    dyingRef.current = false;
    advanceLockRef.current = false;
    setGameState(GameStatus.PLAYING);
    setPlayer({ lane: 0, multiplier: 1 });
    setBarriers(new Set());
    setCars([]);
    setIsGameOver(false);
  };

  const onCashout = () => {
    if (gameState !== GameStatus.PLAYING) return;
    if (dyingRef.current) return;

    // Cancel any pending auto-cashout
    if (pendingTimeoutRef.current !== null) {
      clearTimeout(pendingTimeoutRef.current);
      pendingTimeoutRef.current = null;
    }
    
    const winAmount = Math.round(bet * player.multiplier * 100) / 100;
    setSessionStats((prev) => recordRound(prev, bet, winAmount, null));
    setBalance(balance + winAmount);
    setGameState(GameStatus.WON);
    setTimeout(() => {
      setGameState(GameStatus.IDLE);
      setPlayer({ lane: 0, multiplier: 1 });
    }, 1000);
  };

  const handleMove = () => {
    if (gameState !== GameStatus.PLAYING) return;
    // Block further advances while the death animation is playing.
    if (dyingRef.current) return;
    // Block until the previous barrier has finished appearing.
    if (advanceLockRef.current) return;

    if (player.lane < LANES_COUNT) {
      const nextLane = player.lane + 1;

      const multipliers = getMultipliersByDifficulty(difficulty);
      const isCrashLane = crashLaneRef.current !== null && nextLane >= crashLaneRef.current;

      // If a car in the destination lane would trigger an instant-accelerate
      // dodge, hold the chicken's visual arrival back ~150ms so the car can
      // clear the lane before the chicken's there. Skipped for crash lanes —
      // the killer car timing depends on a prompt arrival.
      let computedMoveDelay = 0;
      if (!isCrashLane) {
        const ACCEL_TRIGGER_LOW = 32;
        const ACCEL_TRIGGER_HIGH = 64;
        const wouldAccelerate = cars.some(
          (c) => c.lane === nextLane && c.y >= ACCEL_TRIGGER_LOW && c.y < ACCEL_TRIGGER_HIGH,
        );
        computedMoveDelay = wouldAccelerate ? 0.15 : 0;
      }
      setMoveDelay(computedMoveDelay);

      setPlayer({
        lane: nextLane,
        multiplier: multipliers[nextLane - 1],
      });

      if (isCrashLane) {
        // Pick the killer: if there's already a car above the chicken at a
        // safe distance, promote it (boost its speed so it arrives at the
        // chicken's y at the 500ms game-over mark). Otherwise spawn a fresh
        // killer from the top. Either way we leave the other cars in this
        // lane alone — they get handled by the normal dodge logic.
        const CHICKEN_Y = 50;
        const KILLER_FRAMES = 30;
        const SAFE_ABOVE_MAX = 25;
        const existingAbove = cars.find(
          (c) => c.lane === nextLane && c.y > -15 && c.y < SAFE_ABOVE_MAX,
        );

        if (existingAbove) {
          const requiredSpeed = (CHICKEN_Y - existingAbove.y) / KILLER_FRAMES;
          setCars((prev) =>
            prev.map((c) =>
              c.id === existingAbove.id
                ? {
                    ...c,
                    speed: Math.max(requiredSpeed, c.speed),
                    color: '#EF4444',
                    isKiller: true,
                  }
                : c,
            ),
          );
        } else {
          setCars((prev) => [
            ...prev,
            {
              id: carIdCounter.current++,
              lane: nextLane,
              y: -5,
              speed: 1.85,
              color: '#EF4444',
              direction: 'down',
              isExploded: false,
              isKiller: true,
            },
          ]);
        }

        dyingRef.current = true;
        setTimeout(() => handleGameOver(), 500);
        return;
      }

      // Safe advance: existing cars in this lane adapt via the dodge logic in
      // the update loop. No clear/spawn here — that was the source of the
      // pop-in/pop-out visual.
      setBarriers((prev) => new Set(prev).add(nextLane));

      // Lock further advances until the new barrier has fully scaled in.
      // Total: moveDelay (chicken-arrival hold) + 0.2s (barrier appearance
      // delay) + 0.3s (scale animation).
      advanceLockRef.current = true;
      window.setTimeout(() => {
        advanceLockRef.current = false;
      }, (computedMoveDelay + 0.5) * 1000);
      
      if (nextLane === LANES_COUNT) {
        // Automatically cashout if reached the end (with guard to prevent double-trigger)
        const winAmount = Math.round(bet * multipliers[nextLane - 1] * 100) / 100;
        pendingTimeoutRef.current = window.setTimeout(() => {
          // Only cashout if still playing (collision might have ended the game)
          if (gameStateRef.current === GameStatus.PLAYING) {
            setSessionStats((prev) => recordRound(prev, bet, winAmount, null));
            setBalance(prevBalance => prevBalance + winAmount);
            setGameState(GameStatus.WON);
            setTimeout(() => {
              setGameState(GameStatus.IDLE);
              setPlayer({ lane: 0, multiplier: 1 });
            }, 1000);
          }
          pendingTimeoutRef.current = null;
        }, 500);
      }
    }
  };

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    dragStartXRef.current = e.clientX;
    dragStartScrollRef.current = scrollX;
    dragMovedRef.current = false;
    isDraggingRef.current = true;
    setScrollAnimated(false);
    e.currentTarget.setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDraggingRef.current) return;
    const dx = e.clientX - dragStartXRef.current;
    if (Math.abs(dx) > 5) dragMovedRef.current = true;
    if (!containerRef.current) return;
    const w = containerRef.current.clientWidth;
    const { min, max } = scrollBounds(LANES_COUNT);
    setScrollX(clamp(dragStartScrollRef.current + (dx / w) * 100, min, max));
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDraggingRef.current) return;
    isDraggingRef.current = false;
    try {
      e.currentTarget.releasePointerCapture(e.pointerId);
    } catch {
      // ignore — pointer may have already been released
    }
    if (!dragMovedRef.current) {
      handleMove();
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white font-sans overflow-hidden flex flex-col relative">
      {/* Background Gradients */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-transparent to-[#1a1a2e] opacity-80 pointer-events-none z-0" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(56,189,248,0.05)_0%,transparent_70%)] pointer-events-none z-0" />

      <Header balance={balance} />

      <RTPPanel
        stats={sessionStats}
        difficulty={difficulty}
        currentBet={bet}
        onReset={() => setSessionStats(emptyStats(LANES_COUNT))}
        onSimulate={(rounds) => {
          const sim = simulateMixedStrategy(difficulty, rounds, bet);
          setSessionStats((prev) => mergeStats(prev, sim));
        }}
      />

      <main className="flex-1 flex flex-col items-center justify-center p-4 relative z-10">
        <div
          ref={containerRef}
          className="w-full max-w-5xl rounded-[40px] overflow-hidden shadow-[0_0_100px_rgba(0,0,0,0.8)] border border-white/5 relative group cursor-grab active:cursor-grabbing touch-none"
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerCancel={handlePointerUp}
        >
          <GameBoard
            player={player}
            cars={cars}
            isGameOver={isGameOver}
            lanes={LANES_COUNT}
            barriers={barriers}
            difficulty={difficulty}
            moveDelay={moveDelay}
            scrollX={scrollX}
            scrollAnimated={scrollAnimated}
          />

          {/* Dynamic HUD in game */}
          <div className="absolute top-8 left-12 flex flex-col pointer-events-none z-40">
            <span className="text-6xl font-black text-white leading-none glow-text tracking-tighter">
              {player.multiplier.toFixed(2)}
            </span>
            <span className="text-[10px] text-white/30 uppercase tracking-[0.3em] mt-1 font-bold">Current Multiplier</span>
          </div>

          {/* Winning Overlay */}
          {gameState === GameStatus.WON && (
            <div className="absolute inset-0 bg-black/80 flex flex-col items-center justify-center z-50 animate-in fade-in zoom-in duration-300 backdrop-blur-sm">
               <h2 className="text-8xl font-black text-white glow-text mb-4 tracking-tighter">SUCCESS</h2>
               <div className="text-4xl font-black text-yellow-400">+€{(Math.round(bet * player.multiplier * 100) / 100).toFixed(2)}</div>
            </div>
          )}

          {/* Game Over Overlay */}
          {gameState === GameStatus.GAMEOVER && (
            <div className="absolute inset-0 bg-red-950/60 flex flex-col items-center justify-center z-50 animate-in fade-in zoom-in duration-300 backdrop-blur-md">
               <h2 className="text-8xl font-black text-white glow-text tracking-tighter">WRECKED</h2>
               <p className="text-xl text-red-400/60 mt-4 uppercase tracking-[0.5em] font-black">Round Lost</p>
            </div>
          )}

          {/* Click to Move hint */}
          {gameState === GameStatus.PLAYING && (
            <div className="absolute bottom-32 left-1/2 -translate-x-1/2 px-6 py-2 rounded-full text-[10px] font-black tracking-[0.4em] text-white/20 uppercase border border-white/5 bg-white/5 backdrop-blur-sm pointer-events-none animate-pulse">
              Click Board to Advance
            </div>
          )}
        </div>

        <Controls
          bet={bet}
          coinMultiplier={coinMultiplier}
          setCoinMultiplier={setCoinMultiplier}
          coinValue={coinValue}
          setCoinValue={setCoinValue}
          coinMultiplierOptions={COIN_MULTIPLIERS}
          coinValueOptions={COIN_VALUES}
          minBet={MIN_BET_CONFIG.mult * MIN_BET_CONFIG.val}
          maxBet={MAX_BET_CONFIG.mult * MAX_BET_CONFIG.val}
          onMinBet={() => {
            setCoinMultiplier(MIN_BET_CONFIG.mult);
            setCoinValue(MIN_BET_CONFIG.val);
          }}
          onMaxBet={() => {
            setCoinMultiplier(MAX_BET_CONFIG.mult);
            setCoinValue(MAX_BET_CONFIG.val);
          }}
          difficulty={difficulty}
          setDifficulty={setDifficulty}
          onPlay={onPlay}
          onCashout={onCashout}
          gameState={gameState}
          currentMultiplier={player.multiplier}
        />
      </main>

      {/* Decorative Sidebars */}
      <div className="absolute inset-0 pointer-events-none border-[32px] border-black/20 z-40" />
    </div>
  );
}

