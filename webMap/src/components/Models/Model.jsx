import { useGLTF } from '@react-three/drei'
import { useRef, useState, useMemo, memo, useEffect } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

const Model = ({ poi, onClick, isSelected, debugMode = false, onOpenExternalUrl, sparrowShot, sparrowReviving, glowIntensity = 0, introComplete = true }) => {
  const { scene } = useGLTF(poi.model)
  const meshRef = useRef()
  const [hovered, setHovered] = useState(false)
  const originalMaterials = useRef(new Map())
  const currentHoverIntensity = useRef(0)

  const clonedScene = useMemo(() => {
    const cloned = scene.clone()
    
    cloned.traverse((child) => {
      if (child.isMesh && child.material) {
        originalMaterials.current.set(child.uuid, child.material.clone())
      }
    })
    
    return cloned
  }, [scene, poi.name, debugMode])
  
  useFrame((state, delta) => {
    if (!clonedScene || poi.interactive === false) return
    
    const targetIntensity = (hovered && !isSelected && introComplete) ? 0.5 : 0
    const fadeSpeed = 4
    
    // Smoothly interpolate towards target
    if (currentHoverIntensity.current < targetIntensity) {
      currentHoverIntensity.current = Math.min(currentHoverIntensity.current + delta * fadeSpeed, targetIntensity)
    } else if (currentHoverIntensity.current > targetIntensity) {
      currentHoverIntensity.current = Math.max(currentHoverIntensity.current - delta * fadeSpeed, targetIntensity)
    }
    
    clonedScene.traverse((child) => {
      if (child.isMesh && child.material) {
        if (poi.id === 'sparrowprince' && sparrowReviving) {
          child.material.emissive = new THREE.Color(0xFFD700)
          child.material.emissiveIntensity = glowIntensity
        } else if (currentHoverIntensity.current > 0.01) {
          child.material.emissive = new THREE.Color(0xFFCC00)
          child.material.emissiveIntensity = currentHoverIntensity.current
        } else {
          child.material.emissive = new THREE.Color(0x000000)
          child.material.emissiveIntensity = 0
        }
      }
    })
  })
  
  useEffect(() => {
    if (!clonedScene || poi.interactive === false) return
    clonedScene.traverse((child) => {
      if (child.isMesh && child.material) {
        if (poi.id === 'sparrowprince' && sparrowShot) {
          child.material.transparent = true
          child.material.opacity = 0.4
        } else if (poi.id === 'sparrowprince') {
          child.material.opacity = 1
          child.material.transparent = false
        }
      }
    })
  }, [clonedScene, poi.interactive, sparrowShot, poi.id])

  const handleClick = (e) => {
    e.stopPropagation()
    
    if (isSelected && poi.externalUrl && onOpenExternalUrl) {
      onOpenExternalUrl(poi.externalUrl)
      return
    }
    
    if (poi.interactive !== false && onClick) {
      onClick(poi)
    }
  }

  const handlePointerOver = (e) => {
    e.stopPropagation()
    if (poi.interactive !== false && introComplete) {
      setHovered(true)
      document.body.style.cursor = 'pointer'
    }
  }

  const handlePointerOut = () => {
    setHovered(false)
    document.body.style.cursor = 'auto'
  }

  return (
    <group ref={meshRef} position={poi.position}>
      <primitive
        object={clonedScene}
        scale={poi.scale || 1}
        onClick={poi.hitboxScale ? undefined : handleClick}
        onPointerOver={poi.hitboxScale ? undefined : (poi.interactive !== false ? handlePointerOver : undefined)}
        onPointerOut={poi.hitboxScale ? undefined : (poi.interactive !== false ? handlePointerOut : undefined)}
      />
      {/* Custom smaller hitbox for POIs with hitboxScale - positioned at cameraTarget relative to position */}
      {poi.hitboxScale && poi.cameraTarget && (
        <mesh
          position={[
            poi.cameraTarget[0] - poi.position[0] +5,
            poi.cameraTarget[1] - poi.position[1] + 31,
            poi.cameraTarget[2] - poi.position[2] -1
          ]}
          onClick={handleClick}
          onPointerOver={poi.interactive !== false ? handlePointerOver : undefined}
          onPointerOut={poi.interactive !== false ? handlePointerOut : undefined}
        >
          <boxGeometry args={[12, 6, 12]} />
          <meshBasicMaterial transparent opacity={0} />
        </mesh>
      )}
    </group>
  )
}

export default memo(Model)
