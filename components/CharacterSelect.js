import React, { useState, useRef } from 'react';
import styles from '../styles/CharacterSelect.module.css';
import CharacterPreview from './CharacterPreview';
import { loadCustomCharacter } from '../lib/CharacterManager';

const CharacterSelect = ({ onSelectCharacter }) => {
  const [selectedCharacter, setSelectedCharacter] = useState(null);
  const [customCharacter, setCustomCharacter] = useState(null);
  const fileInputRef = useRef(null);

  const characters = [
    { id: 'burger', name: 'Burger' },
    { id: 'jean', name: 'Jean' },
    // Add more default characters here
  ];

  const handleSelect = (character) => {
    setSelectedCharacter(character);
  };

  const handleConfirm = () => {
    if (selectedCharacter) {
      onSelectCharacter(selectedCharacter);
    }
  };

  const handleFileUpload = async (event) => {
    const files = event.target.files;
    if (files.length > 0) {
      try {
        const customChar = await loadCustomCharacter(files);
        setCustomCharacter(customChar);
        setSelectedCharacter(customChar);
      } catch (error) {
        console.error('Error loading custom character:', error);
        alert('Failed to load custom character. Please try again.');
      }
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
              selectedCharacter === character ? styles.selected : ''
            }`}
            onClick={() => handleSelect(character)}
          >
            <CharacterPreview characterId={character.id} />
            <p className={styles.characterName}>{character.name}</p>
          </div>
        ))}
        {customCharacter && (
          <div
            className={`${styles.characterCard} ${
              selectedCharacter === customCharacter ? styles.selected : ''
            }`}
            onClick={() => handleSelect(customCharacter)}
          >
            <CharacterPreview character={customCharacter} />
            <p className={styles.characterName}>{customCharacter.name}</p>
          </div>
        )}
      </div>
      <div className={styles.uploadContainer}>
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileUpload}
          accept=".obj,.fbx,.jpg,.png"
          style={{ display: 'none' }}
          multiple
        />
        <button
          className={styles.uploadButton}
          onClick={() => fileInputRef.current.click()}
        >
          Upload Custom Character
        </button>
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