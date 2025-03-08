// lib/CharacterManager.js

class Character {
  constructor(name, health, speed, jumpForce, specialMoves) {
    this.name = name;
    this.health = health;
    this.speed = speed;
    this.jumpForce = jumpForce;
    this.specialMoves = specialMoves;
  }

  executeSpecialMove(moveName) {
    const move = this.specialMoves.find(m => m.name === moveName);
    if (move) {
      console.log(`${this.name} executes ${move.name}: ${move.description}`);
      return move.effect;
    }
    console.log(`${this.name} doesn't know the move ${moveName}`);
    return null;
  }
}

class CharacterManager {
  constructor() {
    this.characters = [
      new Character("Burger King", 100, 5, 7, [
        { 
          name: "Whopper Smash", 
          description: "A powerful downward punch infused with flame-grilled energy",
          effect: { damage: 20, stunDuration: 1 }
        },
        { 
          name: "Fry Barrage", 
          description: "Launches a rapid series of french fries at the opponent",
          effect: { damage: 15, hitCount: 5 }
        }
      ]),
      new Character("Jean-Claude Van Damme", 120, 7, 8, [
        { 
          name: "Roundhouse Kick", 
          description: "A powerful spinning kick that can hit multiple times",
          effect: { damage: 25, hitCount: 3 }
        },
        { 
          name: "Split Punch", 
          description: "JCVD does his famous split and delivers a powerful upward punch",
          effect: { damage: 30, launchForce: 5 }
        }
      ]),
      new Character("Pizza Paladin", 110, 6, 6, [
        { 
          name: "Pepperoni Projectiles", 
          description: "Launches a volley of spicy pepperoni slices at high speed",
          effect: { damage: 18, range: 10 }
        },
        { 
          name: "Cheesy Forcefield", 
          description: "Creates a protective barrier of melted cheese around the character",
          effect: { shieldHealth: 40, duration: 5 }
        }
      ])
    ];
  }

  getCharacter(name) {
    return this.characters.find(char => char.name === name);
  }

  getAllCharacters() {
    return this.characters;
  }
}

export default new CharacterManager();