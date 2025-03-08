import React, { useState, useEffect, useCallback } from 'react';
import StartScreen from './components/StartScreen';
import GameScreen from './components/GameScreen';
import GameOverScreen from './components/GameOverScreen';
import SettingsScreen from './components/SettingsScreen';
import LeaderboardScreen from './components/LeaderboardScreen';
import { moveCharacter, checkCollision, updateScore } from './gameLogic';

/**
 * Enhanced App component for the Burger vs. Jean game
 * @returns {JSX.Element} The rendered game component
 */
function App() {
  const [gameState, setGameState] = useState('start');
  const [settings, setSettings] = useState({
    difficulty: 'normal',
    soundEnabled: true,
    vibrationEnabled: true,
    theme: 'default'
  });
  const [gameMode, setGameMode] = useState('classic');
  const [characters, setCharacters] = useState({
    burger: { x: 0, y: 0, score: 0 },
    jean: { x: 480, y: 480, score: 0 }
  });
  const [leaderboard, setLeaderboard] = useState([]);

  /**
   * Starts the game with the selected mode
   * @param {string} mode - The selected game mode
   */
  const startGame = useCallback((mode) => {
    try {
      setGameMode(mode);
      setGameState('playing');
      setCharacters({
        burger: { x: 0, y: 0, score: 0 },
        jean: { x: 480, y: 480, score: 0 }
      });
    } catch (error) {
      console.error('Error starting game:', error);
    }
  }, []);

  /**
   * Handles character movement
   * @param {string} character - The character to move ('burger' or 'jean')
   * @param {string} direction - The direction to move
   */
  const handleMove = useCallback((character, direction) => {
    try {
      setCharacters(prevCharacters => ({
        ...prevCharacters,
        [character]: moveCharacter(prevCharacters[character], direction, settings.difficulty)
      }));
    } catch (error) {
      console.error('Error moving character:', error);
    }
  }, [settings.difficulty]);

  /**
   * Ends the game and updates the leaderboard
   */
  const endGame = useCallback(() => {
    try {
      setGameState('gameOver');
      const winner = characters.burger.score > characters.jean.score ? 'Burger' : 'Jean';
      const newLeaderboardEntry = {
        winner,
        score: Math.max(characters.burger.score, characters.jean.score),
        mode: gameMode,
        date: new Date().toISOString()
      };
      setLeaderboard(prevLeaderboard => [...prevLeaderboard, newLeaderboardEntry].sort((a, b) => b.score - a.score).slice(0, 10));
    } catch (error) {
      console.error('Error ending game:', error);
    }
  }, [characters, gameMode]);

  /**
   * Applies new game settings
   * @param {Object} newSettings - The new settings to apply
   */
  const applySettings = useCallback((newSettings) => {
    try {
      setSettings(newSettings);
    } catch (error) {
      console.error('Error applying settings:', error);
    }
  }, []);

  /**
   * Game loop effect
   */
  useEffect(() => {
    if (gameState !== 'playing') return;

    const gameLoop = setInterval(() => {
      try {
        setCharacters(prevCharacters => {
          const updatedCharacters = { ...prevCharacters };

          if (checkCollision(updatedCharacters.burger, updatedCharacters.jean)) {
            updateScore(updatedCharacters, gameMode);
          }

          if (updatedCharacters.burger.score >= 10 || updatedCharacters.jean.score >= 10) {
            clearInterval(gameLoop);
            endGame();
          }

          return updatedCharacters;
        });
      } catch (error) {
        console.error('Error in game loop:', error);
        clearInterval(gameLoop);
      }
    }, 100);

    return () => clearInterval(gameLoop);
  }, [gameState, gameMode, endGame]);

  /**
   * Renders the appropriate screen based on the game state
   * @returns {JSX.Element} The rendered screen component
   */
  const renderScreen = () => {
    switch (gameState) {
      case 'start':
        return <StartScreen onStart={startGame} onSettings={() => setGameState('settings')} />;
      case 'playing':
        return <GameScreen characters={characters} onMove={handleMove} settings={settings} gameMode={gameMode} />;
      case 'gameOver':
        return <GameOverScreen winner={characters.burger.score > characters.jean.score ? 'Burger' : 'Jean'} onRestart={() => setGameState('start')} onLeaderboard={() => setGameState('leaderboard')} />;
      case 'settings':
        return <SettingsScreen settings={settings} onApply={applySettings} onBack={() => setGameState('start')} />;
      case 'leaderboard':
        return <LeaderboardScreen leaderboard={leaderboard} onBack={() => setGameState('start')} />;
      default:
        return <div>Error: Unknown game state</div>;
    }
  };

  return (
    <div className="App">
      {renderScreen()}
    </div>
  );
}

export default App;