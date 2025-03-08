import { PhysicsEngine } from './physicsEngine';

export class GameEngine {
  constructor() {
    this.physicsEngine = new PhysicsEngine();
  }

  init() {
    this.physicsEngine.init();
    // Initialize other game systems
  }

  update(delta) {
    this.physicsEngine.update(delta);
    // Update game state, characters, etc.
  }

  // Add methods for handling input, game logic, etc.
}