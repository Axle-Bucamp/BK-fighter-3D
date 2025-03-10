import React, { useState } from 'react';

import styles from '../styles/CharacterSelection.module.css';

const characters = [
  { name: 'burger', class: Burger, image: '/images/burger.png' },
  { name: 'jean', class: Jean, image: '/images/jean.png' },
];

const CharacterSelection = ({ onCharacterSelect }) => {
  const [selectedCharacter, setSelectedCharacter] = useState(null);

  const handleCharacterClick = (character) => {
    setSelectedCharacter(character);
  };

  const handleConfirmSelection = () => {
    if (selectedCharacter) {
      onCharacterSelect(selectedCharacter.class);
    }
  };

  return (
    <div className={styles.characterSelectionContainer}>
      <h2>Select Your Character</h2>
      <div className={styles.characterGrid}>
        {characters.map((character) => (
          <div
            key={character.name}
            className={`${styles.characterCard} ${selectedCharacter === character ? styles.selected : ''}`}
            onClick={() => handleCharacterClick(character)}
          >
            <img src={character.image} alt={character.name} />
            <h3>{character.name}</h3>
            <p>Strength: {character.class.prototype.strength}</p>
            <p>Speed: {character.class.prototype.speed}</p>
          </div>
        ))}
      </div>
      <button
        className={styles.confirmButton}
        onClick={handleConfirmSelection}
        disabled={!selectedCharacter}
      >
        Confirm Selection
      </button>
    </div>
  );
};

export default CharacterSelection;