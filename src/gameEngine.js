import * as THREE from 'three';
import { CharacterManager } from './characterManager';
import { ArenaManager } from './arenaManager';

class GameEngine {
  constructor() {
    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    this.renderer = new THREE.WebGLRenderer();
    this.characterManager = new CharacterManager();
    this.arenaManager = new ArenaManager();
    this.players = new Map();
    this.multiplayerManager = null;

    this.init();
  }

  init() {
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(this.renderer.domElement);

    this.camera.position.z = 5;

    this.setupEventListeners();
    this.animate();
  }

  setupEventListeners() {
    window.addEventListener('resize', this.onWindowResize.bind(this), false);
  }

  onWindowResize() {
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(window.innerWidth, window.innerHeight);
  }

  animate() {
    requestAnimationFrame(this.animate.bind(this));
    this.update();
    this.render();
  }

  update() {
    // Update game logic here
    this.characterManager.update();
    this.arenaManager.update();
  }

  render() {
    this.renderer.render(this.scene, this.camera);
  }

  setMultiplayerManager(multiplayerManager) {
    this.multiplayerManager = multiplayerManager;
  }

  addPlayer(player) {
    this.players.set(player.id, player);
    this.characterManager.addCharacter(player.id, player.character);
  }

  removePlayer(playerId) {
    this.players.delete(playerId);
    this.characterManager.removeCharacter(playerId);
  }

  updateGameState(gameState) {
    // Update game state based on server information
    gameState.players.forEach((player) => {
      if (this.players.has(player.id)) {
        this.characterManager.updateCharacter(player.id, player.position, player.rotation);
      } else {
        this.addPlayer(player);
      }
    });

    // Remove players that are no longer in the game
    this.players.forEach((player, playerId) => {
      if (!gameState.players.some(p => p.id === playerId)) {
        this.removePlayer(playerId);
      }
    });

    // Update arena state if necessary
    this.arenaManager.updateState(gameState.arena);
  }

  handlePlayerAction(playerId, action) {
    // Process player action and update game state
    this.characterManager.handleAction(playerId, action);

    // Send action to server if in multiplayer mode
    if (this.multiplayerManager) {
      this.multiplayerManager.sendPlayerAction({ playerId, action });
    }
  }
}

export default GameEngine;