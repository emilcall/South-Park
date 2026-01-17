import { Suspense, useMemo, useRef, useEffect, useState } from 'react'
import * as THREE from 'three'
import { useThree, useFrame } from '@react-three/fiber'
import { useGLTF } from '@react-three/drei'
import Model from '../components/Models/Model'
import { poiData } from '../data/poiData'

const BloodSphere = ({ position }) => {
  const meshRef = useRef()
  const [scale, setScale] = useState(0.1)
  
  useFrame((state, delta) => {
    if (scale < 2) {
      setScale(prev => Math.min(prev + delta * 20, 2))
    }
  })
  
  return (
    <mesh ref={meshRef} position={[position[0], position[1], position[2]]} scale={scale}>
      <sphereGeometry args={[0.5, 32, 32]} />
      <meshBasicMaterial color="#8B0000" />
    </mesh>
  )
}

const HeavenlyGlow = ({ fading }) => {
  const lightRef = useRef()
  const [intensity, setIntensity] = useState(0)
  const [beamOpacity, setBeamOpacity] = useState(0)
  
  const crossPosition = [-25.95, -10, 5.52]
  
  useFrame((state, delta) => {
    if (fading) {
      setIntensity(prev => Math.max(prev - delta * 3, 0))
      setBeamOpacity(prev => Math.max(prev - delta * 0.3, 0))
    } else {
      if (intensity < 10) {
        setIntensity(prev => Math.min(prev + delta * 4, 10))
      }
      if (beamOpacity < 0.7) {
        setBeamOpacity(prev => Math.min(prev + delta * 0.7, 0.7))
      }
    }
  })
  
  return (
    <group position={crossPosition}>
      {/* Point light to illuminate the church */}
      <pointLight
        position={[0, 20, 0]}
        intensity={intensity * 200}
        color="#FFE4B5"
        distance={150}
        decay={1}
      />
      
      {/* Additional point light closer to ground */}
      <pointLight
        position={[0, 5, 0]}
        intensity={intensity * 120}
        color="#FFD700"
        distance={100}
        decay={1}
      />
      
      {/* Bright spotlight from above */}
      <spotLight
        ref={lightRef}
        position={[0, 100, 0]}
        target-position={[0, 0, 0]}
        angle={0.15}
        penumbra={0.3}
        intensity={intensity * 300}
        color="#FFE4B5"
        castShadow={false}
      />
      
      {/* Visible light beam cone - smaller radius */}
      <mesh position={[0, 55, 0]} rotation={[0, 0, 0]}>
        <coneGeometry args={[5, 110, 32, 1, true]} />
        <meshBasicMaterial 
          color="#FFD700" 
          transparent 
          opacity={beamOpacity}
          side={THREE.DoubleSide}
          depthWrite={false}
        />
      </mesh>
      
      {/* Inner brighter beam - smaller */}
      <mesh position={[0, 55, 0]} rotation={[0, 0, 0]}>
        <coneGeometry args={[2.5, 110, 32, 1, true]} />
        <meshBasicMaterial 
          color="#FFFACD" 
          transparent 
          opacity={beamOpacity * 0.8}
          side={THREE.DoubleSide}
          depthWrite={false}
        />
      </mesh>
      
      {/* Glowing particles/dust in the beam */}
      <points position={[0, 55, 0]}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={500}
            array={new Float32Array(Array.from({length: 1500}, (_, i) => {
              if (i % 3 === 1) return (Math.random() - 0.5) * 110 // Y spread along beam
              return (Math.random() - 0.5) * 5 // X and Z spread - smaller
            }))}
            itemSize={3}
          />
        </bufferGeometry>
        <pointsMaterial 
          size={0.25} 
          color="#FFD700" 
          transparent 
          opacity={beamOpacity * 2}
          sizeAttenuation
        />
      </points>
    </group>
  )
}

const SouthParkScene = ({ onPoiClick, selectedPoi, debugMode = false, onOpenExternalUrl, sparrowShot, showBloodEffect, sparrowReviving, glowIntensity, showHeavenlyGlow, heavenlyGlowFading, introComplete }) => {
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
  
  const sparrowPrincePoi = poiData.find(poi => poi.id === 'sparrowprince')
  
  return (
    <Suspense fallback={null}>
      {poiData.map((poi) => (
        <Model
          key={poi.id}
          poi={poi}
          onClick={onPoiClick}
          isSelected={selectedPoi?.id === poi.id}
          debugMode={debugMode}
          onOpenExternalUrl={onOpenExternalUrl}
          sparrowShot={poi.id === 'sparrowprince' ? sparrowShot : undefined}
          sparrowReviving={poi.id === 'sparrowprince' ? sparrowReviving : undefined}
          glowIntensity={poi.id === 'sparrowprince' ? glowIntensity : undefined}
          introComplete={introComplete}
        />
      ))}
      {fogPlanes}
      {/* Blood effect at correct Y position */}
      {showBloodEffect && sparrowPrincePoi && (
        <BloodSphere position={[sparrowPrincePoi.cameraTarget[0], 0, sparrowPrincePoi.cameraTarget[2]]} />
      )}
      {/* Heavenly glow effect from cross */}
      {showHeavenlyGlow && <HeavenlyGlow fading={heavenlyGlowFading} />}
    </Suspense>
  )
}

export default SouthParkScene
