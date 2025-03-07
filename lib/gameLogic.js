// lib/gameLogic.js

const COMBO_TIMEOUT = 2000; // 2 seconds

export class Character {
  constructor(name, health, attack, defense) {
    this.name = name;
    this.health = health;
    this.attack = attack;
    this.defense = defense;
    this.comboCount = 0;
    this.lastComboTime = 0;
    this.specialMoveReady = false;
  }

  takeDamage(damage) {
    this.health -= Math.max(damage - this.defense, 0);
    if (this.health < 0) this.health = 0;
  }

  performAttack(opponent) {
    const now = Date.now();
    if (now - this.lastComboTime < COMBO_TIMEOUT) {
      this.comboCount++;
    } else {
      this.comboCount = 1;
    }
    this.lastComboTime = now;

    let damage = this.attack * (1 + (this.comboCount - 1) * 0.1); // 10% increase per combo
    opponent.takeDamage(damage);

    if (this.comboCount >= 3) {
      this.specialMoveReady = true;
    }

    return damage;
  }

  performSpecialMove(opponent) {
    if (!this.specialMoveReady) return 0;

    let damage = this.attack * 2; // Special move does double damage
    opponent.takeDamage(damage);
    this.specialMoveReady = false;
    this.comboCount = 0;

    return damage;
  }
}

export const createCharacter = (name) => {
  switch (name) {
    case 'Burger':
      return new Character('Burger', 100, 15, 5);
    case 'Jean':
      return new Character('Jean', 90, 18, 3);
    default:
      throw new Error('Invalid character name');
  }
};

export const isGameOver = (player1, player2) => {
  return player1.health <= 0 || player2.health <= 0;
};

export const getWinner = (player1, player2) => {
  if (player1.health <= 0) return player2;
  if (player2.health <= 0) return player1;
  return null;
};