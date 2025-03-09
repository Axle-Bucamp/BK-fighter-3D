import { GAME_MODES } from './constants';

export const initializeGame = (players, gameMode) => {
  return {
    characters: players.map((player, index) => ({
      name: player.name,
      health: 100,
      position: { x: index * 200 + 100, y: 300 },
      score: 0,
      isPlayer: index === 0,
    })),
    timeRemaining: gameMode === GAME_MODES.TIMED ? 99 : Infinity,
    gameMode,
  };
};

export const updateGameState = (currentState) => {
  // This is a placeholder for the actual game logic
  // In a real implementation, this would handle character movements, collisions, etc.
  const newState = { ...currentState };

  // Update time remaining
  if (newState.gameMode === GAME_MODES.TIMED) {
    newState.timeRemaining = Math.max(0, newState.timeRemaining - 1/60);
  }

  // Example: random health decrease
  newState.characters = newState.characters.map(char => ({
    ...char,
    health: Math.max(0, char.health - Math.random() * 0.5),
  }));

  return newState;
};

export const isGameOver = (gameState) => {
  return gameState.timeRemaining <= 0 || gameState.characters.some(char => char.health <= 0);
};