import React, { useState } from 'react';
import Head from 'next/head';
import styles from '../styles/Home.module.css';
import Game from '../components/Game';
import Menu from '../components/Menu';
import TutorialScreen from '../components/TutorialScreen';

export default function Home() {
  const [gameState, setGameState] = useState('menu'); // Possible states: 'menu', 'game', 'tutorial'

  const startGame = () => setGameState('game');
  const showTutorial = () => setGameState('tutorial');
  const returnToMenu = () => setGameState('menu');

  return (
    <div className={styles.container}>
      <Head>
        <title>Burger vs. Jean</title>
        <meta name="description" content="An epic fighting game featuring Burger and Jean" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <h1 className={styles.title}>Burger vs. Jean</h1>

        {gameState === 'menu' && (
          <Menu onStartGame={startGame} onShowTutorial={showTutorial} />
        )}

        {gameState === 'game' && (
          <Game onReturnToMenu={returnToMenu} />
        )}

        {gameState === 'tutorial' && (
          <TutorialScreen onReturnToMenu={returnToMenu} />
        )}
      </main>

      <footer className={styles.footer}>
        <p>&copy; 2023 Burger vs. Jean. All rights reserved.</p>
      </footer>
    </div>
  );
}