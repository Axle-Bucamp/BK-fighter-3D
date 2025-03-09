import React, { useEffect, useRef } from 'react';
import Matter from 'matter-js';

const Battlefield = ({ width, height, onInteraction }) => {
  const sceneRef = useRef(null);
  const engineRef = useRef(null);

  useEffect(() => {
    const { Engine, Render, World, Bodies, Events } = Matter;

    // Create engine and renderer
    const engine = Engine.create();
    engineRef.current = engine;
    const render = Render.create({
      element: sceneRef.current,
      engine: engine,
      options: {
        width,
        height,
        wireframes: false,
        background: '#87CEEB', // Sky blue background
      },
    });

    // Create ground
    const ground = Bodies.rectangle(width / 2, height, width, 60, { isStatic: true });

    // Create platforms
    const platform1 = Bodies.rectangle(width / 4, height - 120, 200, 20, { isStatic: true });
    const platform2 = Bodies.rectangle((3 * width) / 4, height - 200, 200, 20, { isStatic: true });

    // Create power-up
    const powerUp = Bodies.circle(width / 2, height - 300, 15, {
      isSensor: true,
      render: { fillStyle: 'yellow' },
      label: 'powerUp',
    });

    // Create trap
    const trap = Bodies.rectangle(width / 2, height - 30, 100, 10, {
      isSensor: true,
      render: { fillStyle: 'red' },
      label: 'trap',
    });

    // Add all bodies to the world
    World.add(engine.world, [ground, platform1, platform2, powerUp, trap]);

    // Start the engine and renderer
    Engine.run(engine);
    Render.run(render);

    // Handle collisions
    Events.on(engine, 'collisionStart', (event) => {
      const pairs = event.pairs;
      for (let i = 0; i < pairs.length; i++) {
        const { bodyA, bodyB } = pairs[i];
        if (bodyA.label === 'powerUp' || bodyB.label === 'powerUp') {
          onInteraction('powerUp');
          World.remove(engine.world, bodyA.label === 'powerUp' ? bodyA : bodyB);
        } else if (bodyA.label === 'trap' || bodyB.label === 'trap') {
          onInteraction('trap');
        }
      }
    });

    return () => {
      Render.stop(render);
      World.clear(engine.world);
      Engine.clear(engine);
      render.canvas.remove();
      render.canvas = null;
      render.context = null;
      render.textures = {};
    };
  }, [width, height, onInteraction]);

  return <div ref={sceneRef} />;
};

export default Battlefield;