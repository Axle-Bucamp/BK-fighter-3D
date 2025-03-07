import React, { useState, useEffect } from 'react';
import StartScreen from './StartScreen';
import GameOverScreen from './GameOverScreen';
import OptionsMenu from './OptionsMenu';
import GameEngine from '../lib/gameEngine';
import styles from '../styles/Game.module.css';

const Game = () => {
  const [gameState, setGameState] = useState('start');
  const [showOptions, setShowOptions] = useState(false);
  const [gameEngine, setGameEngine] = useState(null);

  useEffect(() => {
    setGameEngine(new GameEngine());
  }, []);

  const handleStartGame = () => {
    setGameState('playing');
    gameEngine.resetGame();
  };

  const handleOpenOptions = () => {
    setShowOptions(true);
  };

  const handleCloseOptions = () => {
    setShowOptions(false);
  };

  const handleAttack = (attackerId, defenderId, damage) => {
    gameEngine.attack(attackerId, defenderId, damage);
    const currentState = gameEngine.getGameState();
    
    if (currentState.isGameOver) {
      setGameState('gameOver');
    } else {
      setGameState('playing'); // Force a re-render
    }
  };

  const handleRestartGame = () => {
    gameEngine.resetGame();
    setGameState('playing');
  };

  const handleReturnToMenu = () => {
    setGameState('start');
  };

  const renderGameContent = () => {
    if (!gameEngine) return null;

    const { players, currentTurn, isGameOver, winner, finalScores } = gameEngine.getGameState();

    switch (gameState) {
      case 'start':
        return (
          <StartScreen 
            onStartGame={handleStartGame} 
            onOpenOptions={handleOpenOptions}
          />
        );
      case 'playing':
        return (
          <div className={styles.gamePlay}>
            <h2>Burger vs. Jean</h2>
            <div className={styles.playerInfo}>
              <p>Burger Health: {players[0].health}</p>
              <p>Jean Health: {players[1].health}</p>
            </div>
            <p>Current Turn: {players[currentTurn].name}</p>
            <button onClick={() => handleAttack(currentTurn, 1 - currentTurn, 10)}>
              Attack!
            </button>
          </div>
        );
      case 'gameOver':
        return (
          <GameOverScreen 
            winner={winner}
            finalScores={finalScores}
            onRestart={handleRestartGame}
            onReturnToMenu={handleReturnToMenu}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className={styles.game}>
      {renderGameContent()}
      {showOptions && (
        <OptionsMenu onClose={handleCloseOptions} />
      )}
    </div>
  );
};

export default Game;