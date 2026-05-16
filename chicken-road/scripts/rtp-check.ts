import { Difficulty } from '../src/types.ts';
import { simulateFixedStrategy, simulateMixedStrategy, actualRTP, reachProbabilities, crashLaneDistribution } from '../src/rtp.ts';

const ROUNDS = 100000;
const BET = 100;

console.log('=== Reach probabilities (EASY) ===');
console.log(reachProbabilities(Difficulty.EASY).map((p) => p.toFixed(4)));

console.log('\n=== Crash distribution (EASY) ===');
const dist = crashLaneDistribution(Difficulty.EASY);
console.log('crashAt:', dist.crashAt.map((p) => p.toFixed(4)));
console.log('survival:', dist.survival.toFixed(4));
const sum = dist.crashAt.reduce((a, b) => a + b, 0) + dist.survival;
console.log('sum check (should be 1.0):', sum.toFixed(6));

for (const diff of [Difficulty.EASY, Difficulty.MEDIUM, Difficulty.HARD, Difficulty.HARDCORE]) {
  console.log(`\n=== ${diff} difficulty ===`);
  for (const cashoutLane of [1, 3, 5, 7, 10]) {
    const stats = simulateFixedStrategy(diff, ROUNDS, cashoutLane, BET);
    console.log(`  Cashout at lane ${cashoutLane}: RTP = ${(actualRTP(stats) * 100).toFixed(2)}%`);
  }
  const mixed = simulateMixedStrategy(diff, ROUNDS, BET);
  console.log(`  Mixed strategy: RTP = ${(actualRTP(mixed) * 100).toFixed(2)}%`);
}
