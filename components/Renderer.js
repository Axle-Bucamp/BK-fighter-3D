import React, { useRef, useEffect } from 'react';

const CANVAS_WIDTH = 800;
const CANVAS_HEIGHT = 600;
const GROUND_HEIGHT = 100;
const CHARACTER_WIDTH = 50;
const CHARACTER_HEIGHT = 80;

const Renderer = ({ gameState }) => {
  const canvasRef = useRef(null);
  const animationRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      renderBackground(ctx);
      renderCharacters(ctx, gameState);
      renderUI(ctx, gameState);

      animationRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      cancelAnimationFrame(animationRef.current);
    };
  }, [gameState]);

  const renderBackground = (ctx) => {
    // Sky
    ctx.fillStyle = '#87CEEB';
    ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

    // Ground
    ctx.fillStyle = '#8B4513';
    ctx.fillRect(0, CANVAS_HEIGHT - GROUND_HEIGHT, CANVAS_WIDTH, GROUND_HEIGHT);
  };

  const renderCharacters = (ctx, gameState) => {
    const { burger, jean } = gameState;

    renderCharacter(ctx, burger, '#FFA500'); // Orange for Burger
    renderCharacter(ctx, jean, '#0000FF');   // Blue for Jean
  };

  const renderCharacter = (ctx, character, color) => {
    const y = CANVAS_HEIGHT - GROUND_HEIGHT - CHARACTER_HEIGHT + character.verticalPosition;

    // Body
    ctx.fillStyle = color;
    ctx.fillRect(character.position, y, CHARACTER_WIDTH, CHARACTER_HEIGHT);

    // Eyes
    ctx.fillStyle = 'white';
    ctx.fillRect(character.position + 10, y + 15, 10, 10);
    ctx.fillRect(character.position + 30, y + 15, 10, 10);

    // Mouth
    ctx.fillStyle = 'red';
    ctx.fillRect(character.position + 15, y + 40, 20, 5);

    // Render attack animation if attacking
    if (character.isAttacking) {
      renderAttack(ctx, character, color);
    }

    // Render hit animation if hit
    if (character.isHit) {
      renderHit(ctx, character);
    }
  };

  const renderAttack = (ctx, character, color) => {
    ctx.fillStyle = color;
    const attackWidth = 30;
    const attackHeight = 20;
    const attackX = character.position + (character.direction === 'right' ? CHARACTER_WIDTH : -attackWidth);
    const attackY = CANVAS_HEIGHT - GROUND_HEIGHT - CHARACTER_HEIGHT / 2;

    ctx.fillRect(attackX, attackY, attackWidth, attackHeight);
  };

  const renderHit = (ctx, character) => {
    ctx.fillStyle = 'red';
    ctx.globalAlpha = 0.5;
    ctx.fillRect(character.position, CANVAS_HEIGHT - GROUND_HEIGHT - CHARACTER_HEIGHT, CHARACTER_WIDTH, CHARACTER_HEIGHT);
    ctx.globalAlpha = 1;
  };

  const renderUI = (ctx, gameState) => {
    ctx.fillStyle = 'black';
    ctx.font = '20px Arial';
    ctx.fillText(`Burger: ${gameState.burger.health}`, 10, 30);
    ctx.fillText(`Jean: ${gameState.jean.health}`, CANVAS_WIDTH - 100, 30);
  };

  return <canvas ref={canvasRef} width={CANVAS_WIDTH} height={CANVAS_HEIGHT} />;
};

export default Renderer;