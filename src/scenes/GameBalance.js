// GameBalance.js - Manages betting and winnings
export default class GameBalance {
  constructor(gameState) {
    this.gameState = gameState;
    this.balance = gameState.getBalance();
    this.currentBet = 0;
  }

  placeBet(amount) {
    if (amount > this.balance) {
      return false;
    }
    
    this.currentBet = amount;
    this.balance -= amount;
    this.gameState.setBalance(this.balance);
    return true;
  }

  cashOut(winnings) {
    this.balance += winnings;
    this.gameState.setBalance(this.balance);
  }

  loseBet() {
    // Bet is already deducted in placeBet
    this.gameState.setBalance(this.balance);
  }

  getBalance() {
    return this.balance;
  }

  getCurrentBet() {
    return this.currentBet;
  }
}
