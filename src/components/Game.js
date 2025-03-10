import React, { useState, useEffect } from 'react';
import { CharacterManager } from '../utils/CharacterManager';
import { MultiplayerManager } from '../utils/MultiplayerManager';
import GameScene from './GameScene';
import GameOverScreen from './GameOverScreen';

const Game = ({ gameMode, players, onGameEnd }) => {
  const [characters, setCharacters] = useState([]);
  const [gameState, setGameState] = useState('loading');
  const [winner, setWinner] = useState(null);
  const [scores, setScores] = useState({ player1: 0, player2: 0 });
  const [gameStats, setGameStats] = useState(null);

  useEffect(() => {
    const loadCharacters = async () => {
      const characterManager = new CharacterManager();
      const loadedCharacters = await Promise.all(
        players.map(player => characterManager.loadCharacter(player.character))
      );
      setCharacters(loadedCharacters);
      setGameState('playing');
    };

    loadCharacters();
  }, [players]);

  useEffect(() => {
    if (gameMode === 'multiplayer') {
      const multiplayerManager = new MultiplayerManager();
      // Set up multiplayer logic here
    }
  }, [gameMode]);

  const handleGameOver = (winningPlayer, finalScores, stats) => {
    setWinner(winningPlayer);
    setScores(finalScores);
    setGameStats(stats);
    setGameState('gameOver');
  };

  const handleRestart = () => {
    setGameState('playing');
    setScores({ player1: 0, player2: 0 });
    setGameStats(null);
  };

  const renderGameContent = () => {
    switch (gameState) {
      case 'loading':
        return <div>Loading characters...</div>;
      case 'playing':
        return (
          <GameScene
            characters={characters}
            gameMode={gameMode}
            onGameOver={handleGameOver}
          />
        );
      case 'gameOver':
        return (
          <GameOverScreen
            winner={winner}
            scores={scores}
            gameStats={gameStats}
            onRestart={handleRestart}
            onReturnToMenu={onGameEnd}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="game-container">
      <h2>{gameMode === 'multiplayer' ? 'Multiplayer Mode' : 'Single Player Mode'}</h2>
      {renderGameContent()}
    </div>
  );
};

export default Game;