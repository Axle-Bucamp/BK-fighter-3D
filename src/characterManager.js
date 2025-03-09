import * as THREE from 'three';

import AIController from '../controllers/AIController';

class Character {
  constructor(scene, loader, physicsEngine, characterType, isAI) {
    this.scene = scene;
    this.loader = loader;
    this.physicsEngine = physicsEngine;
    this.characterType = characterType;
    this.isAI = isAI;
    this.model = null;
    this.hitbox = null;
    this.animations = {};
    this.currentAnimation = null;
    this.health = 100;
    this.aiController = isAI ? new AIController() : null;

    this.loadModel();
  }

  loadModel() {
    const modelPath = `models/${this.characterType}.glb`;
    this.loader.load(modelPath, (gltf) => {
      this.model = gltf.scene;
      this.scene.add(this.model);
      this.setupAnimations(gltf.animations);
      this.createHitbox();
    });
  }

  setupAnimations(animations) {
    const mixer = new THREE.AnimationMixer(this.model);
    animations.forEach(animation => {
      this.animations[animation.name] = mixer.clipAction(animation);
    });
  }

  createHitbox() {
    // Create a simple hitbox for collision detection
    const geometry = new THREE.BoxGeometry(1, 2, 1);
    const material = new THREE.MeshBasicMaterial({ visible: false });
    this.hitbox = new THREE.Mesh(geometry, material);
    this.scene.add(this.hitbox);
    this.physicsEngine.addObject(this.hitbox);
  }

  setPosition(x, y, z) {
    if (this.model) {
      this.model.position.set(x, y, z);
    }
    if (this.hitbox) {
      this.hitbox.position.set(x, y, z);
    }
  }

  playAnimation(animationName) {
    if (this.currentAnimation) {
      this.currentAnimation.stop();
    }
    this.currentAnimation = this.animations[animationName];
    if (this.currentAnimation) {
      this.currentAnimation.play();
    }
  }

  update() {
    if (this.isAI && this.aiController) {
      const action = this.aiController.getAction(/* pass game state here */);
      this.performAction(action);
    }
    // Update character physics, animations, etc.
  }

  performAction(action) {
    // Implement character actions (move, attack, etc.)
  }

  takeDamage(amount) {
    this.health -= amount;
    if (this.health <= 0) {
      this.defeat();
    }
  }

  defeat() {
    // Handle character defeat
  }
}

class CharacterManager {
  constructor(scene, loader, physicsEngine) {
    this.scene = scene;
    this.loader = loader;
    this.physicsEngine = physicsEngine;
    this.characters = {
      burgerKing: null,
      jeanClaude: null
    };
  }

  createCharacter(characterType, isAI = false) {
    const character = new Character(this.scene, this.loader, this.physicsEngine, characterType, isAI);
    this.characters[characterType] = character;
    return character;
  }

  getCharacter(characterType) {
    return this.characters[characterType];
  }
}

export default CharacterManager;