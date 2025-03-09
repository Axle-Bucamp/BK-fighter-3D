import { Character } from '../lib/Character';

export class BurgerKingClassic extends Character {
  constructor(world, x, y) {
    super(world, x, y, 60, 120); // Adjust size as needed
    this.name = "Classic Burger King";
    this.specialAbility = "Whopper Toss";
    this.strength = 8;
    this.speed = 7;
  }

  useSpecialAbility() {
    console.log(`${this.name} uses ${this.specialAbility}!`);
    // Implement special ability logic here
  }
}