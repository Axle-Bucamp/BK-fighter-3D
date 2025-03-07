import { playJumpSound, playAttackSound, playDamageSound } from './audioManager';

const GAME_WIDTH = 800;
const GAME_HEIGHT = 600;

export function initGame() {
  return {
    players: [
      { id: 'burger', x: 100, y: 400, width: 50, height: 100, health: 100, jumping: false, attacking: false },
      { id: 'jean', x: 650, y: 400, width: 50, height: 100, health: 100, jumping: false, attacking: false }
    ],
    gravity: 0.5,
    jumpForce: -10
  };
}

export function updateGame(gameState) {
  gameState.players.forEach(player => {
    // Apply gravity
    player.y += gameState.gravity;
    
    // Keep player within bounds
    player.y = Math.min(player.y, GAME_HEIGHT - player.height);
    
    // Reset jumping and attacking states
    if (player.y === GAME_HEIGHT - player.height) {
      player.jumping = false;
    }
    player.attacking = false;
  });

  return gameState;
}

export function handleInput(gameState, playerId, action) {
  const player = gameState.players.find(p => p.id === playerId);
  if (!player) return gameState;

  switch (action) {
    case 'JUMP':
      if (!player.jumping) {
        player.jumping = true;
        player.y += gameState.jumpForce;
        playJumpSound();
      }
      break;
    case 'ATTACK':
      player.attacking = true;
      playAttackSound();
      // Check if attack hits other player
      const otherPlayer = gameState.players.find(p => p.id !== playerId);
      if (checkCollision(player, otherPlayer)) {
        otherPlayer.health -= 10;
        playDamageSound();
      }
      break;
    // Add more actions as needed
  }

  return gameState;
}

function checkCollision(player1, player2) {
  return (
    player1.x < player2.x + player2.width &&
    player1.x + player1.width > player2.x &&
    player1.y < player2.y + player2.height &&
    player1.y + player1.height > player2.y
  );
}