import React, { useState } from 'react';

import CharacterSelect from '../components/CharacterSelect';
import Game from '../components/Game';
import MainMenu from '../components/MainMenu';
import OptionsMenu
  from '../components/OptionsMenu'; // New Options Menu Component

const IndexPage = () => {
  const [gameState, setGameState] = useState('menu');
  const [selectedCharacters, setSelectedCharacters] = useState({
    player1: null,
    player2: null,
  });
  const [gameMode, setGameMode] = useState(null);

  const handleStartGame = (mode) => {
    setGameMode(mode);
    setGameState('characterSelect');
  };

  const handleSelectCharacter = (player, character) => {
    setSelectedCharacters((prev) => ({
      ...prev,
      [player]: character,
    }));
  
    if (gameMode === 'singleplayer' || (gameMode === 'multiplayer' && selectedCharacters.player1)) {
      setGameState('game');
    }
  };

  const handleOpenOptions = () => {
    setGameState('options');
  };

  const handleReturnToMenu = () => {
    setGameState('menu');
    setSelectedCharacters({ player1: null, player2: null });
    setGameMode(null);
  };

  return (
    <div>
      {gameState === 'menu' && (
        <MainMenu onSelectGameMode={handleStartGame} onOpenOptions={handleOpenOptions} />
      )}
      {gameState === 'characterSelect' && (
        <CharacterSelect
          onSelect={handleSelectCharacter}
          onBack={handleReturnToMenu}
          onCharacterSelect={handleSelectCharacter}

        />
      )}
      {gameState === 'game' && (
        <Game
          selectedCharacters={selectedCharacters}
          gameMode={gameMode}
          onExit={handleReturnToMenu}
          onCharacterSelect={handleSelectCharacter}
        />
      )}
      {gameState === 'options' && (
        <OptionsMenu onBack={handleReturnToMenu} />
      )}
    </div>
  );
};

export default IndexPage;
