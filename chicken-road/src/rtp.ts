import { Difficulty } from './types.ts';
import { getMultipliersByDifficulty } from './constants.ts';

// The invariant this module enforces:
//   P(reach lane N) * multiplier[N] = TARGET_RTP, for every lane N.
// This makes the expected return equal TARGET_RTP * bet under any cashout
// strategy, so the house edge cannot be beaten by lane selection.
export const TARGET_RTP = 0.95;

export function reachProbabilities(difficulty: Difficulty): number[] {
  const multipliers = getMultipliersByDifficulty(difficulty);
  return multipliers.map((m) => Math.min(1, TARGET_RTP / m));
}

export interface CrashDistribution {
  crashAt: number[];
  survival: number;
}

export function crashLaneDistribution(difficulty: Difficulty): CrashDistribution {
  const reach = reachProbabilities(difficulty);
  const crashAt: number[] = [];
  let prev = 1.0;
  for (const p of reach) {
    crashAt.push(Math.max(0, prev - p));
    prev = p;
  }
  return { crashAt, survival: prev };
}

export function rollCrashLane(difficulty: Difficulty): number | null {
  const { crashAt } = crashLaneDistribution(difficulty);
  const r = Math.random();
  let cumulative = 0;
  for (let i = 0; i < crashAt.length; i++) {
    cumulative += crashAt[i];
    if (r < cumulative) return i + 1;
  }
  return null;
}

export interface SessionStats {
  totalWagered: number;
  totalReturned: number;
  roundsPlayed: number;
  crashLaneCounts: number[];
  survivedCount: number;
}

export function emptyStats(laneCount: number): SessionStats {
  return {
    totalWagered: 0,
    totalReturned: 0,
    roundsPlayed: 0,
    crashLaneCounts: new Array(laneCount).fill(0),
    survivedCount: 0,
  };
}

export function recordRound(
  stats: SessionStats,
  bet: number,
  returned: number,
  crashLane: number | null,
): SessionStats {
  const crashLaneCounts = [...stats.crashLaneCounts];
  let survivedCount = stats.survivedCount;
  if (crashLane === null) {
    survivedCount++;
  } else if (crashLane >= 1 && crashLane <= crashLaneCounts.length) {
    crashLaneCounts[crashLane - 1]++;
  }
  return {
    totalWagered: stats.totalWagered + bet,
    totalReturned: stats.totalReturned + returned,
    roundsPlayed: stats.roundsPlayed + 1,
    crashLaneCounts,
    survivedCount,
  };
}

export function actualRTP(stats: SessionStats): number {
  if (stats.totalWagered === 0) return 0;
  return stats.totalReturned / stats.totalWagered;
}

export function mergeStats(a: SessionStats, b: SessionStats): SessionStats {
  const length = Math.max(a.crashLaneCounts.length, b.crashLaneCounts.length);
  const crashLaneCounts = new Array(length).fill(0).map(
    (_, i) => (a.crashLaneCounts[i] ?? 0) + (b.crashLaneCounts[i] ?? 0),
  );
  return {
    totalWagered: a.totalWagered + b.totalWagered,
    totalReturned: a.totalReturned + b.totalReturned,
    roundsPlayed: a.roundsPlayed + b.roundsPlayed,
    crashLaneCounts,
    survivedCount: a.survivedCount + b.survivedCount,
  };
}

// Simulate `rounds` rounds where the player always cashes out at `cashoutLane`.
// Used by the verification UI to demonstrate RTP convergence.
export function simulateFixedStrategy(
  difficulty: Difficulty,
  rounds: number,
  cashoutLane: number,
  bet: number,
): SessionStats {
  const multipliers = getMultipliersByDifficulty(difficulty);
  let stats = emptyStats(multipliers.length);
  for (let i = 0; i < rounds; i++) {
    const crashLane = rollCrashLane(difficulty);
    const survivedCashout = crashLane === null || crashLane > cashoutLane;
    const returned = survivedCashout ? bet * multipliers[cashoutLane - 1] : 0;
    stats = recordRound(stats, bet, returned, survivedCashout ? null : crashLane);
  }
  return stats;
}

// Simulate `rounds` with a uniformly random cashout lane per round. This shows
// that RTP holds regardless of strategy mix.
export function simulateMixedStrategy(
  difficulty: Difficulty,
  rounds: number,
  bet: number,
): SessionStats {
  const multipliers = getMultipliersByDifficulty(difficulty);
  let stats = emptyStats(multipliers.length);
  for (let i = 0; i < rounds; i++) {
    const cashoutLane = 1 + Math.floor(Math.random() * multipliers.length);
    const crashLane = rollCrashLane(difficulty);
    const survivedCashout = crashLane === null || crashLane > cashoutLane;
    const returned = survivedCashout ? bet * multipliers[cashoutLane - 1] : 0;
    stats = recordRound(stats, bet, returned, survivedCashout ? null : crashLane);
  }
  return stats;
}
