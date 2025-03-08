import MultiplayerManager from './multiplayerManager';
import CharacterManager from './characterManager';
import ArenaManager from './arenaManager';

class GameEngine {
  constructor(serverUrl) {
    this.multiplayerManager = new MultiplayerManager(serverUrl);
    this.characterManager = new CharacterManager();
    this.arenaManager = new ArenaManager();
    this.gameState = {
      players: [],
      arena: null,
      status: 'waiting'
    };
  }

  init() {
    this.multiplayerManager.socket.on('gameStateUpdate', (newState) => {
      this.updateGameState(newState);
    });
  }

  updateGameState(newState) {
    this.gameState = newState;
    this.characterManager.updateCharacters(newState.players);
    this.arenaManager.updateArena(newState.arena);
  }

  joinGame(playerName) {
    this.multiplayerManager.joinGame(playerName);
  }

  leaveGame() {
    this.multiplayerManager.leaveGame();
  }

  performAction(action) {
    this.multiplayerManager.sendPlayerAction(action);
  }

  getGameState() {
    return this.gameState;
  }

  getPlayers() {
    return this.multiplayerManager.getPlayers();
  }
}

export default GameEngine;