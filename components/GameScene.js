import React, {
  useEffect,
  useRef,
} from 'react';

import { useThree } from '@react-three/fiber';

import GameEngine from '../src/gameEngine';

const GameScene = ({ player1, player2, gameMode }) => {
  const { scene } = useThree();
  const gameEngineRef = useRef(null);

  useEffect(() => {
    if (!gameEngineRef.current) {
      gameEngineRef.current = new GameEngine();
      console.log("GameEngine initialized");
    }

    const gameEngine = gameEngineRef.current;

    if (player1?.model) {
      scene.add(player1.model);
      gameEngine.addEntity(player1.model);
      console.log("Added Player 1 to scene");
    }

    if (player2?.model) {
      scene.add(player2.model);
      gameEngine.addEntity(player2.model);
      console.log("Added Player 2 to scene");
    }

    gameEngine.start();

    return () => {
      gameEngine.stop();
    };
  }, [player1, player2]);

  return (
    <group>
      <ambientLight intensity={0.5} />
      <directionalLight position={[5, 5, 5]} />
      
      {player1?.model && <primitive object={player1.model} />}
      {player2?.model && <primitive object={player2.model} />}
    </group>
  );
};

export default GameScene;
