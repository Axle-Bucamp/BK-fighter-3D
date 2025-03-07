import React, { useEffect, useState } from 'react';
import { Stage, Container, Sprite, Text } from '@inlet/react-pixi';
import useGameStore from '../lib/gameLogic';
import useAudioStore from '../lib/audioManager';
import Character from './Character';

const GameScene = ({ selectedCharacters }) => {
  const { gameState, moveLeft, moveRight, attack } = useGameStore();
  const { audioManager } = useAudioStore();
  const [windowSize, setWindowSize] = useState({ width: 800, height: 600 });

  useEffect(() => {
    const handleResize = () => {
      setWindowSize({ width: window.innerWidth, height: window.innerHeight });
    };

    window.addEventListener('resize', handleResize);
    handleResize();

    audioManager.loadSound('attack', '/sounds/attack.mp3');
    audioManager.loadSound('hurt', '/sounds/hurt.mp3');
    audioManager.loadMusic('/sounds/battle_music.mp3');
    audioManager.playMusic();

    return () => {
      window.removeEventListener('resize', handleResize);
      audioManager.stopMusic();
    };
  }, []);

  useEffect(() => {
    const handleKeyPress = (e) => {
      switch (e.key.toLowerCase()) {
        case 'a':
          moveLeft(1);
          break;
        case 'd':
          moveRight(1);
          break;
        case 'h':
          attack(1);
          audioManager.playSound('attack');
          break;
        case 'j':
          moveLeft(2);
          break;
        case 'l':
          moveRight(2);
          break;
        case 'k':
          attack(2);
          audioManager.playSound('attack');
          break;
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => {
      window.removeEventListener('keydown', handleKeyPress);
    };
  }, [moveLeft, moveRight, attack]);

  useEffect(() => {
    if (gameState.player1.health < gameState.player1.prevHealth ||
        gameState.player2.health < gameState.player2.prevHealth) {
      audioManager.playSound('hurt');
    }
  }, [gameState.player1.health, gameState.player2.health]);

  return (
    <Stage width={windowSize.width} height={windowSize.height}>
      <Sprite image="/background.jpg" width={windowSize.width} height={windowSize.height} />
      <Container>
        <Character
          x={gameState.player1.x}
          y={windowSize.height - 200}
          width={100}
          height={200}
          isAttacking={gameState.player1.isAttacking}
          spriteSheet={`/${selectedCharacters[0].toLowerCase()}_spritesheet.png`}
        />
        <Character
          x={gameState.player2.x}
          y={windowSize.height - 200}
          width={100}
          height={200}
          isAttacking={gameState.player2.isAttacking}
          spriteSheet={`/${selectedCharacters[1].toLowerCase()}_spritesheet.png`}
        />
        <Text text={`P1 Health: ${gameState.player1.health}`} x={10} y={10} style={{ fill: 'white' }} />
        <Text text={`P2 Health: ${gameState.player2.health}`} x={windowSize.width - 150} y={10} style={{ fill: 'white' }} />
      </Container>
    </Stage>
  );
};

export default GameScene;