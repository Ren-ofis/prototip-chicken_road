import { Difficulty } from './types.ts';

// Base multipliers for EASY difficulty
const BASE_MULTIPLIERS = [1.01, 1.03, 1.10, 1.15, 1.19, 1.24, 1.45, 1.80, 2.50, 5.00];

// Difficulty-based multiplier multipliers
const DIFFICULTY_MULTIPLIER = {
  [Difficulty.EASY]: 1.0,
  [Difficulty.MEDIUM]: 1.5,
  [Difficulty.HARD]: 2.2,
  [Difficulty.HARDCORE]: 3.5,
};

// Get multipliers based on difficulty
export function getMultipliersByDifficulty(difficulty: Difficulty): number[] {
  const multiplier = DIFFICULTY_MULTIPLIER[difficulty];
  return BASE_MULTIPLIERS.map(m => {
    const adjusted = m * multiplier;
    // Round to 2 decimal places
    return Math.round(adjusted * 100) / 100;
  });
}

export const MULTIPLIERS = BASE_MULTIPLIERS;

export const DIFFICULTY_CONFIG = {
   // lower is more frequent

  [Difficulty.EASY]: {
    spawnRate: 1.5,
    baseSpeed: 0.2,
    carDensity: 2,
  },
  [Difficulty.MEDIUM]: {
    spawnRate: 1.0,
    baseSpeed: 0.3,
    carDensity: 3,
  },
  [Difficulty.HARD]: {
    spawnRate: 0.5,
    baseSpeed: 0.4,
    carDensity: 4,
  },
  [Difficulty.HARDCORE]: {
    spawnRate: 0.3,
    baseSpeed: 0.9,
    carDensity: 5,
  },
};

export const LANES_COUNT = MULTIPLIERS.length;
export const LANE_WIDTH = 100 / (LANES_COUNT + 1); // +1 for the starting area
