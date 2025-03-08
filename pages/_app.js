import '../styles/globals.css';
import { useState, useEffect } from 'react';
import GameEngine from '../src/gameEngine';
import MultiplayerManager from '../src/multiplayerManager';

export default function App({ Component, pageProps }) {
  const [gameEngine, setGameEngine] = useState(null);
  const [multiplayerManager, setMultiplayerManager] = useState(null);

  useEffect(() => {
    const newGameEngine = new GameEngine();
    const newMultiplayerManager = new MultiplayerManager(newGameEngine);

    newGameEngine.setMultiplayerManager(newMultiplayerManager);
    newMultiplayerManager.connect('http://your-server-url.com'); // Replace with your actual server URL

    setGameEngine(newGameEngine);
    setMultiplayerManager(newMultiplayerManager);

    return () => {
      // Clean up resources when component unmounts
      if (multiplayerManager) {
        multiplayerManager.leaveGame();
      }
    };
  }, []);

  return (
    <Component
      {...pageProps}
      gameEngine={gameEngine}
      multiplayerManager={multiplayerManager}
    />
  );
}