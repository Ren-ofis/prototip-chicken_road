import { Difficulty } from './types.ts';

// Base multipliers (EASY scaling). Strictly increasing so RTP math
// (P(reach lane N) = TARGET_RTP / multiplier[N]) yields valid decreasing
// reach-probability sequences. Sized to the largest difficulty's lane count
// (EASY = 30); other difficulties slice the prefix.
const BASE_MULTIPLIERS = [
  1.01, 1.03, 1.10, 1.15, 1.19, 1.24, 1.45, 1.80, 2.50, 5.00,
  6.00, 7.20, 8.60, 10.30, 12.40, 14.90, 17.90, 21.50, 25.80, 31.00,
  37.20, 44.60, 53.50, 64.20, 77.00, 92.40, 110.90, 133.10, 159.70, 191.60,
];

const DIFFICULTY_MULTIPLIER = {
  [Difficulty.EASY]: 1.0,
  [Difficulty.MEDIUM]: 1.5,
  [Difficulty.HARD]: 2.2,
  [Difficulty.HARDCORE]: 3.5,
};

const DIFFICULTY_LANES = {
  [Difficulty.EASY]: 30,
  [Difficulty.MEDIUM]: 25,
  [Difficulty.HARD]: 22,
  [Difficulty.HARDCORE]: 18,
};

export function getMultipliersByDifficulty(difficulty: Difficulty): number[] {
  const scale = DIFFICULTY_MULTIPLIER[difficulty];
  const count = DIFFICULTY_LANES[difficulty];
  return BASE_MULTIPLIERS.slice(0, count).map((m) => Math.round(m * scale * 100) / 100);
}

export function getLanesCount(difficulty: Difficulty): number {
  return DIFFICULTY_LANES[difficulty];
}

// Largest lane count across all difficulties — used for sizing the persistent
// crash-distribution stats array so it can hold any difficulty's outcomes.
export const MAX_LANES = Math.max(...Object.values(DIFFICULTY_LANES));

export const DIFFICULTY_CONFIG = {
  [Difficulty.EASY]: {
    spawnRate: 0.8,
    baseSpeed: 0.35,
    carDensity: 2,
  },
  [Difficulty.MEDIUM]: {
    spawnRate: 0.5,
    baseSpeed: 0.55,
    carDensity: 3,
  },
  [Difficulty.HARD]: {
    spawnRate: 0.3,
    baseSpeed: 0.85,
    carDensity: 4,
  },
  [Difficulty.HARDCORE]: {
    spawnRate: 0.15,
    baseSpeed: 1.3,
    carDensity: 5,
  },
};
