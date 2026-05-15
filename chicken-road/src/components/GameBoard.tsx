import { motion } from 'motion/react';
import { Car, Player, Difficulty } from '../types.ts';
import { getMultipliersByDifficulty } from '../constants.ts';

interface GameBoardProps {
  player: Player;
  cars: Car[];
  isGameOver: boolean;
  lanes: number;
  barriers: Set<number>;
  difficulty: Difficulty;
}

export default function GameBoard({ player, cars, isGameOver, lanes, barriers, difficulty }: GameBoardProps) {
  const multipliers = getMultipliersByDifficulty(difficulty);
  
  return (
    <div className="relative w-full h-[600px] overflow-hidden bg-[#0A0A0A] select-none perspective-1000">
      {/* Background/Sidewalks */}
      <div className="absolute left-0 top-0 bottom-0 w-[12%] bg-[#2d5a27] border-r-8 border-black/20 flex flex-col justify-around px-2 py-8 overflow-hidden z-0">
        {[...Array(12)].map((_, i) => (
          <div key={i} className="flex gap-1">
            <div className="w-full h-8 bg-[#143d14] rounded-sm border-r-4 border-b-4 border-black/20 opacity-60" />
            <div className="w-4 h-full bg-black/10 blur-sm" />
          </div>
        ))}
      </div>

      <div className="absolute right-0 top-0 bottom-0 w-[8%] bg-[#2d5a27] border-l-8 border-black/20 z-0" />

      {/* Road Lanes */}
      <div className="absolute left-[12%] right-[8%] top-0 bottom-0 flex z-0 road-stripe">
        {multipliers.map((mult, i) => (
          <div 
            key={i} 
            className={`flex-1 border-r border-white/5 flex justify-center items-center relative ${
              i === player.lane - 1 ? 'bg-white/5 shadow-[inset_0_0_50px_rgba(255,255,255,0.05)]' : ''
            }`}
          >
            {/* Barrier (Traffic Cone / Road Block) at y=35% */}
            {barriers.has(i + 1) && (
              <motion.div 
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="absolute top-[32%] left-1/2 -translate-x-1/2 z-20"
              >
                <div className="flex flex-col items-center">
                  <div className="w-8 h-4 bg-orange-600 rounded-sm border-b-4 border-black/20 voxel-shadow" />
                  <div className="w-10 h-2 bg-orange-600 rounded-sm shadow-lg" />
                </div>
              </motion.div>
            )}

            {/* Multiplier Disc */}
            <div className={`
              w-16 h-16 rounded-full border flex items-center justify-center transition-all duration-500
              ${i < player.lane 
                ? 'border-yellow-500/50 bg-yellow-500/10 shadow-[0_0_20px_rgba(234,179,8,0.3)] scale-110' 
                : 'border-white/10 bg-black/40'}
            `}>
              <span className={`font-black text-xs tracking-tighter ${i < player.lane ? 'text-yellow-400 glow-text' : 'text-white/20'}`}>
                {mult.toFixed(2)}x
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Cars */}
      {cars.map((car) => (
        <motion.div
           key={car.id}
           initial={false}
           animate={{ top: `${car.y}%` }}
           transition={{ duration: 0, ease: 'linear' }}
           style={{ 
             left: `${12 + (car.lane - 1) * (80 / lanes) + (80 / lanes) / 2}%`,
             transform: 'translate(-50%, -50%)'
           }}
           className="absolute z-10 w-12 h-20"
        >
          {car.isExploded ? (
            <div className="w-full h-full flex items-center justify-center text-3xl animate-bounce">
              💥
            </div>
          ) : (
            <div 
              className="w-full h-full rounded-sm relative flex flex-col items-center border-r-4 border-b-4 border-black/20 voxel-shadow"
              style={{ backgroundColor: car.color }}
            >
              {/* Windshield */}
              <div className="w-[80%] h-[25%] bg-white/20 rounded-sm mt-1" />
              {/* Back Window */}
              <div className="absolute bottom-1 w-[70%] h-[15%] bg-black/10 rounded-sm" />
              
              {/* Lights */}
              <div className="absolute top-0 flex justify-between w-full px-1 pt-0.5">
                <div className={`w-2 h-1 ${car.direction === 'up' ? 'bg-white shadow-[0_0_5px_white]' : 'bg-red-600'} rounded-sm`} />
                <div className={`w-2 h-1 ${car.direction === 'up' ? 'bg-white shadow-[0_0_5px_white]' : 'bg-red-600'} rounded-sm`} />
              </div>
            </div>
          )}
        </motion.div>
      ))}

      {/* Player (Chicken) */}
      <motion.div
        animate={{ 
          left: player.lane === 0 
            ? '6%' 
            : `${12 + (player.lane - 1) * (80 / lanes) + (80 / lanes) / 2}%`,
          scale: isGameOver ? [1, 1.5, 0] : 1,
          rotate: isGameOver ? [0, 180, 360] : 0,
          x: "-50%",
          y: "50%"
        }}
        transition={{ 
          left: { type: 'spring', stiffness: 400, damping: 25 },
          scale: { duration: 0.3, ease: 'easeOut' },
          rotate: { duration: 0.3, ease: 'easeOut' },
        }}
        className="absolute bottom-1/2 z-20 w-14 h-14 flex items-center justify-center voxel-shadow"
      >
        <div className="relative w-full h-full flex flex-col items-center pt-2">
          {/* Voxel-style Chicken */}
          <div className="w-10 h-10 bg-white border-r-4 border-b-4 border-black/10 rounded-sm" />
          <div className="absolute top-0 w-6 h-3 bg-red-500 rounded-t-lg mx-auto" />
          <div className="absolute top-1/2 -right-1 w-3 h-2 bg-yellow-500 rounded-sm" />
        </div>
      </motion.div>

      {/* Explosion effect if hit */}
      {isGameOver && (
        <motion.div 
           initial={{ scale: 0, opacity: 0 }}
           animate={{ scale: 4, opacity: 1 }}
           className="absolute z-30"
           style={{ 
             left: `${12 + (player.lane - 1) * (80 / lanes) + (80 / lanes) / 2}%`,
             top: '50%'
           }}
        >
          <div className="text-4xl">💥</div>
        </motion.div>
      )}
    </div>
  );
}
