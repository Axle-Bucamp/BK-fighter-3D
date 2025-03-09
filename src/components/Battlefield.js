import React from 'react';

const Battlefield = () => {
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.5, 0]}>
      <planeGeometry args={[10, 10]} />
      <meshStandardMaterial color="#00ff00" />
    </mesh>
  );
};

export default Battlefield;