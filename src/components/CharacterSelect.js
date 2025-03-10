import React, { useState, useEffect } from 'react';
import { CharacterManager } from '../utils/CharacterManager';
import styles from '../styles/CharacterSelect.module.css';

const CharacterSelect = ({ onSelectCharacters }) => {
  const [characters, setCharacters] = useState([]);
  const [selectedCharacters, setSelectedCharacters] = useState([]);

  useEffect(() => {
    const loadCharacters = async () => {
      const characterManager = new CharacterManager();
      const loadedCharacters = await characterManager.getAvailableCharacters();
      setCharacters(loadedCharacters);
    };

    loadCharacters();
  }, []);

  const handleCharacterSelect = (character) => {
    if (selectedCharacters.length < 2 && !selectedCharacters.includes(character)) {
      setSelectedCharacters([...selectedCharacters, character]);
    }
  };

  const handleConfirmSelection = () => {
    if (selectedCharacters.length === 2) {
      onSelectCharacters(selectedCharacters);
    }
  };

  return (
    <div className={styles.characterSelect}>
      <h2>Select Your Characters</h2>
      <div className={styles.characterGrid}>
        {characters.map((character) => (
          <div
            key={character.id}
            className={`${styles.characterCard} ${
              selectedCharacters.includes(character) ? styles.selected : ''
            }`}
            onClick={() => handleCharacterSelect(character)}
          >
            <img src={character.thumbnail} alt={character.name} />
            <p>{character.name}</p>
          </div>
        ))}
      </div>
      <button
        className={styles.confirmButton}
        onClick={handleConfirmSelection}
        disabled={selectedCharacters.length !== 2}
      >
        Confirm Selection
      </button>
    </div>
  );
};

export default CharacterSelect;