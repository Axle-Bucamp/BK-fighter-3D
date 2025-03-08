import * as THREE from 'three';

export function createCharacter(name, color) {
  const geometry = new THREE.BoxGeometry(1, 2, 1);
  const material = new THREE.MeshBasicMaterial({ color });
  const mesh = new THREE.Mesh(geometry, material);

  return {
    name,
    mesh,
    health: 100,
    position: { x: 0, y: 0, z: 0 },
    velocity: { x: 0, y: 0, z: 0 },
  };
}

export function updateCharacter(character) {
  // Update character position based on velocity
  character.position.x += character.velocity.x;
  character.position.y += character.velocity.y;
  character.position.z += character.velocity.z;

  // Update mesh position
  character.mesh.position.set(character.position.x, character.position.y, character.position.z);
}

export function performAttack(attacker, defender) {
  // Simple attack logic
  const damage = Math.floor(Math.random() * 20) + 1;
  defender.health -= damage;
  return damage;
}

export function checkCollision(character1, character2) {
  // Simple collision detection
  const distance = character1.mesh.position.distanceTo(character2.mesh.position);
  return distance < 2; // Assuming characters are 1 unit wide
}