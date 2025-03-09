import { Character } from '../lib/Character';

export class VanDammeTimecop extends Character {
  constructor(world, x, y) {
    super(world, x, y, 60, 120);
    this.name = "Timecop";
    this.specialAbility = "Time Warp";
    this.strength = 8;
    this.speed = 9;
  }

  useSpecialAbility() {
    console.log(`${this.name} uses ${this.specialAbility}!`);
    // Implement special ability logic here
  }
}