import React, { useState, useEffect, useRef } from 'react';
import styles from './Game.module.css';
import { initGame, updateGame, renderGame } from '../lib/gameEngine';
import { loadAudioAssets, playBackgroundMusic, stopAllSounds } from '../lib/audioManager';
import OptionsMenu from './OptionsMenu';
import StartScreen from './StartScreen';
import GameOverScreen from './GameOverScreen';

const Game = () => {
  const canvasRef = useRef(null);
  const [gameState, setGameState] = useState('start'); // 'start', 'playing', 'gameOver'
  const [showOptions, setShowOptions] = useState(false);
  const [winner, setWinner] = useState(null);
  const [scores, setScores] = useState({ player1: 0, player2: 0 });

  useEffect(() => {
    loadAudioAssets();
  }, []);

  useEffect(() => {
    if (gameState === 'playing') {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      let animationFrameId;

      const game = initGame(canvas.width, canvas.height);

      const gameLoop = () => {
        updateGame(game);
        renderGame(ctx, game);

        if (game.gameOver) {
          setGameState('gameOver');
          setWinner(game.winner);
          setScores(game.scores);
          stopAllSounds();
        } else {
          animationFrameId = requestAnimationFrame(gameLoop);
        }
      };

      gameLoop();
      playBackgroundMusic();

      return () => {
        cancelAnimationFrame(animationFrameId);
        stopAllSounds();
      };
    }
  }, [gameState]);

  const handleStartGame = () => {
    setGameState('playing');
  };

  const handleOpenOptions = () => {
    setShowOptions(true);
  };

  const handleCloseOptions = () => {
    setShowOptions(false);
  };

  const handleRestart = () => {
    setGameState('playing');
  };

  const handleMainMenu = () => {
    setGameState('start');
  };

  return (
    <div className={styles.game}>
      {gameState === 'start' && (
        <StartScreen onStartGame={handleStartGame} onOpenOptions={handleOpenOptions} />
      )}
      {gameState === 'playing' && (
        <canvas ref={canvasRef} width={800} height={600} />
      )}
      {gameState === 'gameOver' && (
        <GameOverScreen
          winner={winner}
          scores={scores}
          onRestart={handleRestart}
          onMainMenu={handleMainMenu}
        />
      )}
      {showOptions && (
        <OptionsMenu onClose={handleCloseOptions} />
      )}
    </div>
  );
};

export default Game;