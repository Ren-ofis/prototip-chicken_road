import { Difficulty } from './types.ts';

export const MULTIPLIERS = [1.01, 1.03, 1.10, 1.15, 1.19, 1.24, 1.45, 1.80, 2.50, 5.00];

export const DIFFICULTY_CONFIG = {
  [Difficulty.EASY]: {
    spawnRate: 1.5, // lower is more frequent
    baseSpeed: 0.2,
    carDensity: 2,
  },
  [Difficulty.MEDIUM]: {
    spawnRate: 1.0,
    baseSpeed: 0.4,
    carDensity: 3,
  },
  [Difficulty.HARD]: {
    spawnRate: 0.6,
    baseSpeed: 0.6,
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
