import { Character } from '../lib/Character';

export class BurgerKingWhopper extends Character {
  constructor(world, x, y) {
    super(world, x, y, 70, 130); // Slightly larger
    this.name = "Whopper King";
    this.specialAbility = "Flame Grilled Rush";
    this.strength = 10;
    this.speed = 6;
  }

  useSpecialAbility() {
    console.log(`${this.name} uses ${this.specialAbility}!`);
    // Implement special ability logic here
  }
}