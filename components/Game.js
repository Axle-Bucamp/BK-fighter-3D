import React, { useState, useEffect } from 'react';
import CharacterManager from '../lib/CharacterManager';
import GameScene from './GameScene';
import GameOverScreen from './GameOverScreen';

const Game = ({ gameMode, players, difficulty }) => {
  const [gameState, setGameState] = useState('playing');
  const [winner, setWinner] = useState(null);
  const [scores, setScores] = useState({ player1: 0, player2: 0 });
  const [gameStats, setGameStats] = useState(null);
  const [characters, setCharacters] = useState([]);

  useEffect(() => {
    const loadCharacters = async () => {
      const characterManager = new CharacterManager();
      const loadedCharacters = await Promise.all(
        players.map(player => characterManager.loadCharacter(player.character))
      );
      setCharacters(loadedCharacters);
    };

    loadCharacters();
  }, [players]);

  const handleGameOver = (winner, finalScores, stats) => {
    setGameState('gameOver');
    setWinner(winner);
    setScores(finalScores);
    setGameStats(stats);
  };

  const handleRestart = () => {
    setGameState('playing');
    setWinner(null);
    setScores({ player1: 0, player2: 0 });
    setGameStats(null);
  };

  const handleReturnToMenu = () => {
    // This function should be passed as a prop from a parent component
    // to handle returning to the main menu
    console.log('Returning to main menu');
  };

  if (gameState === 'playing') {
    return (
      <GameScene
        gameMode={gameMode}
        difficulty={difficulty}
        characters={characters}
        onGameOver={handleGameOver}
      />
    );
  } else if (gameState === 'gameOver') {
    return (
      <GameOverScreen
        winner={winner}
        scores={scores}
        gameStats={gameStats}
        onRestart={handleRestart}
        onReturnToMenu={handleReturnToMenu}
      />
    );
  }
};

export default Game;