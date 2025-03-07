import React, {
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';

import { OrbitControls } from '@react-three/drei';
import { Canvas } from '@react-three/fiber';

import AudioManager from './AudioManager';
import Background from './Background';
import BurgerCharacter from './BurgerCharacter';
import Floor from './Floor';
import useGameLogic from './GameLogic';
import GameUI from './GameUI';
import JeanCharacter from './JeanCharacter';
import MainMenu from './MainMenu';
import OptionsMenu from './OptionsMenu';
import ParticleSystem from './ParticleSystem';

const Scene = () => {
  const burgerRef = useRef();
  const jeanRef = useRef();

  const {
    burgerHealth,
    jeanHealth,
    gameStates,
    winner,
    roundTime,
    burgerAnimation,
    jeanAnimation,
    startRound,
    resetGame,
    handleAttack,
    burgerPosition,
    jeanPosition,
  } = useGameLogic(burgerRef, jeanRef);

  const [selectedCharacter, setSelectedCharacter] = useState(null);
  const [impactPosition, setImpactPosition] = useState(null);
  const [showOptions, setShowOptions] = useState(false);
  const [musicVolume, setMusicVolume] = useState(0.5);
  const [sfxVolume, setSfxVolume] = useState(0.5);
  const [gameStage, setGameStage] = useState('menu'); // 'menu', 'characterSelect', 'playing'
  const [gameEndTriggered, setGameEndTriggered] = useState(false); // Track if the game end logic was triggered

  const startGame = useCallback(() => {
    if (!selectedCharacter) setSelectedCharacter(burgerRef);
    setGameStage('playing');
  
    // Reset the states related to the round
    setImpactPosition(null);
    setShowOptions(false); // Hide options if any
    setGameEndTriggered(false); // Ensure game end is reset

    startRound(); // Proceed with starting the round (ensure this is correctly implemented)
  }, [selectedCharacter, startRound]);

  const openCharacterSelection = useCallback(() => {
    setGameStage('characterSelect');
  }, []);

  const openOptions = useCallback(() => {
    setShowOptions(true);
  }, []);

  const handleCharacterAttack = useCallback((attacker) => {
    const [success, position] = handleAttack(attacker);
    if (success) {
      setImpactPosition(position);
      setTimeout(() => setImpactPosition(null), 1000);
    }
  }, [handleAttack]);

  const handleVolumeChange = useCallback((type, value) => {
    if (type === 'music') {
      setMusicVolume(value);
    } else if (type === 'sfx') {
      setSfxVolume(value);
    }
  }, []);

  const handleSelectCharacter = (character) => {
    setSelectedCharacter(character);
    setGameStage('playing'); // Move to playing stage
    startRound();
  };

  const handleBack = useCallback(() => {
    resetGame(); 
    setGameStage('menu');
    setSelectedCharacter(null);
    setImpactPosition(null);
    setShowOptions(false);
    setGameEndTriggered(false); // Reset the game end trigger
  }, [resetGame]);

  const gameEnd = useCallback(() => {
      
    }, []);

  // Monitor winner and handle game end
  useEffect(() => {
    if (winner && !gameEndTriggered) {
      setGameEndTriggered(true);
      // Trigger game end sounds or any other game end logic here
      handleBack();
    }
  }, [winner, gameEndTriggered, handleBack]);

  return (
    <>
      {gameStage === 'menu' && (
        <MainMenu
          onStartGame={startGame}
          onCharacterSelection={openCharacterSelection}
          onSelectCharacter={handleSelectCharacter} 
          onBack={handleBack} 
          onOptions={openOptions}
        />
      )}

      {gameStage === 'characterSelect' && (
        <GameUI
          gameStates="characterSelect"
          selectedCharacter={selectedCharacter}
          onCharacterSelect={handleSelectCharacter} // Handle character selection
          onStartGame={startGame}
        />
      )}

      {gameStage === 'playing' && (
        <>
          <Canvas camera={{ position: [0, 5, 10] }}>
            <OrbitControls />
            <ambientLight intensity={0.5} />
            <pointLight position={[10, 10, 10]} />
            <Background />
            <Floor />
            
            <>

              <BurgerCharacter
                ref={burgerRef}
                position={burgerPosition}
                animationState={burgerAnimation}
                //movement={playerMoveDirection} 
                //jumpState={playerJump}
              />

              <JeanCharacter
                ref={jeanRef}
                position={jeanPosition}
                animationState={jeanAnimation}
              />
              {impactPosition && <ParticleSystem position={impactPosition} />}
            </>
            
            <AudioManager
              gameStates={gameStates}
              onAttack={gameEnd}
              onHit={() => {}} // Implement hit sound logic if needed
              onGameStart={gameEnd}
              onGameEnd={gameEnd}
              musicVolume={musicVolume}
              sfxVolume={sfxVolume}
            />
          </Canvas>
          {showOptions ? (
            <OptionsMenu
              onVolumeChange={handleVolumeChange}
              onBack={() => setShowOptions(false)}
            />
          ) : (
            <GameUI
              gameStates={gameStates}
              burgerHealth={burgerHealth}
              jeanHealth={jeanHealth}
              onStartGame={startRound}
              onResetGame={handleBack} // Use new function
              selectedCharacter={selectedCharacter}
              onShowOptions={() => setShowOptions(true)}
            />
          )}
        </>
      )}
    </>
  );
};

export default Scene;
