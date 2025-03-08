import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import PhysicsEngine from './physicsEngine';
import CharacterManager from './characterManager';
import ArenaManager from './arenaManager';

class GameEngine {
  constructor() {
    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    this.renderer = new THREE.WebGLRenderer();
    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.loader = new GLTFLoader();
    this.physicsEngine = new PhysicsEngine();
    this.characterManager = new CharacterManager(this.scene, this.loader, this.physicsEngine);
    this.arenaManager = new ArenaManager(this.scene, this.loader);
    
    this.gameMode = 'arcade'; // 'arcade' or 'versus'
    this.players = [];
    this.currentArena = null;

    this.init();
  }

  init() {
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(this.renderer.domElement);

    this.camera.position.set(0, 5, 10);
    this.controls.update();

    this.setupLighting();
    this.loadArena('default');
    this.animate();

    window.addEventListener('resize', () => this.onWindowResize(), false);
  }

  setupLighting() {
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    this.scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(0, 10, 0);
    this.scene.add(directionalLight);
  }

  loadArena(arenaName) {
    this.currentArena = this.arenaManager.loadArena(arenaName);
  }

  addPlayer(characterType, isAI = false) {
    const player = this.characterManager.createCharacter(characterType, isAI);
    this.players.push(player);
    return player;
  }

  startGame(gameMode) {
    this.gameMode = gameMode;
    this.players = [];

    if (gameMode === 'arcade') {
      this.addPlayer('burgerKing');
      this.addPlayer('jeanClaude', true); // AI opponent
    } else if (gameMode === 'versus') {
      this.addPlayer('burgerKing');
      this.addPlayer('jeanClaude');
    }

    // Position players
    this.players[0].setPosition(-5, 0, 0);
    this.players[1].setPosition(5, 0, 0);
  }

  update() {
    this.physicsEngine.update();
    this.players.forEach(player => player.update());
    this.currentArena.update();
  }

  animate() {
    requestAnimationFrame(() => this.animate());
    this.update();
    this.controls.update();
    this.renderer.render(this.scene, this.camera);
  }

  onWindowResize() {
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(window.innerWidth, window.innerHeight);
  }
}

export default GameEngine;