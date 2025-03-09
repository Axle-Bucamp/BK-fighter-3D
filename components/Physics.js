import {
  forwardRef,
  useImperativeHandle,
  useState,
} from 'react';

const Physics = forwardRef((props, ref) => {
  const [velocity, setVelocity] = useState({ x: 0, y: 0 });
  const gravity = 0.5;
  const friction = 0.9;

  useImperativeHandle(ref, () => ({
    update: (player) => {
      let newVelocity = { ...velocity };
      newVelocity.y += gravity; // Apply gravity
      newVelocity.x *= friction; // Apply friction
      newVelocity.y *= friction;
      
      player.position.x += newVelocity.x;
      player.position.y += newVelocity.y;
      
      if (player.position.y > 0) {
        player.position.y = 0;
        newVelocity.y = 0;
      }
      
      setVelocity(newVelocity);
    }
  }));

  return null;
});

export default Physics;
