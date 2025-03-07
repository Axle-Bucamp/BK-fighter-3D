import create from 'zustand';
import { useEffect, useState } from 'react';

const GAME_WIDTH = 800;
const GAME_HEIGHT = 600;
const CHARACTER_SPEED = 5;
const ATTACK_RANGE = 100;
const ATTACK_DAMAGE = 10;

export const useGameStore = create((set) => ({
  characters: {
    player1: { x: 100, y: GAME_HEIGHT - 200, health: 100, attacking: false, direction: 1, character: null },
    player2: { x: GAME_WIDTH - 200, y: GAME_HEIGHT - 200, health: 100, attacking: false, direction: -1, character: null },
  },
  setCharacter: (player, character) => set(state => ({
    characters: {
      ...state.characters,
      [player]: { ...state.characters[player], character }
    }
  })),
  moveCharacter: (player, direction) => set(state => {
    const newX = state.characters[player].x + direction * CHARACTER_SPEED;
    if (newX >= 0 && newX <= GAME_WIDTH - 100) {
      return {
        characters: {
          ...state.characters,
          [player]: {
            ...state.characters[player],
            x: newX,
            direction: direction > 0 ? 1 : -1,
          }
        }
      };
    }
    return state;
  }),
  attack: (attacker) => set(state => {
    const defender = attacker === 'player1' ? 'player2' : 'player1';
    const attackerState = state.characters[attacker];
    const defenderState = state.characters[defender];

    if (Math.abs(attackerState.x - defenderState.x) <= ATTACK_RANGE) {
      return {
        characters: {
          ...state.characters,
          [attacker]: { ...attackerState, attacking: true },
          [defender]: { ...defenderState, health: Math.max(0, defenderState.health - ATTACK_DAMAGE) }
        }
      };
    }
    return {
      characters: {
        ...state.characters,
        [attacker]: { ...attackerState, attacking: true }
      }
    };
  }),
  resetAttack: (player) => set(state => ({
    characters: {
      ...state.characters,
      [player]: { ...state.characters[player], attacking: false }
    }
  })),
}));

export function useKeyPress(targetKey) {
  const [keyPressed, setKeyPressed] = useState(false);

  useEffect(() => {
    const downHandler = ({ key }) => targetKey === key && setKeyPressed(true);
    const upHandler = ({ key }) => targetKey === key && setKeyPressed(false);

    window.addEventListener('keydown', downHandler);
    window.addEventListener('keyup', upHandler);

    return () => {
      window.removeEventListener('keydown', downHandler);
      window.removeEventListener('keyup', upHandler);
    };
  }, [targetKey]);

  return keyPressed;
}