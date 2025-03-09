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

    newGameEngine.setMultiplayerManager(newMultiplayerManager);
    newMultiplayerManager.connect('http://your-server-url.com'); // Replace with your actual server URL

    setGameEngine(newGameEngine);
    setMultiplayerManager(newMultiplayerManager);

    return () => {
      newGameEngine.stop(); // Proper cleanup for the game engine
      newMultiplayerManager.leaveGame(); // Proper cleanup for multiplayer
    };
  }, []); // Ensures this effect runs only once on mount

  return (
    <Component
      {...pageProps}
      gameEngine={gameEngine}
      multiplayerManager={multiplayerManager}
    />
  );
}
