import { Character } from '../lib/Character';

export class BurgerKingChicken extends Character {
  constructor(world, x, y) {
    super(world, x, y, 45, 75, { label: 'BurgerKingChicken' });
    this.name = 'Burger King Chicken';
    this.strength = 7;
    this.speed = 9;
  }

  specialAbility() {
    console.log('Chicken Frenzy: Burger King Chicken unleashes a flurry of rapid attacks!');
    // Implement special ability logic here
  }
}