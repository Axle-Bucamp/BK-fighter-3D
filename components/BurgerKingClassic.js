import { Character } from '../lib/Character';

export class BurgerKingClassic extends Character {
  constructor(world, x, y) {
    super(world, x, y, 50, 80, { label: 'BurgerKingClassic' });
    this.name = 'Burger King Classic';
    this.strength = 8;
    this.speed = 7;
  }

  specialAbility() {
    console.log('Whopper Smash: Burger King Classic unleashes a powerful smash attack!');
    // Implement special ability logic here
  }
}