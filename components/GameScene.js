// components/GameScene.js
import React, {
  useEffect,
  useRef,
  useState,
} from 'react';

import { getAIMove } from '../lib/aiOpponent';
import {
  createCharacter,
  getWinner,
} from '../lib/gameLogic';
import styles from '../styles/GameScene.module.css';
import Character from './Character';
import GameOverScreen from './GameOverScreen';

const GameScene = ({ gameMode, onGameEnd }) => {
  const [player1, setPlayer1] = useState(createCharacter('Burger'));
  const [player2, setPlayer2] = useState(createCharacter('Jean'));
  const [isGameOver, setIsGameOver] = useState(false);
  const [winner, setWinner] = useState(null);
  const [isPlayer1Attacking, setIsPlayer1Attacking] = useState(false);
  const [isPlayer2Attacking, setIsPlayer2Attacking] = useState(false);
  const [isPlayer1SpecialAttacking, setIsPlayer1SpecialAttacking] = useState(false);
  const [isPlayer2SpecialAttacking, setIsPlayer2SpecialAttacking] = useState(false);
  const gameLoopId = useRef(null);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'a') {
        attack(player1, player2, setPlayer2, setIsPlayer1Attacking);
      } else if (e.key === 'l' && gameMode === 'twoPlayer') {
        attack(player2, player1, setPlayer1, setIsPlayer2Attacking);
      } else if (e.key === 's') {
        specialAttack(player1, player2, setPlayer2, setIsPlayer1SpecialAttacking);
      } else if (e.key === 'k' && gameMode === 'twoPlayer') {
        specialAttack(player2, player1, setPlayer1, setIsPlayer2SpecialAttacking);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [player1, player2, gameMode]);

  useEffect(() => {
    if (gameMode === 'singlePlayer') {
      gameLoopId.current = requestAnimationFrame(gameLoop);
    }
    return () => {
      if (gameLoopId.current) {
        cancelAnimationFrame(gameLoopId.current);
      }
    };
  }, [gameMode]);

  const gameLoop = () => {
    const aiMove = getAIMove(player2, player1);
    if (aiMove === 'attack') {
      attack(player2, player1, setPlayer1, setIsPlayer2Attacking);
    } else if (aiMove === 'special' && player2.specialMoveReady) {
      specialAttack(player2, player1, setPlayer1, setIsPlayer2SpecialAttacking);
    }
    gameLoopId.current = requestAnimationFrame(gameLoop);
  };

  const attack = (attacker, defender, setDefender, setIsAttacking) => {
    const damage = attacker.performAttack(defender);
    setDefender({ ...defender });
    setIsAttacking(true);
    setTimeout(() => setIsAttacking(false), 500);
    checkGameOver();
  };

  const specialAttack = (attacker, defender, setDefender, setIsSpecialAttacking) => {
    if (attacker.specialMoveReady) {
      const damage = attacker.performSpecialMove(defender);
      setDefender({ ...defender });
      setIsSpecialAttacking(true);
      setTimeout(() => setIsSpecialAttacking(false), 1000);
      checkGameOver();
    }
  };

  const checkGameOver = () => {
    if (isGameOver(player1, player2)) {
      setIsGameOver(true);
      setWinner(getWinner(player1, player2));
      onGameEnd();
    }
  };

  if (isGameOver) {
    return <GameOverScreen winner={winner} onRestart={() => window.location.reload()} />;
  }

  return (
    <div className={styles.gameScene}>
      <Character
        name={player1.name}
        health={player1.health}
        position="left"
        isAttacking={isPlayer1Attacking}
        isSpecialAttacking={isPlayer1SpecialAttacking}
      />
      <Character
        name={player2.name}
        health={player2.health}
        position="right"
        isAttacking={isPlayer2Attacking}
        isSpecialAttacking={isPlayer2SpecialAttacking}
      />
      <div className={styles.comboCounter}>
        <div>Player 1 Combo: {player1.comboCount}</div>
        <div>Player 2 Combo: {player2.comboCount}</div>
      </div>
      <div className={styles.controls}>
        <div>Player 1: 'A' to attack, 'S' for special</div>
        {gameMode === 'twoPlayer' && <div>Player 2: 'L' to attack, 'K' for special</div>}
      </div>
    </div>
  );
};

export default GameScene;