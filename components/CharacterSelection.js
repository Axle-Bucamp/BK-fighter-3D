import React, { useState } from 'react';
import styles from '../styles/CharacterSelection.module.css';
import { BurgerKingClassic } from './BurgerKingClassic';
import { BurgerKingWhopper } from './BurgerKingWhopper';
import { BurgerKingChicken } from './BurgerKingChicken';
import { VanDammeKickboxer } from './VanDammeKickboxer';
import { VanDammeUniversalSoldier } from './VanDammeUniversalSoldier';
import { VanDammeTimecop } from './VanDammeTimecop';

const characters = [
  { name: 'Burger King Classic', class: BurgerKingClassic, image: '/images/bk_classic.png' },
  { name: 'Burger King Whopper', class: BurgerKingWhopper, image: '/images/bk_whopper.png' },
  { name: 'Burger King Chicken', class: BurgerKingChicken, image: '/images/bk_chicken.png' },
  { name: 'Van Damme Kickboxer', class: VanDammeKickboxer, image: '/images/vd_kickboxer.png' },
  { name: 'Van Damme Universal Soldier', class: VanDammeUniversalSoldier, image: '/images/vd_universalsoldier.png' },
  { name: 'Van Damme Timecop', class: VanDammeTimecop, image: '/images/vd_timecop.png' },
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