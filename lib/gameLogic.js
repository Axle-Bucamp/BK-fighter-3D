import { create } from 'zustand';

const ATTACK_DAMAGE = 10;
const MOVEMENT_SPEED = 0.1;

export const useGameStore = create((set) => ({
  player1: { position: -2, health: 100, isAttacking: false },
  player2: { position: 2, health: 100, isAttacking: false },

  movePlayer: (player, direction) => set((state) => {
    const newPosition = state[player].position + direction * MOVEMENT_SPEED;
    return {
      [player]: {
        ...state[player],
        position: Math.max(-3, Math.min(3, newPosition)), // Limit movement within -3 to 3
      }
    };
  }),

  attack: (attacker) => set((state) => {
    const defender = attacker === 'player1' ? 'player2' : 'player1';
    const distance = Math.abs(state[attacker].position - state[defender].position);

    if (distance < 1) { // Attack range
      return {
        [defender]: {
          ...state[defender],
          health: Math.max(0, state[defender].health - ATTACK_DAMAGE),
        },
        [attacker]: {
          ...state[attacker],
          isAttacking: true,
        }
      };
    }
    return {};
  }),

  resetAttack: (player) => set((state) => ({
    [player]: {
      ...state[player],
      isAttacking: false,
    }
  })),
}));

export const useKeyPress = (targetKey) => {
  const [keyPressed, setKeyPressed] = React.useState(false);

  const downHandler = ({ key }) => {
    if (key === targetKey) setKeyPressed(true);
  };

  const upHandler = ({ key }) => {
    if (key === targetKey) setKeyPressed(false);
  };

  React.useEffect(() => {
    window.addEventListener('keydown', downHandler);
    window.addEventListener('keyup', upHandler);
    return () => {
      window.removeEventListener('keydown', downHandler);
      window.removeEventListener('keyup', upHandler);
    };
  }, []);

  return keyPressed;
};