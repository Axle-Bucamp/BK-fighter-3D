import AIOpponent from '../lib/aiOpponent';
import { GAME_WIDTH, GAME_HEIGHT } from '../lib/constants';

describe('AIOpponent', () => {
  let player, opponent, aiOpponent;

  beforeEach(() => {
    player = {
      x: 100,
      y: 100,
    };
    opponent = {
      x: 200,
      y: 200,
      width: 50,
      height: 50,
      speed: 5,
      attackRange: 60,
      isMoving: false,
      attack: jest.fn(),
    };
    aiOpponent = new AIOpponent(player, opponent);
  });

  test('constructor initializes properties correctly', () => {
    expect(aiOpponent.player).toBe(player);
    expect(aiOpponent.opponent).toBe(opponent);
    expect(aiOpponent.decisionInterval).toBe(500);
    expect(aiOpponent.lastDecisionTime).toBe(0);
  });

  test('makeDecision updates opponent state', () => {
    const mockMath = Object.create(global.Math);
    mockMath.random = () => 0.5;
    global.Math = mockMath;

    aiOpponent.makeDecision();
    expect(opponent.isMoving).toBe(true);

    mockMath.random = () => 0.8;
    aiOpponent.makeDecision();
    expect(opponent.isMoving).toBe(false);
    expect(opponent.attack).toHaveBeenCalled();
  });

  test('moveTowardsPlayer updates opponent position', () => {
    opponent.isMoving = true;
    const initialX = opponent.x;
    const initialY = opponent.y;

    aiOpponent.moveTowardsPlayer(16); // Assume 16ms frame time

    expect(opponent.x).not.toBe(initialX);
    expect(opponent.y).not.toBe(initialY);
    expect(opponent.x).toBeGreaterThan(0);
    expect(opponent.x).toBeLessThan(GAME_WIDTH - opponent.width);
    expect(opponent.y).toBeGreaterThan(0);
    expect(opponent.y).toBeLessThan(GAME_HEIGHT - opponent.height);
  });

  test('attemptAttack calls attack when in range', () => {
    player.x = 220;
    player.y = 220;
    aiOpponent.attemptAttack();
    expect(opponent.attack).toHaveBeenCalled();
  });

  test('attemptAttack does not call attack when out of range', () => {
    player.x = 500;
    player.y = 500;
    aiOpponent.attemptAttack();
    expect(opponent.attack).not.toHaveBeenCalled();
  });

  test('update calls makeDecision at correct intervals', () => {
    jest.spyOn(aiOpponent, 'makeDecision');
    jest.spyOn(aiOpponent, 'moveTowardsPlayer');
    jest.spyOn(aiOpponent, 'attemptAttack');

    const now = Date.now();
    jest.spyOn(Date, 'now').mockImplementation(() => now);

    aiOpponent.update(16);
    expect(aiOpponent.makeDecision).toHaveBeenCalledTimes(1);
    expect(aiOpponent.moveTowardsPlayer).toHaveBeenCalledTimes(1);
    expect(aiOpponent.attemptAttack).toHaveBeenCalledTimes(1);

    jest.spyOn(Date, 'now').mockImplementation(() => now + 400);
    aiOpponent.update(16);
    expect(aiOpponent.makeDecision).toHaveBeenCalledTimes(1);

    jest.spyOn(Date, 'now').mockImplementation(() => now + 600);
    aiOpponent.update(16);
    expect(aiOpponent.makeDecision).toHaveBeenCalledTimes(2);
  });
});