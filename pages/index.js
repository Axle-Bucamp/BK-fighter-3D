import React, { useState } from 'react';
import { useRouter } from 'next/router';
import CharacterSelect from '../components/CharacterSelect';
import MainMenu from '../components/MainMenu';
import styles from '../styles/MainMenu.module.css';

const IndexPage = () => {
  const [gameMode, setGameMode] = useState(null);
  const [showCharacterSelect, setShowCharacterSelect] = useState(false);
  const router = useRouter();

  const handleModeSelect = (mode) => {
    setGameMode(mode);
    setShowCharacterSelect(true);
  };

  const handleCharacterSelect = (selectedCharacter) => {
    router.push({
      pathname: '/game',
      query: { gameMode, character: selectedCharacter },
    });
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>BK Fighter 3D</h1>
      {!showCharacterSelect ? (
        <MainMenu onModeSelect={handleModeSelect} />
      ) : (
        <CharacterSelect onSelect={handleCharacterSelect} />
      )}
    </div>
  );
};

export default IndexPage;