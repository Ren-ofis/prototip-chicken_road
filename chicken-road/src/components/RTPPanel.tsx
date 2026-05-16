import { useState } from 'react';
import { Difficulty } from '../types.ts';
import { SessionStats, TARGET_RTP, actualRTP, crashLaneDistribution } from '../rtp.ts';
import { getMultipliersByDifficulty } from '../constants.ts';

interface RTPPanelProps {
  stats: SessionStats;
  difficulty: Difficulty;
  currentBet: number;
  onReset: () => void;
  onSimulate: (rounds: number) => void;
}

export default function RTPPanel({ stats, difficulty, currentBet, onReset, onSimulate }: RTPPanelProps) {
  const [customRounds, setCustomRounds] = useState('');
  const parsedCustom = parseInt(customRounds, 10);
  const customValid = Number.isFinite(parsedCustom) && parsedCustom >= 1 && parsedCustom <= 10_000_000;
  const runCustom = () => {
    if (!customValid) return;
    onSimulate(parsedCustom);
  };

  const actual = actualRTP(stats);
  const deltaPct = stats.roundsPlayed > 0 ? (actual - TARGET_RTP) * 100 : 0;
  const multipliers = getMultipliersByDifficulty(difficulty);
  const dist = crashLaneDistribution(difficulty);
  const observedTotal = stats.crashLaneCounts.reduce((a, b) => a + b, 0) + stats.survivedCount;
  const maxObservedFreq = Math.max(
    ...stats.crashLaneCounts,
    stats.survivedCount,
    1,
  );

  const actualColor =
    stats.roundsPlayed === 0
      ? 'text-white/40'
      : Math.abs(deltaPct) < 1
        ? 'text-emerald-400'
        : Math.abs(deltaPct) < 3
          ? 'text-yellow-400'
          : 'text-red-400';

  return (
    <div className="fixed top-32 right-6 z-30 w-80 bg-black/60 backdrop-blur-2xl rounded-2xl border border-white/10 voxel-shadow p-5 text-white pointer-events-auto">
      <div className="flex items-center justify-between mb-1">
        <h2 className="text-[10px] uppercase tracking-[0.3em] font-black text-white/40">RTP Monitor</h2>
        <button
          onClick={onReset}
          className="text-[9px] uppercase tracking-widest font-black text-white/30 hover:text-white/60 transition-colors"
        >
          Reset
        </button>
      </div>
      <div className="mb-4 text-[9px] uppercase tracking-[0.25em] font-black text-red-400/70">
        Difficulty · <span className="text-white/80">{difficulty}</span>
      </div>

      <div className="grid grid-cols-2 gap-3 mb-4">
        <Stat label="Actual RTP" value={stats.roundsPlayed === 0 ? '—' : `${(actual * 100).toFixed(2)}%`} valueClass={actualColor} />
        <Stat label="Target RTP" value={`${(TARGET_RTP * 100).toFixed(2)}%`} valueClass="text-white/70" />
        <Stat label="Delta" value={stats.roundsPlayed === 0 ? '—' : `${deltaPct >= 0 ? '+' : ''}${deltaPct.toFixed(2)}%`} valueClass={actualColor} />
        <Stat label="Rounds" value={stats.roundsPlayed.toLocaleString()} valueClass="text-white/70" />
        <Stat label="Wagered" value={`${stats.totalWagered.toLocaleString()}$`} valueClass="text-white/70" />
        <Stat label="Returned" value={`${stats.totalReturned.toLocaleString()}$`} valueClass="text-white/70" />
      </div>

      <div className="mb-2 text-[9px] uppercase tracking-[0.25em] font-black text-white/30">
        Crash distribution
      </div>
      <div className="space-y-1">
        {multipliers.map((_, i) => {
          const observed = stats.crashLaneCounts[i] ?? 0;
          const observedPct = observedTotal > 0 ? (observed / observedTotal) * 100 : 0;
          const expectedPct = (dist.crashAt[i] ?? 0) * 100;
          const barWidth = (observed / maxObservedFreq) * 100;
          return (
            <div key={i} className="flex items-center gap-2 text-[10px] font-mono">
              <span className="text-white/40 w-6 text-right">L{i + 1}</span>
              <div className="flex-1 h-2 bg-white/5 rounded-sm overflow-hidden">
                <div className="h-full bg-red-500/60 rounded-sm" style={{ width: `${barWidth}%` }} />
              </div>
              <span className="text-white/50 w-10 text-right">{observedPct.toFixed(1)}%</span>
              <span className="text-white/20 w-10 text-right">{expectedPct.toFixed(1)}%</span>
            </div>
          );
        })}
        <div className="flex items-center gap-2 text-[10px] font-mono pt-1 border-t border-white/5 mt-2">
          <span className="text-white/40 w-6 text-right">Win</span>
          <div className="flex-1 h-2 bg-white/5 rounded-sm overflow-hidden">
            <div
              className="h-full bg-emerald-500/60 rounded-sm"
              style={{ width: `${(stats.survivedCount / maxObservedFreq) * 100}%` }}
            />
          </div>
          <span className="text-white/50 w-10 text-right">
            {observedTotal > 0 ? ((stats.survivedCount / observedTotal) * 100).toFixed(1) : '0.0'}%
          </span>
          <span className="text-white/20 w-10 text-right">{(dist.survival * 100).toFixed(1)}%</span>
        </div>
      </div>

      <div className="flex items-center gap-3 text-[8px] uppercase tracking-widest font-black text-white/20 pt-3 mt-3 border-t border-white/5">
        <span><span className="text-white/40">obs</span> · observed</span>
        <span><span className="text-white/40">exp</span> · expected</span>
      </div>

      <div className="mt-4 pt-3 border-t border-white/10">
        <div className="text-[9px] uppercase tracking-[0.25em] font-black text-white/30 mb-2">
          Convergence test
        </div>
        <div className="text-[10px] text-white/40 mb-3 leading-snug">
          Simulate mixed-strategy rounds at current bet ({currentBet.toLocaleString()}$) on <span className="text-white/70 font-black">{difficulty}</span> difficulty to watch Actual RTP converge toward target.
        </div>
        <div className="grid grid-cols-3 gap-2">
          {[1000, 10000, 100000].map((n) => (
            <button
              key={n}
              onClick={() => onSimulate(n)}
              className="py-2 rounded-lg bg-white/5 hover:bg-white/15 border border-white/10 text-[10px] uppercase tracking-wider font-black text-white/70 hover:text-white transition-colors"
            >
              {n >= 1000 ? `${n / 1000}k` : n}
            </button>
          ))}
        </div>

        <div className="flex gap-2 mt-2">
          <input
            type="number"
            inputMode="numeric"
            min={1}
            max={10000000}
            value={customRounds}
            onChange={(e) => setCustomRounds(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') runCustom();
            }}
            placeholder="Custom rounds"
            className="flex-1 min-w-0 bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-[11px] font-mono font-black text-white placeholder:text-white/30 outline-none focus:border-white/30"
          />
          <button
            onClick={runCustom}
            disabled={!customValid}
            className="px-4 py-2 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/40 border border-emerald-500/40 disabled:opacity-30 disabled:hover:bg-emerald-500/20 text-[10px] uppercase tracking-wider font-black text-emerald-200 transition-colors"
          >
            Run
          </button>
        </div>
      </div>
    </div>
  );
}

function Stat({ label, value, valueClass }: { label: string; value: string; valueClass: string }) {
  return (
    <div className="flex flex-col">
      <span className="text-[8px] uppercase tracking-[0.2em] font-black text-white/30">{label}</span>
      <span className={`text-lg font-black tracking-tight ${valueClass}`}>{value}</span>
    </div>
  );
}
