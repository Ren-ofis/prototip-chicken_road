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
  moveDelay: number;
  scrollX: number;
  scrollAnimated: boolean;
}

const LANE_W = 8;
const ROAD_START = 18;
const RIGHT_SIDEWALK_W = 30;
const ROAD_W = (lanes: number) => lanes * LANE_W;
const RIGHT_SIDEWALK_LEFT = (lanes: number) => ROAD_START + ROAD_W(lanes);
const laneCenter = (lane: number) => ROAD_START + (lane - 1) * LANE_W + LANE_W / 2;

export default function GameBoard({
  player,
  cars,
  isGameOver,
  lanes,
  barriers,
  difficulty,
  moveDelay,
  scrollX,
  scrollAnimated,
}: GameBoardProps) {
  const multipliers = getMultipliersByDifficulty(difficulty);
  const roadWidth = ROAD_W(lanes);
  const rightSidewalkLeft = RIGHT_SIDEWALK_LEFT(lanes);

  return (
    <div className="relative w-full h-[600px] overflow-hidden bg-[#0A0A0A] select-none perspective-1000">
      <div className="absolute inset-0 scale-[1.12] origin-center" style={{ clipPath: 'inset(25% 0)' }}>
        <div
          className="absolute inset-0"
          style={{
            transform: `translateX(${scrollX}%)`,
            transition: scrollAnimated ? 'transform 0.4s ease-out' : 'none',
            willChange: 'transform',
          }}
        >
          {/* Left sidewalk */}
          <div className="absolute left-0 top-0 bottom-0 bg-[#2d5a27] border-r-8 border-black/20 flex flex-col justify-around px-2 py-8 overflow-hidden z-0" style={{ width: `${ROAD_START}%` }}>
            {[...Array(12)].map((_, i) => (
              <div key={i} className="flex gap-1">
                <div className="w-full h-8 bg-[#143d14] rounded-sm border-r-4 border-b-4 border-black/20 opacity-60" />
                <div className="w-4 h-full bg-black/10 blur-sm" />
              </div>
            ))}
          </div>

          {/* Right sidewalk (end of road) */}
          <div className="absolute top-0 bottom-0 bg-[#2d5a27] border-l-8 border-black/20 flex flex-col justify-around px-2 py-8 overflow-hidden z-0" style={{ left: `${rightSidewalkLeft}%`, width: `${RIGHT_SIDEWALK_W}%` }}>
            {[...Array(12)].map((_, i) => (
              <div key={i} className="flex gap-1">
                <div className="w-full h-8 bg-[#143d14] rounded-sm border-r-4 border-b-4 border-black/20 opacity-60" />
                <div className="w-4 h-full bg-black/10 blur-sm" />
              </div>
            ))}
          </div>

          {/* Road lanes */}
          <div className="absolute top-0 bottom-0 flex z-0 road-stripe" style={{ left: `${ROAD_START}%`, width: `${roadWidth}%` }}>
            {multipliers.map((mult, i) => (
              <div
                key={i}
                className={`flex-1 border-r border-white/5 flex justify-center items-center relative ${
                  i === player.lane - 1 ? 'bg-white/5 shadow-[inset_0_0_50px_rgba(255,255,255,0.05)]' : ''
                }`}
              >
                {barriers.has(i + 1) && (
                  <motion.div
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: moveDelay + 0.2 }}
                    className="absolute top-[32%] left-1/2 -translate-x-1/2 z-20"
                  >
                    <div className="flex flex-col items-center">
                      <div className="w-8 h-4 bg-orange-600 rounded-sm border-b-4 border-black/20 voxel-shadow" />
                      <div className="w-10 h-2 bg-orange-600 rounded-sm shadow-lg" />
                    </div>
                  </motion.div>
                )}

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
                left: `${laneCenter(car.lane)}%`,
                transform: 'translate(-50%, -50%)',
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
                  <div className="w-[80%] h-[25%] bg-white/20 rounded-sm mt-1" />
                  <div className="absolute bottom-1 w-[70%] h-[15%] bg-black/10 rounded-sm" />
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
              left: player.lane === 0 ? '6%' : `${laneCenter(player.lane)}%`,
              scale: isGameOver ? [1, 1.5, 0] : 1,
              rotate: isGameOver ? [0, 180, 360] : 0,
              x: '-50%',
              y: '50%',
            }}
            transition={{
              left: { type: 'spring', stiffness: 400, damping: 25, delay: moveDelay },
              scale: { duration: 0.3, ease: 'easeOut' },
              rotate: { duration: 0.3, ease: 'easeOut' },
            }}
            className="absolute bottom-1/2 z-20 w-14 h-14 flex items-center justify-center voxel-shadow"
          >
            <div className="relative w-full h-full flex flex-col items-center pt-2">
              <div className="w-10 h-10 bg-white border-r-4 border-b-4 border-black/10 rounded-sm" />
              <div className="absolute top-0 w-6 h-3 bg-red-500 rounded-t-lg mx-auto" />
              <div className="absolute top-1/2 -right-1 w-3 h-2 bg-yellow-500 rounded-sm" />
            </div>
          </motion.div>

          {isGameOver && (
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 4, opacity: 1 }}
              className="absolute z-30"
              style={{
                left: `${laneCenter(player.lane)}%`,
                top: '50%',
              }}
            >
              <div className="text-4xl">💥</div>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}
