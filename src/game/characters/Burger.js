import Character from './Character';

class Burger extends Character {
  constructor(x, y) {
    super(x, y, 100); // 100 is the initial health
    this.specialMove = 'Burger Flip';
  }

  useSpecialMove() {
    console.log(`Burger uses ${this.specialMove}!`);
    // Implement special move logic
  }
}

export default Burger;