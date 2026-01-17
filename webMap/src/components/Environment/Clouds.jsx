import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

const Cloud = ({ position, scale, speed, snowActive }) => {
  const meshRef = useRef()
  const currentColor = useRef(new THREE.Color('#FFFFFF')).current
  const blobCount = useMemo(() => 1 + Math.floor(Math.random() * 3), [])
  const blobData = useMemo(() => {
    return Array.from({ length: blobCount }).map(() => ({
      offset: [
        (Math.random() - 0.5) * scale,
        (Math.random() - 0.5) * scale * 0.5,
        (Math.random() - 0.5) * scale
      ],
      blobScale: scale * (0.6 + Math.random() * 0.6)
    }))
  }, [blobCount, scale])
  
  useFrame((state, delta) => {
    if (!meshRef.current) return
    
    meshRef.current.position.x += speed * delta * 60
    if (meshRef.current.position.x > 100) {
      meshRef.current.position.x = -120
    }
    
    const targetColor = snowActive ? new THREE.Color('#707070') : new THREE.Color('#FFFFFF')
    currentColor.lerp(targetColor, 0.02)
    
    meshRef.current.children.forEach(child => {
      if (child.material) {
        child.material.color.copy(currentColor)
      }
    })
  })
  
  return (
    <group ref={meshRef} position={position}>
      {blobData.map((blob, i) => (
        <mesh key={i} position={blob.offset} scale={blob.blobScale}>
          <sphereGeometry args={[1, 8, 8]} />
          <meshStandardMaterial color="#FFFFFF" transparent opacity={0.85} />
        </mesh>
      ))}
    </group>
  )
}

const Clouds = ({ snowActive }) => {
  const cloudCount = snowActive ? 60 : 30
  const spacing = snowActive ? 4.5 : 8
  
  const clouds = useMemo(() => {
    const result = []
    for (let i = 0; i < cloudCount; i++) {
      result.push({
        key: i,
        position: [
          -120 + (i * spacing) + Math.random() * 3,
          25 + Math.random() * 20,
          (Math.random() - 0.5) * 160
        ],
        scale: 4 + Math.random() * 5,
        speed: 0.015 + Math.random() * 0.025
      })
    }
    return result
  }, [cloudCount, spacing])
  
  return (
    <>
      {clouds.map(cloud => (
        <Cloud
          key={cloud.key}
          position={cloud.position}
          scale={cloud.scale}
          speed={cloud.speed}
          snowActive={snowActive}
        />
      ))}
    </>
  )
}

export default Clouds
