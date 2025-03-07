import React from 'react';
import BurgerCharacter from './CharacterModel';
import JeanCharacter from './CharacterModel';
import PizzaCharacter from './PizzaCharacter';

const CharacterSelection = ({ onSelectCharacter }) => {
  const characters = [
    { name: 'Burger', component: BurgerCharacter, properties: BurgerCharacter.properties },
    { name: 'Jean', component: JeanCharacter, properties: JeanCharacter.properties },
    { name: 'Pizza', component: PizzaCharacter, properties: PizzaCharacter.properties },
  ];

  return (
    <div className="character-selection">
      <h2>Select Your Character</h2>
      <div className="character-list">
        {characters.map((character) => (
          <div key={character.name} className="character-option" onClick={() => onSelectCharacter(character)}>
            <h3>{character.name}</h3>
            <p>Health: {character.properties.health}</p>
            <p>Speed: {character.properties.speed}</p>
            <p>Special Ability: {character.properties.specialAbility}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CharacterSelection;