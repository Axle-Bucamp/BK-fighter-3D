import React, { useState, useEffect } from 'react';
import Game from './Game';
import AIController from '../controllers/AIController';

const opponents = [
  { name: 'Burger King Classic', type: 'burgerKingClassic', difficulty: 'easy' },
  { name: 'Burger King Whopper', type: 'burgerKingWhopper', difficulty: 'normal' },
  { name: 'Burger King Chicken', type: 'burgerKingChicken', difficulty: 'normal' },
  { name: 'Van Damme Kickboxer', type: 'vanDammeKickboxer', difficulty: 'hard' },
  { name: 'Van Damme Universal Soldier', type: 'vanDammeUniversalSoldier', difficulty: 'hard' },
  { name: 'Van Damme Timecop', type: 'vanDammeTimecop', difficulty: 'expert' },
];

const challenges = [
  { name: 'Time Attack', description: 'Defeat the opponent within 60 seconds' },
  { name: 'No Special Moves', description: 'Win without using any special moves' },
  { name: 'Low Health', description: 'Start with only 50% health' },
  { name: 'Sudden Death', description: 'Both you and the opponent have only 1 HP' },
  { name: 'Mirror Match', description: 'Face an opponent with the same character as you' },
];

const ArcadeMode = ({ playerCharacter }) => {
  const [currentOpponentIndex, setCurrentOpponentIndex] = useState(0);
  const [currentChallenge, setCurrentChallenge] = useState(null);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);

  useEffect(() => {
    if (currentOpponentIndex < opponents.length) {
      setCurrentChallenge(challenges[Math.floor(Math.random() * challenges.length)]);
    } else {
      setGameOver(true);
    }
  }, [currentOpponentIndex]);

  const handleGameEnd = (playerWon) => {
    if (playerWon) {
      setScore(score + 1);
      setCurrentOpponentIndex(currentOpponentIndex + 1);
    } else {
      setGameOver(true);
    }
  };

  const restartArcadeMode = () => {
    setCurrentOpponentIndex(0);
    setScore(0);
    setGameOver(false);
  };

  if (gameOver) {
    return (
      <div>
        <h2>Game Over</h2>
        <p>Your final score: {score}</p>
        <button onClick={restartArcadeMode}>Play Again</button>
      </div>
    );
  }

  const currentOpponent = opponents[currentOpponentIndex];

  return (
    <div>
      <h2>Arcade Mode</h2>
      <p>Current Opponent: {currentOpponent.name}</p>
      <p>Current Challenge: {currentChallenge.name}</p>
      <p>{currentChallenge.description}</p>
      <p>Score: {score}</p>
      <Game
        playerCharacter={playerCharacter}
        opponentCharacter={currentOpponent.type}
        opponentAI={new AIController(null, null, currentOpponent.difficulty)}
        challenge={currentChallenge}
        onGameEnd={handleGameEnd}
      />
    </div>
  );
};

export default ArcadeMode;