import { Character } from '../lib/Character';

export class BurgerKingChicken extends Character {
  constructor(world, x, y) {
    super(world, x, y, 55, 110); // Slightly smaller
    this.name = "Chicken Royale";
    this.specialAbility = "Crispy Combo";
    this.strength = 7;
    this.speed = 9;
  }

  useSpecialAbility() {
    console.log(`${this.name} uses ${this.specialAbility}!`);
    // Implement special ability logic here
  }
}