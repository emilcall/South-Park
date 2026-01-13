import { useGLTF } from '@react-three/drei'
import { useRef, useState, useMemo, memo, useEffect } from 'react'
import * as THREE from 'three'

const Model = ({ poi, onClick, isSelected, debugMode = false }) => {
  const { scene } = useGLTF(poi.model)
  const meshRef = useRef()
  const [hovered, setHovered] = useState(false)
  const originalMaterials = useRef(new Map())

  const clonedScene = useMemo(() => {
    const cloned = scene.clone()
    
    cloned.traverse((child) => {
      if (child.isMesh && child.material) {
        originalMaterials.current.set(child.uuid, child.material.clone())
      }
    })
    
    return cloned
  }, [scene, poi.name, debugMode])
  
  useEffect(() => {
    if (!clonedScene || poi.interactive === false) return
    
    clonedScene.traverse((child) => {
      if (child.isMesh && child.material) {
        if (hovered && !isSelected) {
          child.material.emissive = new THREE.Color(0x444444)
          child.material.emissiveIntensity = 0.3
        } else {
          child.material.emissive = new THREE.Color(0x000000)
          child.material.emissiveIntensity = 0
        }
      }
    })
  }, [hovered, clonedScene, poi.interactive, isSelected])

  const handleClick = (e) => {
    e.stopPropagation()
    
    if (poi.interactive !== false && onClick) {
      onClick(poi)
    }
  }

  const handlePointerOver = (e) => {
    e.stopPropagation()
    if (poi.interactive !== false) {
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
        onClick={handleClick}
        onPointerOver={poi.interactive !== false ? handlePointerOver : undefined}
        onPointerOut={poi.interactive !== false ? handlePointerOut : undefined}
      />
    </group>
  )
}

export default memo(Model)
