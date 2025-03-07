export function renderGame(gameState, attackType, damage) {
  const gameContainer = document.getElementById('game-container');
  if (!gameContainer) return;

  gameContainer.innerHTML = `
    <div class="game-board">
      <div class="player burger" style="height: ${gameState.players.burger.health}%;">
        <div class="health-bar">Health: ${gameState.players.burger.health}</div>
        <div class="cooldown">Special Cooldown: ${gameState.players.burger.specialCooldown}</div>
      </div>
      <div class="player jean" style="height: ${gameState.players.jean.health}%;">
        <div class="health-bar">Health: ${gameState.players.jean.health}</div>
        <div class="cooldown">Special Cooldown: ${gameState.players.jean.specialCooldown}</div>
      </div>
    </div>
    <div class="attack-info">
      <p>Last attack: ${gameState.currentPlayer === 'burger' ? 'Jean' : 'Burger'} used ${attackType} attack for ${damage} damage!</p>
    </div>
    <div class="controls-info">
      <p>Controls: Q (Light Attack), W (Heavy Attack), E (Special Attack)</p>
    </div>
  `;

  // Add attack animation
  const attacker = gameState.currentPlayer === 'burger' ? 'jean' : 'burger';
  const attackerElement = gameContainer.querySelector(`.player.${attacker}`);
  attackerElement.classList.add('attacking');
  setTimeout(() => {
    attackerElement.classList.remove('attacking');
  }, 500);

  // Add hit animation
  const defender = gameState.currentPlayer;
  const defenderElement = gameContainer.querySelector(`.player.${defender}`);
  defenderElement.classList.add('hit');
  setTimeout(() => {
    defenderElement.classList.remove('hit');
  }, 500);
}