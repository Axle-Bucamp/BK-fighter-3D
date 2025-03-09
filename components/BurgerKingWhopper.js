import { Character } from '../lib/Character';

export class BurgerKingWhopper extends Character {
  constructor(world, x, y) {
    super(world, x, y, 60, 90, { label: 'BurgerKingWhopper' });
    this.name = 'Burger King Whopper';
    this.strength = 10;
    this.speed = 6;
  }

  specialAbility() {
    console.log('Flame Grilled Fury: Burger King Whopper ignites with flame-grilled power!');
    // Implement special ability logic here
  }
}