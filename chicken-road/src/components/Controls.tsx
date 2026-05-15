import { Difficulty } from '../types.ts';

interface ControlsProps {
  bet: number;
  setBet: (bet: number) => void;
  difficulty: Difficulty;
  setDifficulty: (difficulty: Difficulty) => void;
  onPlay: () => void;
  onCashout: () => void;
  gameState: 'IDLE' | 'PLAYING' | 'GAMEOVER' | 'WON';
  currentMultiplier: number;
}

export default function Controls({
  bet,
  setBet,
  difficulty,
  setDifficulty,
  onPlay,
  onCashout,
  gameState,
  currentMultiplier,
}: ControlsProps) {
  const isPlaying = gameState === 'PLAYING';

  return (
    <div className="fixed bottom-12 left-1/2 -translate-x-1/2 p-4 w-full max-w-4xl z-50">
      <div className="flex flex-col md:flex-row items-center gap-6 bg-black/40 backdrop-blur-3xl p-8 rounded-[32px] border border-white/10 voxel-shadow">
        
        {/* Bet Input */}
        <div className="flex flex-col gap-2 w-full md:w-auto">
          <label className="text-[10px] uppercase font-black text-white/30 tracking-[0.2em] ml-1">Wager</label>
          <div className="flex items-center gap-4 bg-white/5 p-2 rounded-2xl border border-white/5">
             <button 
              onClick={() => setBet(Math.max(1, bet - 10))}
              className="px-4 py-2 flex items-center justify-center rounded-xl hover:bg-white/10 text-[10px] uppercase font-black text-white/40 hover:text-white transition-colors whitespace-nowrap"
             >bet less</button>
             <input 
              type="number" 
              value={bet}
              onChange={(e) => setBet(Number(e.target.value))}
              disabled={isPlaying}
              className="w-20 text-center bg-transparent text-white font-black text-xl outline-none glow-text px-2"
             />
             <button 
              onClick={() => setBet(bet + 10)}
              className="px-4 py-2 flex items-center justify-center rounded-xl hover:bg-white/10 text-[10px] uppercase font-black text-white/40 hover:text-white transition-colors whitespace-nowrap"
             >bet more</button>
          </div>
        </div>

        {/* Difficulty */}
        <div className="flex flex-col gap-2 w-full md:flex-1">
          <div className="flex justify-between items-end px-1">
            <label className="text-[10px] uppercase font-black text-white/30 tracking-[0.2em]">Risk Level</label>
            <span className="text-[10px] uppercase font-black text-red-500/50 tracking-widest italic">Collision Chance</span>
          </div>
          <div className="grid grid-cols-4 gap-2 p-2 bg-white/5 rounded-2xl border border-white/5">
            {[
              { d: Difficulty.EASY, p: '2%' },
              { d: Difficulty.MEDIUM, p: '5%' },
              { d: Difficulty.HARD, p: '12%' },
              { d: Difficulty.HARDCORE, p: '25%' },
            ].map(({ d, p }) => (
              <button 
                key={d}
                onClick={() => setDifficulty(d)}
                disabled={isPlaying}
                className={`flex flex-col items-center py-2 px-1 rounded-xl transition-all border ${
                  difficulty === d 
                    ? 'bg-white/10 border-white/20 text-white shadow-inner' 
                    : 'border-transparent text-white/20 hover:text-white/40'
                }`}
              >
                <span className="text-[10px] font-black uppercase tracking-tighter">{d}</span>
                {difficulty === d && <span className="text-[9px] text-red-500 font-bold mt-0.5">{p}</span>}
              </button>
            ))}
          </div>
        </div>

        {/* Action Button */}
        {isPlaying ? (
          <button 
            onClick={onCashout}
            className="w-full md:w-64 h-20 bg-yellow-400 hover:bg-yellow-300 text-black font-black text-2xl rounded-2xl transition-all active:scale-95 flex flex-col items-center justify-center shadow-[0_0_30px_rgba(250,204,21,0.3)] voxel-shadow group"
          >
            <span className="tracking-tighter">CASHOUT</span>
            <span className="text-sm opacity-50 font-mono tracking-normal">{(bet * currentMultiplier).toFixed(2)}$</span>
          </button>
        ) : (
          <button 
            onClick={onPlay}
            className="w-full md:w-64 h-20 bg-[#38D361] hover:bg-[#45E872] text-black font-black text-2xl rounded-2xl transition-all active:scale-95 shadow-[0_0_30px_rgba(56,211,97,0.3)] voxel-shadow tracking-tighter"
          >
            PLAY ROUND
          </button>
        )}
      </div>
    </div>
  );
}
