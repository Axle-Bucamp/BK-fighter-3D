import React from 'react';
import Character from './Character';

const Game: React.FC = () => {
  return (
    <div className="game">
      <Character name="Burger" />
      <Character name="Jean" />
    </div>
  );
};

export default Game;