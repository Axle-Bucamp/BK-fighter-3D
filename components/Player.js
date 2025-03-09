import {
  forwardRef,
  useImperativeHandle,
  useState,
} from 'react';

const Player = forwardRef(({ player, onCollision }, ref) => {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [health, setHealth] = useState(100);
  
  useImperativeHandle(ref, () => ({
    render: (context) => {
      context.fillStyle = player === 'player1' ? 'blue' : 'red';
      context.fillRect(position.x + 200, 150 - position.y, 20, 20);
    },
    updatePosition: (newPosition) => {
      setPosition(newPosition);
    },
    takeDamage: (damage) => {
      setHealth((prevHealth) => Math.max(0, prevHealth - damage));
      if (health - damage <= 0) {
        onCollision(player, damage);
      }
    }
  }));

  return null;
});

export default Player;
