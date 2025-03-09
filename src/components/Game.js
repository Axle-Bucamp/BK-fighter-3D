import React, { useState, useEffect } from 'react';
import styles from '../styles/Game.module.css';
import characters from '../data/characters';
import arenas from '../data/arenas';

const Game = ({ onReturnToMenu }) => {
  const [player1, setPlayer1] = useState(null);
  const [player2, setPlayer2] = useState(null);
  const [arena, setArena] = useState(null);
  const [gameState, setGameState] = useState('character_select');

  const selectCharacter = (character, playerNumber) => {
    if (playerNumber === 1) {
      setPlayer1(character);
    } else {
      setPlayer2(character);
    }

    if (player1 && player2) {
      setGameState('arena_select');
    }
  };

  const selectArena = (selectedArena) => {
    setArena(selectedArena);
    setGameState('fighting');
  };

  const renderCharacterSelection = () => (
    <div className={styles.characterSelection}>
      <h2>Select Your Characters</h2>
      <div className={styles.characterGrid}>
        {characters.map((char) => (
          <div
            key={char.id}
            className={styles.characterCard}
            onClick={() => selectCharacter(char, player1 ? 2 : 1)}
          >
            <img src={`/images/${char.id}.png`} alt={char.name} />
            <p>{char.name}</p>
          </div>
        ))}
      </div>
    </div>
  );

  const renderArenaSelection = () => (
    <div className={styles.arenaSelection}>
      <h2>Select Arena</h2>
      <div className={styles.arenaGrid}>
        {arenas.map((arena) => (
          <div
            key={arena.id}
            className={styles.arenaCard}
            onClick={() => selectArena(arena)}
          >
            <img src={arena.backgroundImage} alt={arena.name} />
            <p>{arena.name}</p>
          </div>
        ))}
      </div>
    </div>
  );

  const renderFight = () => {
    const Player1Component = player1.component;
    const Player2Component = player2.component;

    return (
      <div className={styles.fightScreen} style={{ backgroundImage: `url(${arena.backgroundImage})` }}>
        <Player1Component position="left" health={100} onAttack={() => {}} onSpecial={() => {}} />
        <Player2Component position="right" health={100} onAttack={() => {}} onSpecial={() => {}} />
      </div>
    );
  };

  return (
    <div className={styles.game}>
      {gameState === 'character_select' && renderCharacterSelection()}
      {gameState === 'arena_select' && renderArenaSelection()}
      {gameState === 'fighting' && renderFight()}
      <button className={styles.menuButton} onClick={onReturnToMenu}>
        Return to Menu
      </button>
    </div>
  );
};

export default Game;