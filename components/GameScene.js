import React, {
  useEffect,
  useRef,
} from 'react';

import { useThree } from '@react-three/fiber'; // Use R3F hooks

import GameEngine
  from '../src/gameEngine'; // Assuming GameEngine is your custom class

const GameScene = ({ player1, player2, gameMode }) => {
  const { scene } = useThree(); // R3F hook to access the scene
  const gameEngineRef = useRef(null);

  useEffect(() => {
    if (!gameEngineRef.current) {
      gameEngineRef.current = new GameEngine(); // Initialize the game engine
    }

    const gameEngine = gameEngineRef.current;
    
    // Assuming player1 and player2 are loaded and passed as props
    if (player1) gameEngine.addEntity(player1.model);
    if (player2) gameEngine.addEntity(player2.model);

    gameEngine.start(); // Start the game loop

    // Cleanup game engine on component unmount
    return () => {
      gameEngine.stop();
    };
  }, [player1, player2]); // Effect runs whenever player1 or player2 changes

  return (
    <group>
      {/* Render your game elements */}
      {player1 && <primitive object={player1.model} />}
      {player2 && <primitive object={player2.model} />}
    </group>
  );
};

export default GameScene;
