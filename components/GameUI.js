import '../styles/GameUI.module.css'; // You'll need to create this CSS file

import React, {
  useEffect,
  useRef,
  useState,
} from 'react';

const GameUI = ({ gameState, onStartGame, onRestartGame }) => {
  const [showStartScreen, setShowStartScreen] = useState(true);
  const [showGameOverScreen, setShowGameOverScreen] = useState(false);
  const backgroundMusicRef = useRef(null);
  const soundEffectsRef = useRef(null);

  useEffect(() => {
    if (gameState.isGameOver) {
      setShowGameOverScreen(true);
      playSound('gameOver');
    }
  }, [gameState.isGameOver]);

  const handleStartGame = () => {
    setShowStartScreen(false);
    onStartGame();
    playBackgroundMusic();
  };

  const handleRestartGame = () => {
    setShowGameOverScreen(false);
    onRestartGame();
    playBackgroundMusic();
  };

  const playBackgroundMusic = () => {
    if (backgroundMusicRef.current) {
      backgroundMusicRef.current.play();
    }
  };

  const playSound = (sound) => {
    if (soundEffectsRef.current) {
      soundEffectsRef.current.src = `/sounds/${sound}.mp3`;
      soundEffectsRef.current.play();
    }
  };

  return (
    <div className="game-ui">
      {showStartScreen && (
        <div className="start-screen">
          <h1>Burger vs Jean</h1>
          <button onClick={handleStartGame}>Start Game</button>
        </div>
      )}

      {!showStartScreen && !showGameOverScreen && (
        <div className="health-bars">
          <div className="health-bar">
            <div className="health-label">Burger</div>
            <div className="health-bar-inner" style={{ width: `${gameState.burgerHealth}%` }}></div>
          </div>
          <div className="health-bar">
            <div className="health-label">Jean</div>
            <div className="health-bar-inner" style={{ width: `${gameState.jeanHealth}%` }}></div>
          </div>
        </div>
      )}

      {showGameOverScreen && (
        <div className="game-over-screen">
          <h2>Game Over</h2>
          <p>{gameState.winner} wins!</p>
          <button onClick={handleRestartGame}>Play Again</button>
        </div>
      )}

      <audio ref={backgroundMusicRef} loop>
        <source src="/sounds/background-music.mp3" type="audio/mpeg" />
      </audio>
      <audio ref={soundEffectsRef}></audio>
    </div>
  );
};

export default GameUI;