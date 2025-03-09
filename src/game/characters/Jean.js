import BaseCharacter from './BaseCharacter';
import { CHARACTERS } from '../constants';

class Jean extends BaseCharacter {
  constructor() {
    super(CHARACTERS.JEAN, 100, 2);
    this.specialMove = 'Denim Dash';
  }

  performSpecialMove() {
    console.log(`${this.name} performs ${this.specialMove}!`);
    // Implement special move logic here
  }
}

export default Jean;