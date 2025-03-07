// lib/renderer.js

/**
 * Renders the entire game state on the canvas
 * @param {CanvasRenderingContext2D} ctx - The canvas rendering context
 * @param {Object} gameState - The current game state
 */
export function renderGame(ctx, gameState) {
  clearCanvas(ctx);
  drawBackground(ctx);
  drawPlayers(ctx, gameState.players);
  drawUI(ctx, gameState);
}

/**
 * Clears the entire canvas
 * @param {CanvasRenderingContext2D} ctx - The canvas rendering context
 */
function clearCanvas(ctx) {
  ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
}

/**
 * Draws the game background
 * @param {CanvasRenderingContext2D} ctx - The canvas rendering context
 */
function drawBackground(ctx) {
  // For now, just fill with a light color
  ctx.fillStyle = '#e6e6e6';
  ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
}

/**
 * Draws all players on the canvas
 * @param {CanvasRenderingContext2D} ctx - The canvas rendering context
 * @param {Array} players - Array of player objects
 */
function drawPlayers(ctx, players) {
  players.forEach(player => {
    drawPlayer(ctx, player);
  });
}

/**
 * Draws a single player on the canvas
 * @param {CanvasRenderingContext2D} ctx - The canvas rendering context
 * @param {Object} player - The player object to draw
 */
function drawPlayer(ctx, player) {
  // For now, we'll just draw colored rectangles for the players
  ctx.fillStyle = player.type === 'Burger' ? '#FFA500' : '#0000FF';
  ctx.fillRect(player.x, player.y, player.width, player.height);
  
  // Draw player name
  ctx.fillStyle = '#000000';
  ctx.font = '14px Arial';
  ctx.textAlign = 'center';
  ctx.fillText(player.type, player.x + player.width / 2, player.y - 10);
}

/**
 * Draws the UI elements
 * @param {CanvasRenderingContext2D} ctx - The canvas rendering context
 * @param {Object} gameState - The current game state
 */
function drawUI(ctx, gameState) {
  drawHealthBars(ctx, gameState.players);
}

/**
 * Draws health bars for all players
 * @param {CanvasRenderingContext2D} ctx - The canvas rendering context
 * @param {Array} players - Array of player objects
 */
function drawHealthBars(ctx, players) {
  const barWidth = 100;
  const barHeight = 10;
  const padding = 10;

  players.forEach((player, index) => {
    const x = padding + index * (barWidth + padding);
    const y = ctx.canvas.height - barHeight - padding;

    // Draw background
    ctx.fillStyle = '#FF0000';
    ctx.fillRect(x, y, barWidth, barHeight);

    // Draw health
    ctx.fillStyle = '#00FF00';
    ctx.fillRect(x, y, barWidth * (player.health / 100), barHeight);

    // Draw border
    ctx.strokeStyle = '#000000';
    ctx.strokeRect(x, y, barWidth, barHeight);
  });
}

// Export any other necessary rendering functions here