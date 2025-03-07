import React, { useRef, useEffect } from 'react';
import { useLoader, useThree } from '@react-three/fiber';
import { TextureLoader } from 'three/src/loaders/TextureLoader';
import { PlaneGeometry, MeshStandardMaterial, Vector3 } from 'three';
import { useTexture } from '@react-three/drei';

const ARBattlefield = ({ depthMapUrl, textureUrl, size = [10, 10], resolution = [128, 128] }) => {
  const meshRef = useRef();
  const { scene } = useThree();

  // Load the depth map and texture
  const depthMap = useLoader(TextureLoader, depthMapUrl);
  const texture = useTexture(textureUrl);

  useEffect(() => {
    if (meshRef.current) {
      const geometry = new PlaneGeometry(size[0], size[1], resolution[0] - 1, resolution[1] - 1);
      const material = new MeshStandardMaterial({
        map: texture,
        displacementMap: depthMap,
        displacementScale: 1,
        roughness: 0.8,
      });

      meshRef.current.geometry = geometry;
      meshRef.current.material = material;

      // Displace vertices based on depth map
      const positionAttribute = geometry.attributes.position;
      const vertex = new Vector3();

      for (let i = 0; i < positionAttribute.count; i++) {
        vertex.fromBufferAttribute(positionAttribute, i);
        const u = (vertex.x + size[0] / 2) / size[0];
        const v = (vertex.y + size[1] / 2) / size[1];
        
        const sample = sampleDepthMap(depthMap, u, v);
        vertex.z = sample;

        positionAttribute.setXYZ(i, vertex.x, vertex.y, vertex.z);
      }

      positionAttribute.needsUpdate = true;
      geometry.computeVertexNormals();
    }
  }, [depthMap, texture, size, resolution]);

  // Helper function to sample the depth map
  const sampleDepthMap = (depthMap, u, v) => {
    const width = depthMap.image.width;
    const height = depthMap.image.height;
    const x = Math.floor(u * (width - 1));
    const y = Math.floor(v * (height - 1));
    const pixel = depthMap.image.data[(y * width + x) * 4];
    return (pixel / 255) * 2 - 1; // Normalize to [-1, 1]
  };

  return (
    <mesh ref={meshRef} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
      <planeGeometry args={size} />
      <meshStandardMaterial />
    </mesh>
  );
};

export default ARBattlefield;