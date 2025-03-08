import React, { useState, useEffect, useCallback } from 'react';
import StartScreen from './components/StartScreen';
import GameScreen from './components/GameScreen';
import GameOverScreen from './components/GameOverScreen';

/**
 * Main App component for the Burger vs. Jean game
 * @returns {JSX.Element} The rendered game component
 */
function App() {
  const [gameState, setGameState] = useState('start');
  const [gameMode, setGameMode] = useState('classic');
  const [difficulty, setDifficulty] = useState('normal');
  const [score, setScore] = useState({ burger: 0, jean: 0 });
  const [characters, setCharacters] = useState({
    burger: { x: 0, y: 0 },
    jean: { x: 0, y: 0 }
  });

  /**
   * Start the game with the selected mode and difficulty
   * @param {string} mode - The selected game mode
   * @param {string} diff - The selected difficulty level
   */
  const startGame = useCallback((mode, diff) => {
    try {
      setGameMode(mode);
      setDifficulty(diff);
      setGameState('playing');
      setScore({ burger: 0, jean: 0 });
      setCharacters({
        burger: { x: 50, y: 50 },
        jean: { x: 450, y: 450 }
      });
    } catch (error) {
      console.error('Error starting the game:', error);
      setGameState('start');
    }
  }, []);

  /**
   * Move a character in the specified direction
   * @param {string} character - The character to move ('burger' or 'jean')
   * @param {string} direction - The direction to move ('up', 'down', 'left', 'right')
   */
  const moveCharacter = useCallback((character, direction) => {
    try {
      setCharacters(prevCharacters => {
        const newPosition = { ...prevCharacters[character] };
        const speed = difficulty === 'hard' ? 5 : 3;

        switch (direction) {
          case 'up':
            newPosition.y = Math.max(0, newPosition.y - speed);
            break;
          case 'down':
            newPosition.y = Math.min(500, newPosition.y + speed);
            break;
          case 'left':
            newPosition.x = Math.max(0, newPosition.x - speed);
            break;
          case 'right':
            newPosition.x = Math.min(500, newPosition.x + speed);
            break;
          default:
            throw new Error('Invalid direction');
        }

        return { ...prevCharacters, [character]: newPosition };
      });
    } catch (error) {
      console.error('Error moving character:', error);
    }
  }, [difficulty]);

  /**
   * Check for collisions between characters and update scores
   */
  const checkCollision = useCallback(() => {
    try {
      const { burger, jean } = characters;
      const collisionDistance = 30;

      if (
        Math.abs(burger.x - jean.x) < collisionDistance &&
        Math.abs(burger.y - jean.y) < collisionDistance
      ) {
        setScore(prevScore => ({
          burger: prevScore.burger + 1,
          jean: prevScore.jean + 1
        }));

        // Reset characters to starting positions
        setCharacters({
          burger: { x: 50, y: 50 },
          jean: { x: 450, y: 450 }
        });
      }
    } catch (error) {
      console.error('Error checking collision:', error);
    }
  }, [characters]);

  /**
   * End the game and transition to the game over screen
   */
  const endGame = useCallback(() => {
    try {
      setGameState('gameOver');
    } catch (error) {
      console.error('Error ending the game:', error);
    }
  }, []);

  /**
   * Handle key press events for character movement
   * @param {KeyboardEvent} event - The keyboard event
   */
  const handleKeyPress = useCallback((event) => {
    try {
      if (gameState !== 'playing') return;

      switch (event.key) {
        case 'w':
          moveCharacter('burger', 'up');
          break;
        case 's':
          moveCharacter('burger', 'down');
          break;
        case 'a':
          moveCharacter('burger', 'left');
          break;
        case 'd':
          moveCharacter('burger', 'right');
          break;
        case 'ArrowUp':
          moveCharacter('jean', 'up');
          break;
        case 'ArrowDown':
          moveCharacter('jean', 'down');
          break;
        case 'ArrowLeft':
          moveCharacter('jean', 'left');
          break;
        case 'ArrowRight':
          moveCharacter('jean', 'right');
          break;
        default:
          break;
      }
    } catch (error) {
      console.error('Error handling key press:', error);
    }
  }, [gameState, moveCharacter]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyPress);
    return () => {
      window.removeEventListener('keydown', handleKeyPress);
    };
  }, [handleKeyPress]);

  useEffect(() => {
    if (gameState === 'playing') {
      const gameLoop = setInterval(() => {
        checkCollision();
        if (score.burger >= 10 || score.jean >= 10) {
          endGame();
        }
      }, 100);

      return () => clearInterval(gameLoop);
    }
  }, [gameState, checkCollision, score, endGame]);

  return (
    <div className="App">
      {gameState === 'start' && (
        <StartScreen onStartGame={startGame} />
      )}
      {gameState === 'playing' && (
        <GameScreen
          characters={characters}
          score={score}
          gameMode={gameMode}
          difficulty={difficulty}
        />
      )}
      {gameState === 'gameOver' && (
        <GameOverScreen
          score={score}
          onRestart={() => setGameState('start')}
        />
      )}
    </div>
  );
}

export default App;