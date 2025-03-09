import '../styles/globals.css';

import {
  useEffect,
  useState,
} from 'react';

import GameEngine from '../src/gameEngine';
import MultiplayerManager from '../src/multiplayerManager';

export default function App({ Component, pageProps }) {
  const [gameEngine, setGameEngine] = useState(null);
  const [multiplayerManager, setMultiplayerManager] = useState(null);

  useEffect(() => {
    const newGameEngine = new GameEngine();
    const newMultiplayerManager = new MultiplayerManager(newGameEngine);

    newMultiplayerManager.connect('http://localhost:3001'); // Replace with actual server URL

    setGameEngine(newGameEngine);
    setMultiplayerManager(newMultiplayerManager);

    return () => {
      if (newGameEngine.stop) {
        newGameEngine.stop(); // Ensure cleanup logic exists
      }
      if (newMultiplayerManager.leaveGame) {
        newMultiplayerManager.leaveGame(); // Disconnect WebSocket properly
      }
    };
  }, []); // Run only on mount

  return (
    <Component
      {...pageProps}
      gameEngine={gameEngine}
      multiplayerManager={multiplayerManager}
    />
  );
}
