import { Character } from '../lib/Character';

export class VanDammeKickboxer extends Character {
  constructor(world, x, y) {
    super(world, x, y, 60, 120);
    this.name = "JCVD Kickboxer";
    this.specialAbility = "Spinning Heel Kick";
    this.strength = 9;
    this.speed = 8;
  }

  useSpecialAbility() {
    console.log(`${this.name} uses ${this.specialAbility}!`);
    // Implement special ability logic here
  }
}