import Burger from './characters/Burger';
import Jean from './characters/Jean';
import { CHARACTERS, ARENAS } from './constants';

class GameLogicManager {
  constructor() {
    this.players = {};
    this.currentArena = null;
  }

  initializeGame(player1Character, player2Character, arena) {
    this.players = {
      player1: this.createCharacter(player1Character),
      player2: this.createCharacter(player2Character),
    };
    this.currentArena = arena;
  }

  createCharacter(characterType) {
    switch (characterType) {
      case CHARACTERS.BURGER:
        return new Burger();
      case CHARACTERS.JEAN:
        return new Jean();
      default:
        throw new Error('Invalid character type');
    }
  }

  movePlayer(playerKey, x, y, z) {
    this.players[playerKey].move(x, y, z);
  }

  performSpecialMove(playerKey) {
    this.players[playerKey].performSpecialMove();
  }

  checkCollision() {
    // Implement collision detection logic here
  }

  updateGameState() {
    // Implement game state update logic here
  }
}

export default new GameLogicManager();