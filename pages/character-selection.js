import { useState } from 'react';
import { useRouter } from 'next/router';
import styles from '../styles/CharacterSelection.module.css';

const characters = [
  { id: 'burger', name: 'Burger', image: '/burger.png' },
  { id: 'jean', name: 'Jean', image: '/jean.png' },
];

export default function CharacterSelection() {
  const router = useRouter();
  const [selectedCharacters, setSelectedCharacters] = useState({ player1: null, player2: null });

  const handleCharacterSelect = (character, player) => {
    setSelectedCharacters(prev => ({ ...prev, [player]: character }));
  };

  const handleStartGame = () => {
    if (selectedCharacters.player1 && selectedCharacters.player2) {
      router.push({
        pathname: '/game',
        query: { 
          player1: selectedCharacters.player1.id, 
          player2: selectedCharacters.player2.id 
        },
      });
    }
  };

  return (
    <div className={styles.container}>
      <h1>Select Your Characters</h1>
      <div className={styles.selectionArea}>
        <div className={styles.playerSelection}>
          <h2>Player 1</h2>
          {characters.map(character => (
            <button
              key={character.id}
              className={`${styles.characterButton} ${selectedCharacters.player1 === character ? styles.selected : ''}`}
              onClick={() => handleCharacterSelect(character, 'player1')}
            >
              <img src={character.image} alt={character.name} />
              <span>{character.name}</span>
            </button>
          ))}
        </div>
        <div className={styles.playerSelection}>
          <h2>Player 2</h2>
          {characters.map(character => (
            <button
              key={character.id}
              className={`${styles.characterButton} ${selectedCharacters.player2 === character ? styles.selected : ''}`}
              onClick={() => handleCharacterSelect(character, 'player2')}
            >
              <img src={character.image} alt={character.name} />
              <span>{character.name}</span>
            </button>
          ))}
        </div>
      </div>
      <button 
        className={styles.startButton} 
        onClick={handleStartGame}
        disabled={!selectedCharacters.player1 || !selectedCharacters.player2}
      >
        Start Game
      </button>
    </div>
  );
}