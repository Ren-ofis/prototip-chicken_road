// GameState.js - Manages overall game state and localStorage
export default class GameState {
  constructor() {
    this.state = this.loadState();
  }

  loadState() {
    const saved = localStorage.getItem("chickenGameState");
    return saved ? JSON.parse(saved) : this.getDefaultState();
  }

  getDefaultState() {
    return {
      balance: 1000,
      totalGames: 0,
      wins: 0,
      losses: 0,
      highestMultiplier: 1,
      biggestWin: 0,
      gameMode: "manual",
      soundEnabled: true,
    };
  }

  saveState() {
    localStorage.setItem("chickenGameState", JSON.stringify(this.state));
  }

  getStats() {
    const totalGames = this.state.totalGames;
    const winRate = totalGames > 0 ? (this.state.wins / totalGames) * 100 : 0;
    
    return {
      balance: this.state.balance,
      totalGames: totalGames,
      winRate: winRate,
      highestMultiplier: this.state.highestMultiplier,
      biggestWin: this.state.biggestWin,
      gameMode: this.state.gameMode,
    };
  }

  recordWin(multiplier, winnings) {
    this.state.wins++;
    this.state.totalGames++;
    this.state.highestMultiplier = Math.max(this.state.highestMultiplier, multiplier);
    this.state.biggestWin = Math.max(this.state.biggestWin, winnings);
    this.saveState();
  }

  recordLoss() {
    this.state.losses++;
    this.state.totalGames++;
    this.saveState();
  }

  getBalance() {
    return this.state.balance;
  }

  setBalance(amount) {
    this.state.balance = amount;
    this.saveState();
  }

  setGameMode(mode) {
    this.state.gameMode = mode;
    this.saveState();
  }

  getGameMode() {
    return this.state.gameMode;
  }

  toggleSound() {
    this.state.soundEnabled = !this.state.soundEnabled;
    this.saveState();
  }

  isSoundEnabled() {
    return this.state.soundEnabled;
  }
}
