import React, { useState, useRef } from 'react';
import styles from '../styles/CharacterSelect.module.css';
import CharacterPreview from './CharacterPreview';
import { loadCustomCharacter } from '../lib/CharacterManager';

const CharacterSelect = ({ onCharacterSelect, selectedGameMode }) => {
  const [selectedCharacters, setSelectedCharacters] = useState({});
  const [customCharacters, setCustomCharacters] = useState([]);
  const fileInputRef = useRef(null);

  const defaultCharacters = [
    { id: 'burger', name: 'Burger King Classic' },
    { id: 'whopper', name: 'Burger King Whopper' },
    { id: 'chicken', name: 'Burger King Chicken' },
    { id: 'kickboxer', name: 'Van Damme Kickboxer' },
    { id: 'universal', name: 'Van Damme Universal Soldier' },
    { id: 'timecop', name: 'Van Damme Timecop' },
  ];

  const handleSelect = (character, player) => {
    setSelectedCharacters({...selectedCharacters, [player]: character});
    onCharacterSelect(player, character);
  };

  const handleFileUpload = async (event) => {
    const files = event.target.files;
    if (files.length > 0) {
      try {
        const customChar = await loadCustomCharacter(files);
        setCustomCharacters([...customCharacters, customChar]);
      } catch (error) {
        console.error('Error loading custom character:', error);
        alert('Failed to load custom character. Please try again.');
      }
    }
  };

  const renderCharacterGrid = (player) => (
    <div className={styles.charactersGrid}>
      {[...defaultCharacters, ...customCharacters].map((character) => (
        <div
          key={character.id}
          className={`${styles.characterCard} ${
            selectedCharacters[player] === character ? styles.selected : ''
          }`}
          onClick={() => handleSelect(character, player)}
        >
          <CharacterPreview characterId={character.id} />
          <p className={styles.characterName}>{character.name}</p>
        </div>
      ))}
    </div>
  );

  return (
    <div className={styles.characterSelectContainer}>
      <h2 className={styles.title}>Select Your Character{selectedGameMode === 'multiplayer' ? 's' : ''}</h2>
      {selectedGameMode === 'multiplayer' ? (
        <>
          <div className={styles.playerSection}>
            <h3>Player 1</h3>
            {renderCharacterGrid('player1')}
          </div>
          <div className={styles.playerSection}>
            <h3>Player 2</h3>
            {renderCharacterGrid('player2')}
          </div>
        </>
      ) : (
        renderCharacterGrid('player1')
      )}
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
    </div>
  );
};

export default CharacterSelect;