export function initializeGameModes() {
  return {
    arcade: {
      name: 'Arcade',
      init: () => {
        // Initialize arcade mode
      },
      update: (gameState) => {
        // Update arcade mode logic
      },
    },
    localMultiplayer: {
      name: 'Local Multiplayer',
      init: () => {
        // Initialize local multiplayer mode
      },
      update: (gameState) => {
        // Update local multiplayer mode logic
      },
    },
  };
}

export function updateGameMode(mode, gameState) {
  if (mode && mode.update) {
    mode.update(gameState);
  }
}