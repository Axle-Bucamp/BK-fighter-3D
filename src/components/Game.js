import React, { useState, useEffect, useMemo } from 'react';
import { Canvas } from '@react-three/fiber';
import { useThree, useFrame } from '@react-three/fiber';
import { OrbitControls, Sky } from '@react-three/drei';
import Battlefield from './Battlefield';
import Character from './Character';
import GameUI from './GameUI';
import { GAME_MODES } from '../game/constants';
import styles from '../styles/Game.module.css';
import { useGameLogic } from '../game/GameLogic';
import { useGameState } from '../game/GameState';
import { useAssetManager } from '../game/AssetManager';
import { useAdaptiveResolution } from '../game/utils/adaptiveResolution';

const Game = ({ players, gameMode }) => {
  const [isLoading, setIsLoading] = useState(true);
  const { gameState, dispatch } = useGameState(players, gameMode);
  const { handlePlayerAction, updateGameState } = useGameLogic(gameState, dispatch);
  const { loadAssets } = useAssetManager();
  
  useEffect(() => {
    const loadGameAssets = async () => {
      await loadAssets();
      setIsLoading(false);
    };
    loadGameAssets();
  }, []);

  const AdaptiveResolutionCanvas = useAdaptiveResolution(Canvas);

  const SceneContent = () => {
    const { scene } = useThree();
    useFrame(() => updateGameState(scene));

    return (
      <>
        <Sky />
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} />
        <Battlefield>
          {gameState.players.map((player, index) => (
            <Character
              key={index}
              player={player}
              onAction={(action) => handlePlayerAction(index, action)}
            />
          ))}
        </Battlefield>
      </>
    );
  };

  const MemoizedSceneContent = useMemo(() => <SceneContent />, [gameState]);

  if (isLoading) {
    return <div className={styles.loading}>Loading...</div>;
  }

  return (
    <div className={styles.gameContainer}>
      <AdaptiveResolutionCanvas>
        <OrbitControls />
        {MemoizedSceneContent}
      </AdaptiveResolutionCanvas>
      <GameUI gameState={gameState} />
    </div>
  );
};

export default React.memo(Game);