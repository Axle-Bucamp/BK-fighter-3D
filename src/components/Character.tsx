import React from 'react';

interface CharacterProps {
  name: string;
}

const Character: React.FC<CharacterProps> = ({ name }) => {
  return (
    <div className="character">
      <h2>{name}</h2>
      {/* Add character rendering logic here */}
    </div>
  );
};

export default Character;