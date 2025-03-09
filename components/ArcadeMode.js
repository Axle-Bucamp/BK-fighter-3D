import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Game from './Game';
import AIController from '../controllers/AIController';
import CharacterManager from '../src/characterManager';

const ArcadeMode = () => {
  const router = useRouter();
  const [currentStage, setCurrentStage] = useState(0);
  const [playerCharacter, setPlayerCharacter] = useState(null);
  const [score, setScore] = useState(0);

  const stages = [
    { opponent: 'BurgerKingClassic', difficulty: 'easy', challenge: 'None' },
    { opponent: 'VanDammeKickboxer', difficulty: 'normal', challenge: 'TimedMatch' },
    { opponent: 'BurgerKingWhopper', difficulty: 'normal', challenge: 'HealthHandicap' },
    { opponent: 'VanDammeUniversalSoldier', difficulty: 'hard', challenge: 'PowerUpRush' },
    { opponent: 'BurgerKingChicken', difficulty: 'hard', challenge: 'DodgeMaster' },
    { opponent: 'VanDammeTimecop', difficulty: 'expert', challenge: 'BossRush' },
  ];

  useEffect(() => {
    // Initialize player character
    const characterManager = new CharacterManager();
    setPlayerCharacter(characterManager.createCharacter('BurgerKingClassic', false));
  }, []);

  const handleStageComplete = (stageScore) => {
    setScore(prevScore => prevScore + stageScore);
    if (currentStage < stages.length - 1) {
      setCurrentStage(prevStage => prevStage + 1);
    } else {
      // Game completed
      router.push('/game-over');
    }
  };

  const handleGameOver = () => {
    router.push('/game-over');
  };

  if (!playerCharacter) {
    return <div>Loading...</div>;
  }

  const currentStageData = stages[currentStage];

  return (
    <div>
      <h1>Arcade Mode - Stage {currentStage + 1}</h1>
      <p>Score: {score}</p>
      <Game
        playerCharacter={playerCharacter}
        opponent={currentStageData.opponent}
        difficulty={currentStageData.difficulty}
        challenge={currentStageData.challenge}
        onStageComplete={handleStageComplete}
        onGameOver={handleGameOver}
      />
    </div>
  );
};

export default ArcadeMode;