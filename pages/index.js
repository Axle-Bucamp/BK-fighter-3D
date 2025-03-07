import { useState } from 'react';
import { useRouter } from 'next/router';
import styles from '../styles/Home.module.css';

export default function Home() {
  const router = useRouter();
  const [playerName, setPlayerName] = useState('');

  const handleStartGame = () => {
    if (playerName.trim() !== '') {
      router.push('/character-selection');
    }
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Welcome to the Fighting Game</h1>
      <input
        type="text"
        value={playerName}
        onChange={(e) => setPlayerName(e.target.value)}
        placeholder="Enter your name"
        className={styles.input}
      />
      <button onClick={handleStartGame} className={styles.button}>
        Start Game
      </button>
    </div>
  );
}