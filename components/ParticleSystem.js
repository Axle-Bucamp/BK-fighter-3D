import React, { useRef, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

const ParticleSystem = ({ position, color, count = 20, duration = 1000 }) => {
  const mesh = useRef();
  const particles = useRef([]);
  const startTime = useRef(Date.now());

  useEffect(() => {
    particles.current = Array(count).fill().map(() => ({
      position: new THREE.Vector3(
        Math.random() * 0.4 - 0.2,
        Math.random() * 0.4 - 0.2,
        Math.random() * 0.4 - 0.2
      ),
      velocity: new THREE.Vector3(
        Math.random() * 0.02 - 0.01,
        Math.random() * 0.05 + 0.02,
        Math.random() * 0.02 - 0.01
      ),
      size: Math.random() * 0.03 + 0.01,
    }));

    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(count * 3);
    const sizes = new Float32Array(count);

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));

    mesh.current.geometry = geometry;
    startTime.current = Date.now();
  }, [count]);

  useFrame(() => {
    const elapsedTime = (Date.now() - startTime.current) / 1000;
    const positions = mesh.current.geometry.attributes.position.array;
    const sizes = mesh.current.geometry.attributes.size.array;

    particles.current.forEach((particle, i) => {
      particle.position.add(particle.velocity);
      particle.velocity.y -= 0.001; // gravity

      positions[i * 3] = particle.position.x + position[0];
      positions[i * 3 + 1] = particle.position.y + position[1];
      positions[i * 3 + 2] = particle.position.z + position[2];

      sizes[i] = particle.size * (1 - elapsedTime / (duration / 1000));
    });

    mesh.current.geometry.attributes.position.needsUpdate = true;
    mesh.current.geometry.attributes.size.needsUpdate = true;

    if (elapsedTime > duration / 1000) {
      mesh.current.visible = false;
    }
  });

  return (
    <points ref={mesh}>
      <bufferGeometry />
      <pointsMaterial
        color={color}
        size={0.05}
        sizeAttenuation
        transparent
        opacity={0.8}
      />
    </points>
  );
};

export default ParticleSystem;