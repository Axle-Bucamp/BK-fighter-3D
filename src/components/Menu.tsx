import React from 'react';

interface MenuProps {
  onStartGame: () => void;
}

const Menu: React.FC<MenuProps> = ({ onStartGame }) => {
  return (
    <div className="menu">
      <h1>Burger vs. Jean</h1>
      <button onClick={onStartGame}>Start Game</button>
    </div>
  );
};

export default Menu;