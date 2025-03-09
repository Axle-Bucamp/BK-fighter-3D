import React, { useEffect, useState, useRef } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import AssetManager from '../game/AssetManager';
import GameLogic from '../game/GameLogic';
import Character from './Character';
import Arena from './Arena';
import LoadingScreen from './LoadingScreen';

const Game = ({ onReturnToMenu }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const assetManager = useRef(new AssetManager());
  const gameLogic = useRef(null);

  useEffect(() => {
    const loadAssets = async () => {
      const assetManifest = [
        { type: 'texture', key: 'burgerTexture', url: '/textures/burger.jpg' },
        { type: 'texture', key: 'jeanTexture', url: '/textures/jean.jpg' },
        { type: 'model', key: 'burgerModel', url: '/models/burger.glb' },
        { type: 'model', key: 'jeanModel', url: '/models/jean.glb' },
        { type: 'audio', key: 'backgroundMusic', url: '/audio/background.mp3' },
        // Add more assets as needed
      ];

      const totalAssets = assetManifest.length;
      let loadedAssets = 0;

      for (const asset of assetManifest) {
        await assetManager.current.loadAsset(asset.type, asset.key, asset.url);
        loadedAssets++;
        setLoadingProgress((loadedAssets / totalAssets) * 100);
      }

      gameLogic.current = new GameLogic(assetManager.current);
      setIsLoading(false);
    };

    loadAssets();
  }, []);

  if (isLoading) {
    return <LoadingScreen progress={loadingProgress} />;
  }

  return (
    <div style={{ width: '100%', height: '100vh' }}>
      <Canvas>
        <OrbitControls />
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} />
        <Arena />
        <Character
          position={[-2, 0, 0]}
          model={assetManager.current.getModel('burgerModel')}
          texture={assetManager.current.getTexture('burgerTexture')}
        />
        <Character
          position={[2, 0, 0]}
          model={assetManager.current.getModel('jeanModel')}
          texture={assetManager.current.getTexture('jeanTexture')}
        />
      </Canvas>
      <button onClick={onReturnToMenu} style={{ position: 'absolute', top: 10, left: 10 }}>
        Back to Menu
      </button>
    </div>
  );
};

export default Game;