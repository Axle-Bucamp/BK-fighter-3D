import React, { useRef, useEffect } from 'react';

const Renderer = ({ gameState }) => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    
    // Clear the canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Render game elements
    renderBackground(ctx);
    renderPlatforms(ctx, gameState.platforms);
    renderCharacters(ctx, gameState.characters);
    renderUI(ctx, gameState);
  }, [gameState]);

  const renderBackground = (ctx) => {
    // Simple gradient background
    const gradient = ctx.createLinearGradient(0, 0, 0, 600);
    gradient.addColorStop(0, '#87CEEB');
    gradient.addColorStop(1, '#E0F6FF');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 800, 600);
  };

  const renderPlatforms = (ctx, platforms) => {
    ctx.fillStyle = '#8B4513';
    platforms.forEach(platform => {
      ctx.fillRect(platform.x, platform.y, platform.width, platform.height);
    });
  };

  const renderCharacters = (ctx, characters) => {
    characters.forEach((character, index) => {
      // Character body
      ctx.fillStyle = index === 0 ? '#FF0000' : '#0000FF';
      ctx.fillRect(character.x, character.y, 50, 100);

      // Character face
      ctx.fillStyle = '#FFFFFF';
      ctx.fillRect(character.x + 10, character.y + 10, 30, 20);

      // Eyes
      ctx.fillStyle = '#000000';
      ctx.fillRect(character.x + 15, character.y + 15, 5, 5);
      ctx.fillRect(character.x + 30, character.y + 15, 5, 5);

      // Animate attack
      if (character.isAttacking) {
        ctx.fillStyle = '#FFFF00';
        ctx.beginPath();
        ctx.arc(character.x + (index === 0 ? 60 : -10), character.y + 50, 20, 0, 2 * Math.PI);
        ctx.fill();
      }

      // Animate jump
      if (character.velocityY < 0) {
        ctx.fillStyle = '#FFFFFF';
        ctx.beginPath();
        ctx.arc(character.x + 25, character.y + 110, 10, 0, 2 * Math.PI);
        ctx.fill();
      }
    });
  };

  const renderUI = (ctx, gameState) => {
    // Health bars
    gameState.characters.forEach((character, index) => {
      const x = index === 0 ? 20 : 580;
      const width = 200;
      const height = 20;
      const healthPercentage = character.health / 100;

      // Health bar background
      ctx.fillStyle = '#333333';
      ctx.fillRect(x, 20, width, height);

      // Health bar fill
      ctx.fillStyle = '#00FF00';
      ctx.fillRect(x, 20, width * healthPercentage, height);

      // Health text
      ctx.fillStyle = '#FFFFFF';
      ctx.font = '16px Arial';
      ctx.fillText(`Health: ${character.health}`, x + 5, 35);
    });

    // Game timer
    ctx.fillStyle = '#000000';
    ctx.font = '24px Arial';
    ctx.fillText(`Time: ${Math.floor(gameState.time / 60)}`, 375, 30);
  };

  return <canvas ref={canvasRef} width={800} height={600} />;
};

export default Renderer;