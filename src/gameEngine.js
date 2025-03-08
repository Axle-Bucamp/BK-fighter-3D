import CharacterManager from './characterManager';
import ArenaManager from './arenaManager';

class GameEngine {
  constructor(multiplayerManager) {
    this.multiplayerManager = multiplayerManager;
    this.characterManager = new CharacterManager();
    this.arenaManager = new ArenaManager();
    this.players = new Map();
    this.currentArena = null;

    this.setupMultiplayerListeners();
  }

  setupMultiplayerListeners() {
    this.multiplayerManager.setEventHandlers(
      this.onPlayerJoin.bind(this),
      this.onPlayerLeave.bind(this),
      this.onGameStateUpdate.bind(this)
    );
  }

  onPlayerJoin(player) {
    const character = this.characterManager.createCharacter(player.characterType);
    this.players.set(player.id, { ...player, character });
    console.log(`Player ${player.name} joined the game`);
  }

  onPlayerLeave(playerId) {
    this.players.delete(playerId);
    console.log(`Player ${playerId} left the game`);
  }

  onGameStateUpdate(gameState) {
    this.updatePlayersState(gameState.players);
    this.updateArenaState(gameState.arena);
  }

  updatePlayersState(playersState) {
    for (const [playerId, playerState] of Object.entries(playersState)) {
      if (this.players.has(playerId)) {
        const player = this.players.get(playerId);
        player.character.updateState(playerState);
      }
    }
  }

  updateArenaState(arenaState) {
    if (this.currentArena) {
      this.currentArena.updateState(arenaState);
    }
  }

  startGame(arenaType) {
    this.currentArena = this.arenaManager.createArena(arenaType);
    console.log(`Starting game in arena: ${arenaType}`);
  }

  performAction(playerId, action) {
    if (this.players.has(playerId)) {
      const player = this.players.get(playerId);
      player.character.performAction(action);
      this.multiplayerManager.sendPlayerAction({ playerId, action });
    }
  }

  update(deltaTime) {
    // Update game logic here
    for (const player of this.players.values()) {
      player.character.update(deltaTime);
    }
    if (this.currentArena) {
      this.currentArena.update(deltaTime);
    }
  }
}

export default GameEngine;