import * as THREE from 'three';
import { createCharacter, updateCharacter } from './gameLogic';
import { createArena, updateArena } from './arenaManager';
import { setupPhysics, updatePhysics } from './physicsEngine';
import { initializeGameModes, updateGameMode } from './gameModes';

export function initGame(scene, camera) {
  const player1 = createCharacter('BurgerKing', 0x0000ff);
  const player2 = createCharacter('JeanClaudeVanDamme', 0xff0000);

  scene.add(player1.mesh);
  scene.add(player2.mesh);

  const arena = createArena('default');
  scene.add(arena.mesh);

  const physics = setupPhysics();
  const gameModes = initializeGameModes();

  camera.position.z = 5;

  return { player1, player2, arena, physics, gameModes, currentMode: 'arcade' };
}

export function updateGame(gameState) {
  updateCharacter(gameState.player1);
  updateCharacter(gameState.player2);
  updateArena(gameState.arena);
  updatePhysics(gameState.physics, [gameState.player1, gameState.player2, gameState.arena]);
  updateGameMode(gameState.gameModes[gameState.currentMode], gameState);
}

export function switchGameMode(gameState, mode) {
  if (gameState.gameModes[mode]) {
    gameState.currentMode = mode;
  } else {
    console.error(`Game mode ${mode} not found`);
  }
}