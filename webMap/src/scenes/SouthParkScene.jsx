import { Suspense, useMemo, useRef, useEffect, useState } from 'react'
import * as THREE from 'three'
import { useThree, useFrame } from '@react-three/fiber'
import { useGLTF } from '@react-three/drei'
import Model from '../components/Models/Model'
import { poiData } from '../data/poiData'

const MistCloud = ({ position }) => {
  const groupRef = useRef()
  const [scale, setScale] = useState(0.1)
  const [opacity, setOpacity] = useState(0.6)
  const [fadeOut, setFadeOut] = useState(false)
  
  useEffect(() => {
    const timer = setTimeout(() => {
      setFadeOut(true)
    }, 1500)
    return () => clearTimeout(timer)
  }, [])
  
  useFrame((state, delta) => {
    if (scale < 3) {
      setScale(prev => Math.min(prev + delta * 6, 3))
    }
    
    if (fadeOut && opacity > 0) {
      setOpacity(prev => Math.max(prev - delta * 0.2, 0))
    }
    
    if (groupRef.current) {
      groupRef.current.rotation.y += delta * 0.3
    }
  })
  
  return (
    <group ref={groupRef} position={[position[0], position[1], position[2]]} scale={scale}>
      <mesh position={[0, 0, 0]}>
        <sphereGeometry args={[0.5, 16, 16]} />
        <meshBasicMaterial color="#808080" transparent opacity={opacity * 0.7} depthWrite={false} />
      </mesh>
      <mesh position={[0.3, 0.1, 0.2]}>
        <sphereGeometry args={[0.4, 16, 16]} />
        <meshBasicMaterial color="#909090" transparent opacity={opacity * 0.5} depthWrite={false} />
      </mesh>
      <mesh position={[-0.2, 0.15, -0.1]}>
        <sphereGeometry args={[0.35, 16, 16]} />
        <meshBasicMaterial color="#707070" transparent opacity={opacity * 0.6} depthWrite={false} />
      </mesh>
      <mesh position={[0.1, -0.1, 0.25]}>
        <sphereGeometry args={[0.45, 16, 16]} />
        <meshBasicMaterial color="#858585" transparent opacity={opacity * 0.4} depthWrite={false} />
      </mesh>
      <mesh position={[-0.15, 0.2, 0.15]}>
        <sphereGeometry args={[0.3, 16, 16]} />
        <meshBasicMaterial color="#959595" transparent opacity={opacity * 0.5} depthWrite={false} />
      </mesh>
    </group>
  )
}

const FeatherSparkles = ({ position }) => {
  const pointsRef = useRef()
  const [opacity, setOpacity] = useState(1)
  const velocities = useRef([])
  
  const particleCount = 25
  
  const positions = useMemo(() => {
    const pos = new Float32Array(particleCount * 3)
    velocities.current = []
    for (let i = 0; i < particleCount; i++) {
      pos[i * 3] = position[0]
      pos[i * 3 + 1] = position[1]
      pos[i * 3 + 2] = position[2]
      velocities.current.push({
        x: (Math.random() - 0.5) * 8,
        y: Math.random() * 3 + 2,
        z: (Math.random() - 0.5) * 8
      })
    }
    return pos
  }, [position])
  
  useFrame((state, delta) => {
    if (pointsRef.current && opacity > 0) {
      const posArray = pointsRef.current.geometry.attributes.position.array
      for (let i = 0; i < particleCount; i++) {
        posArray[i * 3] += velocities.current[i].x * delta
        posArray[i * 3 + 1] += velocities.current[i].y * delta
        posArray[i * 3 + 2] += velocities.current[i].z * delta
        velocities.current[i].y -= delta * 3
      }
      pointsRef.current.geometry.attributes.position.needsUpdate = true
      setOpacity(prev => Math.max(prev - delta * 0.4, 0))
    }
  })
  
  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={particleCount}
          array={positions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.08}
        color="#8B4513"
        transparent
        opacity={opacity}
        sizeAttenuation
      />
    </points>
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
      <pointLight
        position={[0, 20, 0]}
        intensity={intensity * 200}
        color="#FFE4B5"
        distance={150}
        decay={1}
      />
      
      <pointLight
        position={[0, 5, 0]}
        intensity={intensity * 120}
        color="#FFD700"
        distance={100}
        decay={1}
      />
      
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
      
      <points position={[0, 55, 0]}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={500}
            array={new Float32Array(Array.from({length: 1500}, (_, i) => {
              if (i % 3 === 1) return (Math.random() - 0.5) * 110
              return (Math.random() - 0.5) * 5
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
      {showBloodEffect && sparrowPrincePoi && (
        <MistCloud position={[sparrowPrincePoi.cameraTarget[0], 0, sparrowPrincePoi.cameraTarget[2]]} />
      )}
      {showBloodEffect && sparrowPrincePoi && (
        <FeatherSparkles position={[sparrowPrincePoi.cameraTarget[0], 0, sparrowPrincePoi.cameraTarget[2]]} />
      )}
      {showHeavenlyGlow && <HeavenlyGlow fading={heavenlyGlowFading} />}
    </Suspense>
  )
}

export default SouthParkScene
