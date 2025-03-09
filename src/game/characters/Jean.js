import Character from './Character';

class Jean extends Character {
  constructor(x, y) {
    super(x, y, 100); // 100 is the initial health
    this.specialMove = 'Denim Dash';
  }

  useSpecialMove() {
    console.log(`Jean uses ${this.specialMove}!`);
    // Implement special move logic
  }
}

export default Jean;