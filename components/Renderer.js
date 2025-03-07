import React, { useRef, useEffect } from 'react';

/**
 * @component Renderer
 * @description Renders the game state using HTML5 Canvas
 * @param {Object} props - Component props
 * @param {Object} props.gameState - Current game state from GameEngine
 */
const Renderer = ({ gameState }) => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    
    // Clear the canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Render game elements
    renderArena(ctx, gameState);
    renderCharacters(ctx, gameState);
    renderUI(ctx, gameState);
  }, [gameState]);

  /**
   * @function renderArena
   * @description Renders the game arena
   * @param {CanvasRenderingContext2D} ctx - The canvas rendering context
   * @param {Object} gameState - Current game state
   */
  const renderArena = (ctx, gameState) => {
    // Set arena background
    ctx.fillStyle = '#87CEEB'; // Sky blue background
    ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);

    // Draw a simple platform
    ctx.fillStyle = '#8B4513'; // Saddle brown for the platform
    ctx.fillRect(0, ctx.canvas.height - 50, ctx.canvas.width, 50);
  };

  /**
   * @function renderCharacters
   * @description Renders the game characters
   * @param {CanvasRenderingContext2D} ctx - The canvas rendering context
   * @param {Object} gameState - Current game state
   */
  const renderCharacters = (ctx, gameState) => {
    const { burger, jean } = gameState.characters;

    // Render Burger
    ctx.fillStyle = '#FF6347'; // Tomato color for Burger
    ctx.fillRect(burger.position.x, burger.position.y, 50, 100);
    renderHealthBar(ctx, burger.position.x, burger.position.y - 20, burger.health);

    // Render Jean
    ctx.fillStyle = '#4169E1'; // Royal blue for Jean
    ctx.fillRect(jean.position.x, jean.position.y, 50, 100);
    renderHealthBar(ctx, jean.position.x, jean.position.y - 20, jean.health);
  };

  /**
   * @function renderHealthBar
   * @description Renders a health bar for a character
   * @param {CanvasRenderingContext2D} ctx - The canvas rendering context
   * @param {number} x - X position of the health bar
   * @param {number} y - Y position of the health bar
   * @param {number} health - Current health of the character
   */
  const renderHealthBar = (ctx, x, y, health) => {
    const width = 50;
    const height = 10;

    // Draw background
    ctx.fillStyle = '#FF0000';
    ctx.fillRect(x, y, width, height);

    // Draw health
    ctx.fillStyle = '#00FF00';
    ctx.fillRect(x, y, width * (health / 100), height);
  };

  /**
   * @function renderUI
   * @description Renders the game UI (scores, time, etc.)
   * @param {CanvasRenderingContext2D} ctx - The canvas rendering context
   * @param {Object} gameState - Current game state
   */
  const renderUI = (ctx, gameState) => {
    ctx.fillStyle = '#000000';
    ctx.font = '20px Arial';

    // Render scores
    ctx.fillText(`Burger: ${gameState.scores.burger}`, 10, 30);
    ctx.fillText(`Jean: ${gameState.scores.jean}`, ctx.canvas.width - 100, 30);

    // Render time
    const timeRemaining = Math.max(0, Math.floor(gameState.timeRemaining / 1000));
    ctx.fillText(`Time: ${timeRemaining}s`, ctx.canvas.width / 2 - 40, 30);
  };

  return <canvas ref={canvasRef} width={800} height={600} />;
};

export default Renderer;