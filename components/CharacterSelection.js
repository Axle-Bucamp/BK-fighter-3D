import React, { useState } from 'react';
import styles from '../styles/CharacterSelection.module.css';
import { BurgerKingClassic } from './BurgerKingClassic';
import { BurgerKingWhopper } from './BurgerKingWhopper';
import { BurgerKingChicken } from './BurgerKingChicken';
import { VanDammeKickboxer } from './VanDammeKickboxer';
import { VanDammeUniversalSoldier } from './VanDammeUniversalSoldier';
import { VanDammeTimecop } from './VanDammeTimecop';

const characters = [
  { id: 'bk_classic', name: 'Classic Burger King', component: BurgerKingClassic },
  { id: 'bk_whopper', name: 'Whopper King', component: BurgerKingWhopper },
  { id: 'bk_chicken', name: 'Chicken Royale', component: BurgerKingChicken },
  { id: 'vd_kickboxer', name: 'JCVD Kickboxer', component: VanDammeKickboxer },
  { id: 'vd_universal', name: 'Universal Soldier', component: VanDammeUniversalSoldier },
  { id: 'vd_timecop', name: 'Timecop', component: VanDammeTimecop },
];

const CharacterSelection = ({ onCharacterSelect }) => {
  const [selectedCharacter, setSelectedCharacter] = useState(null);

  const handleSelect = (character) => {
    setSelectedCharacter(character);
  };

  const handleConfirm = () => {
    if (selectedCharacter) {
      onCharacterSelect(selectedCharacter);
    }
  };

  return (
    <div className={styles.characterSelection}>
      <h2>Select Your Fighter</h2>
      <div className={styles.characterGrid}>
        {characters.map((character) => (
          <div
            key={character.id}
            className={`${styles.characterCard} ${
              selectedCharacter === character ? styles.selected : ''
            }`}
            onClick={() => handleSelect(character)}
          >
            <img
              src={`/images/${character.id}.png`}
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

export default CharacterSelection;