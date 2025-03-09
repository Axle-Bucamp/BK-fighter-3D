import BaseCharacter from './BaseCharacter';
import { CHARACTERS } from '../constants';

class Burger extends BaseCharacter {
  constructor() {
    super(CHARACTERS.BURGER, 100, 1.5);
    this.specialMove = 'Patty Slam';
  }

  performSpecialMove() {
    console.log(`${this.name} performs ${this.specialMove}!`);
    // Implement special move logic here
  }
}

export default Burger;