import { Character } from '../lib/Character';

export class VanDammeTimecop extends Character {
  constructor(world, x, y) {
    super(world, x, y, 52, 86, { label: 'VanDammeTimecop' });
    this.name = 'Van Damme Timecop';
    this.strength = 8;
    this.speed = 9;
  }

  specialAbility() {
    console.log('Time Warp: Van Damme Timecop manipulates time to gain an advantage!');
    // Implement special ability logic here
  }
}