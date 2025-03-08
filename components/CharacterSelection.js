import React from 'react';
import styles from '../styles/CharacterSelection.module.css';

const characters = [
  { id: 'burger_king', name: 'Burger King' },
  { id: 'van_damme', name: 'Jean-Claude Van Damme' },
  // Add more characters here
];

const CharacterSelection = ({ onCharacterSelect }) => {
  return (
    <div className={styles.characterSelection}>
      <h2>Select Your Fighter</h2>
      <div className={styles.characterGrid}>
        {characters.map((character) => (
          <button
            key={character.id}
            className={styles.characterButton}
            onClick={() => onCharacterSelect(character)}
          >
            {character.name}
          </button>
        ))}
      </div>
    </div>
  );
};

export default CharacterSelection;