import React, { useState } from 'react';
import MainMenu from '../components/MainMenu';
import CharacterSelect from '../components/CharacterSelect';
import Game from '../components/Game';

const IndexPage = () => {
  const [gameState, setGameState] = useState('mainMenu');
  const [selectedCharacter, setSelectedCharacter] = useState(null);
  const [gameMode, setGameMode] = useState(null);

  const handleGameModeSelect = (mode) => {
    setGameMode(mode);
    setGameState('characterSelect');
  };

  const handleCharacterSelect = (character) => {
    setSelectedCharacter(character);
    setGameState('game');
  };

  const handleReturnToMainMenu = () => {
    setGameState('mainMenu');
    setSelectedCharacter(null);
    setGameMode(null);
  };

  return (
    <div>
      {gameState === 'mainMenu' && (
        <MainMenu onGameModeSelect={handleGameModeSelect} />
      )}
      {gameState === 'characterSelect' && (
        <CharacterSelect onCharacterSelect={handleCharacterSelect} onBack={handleReturnToMainMenu} />
      )}
      {gameState === 'game' && (
        <Game
          gameMode={gameMode}
          selectedCharacter={selectedCharacter}
          onReturnToMainMenu={handleReturnToMainMenu}
        />
      )}
    </div>
  );
};

export default IndexPage;