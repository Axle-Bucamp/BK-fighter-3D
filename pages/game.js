import React from 'react';
import Game from '../components/Game';

const GamePage = () => {
  const players = [
    { id: 1, character: 'burger_king_classic' },
    { id: 2, character: 'van_damme_kickboxer' },
  ];

  return (
    <div>
      <h1>Battle Royale</h1>
      <Game players={players} />
    </div>
  );
};

export default GamePage;