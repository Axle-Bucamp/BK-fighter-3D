import React, { useEffect, useRef } from 'react';
import GameEngine from './gameEngine';
import './App.css';

function App() {
  const gameContainerRef = useRef(null);
  const gameEngineRef = useRef(null);

  useEffect(() => {
    if (!gameEngineRef.current) {
      gameEngineRef.current = new GameEngine();
      gameContainerRef.current.appendChild(gameEngineRef.current.renderer.domElement);
    }

    const handleResize = () => {
      gameEngineRef.current.onWindowResize();
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      if (gameEngineRef.current) {
        gameContainerRef.current.removeChild(gameEngineRef.current.renderer.domElement);
        gameEngineRef.current = null;
      }
    };
  }, []);

  const startArcadeMode = () => {
    gameEngineRef.current.startGame('arcade');
  };

  const startVersusMode = () => {
    gameEngineRef.current.startGame('versus');
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>BK-fighter-3D</h1>
      </header>
      <main>
        <div className="game-container" ref={gameContainerRef}></div>
        <div className="controls">
          <button onClick={startArcadeMode}>Start Arcade Mode</button>
          <button onClick={startVersusMode}>Start Versus Mode</button>
        </div>
      </main>
    </div>
  );
}

export default App;