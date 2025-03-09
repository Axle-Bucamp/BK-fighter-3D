import Burger from './characters/Burger';
import Jean from './characters/Jean';

class GameState {
  constructor() {
    this.player1 = new Burger(-5, 0);
    this.player2 = new Jean(5, 0);
    this.gameOver = false;
  }
}

export default GameState;