import { useState, useEffect, useRef, useCallback } from 'react';
import Header from './components/Header.tsx';
import GameBoard from './components/GameBoard.tsx';
import Controls from './components/Controls.tsx';
import { Difficulty, GameStatus, Car, Player } from './types.ts';
import { MULTIPLIERS, DIFFICULTY_CONFIG, LANES_COUNT } from './constants.ts';

export default function App() {
  const [balance, setBalance] = useState(1000000);
  const [bet, setBet] = useState(20);
  const [difficulty, setDifficulty] = useState(Difficulty.MEDIUM);
  const [gameState, setGameState] = useState<GameStatus>(GameStatus.IDLE);
  const [player, setPlayer] = useState<Player>({ lane: 0, multiplier: 1 });
  const [cars, setCars] = useState<Car[]>([]);
  const [isGameOver, setIsGameOver] = useState(false);
  const [barriers, setBarriers] = useState<Set<number>>(new Set());

  const requestRef = useRef<number>(null);
  const lastTimeRef = useRef<number>(0);
  const carIdCounter = useRef(0);
  const spawnTimer = useRef(0);

  const spawnCar = useCallback((diff: Difficulty) => {
    const config = DIFFICULTY_CONFIG[diff];
    const lane = Math.floor(Math.random() * LANES_COUNT) + 1;
    const direction = 'down';
    
    const newCar: Car = {
      id: carIdCounter.current++,
      lane,
      y: -15,
      speed: config.baseSpeed + Math.random() * 0.2, // Randomize speed slightly
      color: ['#FACC15', '#FFFFFF', '#3B82F6', '#EF4444', '#10B981'][Math.floor(Math.random() * 5)],
      direction,
      isExploded: false,
    };
    
    setCars((prev) => [...prev, newCar]);
  }, []);

  const update = useCallback((time: number) => {
    if (lastTimeRef.current !== undefined) {
      const deltaTime = time - lastTimeRef.current;
      const config = DIFFICULTY_CONFIG[difficulty];

      // Spawn cars
      spawnTimer.current += deltaTime / 1000;
      if (spawnTimer.current >= config.spawnRate) {
        spawnCar(difficulty);
        spawnTimer.current = 0;
      }

      // Update positions & Check collisions
      setCars((prev) => {
        const nextCars = prev
          .map((car) => {
            if (car.isExploded) return car;
            
            let nextY = car.y + car.speed;
            
            // Barrier collision check (Barrier visual is at ~32%)
            const BARRIER_Y = 15; // Stop slightly before the barrier
            if (barriers.has(car.lane) && car.y < BARRIER_Y && nextY >= BARRIER_Y) {
               // Higher threshold (0.5) so Medium (0.4) is generally safe
               if (car.speed > 0.5) {
                 handleGameOver();
                 return { ...car, y: BARRIER_Y + 2, isExploded: true };
               } else {
                 return { ...car, y: BARRIER_Y, speed: 0 };
               }
            }

            return {
              ...car,
              y: nextY,
            };
          })
          .filter((car) => car.y > -20 && car.y < 120);

        // Collision logic with chicken (Chicken at y=50)
        if (gameState === GameStatus.PLAYING && player.lane > 0) {
          const hit = nextCars.find((car) => {
            if (car.lane !== player.lane || car.isExploded) return false;
            const chickenY = 50;
            return chickenY > car.y - 6 && chickenY < car.y + 6;
          });

          if (hit) {
            handleGameOver();
          }
        }

        return nextCars;
      });
    }
    lastTimeRef.current = time;
    requestRef.current = requestAnimationFrame(update);
  }, [difficulty, gameState, player, spawnCar]);

  useEffect(() => {
    requestRef.current = requestAnimationFrame(update);
    return () => {
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
    };
  }, [update]);

  const handleGameOver = () => {
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
    setGameState(GameStatus.PLAYING);
    setPlayer({ lane: 0, multiplier: 1 });
    setBarriers(new Set());
    setCars([]); // Clear cars for new round
    setIsGameOver(false);
  };

  const onCashout = () => {
    if (gameState !== GameStatus.PLAYING) return;
    const winAmount = Math.floor(bet * player.multiplier);
    setBalance(balance + winAmount);
    setGameState(GameStatus.WON);
    setTimeout(() => {
      setGameState(GameStatus.IDLE);
      setPlayer({ lane: 0, multiplier: 1 });
    }, 1000);
  };

  const handleMove = () => {
    if (gameState !== GameStatus.PLAYING) return;
    if (player.lane < LANES_COUNT) {
      const nextLane = player.lane + 1;
      setPlayer({
        lane: nextLane,
        multiplier: MULTIPLIERS[nextLane - 1],
      });
      setBarriers(prev => new Set(prev).add(nextLane));
      
      if (nextLane === LANES_COUNT) {
        // Automatically cashout if reached the end
        setTimeout(() => {
          onCashout();
        }, 500);
      }
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white font-sans overflow-hidden flex flex-col relative">
      {/* Background Gradients */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-transparent to-[#1a1a2e] opacity-80 pointer-events-none z-0" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(56,189,248,0.05)_0%,transparent_70%)] pointer-events-none z-0" />

      <Header balance={balance} />
      
      <main className="flex-1 flex flex-col items-center justify-center p-4 relative z-10">
        <div 
          className="w-full max-w-5xl rounded-[40px] overflow-hidden shadow-[0_0_100px_rgba(0,0,0,0.8)] border border-white/5 relative group cursor-pointer"
          onClick={handleMove}
        >
          <GameBoard 
            player={player} 
            cars={cars} 
            isGameOver={isGameOver}
            lanes={LANES_COUNT}
            barriers={barriers}
          />

          {/* Dynamic HUD in game */}
          <div className="absolute top-8 left-12 flex flex-col pointer-events-none">
            <span className="text-6xl font-black text-white leading-none glow-text tracking-tighter">
              {player.multiplier.toFixed(2)}
            </span>
            <span className="text-[10px] text-white/30 uppercase tracking-[0.3em] mt-1 font-bold">Current Multiplier</span>
          </div>

          {/* Winning Overlay */}
          {gameState === GameStatus.WON && (
            <div className="absolute inset-0 bg-black/80 flex flex-col items-center justify-center z-50 animate-in fade-in zoom-in duration-300 backdrop-blur-sm">
               <h2 className="text-8xl font-black text-white glow-text mb-4 tracking-tighter">SUCCESS</h2>
               <div className="text-4xl font-black text-yellow-400">+{Math.floor(bet * player.multiplier).toLocaleString()}$</div>
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
          setBet={setBet}
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

