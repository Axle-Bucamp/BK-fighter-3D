import { detectCollision, resolveCollision } from './utils/collisionDetection';

class GameLogic {
  update(gameState) {
    const { player1, player2 } = gameState;

    // Update character positions based on their current state
    if (player1.movingLeft) player1.moveLeft();
    if (player1.movingRight) player1.moveRight();
    if (player2.movingLeft) player2.moveLeft();
    if (player2.movingRight) player2.moveRight();

    // Check for collisions
    if (detectCollision(player1, player2)) {
      resolveCollision(player1, player2);
    }

    // Check for victory conditions
    if (player1.health <= 0 || player2.health <= 0) {
      gameState.gameOver = true;
    }

    return { ...gameState, player1, player2 };
  }

  handleInput(gameState, key, isKeyDown) {
    switch (key) {
      case 'ArrowLeft':
        gameState.player1.movingLeft = isKeyDown;
        break;
      case 'ArrowRight':
        gameState.player1.movingRight = isKeyDown;
        break;
      case 'a':
        gameState.player2.movingLeft = isKeyDown;
        break;
      case 'd':
        gameState.player2.movingRight = isKeyDown;
        break;
      // Add more input handlers as needed
    }
    return gameState;
  }
}

export default GameLogic;