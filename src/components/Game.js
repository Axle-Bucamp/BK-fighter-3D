import React, { useState, useEffect, useRef } from 'react';
import { Canvas } from '@react-three/fiber';
import { Physics } from '@react-three/cannon';
import AssetManager from '../game/AssetManager';
import LoadingScreen from './LoadingScreen';
import Arena from './Arena';
import Character from './Character';
import GameLogic from '../game/GameLogic';

const assetManifest = {
  burgerTexture: { type: 'texture', url: '/assets/burger_texture.png' },
  jeanTexture: { type: 'texture', url: '/assets/jean_texture.png' },
  arenaModel: { type: 'model', url: '/assets/arena.glb' },
  backgroundMusic: { type: 'audio', url: '/assets/background_music.mp3' },
  // Add more assets as needed
};

const Game = () => {
  const [assetsLoaded, setAssetsLoaded] = useState(false);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const assetManagerRef = useRef(new AssetManager());
  const gameLogicRef = useRef(null);

  useEffect(() => {
    const loadAssets = async () => {
      const totalAssets = Object.keys(assetManifest).length;
      let loadedAssets = 0;

      for (const [key, asset] of Object.entries(assetManifest)) {
        await assetManagerRef.current.loadAll({ [key]: asset });
        loadedAssets++;
        setLoadingProgress((loadedAssets / totalAssets) * 100);
      }

      setAssetsLoaded(true);
      gameLogicRef.current = new GameLogic(assetManagerRef.current);
    };

    loadAssets();
  }, []);

  if (!assetsLoaded) {
    return <LoadingScreen progress={loadingProgress} />;
  }

  return (
    <Canvas>
      <Physics>
        <Arena assetManager={assetManagerRef.current} />
        <Character
          name="Burger"
          position={[0, 1, 0]}
          assetManager={assetManagerRef.current}
        />
        <Character
          name="Jean"
          position={[0, 1, 2]}
          assetManager={assetManagerRef.current}
        />
      </Physics>
    </Canvas>
  );
};

export default Game;