import * as THREE from 'three';

const characters = {
  BurgerKing: {
    geometry: new THREE.BoxGeometry(1, 2, 1),
    material: new THREE.MeshBasicMaterial({ color: 0xffff00 }),
  },
  JeanClaudeVanDamme: {
    geometry: new THREE.BoxGeometry(1, 2, 1),
    material: new THREE.MeshBasicMaterial({ color: 0xff0000 }),
  },
  // Add new characters here
  NewCharacter1: {
    geometry: new THREE.SphereGeometry(1, 32, 32),
    material: new THREE.MeshBasicMaterial({ color: 0x00ff00 }),
  },
  NewCharacter2: {
    geometry: new THREE.ConeGeometry(1, 2, 32),
    material: new THREE.MeshBasicMaterial({ color: 0x0000ff }),
  },
};

export function createCharacter(characterName, color) {
  const characterConfig = characters[characterName];
  if (!characterConfig) {
    console.error(`Character ${characterName} not found`);
    return null;
  }
  const mesh = new THREE.Mesh(characterConfig.geometry, characterConfig.material);
  return { mesh, name: characterName };
}

export function updateCharacter(character) {
  // Add character-specific updates here
}