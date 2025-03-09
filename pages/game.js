import React from 'react';
import Game from '../components/Game';
import { GAME_MODES, CHARACTERS } from '../src/game/constants';

const GamePage = () => {
  const players = [
    { name: CHARACTERS.BURGER_KING_CLASSIC },
    { name: CHARACTERS.VAN_DAMME_KICKBOXER },
  ];

  return (
    <div>
      <h1>Battle Royale</h1>
      <Game players={players} gameMode={GAME_MODES.TIMED} />
    </div>
  );
};

export default GamePage;