import * as THREE from 'three';

const arenas = {
  default: {
    geometry: new THREE.PlaneGeometry(10, 10),
    material: new THREE.MeshBasicMaterial({ color: 0x00ff00 }),
  },
  // Add more arenas here
};

export function createArena(arenaName) {
  const arenaConfig = arenas[arenaName] || arenas.default;
  const mesh = new THREE.Mesh(arenaConfig.geometry, arenaConfig.material);
  return { mesh, name: arenaName };
}

export function updateArena(arena) {
  // Add any arena-specific updates here
}