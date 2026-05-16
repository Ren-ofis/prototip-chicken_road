import { useEffect, useRef, useState } from 'react';
import { Difficulty } from '../types.ts';

interface ControlsProps {
  bet: number;
  coinMultiplier: number;
  setCoinMultiplier: (n: number) => void;
  coinValue: number;
  setCoinValue: (v: number) => void;
  coinMultiplierOptions: number[];
  coinValueOptions: number[];
  minBet: number;
  maxBet: number;
  onMinBet: () => void;
  onMaxBet: () => void;
  difficulty: Difficulty;
  setDifficulty: (difficulty: Difficulty) => void;
  onPlay: () => void;
  onCashout: () => void;
  gameState: 'IDLE' | 'PLAYING' | 'GAMEOVER' | 'WON';
  currentMultiplier: number;
}

function cyclePrev(v: number, list: number[]): number {
  const i = list.indexOf(v);
  if (i === -1) return list[0];
  return list[Math.max(i - 1, 0)];
}

function cycleNext(v: number, list: number[]): number {
  const i = list.indexOf(v);
  if (i === -1) return list[0];
  return list[Math.min(i + 1, list.length - 1)];
}

const fmtMoney = (v: number) => `€${v.toFixed(2)}`;

export default function Controls({
  bet,
  coinMultiplier,
  setCoinMultiplier,
  coinValue,
  setCoinValue,
  coinMultiplierOptions,
  coinValueOptions,
  minBet,
  maxBet,
  onMinBet,
  onMaxBet,
  difficulty,
  setDifficulty,
  onPlay,
  onCashout,
  gameState,
  currentMultiplier,
}: ControlsProps) {
  const isPlaying = gameState === 'PLAYING';
  const lockEdit = isPlaying;

  const [isBetPanelOpen, setIsBetPanelOpen] = useState(false);
  const betPanelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isBetPanelOpen) return;
    const handler = (e: PointerEvent) => {
      if (!betPanelRef.current) return;
      if (!betPanelRef.current.contains(e.target as Node)) {
        setIsBetPanelOpen(false);
      }
    };
    document.addEventListener('pointerdown', handler);
    return () => document.removeEventListener('pointerdown', handler);
  }, [isBetPanelOpen]);

  useEffect(() => {
    if (isPlaying) setIsBetPanelOpen(false);
  }, [isPlaying]);

  // Bound-checked steps. round2 avoids floating-point edge cases where
  // 12 * 0.01 would compare as 0.12000000000000001 or similar.
  const round2 = (v: number) => Math.round(v * 100) / 100;
  const wouldFit = (mult: number, val: number) => {
    const b = round2(mult * val);
    return b >= minBet && b <= maxBet;
  };

  const nextMult = cycleNext(coinMultiplier, coinMultiplierOptions);
  const prevMult = cyclePrev(coinMultiplier, coinMultiplierOptions);
  const nextVal = cycleNext(coinValue, coinValueOptions);
  const prevVal = cyclePrev(coinValue, coinValueOptions);

  const canIncMult = nextMult !== coinMultiplier && wouldFit(nextMult, coinValue);
  const canDecMult = prevMult !== coinMultiplier && wouldFit(prevMult, coinValue);
  const canIncVal = nextVal !== coinValue && wouldFit(coinMultiplier, nextVal);
  const canDecVal = prevVal !== coinValue && wouldFit(coinMultiplier, prevVal);

  const handleIncMult = () => { if (canIncMult) setCoinMultiplier(nextMult); };
  const handleDecMult = () => { if (canDecMult) setCoinMultiplier(prevMult); };
  const handleIncVal = () => { if (canIncVal) setCoinValue(nextVal); };
  const handleDecVal = () => { if (canDecVal) setCoinValue(prevVal); };

  return (
    <div className="fixed bottom-12 left-1/2 -translate-x-1/2 p-4 w-full max-w-4xl z-50">
      <div className="flex flex-col md:flex-row items-center gap-6 bg-black/40 backdrop-blur-3xl p-6 rounded-[32px] border border-white/10 voxel-shadow">

        {/* Bet Money button + popup overlay */}
        <div ref={betPanelRef} className="relative flex flex-col gap-2 w-full md:w-auto">
          <label className="text-[10px] uppercase font-black text-white/30 tracking-[0.2em] ml-1">Bet Money</label>
          <button
            onClick={() => setIsBetPanelOpen((v) => !v)}
            disabled={lockEdit}
            className={`flex items-center gap-2 bg-white/5 p-2 rounded-2xl border min-w-[140px] transition-colors ${
              isBetPanelOpen ? 'border-emerald-500/60' : 'border-white/5 hover:border-white/15'
            } disabled:opacity-60 disabled:cursor-not-allowed`}
          >
            <div className="w-full text-center text-white font-black text-xl glow-text font-mono tracking-tight px-2 py-1">
              {fmtMoney(bet)}
            </div>
          </button>

          {isBetPanelOpen && (
            <div className="absolute bottom-full left-0 mb-3 w-72 bg-black/85 backdrop-blur-3xl p-5 rounded-2xl border border-white/15 voxel-shadow flex flex-col gap-3 z-50">
              <div className="text-[10px] uppercase tracking-[0.3em] font-black text-white/40 text-center">Bet Configuration</div>
              <BetSegment
                label="Coin Multiplier"
                value={coinMultiplier.toString()}
                onMinus={handleDecMult}
                onPlus={handleIncMult}
                disabledMinus={lockEdit || !canDecMult}
                disabledPlus={lockEdit || !canIncMult}
              />
              <BetSegment
                label="Coin Value"
                value={fmtMoney(coinValue)}
                onMinus={handleDecVal}
                onPlus={handleIncVal}
                disabledMinus={lockEdit || !canDecVal}
                disabledPlus={lockEdit || !canIncVal}
              />
              <BetSegment
                label="Total Bet"
                value={fmtMoney(bet)}
                onMinus={handleDecMult}
                onPlus={handleIncMult}
                disabledMinus={lockEdit || !canDecMult}
                disabledPlus={lockEdit || !canIncMult}
              />

              <div className="grid grid-cols-2 gap-2 pt-1">
                <button
                  onClick={onMinBet}
                  disabled={lockEdit}
                  className="py-2 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 disabled:opacity-50 disabled:cursor-not-allowed text-[10px] uppercase tracking-widest font-black text-white/70 hover:text-white transition-colors"
                >
                  Min Bet
                </button>
                <button
                  onClick={onMaxBet}
                  disabled={lockEdit}
                  className="py-2 rounded-xl border border-emerald-500/40 bg-emerald-500/10 hover:bg-emerald-500/20 disabled:opacity-50 disabled:cursor-not-allowed text-[10px] uppercase tracking-widest font-black text-emerald-300 hover:text-emerald-100 transition-colors"
                >
                  Max Bet
                </button>
              </div>
            </div>
          )}
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
                  className={`flex flex-col items-center py-2 px-1 rounded-xl transition-all border disabled:cursor-not-allowed disabled:opacity-50 ${
                    difficulty === d
                      ? 'bg-white/10 border-white/20 text-white shadow-inner disabled:shadow-none'
                      : 'border-transparent text-white/20 hover:text-white/40 disabled:hover:text-white/20'
                  }`}
                >
                  <span className="text-[10px] font-black uppercase tracking-tighter">{d}</span>
                  {difficulty === d && <span className="text-[9px] text-red-500 font-bold mt-0.5">{p}</span>}
                </button>
              ))}
            </div>
          </div>

          {/* Action button */}
          {isPlaying ? (
            <button
              onClick={onCashout}
              disabled={!isPlaying}
              className="w-full md:w-64 h-20 bg-yellow-400 hover:bg-yellow-300 disabled:bg-yellow-400/50 disabled:cursor-not-allowed text-black font-black text-2xl rounded-2xl transition-all active:scale-95 flex flex-col items-center justify-center shadow-[0_0_30px_rgba(250,204,21,0.3)] voxel-shadow group disabled:shadow-none"
            >
              <span className="tracking-tighter">CASHOUT</span>
              <span className="text-sm opacity-50 font-mono tracking-normal">€{(bet * currentMultiplier).toFixed(2)}</span>
            </button>
          ) : (
            <button
              onClick={onPlay}
              disabled={isPlaying}
              className="w-full md:w-64 h-20 bg-[#38D361] hover:bg-[#45E872] disabled:bg-[#38D361]/50 disabled:cursor-not-allowed text-black font-black text-2xl rounded-2xl transition-all active:scale-95 shadow-[0_0_30px_rgba(56,211,97,0.3)] voxel-shadow tracking-tighter disabled:shadow-none"
            >
              PLAY ROUND
            </button>
          )}
      </div>
    </div>
  );
}

interface BetSegmentProps {
  label: string;
  value: string;
  onMinus: () => void;
  onPlus: () => void;
  disabledMinus: boolean;
  disabledPlus: boolean;
}

function BetSegment({ label, value, onMinus, onPlus, disabledMinus, disabledPlus }: BetSegmentProps) {
  return (
    <div className="flex flex-col items-center gap-1.5">
      <label className="text-[9px] uppercase font-black text-white/30 tracking-[0.2em] text-center">{label}</label>
      <div className="flex items-center justify-between gap-2 bg-white/5 p-1.5 rounded-xl border border-white/5 w-full">
        <button
          onClick={onMinus}
          disabled={disabledMinus}
          className="w-8 h-8 shrink-0 rounded-full bg-white/10 hover:bg-white/20 disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center text-white font-black text-lg transition-colors"
        >
          −
        </button>
        <div className="flex-1 text-center text-white font-black text-base font-mono tracking-tight">
          {value}
        </div>
        <button
          onClick={onPlus}
          disabled={disabledPlus}
          className="w-8 h-8 shrink-0 rounded-full bg-emerald-500 hover:bg-emerald-400 disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center text-white font-black text-lg transition-colors"
        >
          +
        </button>
      </div>
    </div>
  );
}
