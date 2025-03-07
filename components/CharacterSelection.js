import React from 'react';

import styles from '../styles/CharacterSelection.module.css';

const CharacterSelection = ({ onSelectCharacter, onBack }) => {
  const characters = ['Burger', 'Jean'];

  return (
    <div className={styles.characterSelection}>
      <h2>Select Your Character</h2>
      <div className={styles.characters}>
        {characters.map((character, index) => (
          <button key={index} onClick={() => onSelectCharacter(character)}>
            {character}
          </button>
        ))}
      </div>
      <button onClick={onBack}>Back</button>
    </div>
  );
};

export default CharacterSelection;