import React, { useState } from 'react';

import CharacterSelect from '../components/CharacterSelect';
import Game from '../components/Game';
import MainMenu from '../components/MainMenu';

const IndexPage = () => {
  const [gameState, setGameState] = useState('menu');
  const [selectedCharacter, setSelectedCharacter] = useState(null);
  const [gameMode, setGameMode] = useState(null);

  const handleStartGame = (mode) => {
    setGameMode(mode);
    setGameState('characterSelect');
  };

  const handleCharacterSelect = (character) => {
    setSelectedCharacter(character);
    setGameState('game');
  };

  const handleReturnToMenu = () => {
    setGameState('menu');
    setSelectedCharacter(null);
    setGameMode(null);
  };

  return (
    <div>
      {gameState === 'menu' && (
        <MainMenu onStartGame={handleStartGame} onSelectGameMode={handleStartGame}/>
      )}
      {gameState === 'characterSelect' && (
        <CharacterSelect onSelect={handleCharacterSelect} onCharacterSelect={handleCharacterSelect} onBack={handleReturnToMenu} />
      )}
      {gameState === 'game' && (
        <Game
          character={selectedCharacter}
          gameMode={gameMode}
          onExit={handleReturnToMenu}
        />
      )}
    </div>
  );
};

export default IndexPage;