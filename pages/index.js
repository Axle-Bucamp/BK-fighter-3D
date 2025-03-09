import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import styles from '../styles/Home.module.css';
import Game from '../components/Game';
import Menu from '../components/Menu';
import TutorialScreen from '../components/TutorialScreen';
import GameStateManager from '../game/GameStateManager';
import { GAME_STATES } from '../game/constants';

export default function Home() {
  const [gameState, setGameState] = useState(GAME_STATES.MENU);

  useEffect(() => {
    const handleStateChange = (newState) => {
      setGameState(newState);
    };

    GameStateManager.addListener(handleStateChange);

    return () => {
      GameStateManager.removeListener(handleStateChange);
    };
  }, []);

  const startGame = () => GameStateManager.setState(GAME_STATES.GAME);
  const showTutorial = () => GameStateManager.setState(GAME_STATES.TUTORIAL);
  const returnToMenu = () => GameStateManager.setState(GAME_STATES.MENU);

  return (
    <div className={styles.container}>
      <Head>
        <title>Burger vs. Jean</title>
        <meta name="description" content="An epic fighting game featuring Burger and Jean" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <h1 className={styles.title}>Burger vs. Jean</h1>

        {gameState === GAME_STATES.MENU && (
          <Menu onStartGame={startGame} onShowTutorial={showTutorial} />
        )}

        {gameState === GAME_STATES.GAME && (
          <Game onReturnToMenu={returnToMenu} />
        )}

        {gameState === GAME_STATES.TUTORIAL && (
          <TutorialScreen onReturnToMenu={returnToMenu} />
        )}
      </main>

      <footer className={styles.footer}>
        <p>&copy; 2023 Burger vs. Jean. All rights reserved.</p>
      </footer>
    </div>
  );
}