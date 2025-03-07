import { useState } from 'react';
import { useRouter } from 'next/router';
import styles from '../styles/MainMenu.module.css';

export default function MainMenu() {
  const [selectedOption, setSelectedOption] = useState(null);
  const router = useRouter();

  const handleOptionClick = (option) => {
    setSelectedOption(option);
    switch (option) {
      case 'start':
        router.push('/game');
        break;
      case 'characters':
        router.push('/character-selection');
        break;
      case 'options':
        router.push('/options');
        break;
      default:
        break;
    }
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Fighting Game</h1>
      <div className={styles.menuOptions}>
        <button 
          className={`${styles.menuButton} ${selectedOption === 'start' ? styles.selected : ''}`}
          onClick={() => handleOptionClick('start')}
        >
          Start Game
        </button>
        <button 
          className={`${styles.menuButton} ${selectedOption === 'characters' ? styles.selected : ''}`}
          onClick={() => handleOptionClick('characters')}
        >
          Character Selection
        </button>
        <button 
          className={`${styles.menuButton} ${selectedOption === 'options' ? styles.selected : ''}`}
          onClick={() => handleOptionClick('options')}
        >
          Options
        </button>
      </div>
    </div>
  );
}