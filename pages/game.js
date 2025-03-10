import React from 'react';
import Game from '../components/Game';

const GamePage = ({ gameMode, players, difficulty }) => {
  return (
    <div>
      <h1>BK Fighter 3D</h1>
      <Game gameMode={gameMode} players={players} difficulty={difficulty} />
    </div>
  );
};

export default GamePage;