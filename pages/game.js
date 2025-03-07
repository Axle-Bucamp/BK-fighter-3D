import React from 'react';
import dynamic from 'next/dynamic';

const GameScene = dynamic(() => import('../components/GameScene'), { ssr: false });

const GamePage = () => {
  return (
    <div style={{ width: '100vw', height: '100vh' }}>
      <GameScene />
    </div>
  );
};

export default GamePage;