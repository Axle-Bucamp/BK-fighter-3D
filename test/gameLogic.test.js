import { createCharacter, updateCharacter, performAttack, checkCollision } from '../lib/gameLogic';

describe('Game Logic', () => {
  test('createCharacter should return a character object', () => {
    const character = createCharacter('TestCharacter', 0xff0000);
    expect(character).toHaveProperty('name', 'TestCharacter');
    expect(character).toHaveProperty('health', 100);
    expect(character).toHaveProperty('mesh');
    expect(character).toHaveProperty('position');
    expect(character).toHaveProperty('velocity');
  });

  test('updateCharacter should update character position', () => {
    const character = createCharacter('TestCharacter', 0xff0000);
    character.velocity = { x: 1, y: 0, z: 0 };
    updateCharacter(character);
    expect(character.position).toEqual({ x: 1, y: 0, z: 0 });
    expect(character.mesh.position.x).toBe(1);
  });

  test('performAttack should reduce defender health', () => {
    const attacker = createCharacter('Attacker', 0xff0000);
    const defender = createCharacter('Defender', 0x0000ff);
    const initialHealth = defender.health;
    const damage = performAttack(attacker, defender);
    expect(defender.health).toBe(initialHealth - damage);
  });

  test('checkCollision should detect nearby characters', () => {
    const character1 = createCharacter('Character1', 0xff0000);
    const character2 = createCharacter('Character2', 0x0000ff);
    character1.mesh.position.set(0, 0, 0);
    character2.mesh.position.set(1, 0, 0);
    expect(checkCollision(character1, character2)).toBe(true);
    character2.mesh.position.set(3, 0, 0);
    expect(checkCollision(character1, character2)).toBe(false);
  });
});