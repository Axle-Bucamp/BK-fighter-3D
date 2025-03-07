// Constants
const CANVAS_WIDTH = 800;
const CANVAS_HEIGHT = 600;
const PLAYER_WIDTH = 50;
const PLAYER_HEIGHT = 100;
const PLAYER_SPEED = 5;
const GRAVITY = 0.5;
const JUMP_FORCE = 10;
const ATTACK_RANGE = 60;
const ATTACK_DAMAGE = 10;

// Initialize game state
export function initGameState(isSinglePlayer = false) {
  return {
    players: [
      {
        x: 100,
        y: CANVAS_HEIGHT - PLAYER_HEIGHT,
        velocityY: 0,
        isJumping: false,
        health: 100,
        isAttacking: false,
        attackCooldown: 0,
        character: 'burger',
      },
      {
        x: CANVAS_WIDTH - 100 - PLAYER_WIDTH,
        y: CANVAS_HEIGHT - PLAYER_HEIGHT,
        velocityY: 0,
        isJumping: false,
        health: 100,
        isAttacking: false,
        attackCooldown: 0,
        character: 'jean',
      },
    ],
    isSinglePlayer,
  };
}

// Update player positions
export function updatePlayerPositions(gameState) {
  gameState.players.forEach((player) => {
    // Apply gravity
    player.velocityY += GRAVITY;
    player.y += player.velocityY;

    // Ground collision
    if (player.y > CANVAS_HEIGHT - PLAYER_HEIGHT) {
      player.y = CANVAS_HEIGHT - PLAYER_HEIGHT;
      player.velocityY = 0;
      player.isJumping = false;
    }
  });
}

// Handle player movement
export function movePlayer(gameState, playerIndex, direction) {
  const player = gameState.players[playerIndex];
  if (direction === 'left') {
    player.x = Math.max(0, player.x - PLAYER_SPEED);
  } else if (direction === 'right') {
    player.x = Math.min(CANVAS_WIDTH - PLAYER_WIDTH, player.x + PLAYER_SPEED);
  }
}

// Handle player jump
export function jumpPlayer(gameState, playerIndex) {
  const player = gameState.players[playerIndex];
  if (!player.isJumping) {
    player.velocityY = -JUMP_FORCE;
    player.isJumping = true;
  }
}

// Handle player attack
export function playerAttack(gameState, attackingPlayerIndex) {
  const attackingPlayer = gameState.players[attackingPlayerIndex];
  const defendingPlayer = gameState.players[1 - attackingPlayerIndex];

  if (attackingPlayer.attackCooldown === 0) {
    attackingPlayer.isAttacking = true;
    attackingPlayer.attackCooldown = 30; // 30 frames cooldown

    // Check if defending player is in range
    const distance = Math.abs(attackingPlayer.x - defendingPlayer.x);
    if (distance <= ATTACK_RANGE) {
      defendingPlayer.health -= ATTACK_DAMAGE;
      if (defendingPlayer.health < 0) defendingPlayer.health = 0;
    }
  }
}

// Update attack states
export function updateAttackStates(gameState) {
  gameState.players.forEach((player) => {
    if (player.attackCooldown > 0) {
      player.attackCooldown--;
    } else {
      player.isAttacking = false;
    }
  });
}

// Detect collisions between players
export function detectCollisions(gameState) {
  const [player1, player2] = gameState.players;
  if (
    player1.x < player2.x + PLAYER_WIDTH &&
    player1.x + PLAYER_WIDTH > player2.x &&
    player1.y < player2.y + PLAYER_HEIGHT &&
    player1.y + PLAYER_HEIGHT > player2.y
  ) {
    // Collision detected, push players apart
    const overlapX = Math.min(
      player1.x + PLAYER_WIDTH - player2.x,
      player2.x + PLAYER_WIDTH - player1.x
    );
    player1.x -= overlapX / 2;
    player2.x += overlapX / 2;
  }
}

// AI opponent logic for single-player mode
export function updateAIOpponent(gameState) {
  if (!gameState.isSinglePlayer) return;

  const aiPlayer = gameState.players[1];
  const humanPlayer = gameState.players[0];

  // Simple AI: move towards the player and attack when in range
  if (aiPlayer.x < humanPlayer.x) {
    movePlayer(gameState, 1, 'right');
  } else {
    movePlayer(gameState, 1, 'left');
  }

  // Attack if in range
  const distance = Math.abs(aiPlayer.x - humanPlayer.x);
  if (distance <= ATTACK_RANGE) {
    playerAttack(gameState, 1);
  }

  // Random jumping
  if (Math.random() < 0.02 && !aiPlayer.isJumping) {
    jumpPlayer(gameState, 1);
  }
}

// Main game loop function
export function gameLoop(gameState) {
  updatePlayerPositions(gameState);
  updateAttackStates(gameState);
  detectCollisions(gameState);
  
  if (gameState.isSinglePlayer) {
    updateAIOpponent(gameState);
  }

  // Check for game over condition
  if (gameState.players[0].health === 0 || gameState.players[1].health === 0) {
    return 'gameOver';
  }

  return 'playing';
}