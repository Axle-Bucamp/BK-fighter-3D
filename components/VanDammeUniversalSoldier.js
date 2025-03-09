import { Character } from '../lib/Character';

export class VanDammeUniversalSoldier extends Character {
  constructor(world, x, y) {
    super(world, x, y, 55, 88, { label: 'VanDammeUniversalSoldier' });
    this.name = 'Van Damme Universal Soldier';
    this.strength = 10;
    this.speed = 7;
  }

  specialAbility() {
    console.log('Regeneration: Van Damme Universal Soldier activates rapid healing!');
    // Implement special ability logic here
  }
}