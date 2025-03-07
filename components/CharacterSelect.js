import React, { useState } from 'react';
import styles from '../styles/CharacterSelect.module.css';

const CharacterSelect = ({ onSelectCharacter }) => {
  const [selectedCharacter, setSelectedCharacter] = useState(null);

  const characters = [
    { id: 'burger', name: 'Burger' },
    { id: 'jean', name: 'Jean' },
  ];

  const handleSelect = (character) => {
    setSelectedCharacter(character);
  };

  const handleConfirm = () => {
    if (selectedCharacter) {
      onSelectCharacter(selectedCharacter);
    }
  };

  return (
    <div className={styles.characterSelectContainer}>
      <h2 className={styles.title}>Select Your Character</h2>
      <div className={styles.charactersContainer}>
        {characters.map((character) => (
          <div
            key={character.id}
            className={`${styles.characterCard} ${
              selectedCharacter === character.id ? styles.selected : ''
            }`}
            onClick={() => handleSelect(character.id)}
          >
            <img
              src={`/images/${character.id}-placeholder.png`}
              alt={character.name}
              className={styles.characterImage}
            />
            <p className={styles.characterName}>{character.name}</p>
          </div>
        ))}
      </div>
      <button
        className={styles.confirmButton}
        onClick={handleConfirm}
        disabled={!selectedCharacter}
      >
        Confirm Selection
      </button>
    </div>
  );
};

export default CharacterSelect;