import { useState, useEffect, useRef } from 'react'
import { RigidBody } from '@react-three/rapier'
import * as THREE from 'three'

const Snowflake = ({ position, index }) => {
  const size = 0.1 + Math.random() * 0.15
  const rotation1 = Math.random() * Math.PI
  const rotation2 = Math.random() * Math.PI
  
  return (
    <RigidBody
      position={position}
      colliders="ball"
      mass={0.01}
      restitution={0.2}
      linearDamping={0.5}
      angularDamping={0.8}
      gravityScale={0.3}
    >
      <mesh rotation={[rotation1, rotation2, 0]} castShadow>
        <group>
          <mesh position={[0, 0, 0]}>
            <boxGeometry args={[size * 0.1, size, size * 0.1]} />
            <meshStandardMaterial color="white" />
          </mesh>
          <mesh position={[0, 0, 0]}>
            <boxGeometry args={[size, size * 0.1, size * 0.1]} />
            <meshStandardMaterial color="white" />
          </mesh>
          <mesh position={[0, 0, 0]} rotation={[0, 0, Math.PI / 4]}>
            <boxGeometry args={[size * 0.7, size * 0.1, size * 0.1]} />
            <meshStandardMaterial color="white" />
          </mesh>
          <mesh position={[0, 0, 0]} rotation={[0, 0, -Math.PI / 4]}>
            <boxGeometry args={[size * 0.7, size * 0.1, size * 0.1]} />
            <meshStandardMaterial color="white" />
          </mesh>
        </group>
      </mesh>
    </RigidBody>
  )
}

const SnowSystem = ({ isActive }) => {
  const [snowflakes, setSnowflakes] = useState([])
  const maxSnowflakes = 1200
  const spawnInterval = 30

  useEffect(() => {
    if (!isActive) {
      setSnowflakes([])
      return
    }

    const interval = setInterval(() => {
      setSnowflakes(prev => {
        if (prev.length >= maxSnowflakes) return prev
        
        const newFlake = {
          id: Date.now() + Math.random(),
          position: [
            (Math.random() - 0.5) * 100,
            50 + Math.random() * 20,
            (Math.random() - 0.5) * 100
          ]
        }
        
        return [...prev, newFlake]
      })
    }, spawnInterval)

    const cleanupInterval = setInterval(() => {
      setSnowflakes(prev => prev.slice(-maxSnowflakes))
    }, 5000)

    return () => {
      clearInterval(interval)
      clearInterval(cleanupInterval)
    }
  }, [isActive])

  if (!isActive) return null

  return (
    <>
      {snowflakes.map((flake, index) => (
        <Snowflake key={flake.id} position={flake.position} index={index} />
      ))}
    </>
  )
}

export default SnowSystem
