import React, { useState, useEffect } from 'react';
import styles from '../styles/CharacterSelect.module.css';
import CharacterPreview from './CharacterPreview';
import { loadCustomCharacter } from '../lib/CharacterManager';

const CharacterSelect = ({ onSelectCharacter }) => {
  const [selectedCharacter, setSelectedCharacter] = useState(null);
  const [characters, setCharacters] = useState([
    { id: 'burger', name: 'Burger' },
    { id: 'jean', name: 'Jean' },
  ]);
  const [customCharacter, setCustomCharacter] = useState(null);

  const handleSelect = (character) => {
    setSelectedCharacter(character);
  };

  const handleConfirm = () => {
    if (selectedCharacter) {
      onSelectCharacter(selectedCharacter);
    }
  };

  const handleCustomCharacterUpload = async (event) => {
    const files = event.target.files;
    if (files.length > 0) {
      const objFile = Array.from(files).find(file => file.name.endsWith('.obj'));
      const fbxFile = Array.from(files).find(file => file.name.endsWith('.fbx'));
      const jpgFile = Array.from(files).find(file => file.name.endsWith('.jpg'));

      if (objFile && fbxFile && jpgFile) {
        const customChar = await loadCustomCharacter(objFile, fbxFile, jpgFile);
        setCustomCharacter(customChar);
        setCharacters([...characters, customChar]);
      } else {
        alert('Please upload all required files: .obj, .fbx, and .jpg');
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
            <CharacterPreview character={character} />
            <p className={styles.characterName}>{character.name}</p>
          </div>
        ))}
      </div>
      <div className={styles.customCharacterUpload}>
        <input
          type="file"
          accept=".obj,.fbx,.jpg"
          multiple
          onChange={handleCustomCharacterUpload}
        />
        <label>Upload Custom Character (.obj, .fbx, .jpg)</label>
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