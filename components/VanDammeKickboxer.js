import { Character } from '../lib/Character';

export class VanDammeKickboxer extends Character {
  constructor(world, x, y) {
    super(world, x, y, 50, 85, { label: 'VanDammeKickboxer' });
    this.name = 'Van Damme Kickboxer';
    this.strength = 9;
    this.speed = 8;
  }

  specialAbility() {
    console.log('Spin Kick Combo: Van Damme Kickboxer performs a devastating series of spin kicks!');
    // Implement special ability logic here
  }
}