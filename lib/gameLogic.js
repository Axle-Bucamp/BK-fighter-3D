import { CANVAS_HEIGHT, CANVAS_WIDTH, PLAYER_INITIAL_HEALTH } from './constants';

export const initialGameState = {
  player1: {
    x: 100,
    y: CANVAS_HEIGHT - 150,
    health: PLAYER_INITIAL_HEALTH,
    character: null,
  },
  player2: {
    x: CANVAS_WIDTH - 100,
    y: CANVAS_HEIGHT - 150,
    health: PLAYER_INITIAL_HEALTH,
    character: null,
  },
  gameOver: false,
  winner: null,
};

export const updateGameState = (state, player1Input, player2Input) => {
  // ... (previous game logic remains unchanged)

  // Check for win/lose condition
  if (state.player1.health <= 0) {
    state.gameOver = true;
    state.winner = 'Player 2';
  } else if (state.player2.health <= 0) {
    state.gameOver = true;
    state.winner = 'Player 1';
  }

  return state;
};

export const resetGameState = () => {
  return { ...initialGameState };
};