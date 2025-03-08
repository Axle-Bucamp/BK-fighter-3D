import * as THREE from 'three';
import { createCharacter, updateCharacter } from './gameLogic';

export function initGame(scene, camera) {
  const player1 = createCharacter('BurgerKing', 0x0000ff);
  const player2 = createCharacter('JeanClaudeVanDamme', 0xff0000);

  scene.add(player1.mesh);
  scene.add(player2.mesh);

  camera.position.z = 5;

  return { player1, player2 };
}

export function updateGame(gameState) {
  updateCharacter(gameState.player1);
  updateCharacter(gameState.player2);
}