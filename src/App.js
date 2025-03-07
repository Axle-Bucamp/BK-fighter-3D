import React, { useState } from 'react';
import Game from './components/Game';
import StartScreen from './components/StartScreen';
import GameOverScreen from './components/GameOverScreen';
import soundEffects from './lib/soundEffects';
import styles from './App.module.css';

const App = () => {
  const [gameState, setGameState] = useState('start');
  const [gameMode, setGameMode] = useState('single');
  const [difficulty, setDifficulty] = useState('medium');
  const [winner, setWinner] = useState(null);
  const [scores, setScores] = useState({ burger: 0, jean: 0 });
  const [gameStats, setGameStats] = useState(null);

  const handleStartGame = (mode, diff) => {
    setGameMode(mode);
    setDifficulty(diff);
    setGameState('playing');
    soundEffects.playSound('gameStart');
    soundEffects.playMusic();
  };

  const handleGameOver = (winner, finalScores, stats) => {
    setWinner(winner);
    setScores(finalScores);
    setGameStats(stats);
    setGameState('gameOver');
    soundEffects.playSound('gameOver');
    soundEffects.stopMusic();
  };

  const handleRestartGame = () => {
    setGameState('playing');
    soundEffects.playSound('gameStart');
    soundEffects.playMusic();
  };

  const handleReturnToMenu = () => {
    setGameState('start');
    soundEffects.stopMusic();
  };

  return (
    <div className={styles.app}>
      {gameState === 'start' && (
        <StartScreen onStartGame={handleStartGame} />
      )}
      {gameState === 'playing' && (
        <Game
          gameMode={gameMode}
          difficulty={difficulty}
          onGameOver={handleGameOver}
        />
      )}
      {gameState === 'gameOver' && (
        <GameOverScreen
          winner={winner}
          scores={scores}
          gameStats={gameStats}
          onRestart={handleRestartGame}
          onReturnToMenu={handleReturnToMenu}
        />
      )}
    </div>
  );
};

export default App;