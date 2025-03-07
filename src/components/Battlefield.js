import React, { useRef, useEffect } from 'react';
import { useFrame, useLoader } from '@react-three/fiber';
import * as THREE from 'three';
import { TextureLoader } from 'three/src/loaders/TextureLoader';

const Battlefield = ({ onCollision }) => {
  const meshRef = useRef();
  const depthMap = useLoader(TextureLoader, '/textures/depth_map.png');

  useEffect(() => {
    if (meshRef.current) {
      const geometry = meshRef.current.geometry;
      const positionAttribute = geometry.getAttribute('position');
      const vertex = new THREE.Vector3();

      for (let i = 0; i < positionAttribute.count; i++) {
        vertex.fromBufferAttribute(positionAttribute, i);
        const depthValue = depthMap.image.data[i * 4] / 255; // Assuming grayscale depth map
        vertex.z = depthValue * 10; // Scale the depth
        positionAttribute.setXYZ(i, vertex.x, vertex.y, vertex.z);
      }

      positionAttribute.needsUpdate = true;
      geometry.computeVertexNormals();
    }
  }, [depthMap]);

  useFrame((state) => {
    if (meshRef.current) {
      const raycaster = new THREE.Raycaster();
      raycaster.ray.origin.set(0, 10, 0); // Start from above the terrain
      raycaster.ray.direction.set(0, -1, 0); // Cast ray downwards

      const intersects = raycaster.intersectObject(meshRef.current);
      if (intersects.length > 0) {
        const point = intersects[0].point;
        onCollision(point);
      }
    }
  });

  return (
    <mesh ref={meshRef} rotation={[-Math.PI / 2, 0, 0]}>
      <planeGeometry args={[100, 100, 128, 128]} />
      <meshStandardMaterial
        map={depthMap}
        displacementMap={depthMap}
        displacementScale={10}
        wireframe={false}
      />
    </mesh>
  );
};

export default Battlefield;