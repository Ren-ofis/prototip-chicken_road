export enum Difficulty {
  EASY = 'Easy',
  MEDIUM = 'Medium',
  HARD = 'Hard',
  HARDCORE = 'Hardcore',
}

export enum GameStatus {
  IDLE = 'IDLE',
  PLAYING = 'PLAYING',
  GAMEOVER = 'GAMEOVER',
  WON = 'WON',
}

export interface Car {
  id: number;
  lane: number;
  y: number; // Percent from top (0-100)
  speed: number;
  color: string;
  direction: 'up' | 'down';
  isExploded?: boolean;
}

export interface Player {
  lane: number; // 0 is starting sidewalk, 1-7 are lanes, 8 is finish? 
  // Based on the image, there are about 7 lanes with multipliers.
  multiplier: number;
}
