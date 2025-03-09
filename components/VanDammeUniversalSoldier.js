import { Character } from '../lib/Character';

export class VanDammeUniversalSoldier extends Character {
  constructor(world, x, y) {
    super(world, x, y, 65, 125);
    this.name = "Universal Soldier";
    this.specialAbility = "Regeneration";
    this.strength = 10;
    this.speed = 7;
  }

  useSpecialAbility() {
    console.log(`${this.name} uses ${this.specialAbility}!`);
    // Implement special ability logic here
  }
}