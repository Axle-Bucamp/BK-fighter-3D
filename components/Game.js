import React, { useEffect, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import CharacterManager from '../utils/CharacterManager';
import Arena from './Arena';
import Player from './Player';
import GameUI from './GameUI';

const Game = ({ gameMode, selectedCharacters }) => {
  const [characters, setCharacters] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadCharacters = async () => {
      setIsLoading(true);
      try {
        const loadedCharacters = await CharacterManager.loadCharacters(selectedCharacters);
        setCharacters(loadedCharacters);
      } catch (error) {
        console.error('Error loading characters:', error);
      }
      setIsLoading(false);
    };

    loadCharacters();
  }, [selectedCharacters]);

  if (isLoading) {
    return <div>Loading characters...</div>;
  }

  return (
    <div style={{ width: '100%', height: '100vh' }}>
      <Canvas>
        <OrbitControls />
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} />
        <Arena />
        {characters.map((character, index) => (
          <Player key={index} character={character} position={[index * 2 - 1, 0, 0]} />
        ))}
      </Canvas>
      <GameUI gameMode={gameMode} characters={characters} />
    </div>
  );
};

export default Game;