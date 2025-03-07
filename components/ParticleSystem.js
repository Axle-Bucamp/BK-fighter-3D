import React, {
  useMemo,
  useRef,
} from 'react';

import * as THREE from 'three';

import { useFrame } from '@react-three/fiber';

const ParticleSystem = ({ position, color = '#ffffff', count = 20 }) => {
  const mesh = useRef()

  const particles = useMemo(() => {
    const temp = []
    for (let i = 0; i < count; i++) {
      const time = Math.random() * 100
      const factor = 20 + Math.random() * 100
      const speed = 0.01 + Math.random() / 200
      const x = Math.random() - 0.5
      const y = Math.random() - 0.5
      const z = Math.random() - 0.5

      temp.push({ time, factor, speed, x, y, z })
    }
    return temp
  }, [count])

  const dummy = useMemo(() => new THREE.Object3D(), [])

  useFrame(() => {
    particles.forEach((particle, i) => {
      let { time, factor, speed, x, y, z } = particle

      time = particle.time += speed / 2
      const a = Math.cos(time) + Math.sin(time * 1) / 10
      const b = Math.sin(time) + Math.cos(time * 2) / 10
      const s = Math.cos(time)

      dummy.position.set(
        x * a + position[0],
        y * b + position[1],
        (z * s + position[2]) * factor
      )
      dummy.scale.set(s, s, s)
      dummy.updateMatrix()

      mesh.current.setMatrixAt(i, dummy.matrix)
    })
    mesh.current.instanceMatrix.needsUpdate = true
  })

  return (
    <instancedMesh ref={mesh} args={[null, null, count]}>
      <sphereGeometry args={[0.1, 32, 32]} />
      <meshBasicMaterial color={color} />
    </instancedMesh>
  )
}

export default ParticleSystem