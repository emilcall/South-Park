import { Suspense, useMemo, useRef, useEffect, useState } from 'react'
import * as THREE from 'three'
import { useThree } from '@react-three/fiber'
import { useGLTF } from '@react-three/drei'
import Model from '../components/Models/Model'
import { poiData } from '../data/poiData'

const SouthParkScene = ({ onPoiClick, selectedPoi, debugMode = false }) => {
  const { scene } = useThree()
  const [mapBounds, setMapBounds] = useState(null)
  
  const mapModel = useGLTF('/3Dmodels/map_compressed.glb')
  
  useEffect(() => {
    if (mapModel?.scene) {
      const box = new THREE.Box3().setFromObject(mapModel.scene)
      setMapBounds(box)
    }
  }, [mapModel, debugMode])
  
  const fogPlanes = useMemo(() => {
    if (!mapBounds) return []
    
    const planes = []
    const fogHeight = 25
    const fogInset = 39
    
    const minX = mapBounds.min.x + fogInset +5
    const maxX = mapBounds.max.x - fogInset
    const minZ = mapBounds.min.z 
    const maxZ = mapBounds.max.z - fogInset
    const centerZ = (minZ + maxZ) / 2
    const centerX = (minX + maxX) / 2
    const widthX = maxX - minX
    const widthZ = maxZ - minZ
    const fogY = mapBounds.min.y + fogHeight/2 - 30
    
    const createFogTexture = (width, height) => {
      const canvas = document.createElement('canvas')
      canvas.width = width
      canvas.height = height
      const ctx = canvas.getContext('2d')
      
      const gradient = ctx.createLinearGradient(0, 0, 0, height)
      gradient.addColorStop(0, 'rgba(224, 224, 224, 0)')
      gradient.addColorStop(0.2, 'rgba(224, 224, 224, 0.3)')
      gradient.addColorStop(0.4, 'rgba(224, 224, 224, 0.7)')
      gradient.addColorStop(0.6, 'rgba(224, 224, 224, 0.95)')
      gradient.addColorStop(1, 'rgba(224, 224, 224, 1)')
      
      ctx.fillStyle = gradient
      ctx.fillRect(0, 0, width, height)
      
      return new THREE.CanvasTexture(canvas)
    }
    
    const fogTexture = createFogTexture(512, 512)
    fogTexture.needsUpdate = true
    
    planes.push(
      <mesh key="fog-left" position={[minX, fogY, centerZ]} rotation={[0, -Math.PI/2, 0]}>
        <planeGeometry args={[widthZ, fogHeight]} />
        <meshBasicMaterial map={fogTexture} transparent opacity={1} side={THREE.DoubleSide} depthWrite={false} />
      </mesh>
    )
    
    planes.push(
      <mesh key="fog-right" position={[maxX, fogY, centerZ]} rotation={[0, Math.PI/2, 0]}>
        <planeGeometry args={[widthZ, fogHeight]} />
        <meshBasicMaterial map={fogTexture.clone()} transparent opacity={1} side={THREE.DoubleSide} depthWrite={false} />
      </mesh>
    )
    
    planes.push(
      <mesh key="fog-front" position={[centerX, fogY, maxZ]} rotation={[0, Math.PI, 0]}>
        <planeGeometry args={[widthX, fogHeight]} />
        <meshBasicMaterial map={fogTexture.clone()} transparent opacity={1} side={THREE.DoubleSide} depthWrite={false} />
      </mesh>
    )
    
    planes.push(
      <mesh key="fog-back" position={[centerX, fogY, minZ]} rotation={[0, 0, 0]}>
        <planeGeometry args={[widthX, fogHeight]} />
        <meshBasicMaterial map={fogTexture.clone()} transparent opacity={1} side={THREE.DoubleSide} depthWrite={false} />
      </mesh>
    )
    
    return planes
  }, [mapBounds])
  
  return (
    <Suspense fallback={null}>
      {poiData.map((poi) => (
        <Model
          key={poi.id}
          poi={poi}
          onClick={onPoiClick}
          isSelected={selectedPoi?.id === poi.id}
          debugMode={debugMode}
        />
      ))}
      {fogPlanes}
    </Suspense>
  )
}

export default SouthParkScene
