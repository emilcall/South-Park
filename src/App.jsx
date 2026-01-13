import { useState, useRef, useEffect } from 'react'
import { Canvas } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import { Physics, RigidBody } from '@react-three/rapier'
import { gsap } from 'gsap'
import * as THREE from 'three'
import IntroScreen from './components/UI/IntroScreen'
import LoadingScreen from './components/UI/LoadingScreen'
import InfoPanel from './components/UI/InfoPanel'
import PoiList from './components/UI/PoiList'
import SouthParkScene from './scenes/SouthParkScene'
import Clouds from './components/Environment/Clouds'
import SnowSystem from './components/Effects/SnowSystem'

function App() {
  const [showIntro, setShowIntro] = useState(true)
  const [startLoading, setStartLoading] = useState(false)
  const [showAudioIntro, setShowAudioIntro] = useState(false)
  const [fadeOutAudio, setFadeOutAudio] = useState(false)
  const [showScene, setShowScene] = useState(false)
  const [selectedPoi, setSelectedPoi] = useState(null)
  const [isFocused, setIsFocused] = useState(false)
  const [crabPeopleImages, setCrabPeopleImages] = useState([])
  const [crabClickCount, setCrabClickCount] = useState(0)
  const [snowActive, setSnowActive] = useState(false)
  
  const cameraRef = useRef()
  const controlsRef = useRef()
  const sceneRef = useRef()
  const birdsAudioRef = useRef(null)
  const characterAudioRef = useRef(null)
  
  const stopBirdsAudio = () => {
    if (birdsAudioRef.current) {
      birdsAudioRef.current.pause()
    }
  }
  
  const resumeBirdsAudio = () => {
    if (birdsAudioRef.current) {
      birdsAudioRef.current.volume = 0.15
      birdsAudioRef.current.play().catch(err => {
      })
    }
  }
  

  const playCharacterAudio = (audioSrc) => {
    if (characterAudioRef.current) {
      characterAudioRef.current.pause()
      characterAudioRef.current = null
    }
    
    stopBirdsAudio()
    
    characterAudioRef.current = new Audio(audioSrc)
    
    if (audioSrc.includes('chinpokomon')) {
      characterAudioRef.current.volume = 0.8
    } else {
      characterAudioRef.current.volume = 0.4
    }
    
    characterAudioRef.current.play().catch(err => {
    })
    
    characterAudioRef.current.onended = () => {
      resumeBirdsAudio()
      characterAudioRef.current = null
    }
  }
  
  const stopCharacterAudio = () => {
    if (characterAudioRef.current) {
      characterAudioRef.current.pause()
      characterAudioRef.current = null
    }
    resumeBirdsAudio()
  }
  
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && selectedPoi) {
        handleCloseInfo()
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [selectedPoi])
  
  useEffect(() => {
    if (showScene && cameraRef.current && controlsRef.current) {
      const camera = cameraRef.current
      const controls = controlsRef.current
      
      if (sceneRef.current) {
        const sunriseColor = new THREE.Color('#FF6B35')
        sceneRef.current.background = sunriseColor
        
        const startColor = { r: sunriseColor.r, g: sunriseColor.g, b: sunriseColor.b }
        const endColor = new THREE.Color('#4DA6FF')
        
        gsap.to(startColor, {
          r: endColor.r,
          g: endColor.g,
          b: endColor.b,
          duration: 10,
          ease: "power1.inOut",
          onUpdate: () => {
            if (sceneRef.current) {
              sceneRef.current.background.setRGB(startColor.r, startColor.g, startColor.b)
            }
          }
        })
      }
      
      camera.position.set(5, 4, 45.09)
      controls.target.set(5, 3.5, 42.09)
      controls.update()
      
      setTimeout(() => {
        const startCam = { x: camera.position.x, y: camera.position.y, z: camera.position.z }
        const startTarget = { x: controls.target.x, y: controls.target.y, z: controls.target.z }
        const endCam = { x: 0, y: 40, z: 50 }
        const endTarget = { x: 0, y: 0, z: 0 }
        
        gsap.to({ progress: 0 }, {
          progress: 1,
          duration: 4.5,
          ease: "power1.inOut",
          onUpdate: function() {
            const p = this.targets()[0].progress
            
            const camX = startCam.x + (endCam.x - startCam.x) * p
            const camZ = startCam.z + (endCam.z - startCam.z) * p
            
            const yProgress = Math.pow(p, 5)
            const camY = startCam.y + (endCam.y - startCam.y) * yProgress
            
            const targetX = startTarget.x + (endTarget.x - startTarget.x) * p
            const targetY = startTarget.y + (endTarget.y - startTarget.y) * yProgress
            const targetZ = startTarget.z + (endTarget.z - startTarget.z) * p
            
            camera.position.set(camX, camY, camZ)
            controls.target.set(targetX, targetY, targetZ)
            controls.update()
          }
        })
      }, 1500)
    }
  }, [showScene])
  
  useEffect(() => {
    if (!sceneRef.current) return
    
    const targetColor = snowActive ? new THREE.Color('#6B8E9E') : new THREE.Color('#4DA6FF')
    const currentColor = sceneRef.current.background
    
    let animationId
    const animate = () => {
      if (!sceneRef.current) return
      
      currentColor.lerp(targetColor, 0.02)
      
      const diff = Math.abs(currentColor.r - targetColor.r) + 
                   Math.abs(currentColor.g - targetColor.g) + 
                   Math.abs(currentColor.b - targetColor.b)
      
      if (diff > 0.01) {
        animationId = requestAnimationFrame(animate)
      }
    }
    
    animate()
    
    return () => {
      if (animationId) cancelAnimationFrame(animationId)
    }
  }, [snowActive])

  const handleEnter = () => {
    setShowIntro(false)
    setStartLoading(true)
  }

  const handleModelsLoaded = () => {
    setStartLoading(false)
    setShowAudioIntro(true)
    
    const audio = new Audio('/audio/south-park-guitar-made-with-Voicemod.mp3')
    audio.volume = 0.7
    audio.play()
    
    audio.addEventListener('ended', () => {
      setFadeOutAudio(true)
      setTimeout(() => {
        setShowAudioIntro(false)
        setFadeOutAudio(false)
        setShowScene(true)
        
        birdsAudioRef.current = new Audio('/audio/mixkit-little-birds-singing-in-the-trees-17.wav')
        birdsAudioRef.current.loop = true
        birdsAudioRef.current.volume = 0.15
        birdsAudioRef.current.play().catch(err => {
        })
      }, 1500)
    })
  }

  const handlePoiClick = (poi) => {
    if (selectedPoi && selectedPoi.id === poi.id) {
      setSelectedPoi(poi)
      return
    }
    
    stopCharacterAudio()
    
    setCrabPeopleImages([])
    setCrabClickCount(0)
    
    setSelectedPoi(poi)
    setIsFocused(true)
    
    if (cameraRef.current && controlsRef.current) {
      const camera = cameraRef.current
      const controls = controlsRef.current
      
      const targetPos = poi.cameraTarget || poi.position
      
      const distance = poi.cameraDistance !== undefined ? poi.cameraDistance : 5
      const cameraHeight = poi.cameraHeight || 5
      const targetHeight = poi.targetHeight !== undefined ? poi.targetHeight : 0
      
      let xOffset = 0
      let zOffset = distance
      
      if (poi.cameraSide === 'front') {
        zOffset = -distance
      } else if (poi.cameraSide === 'right') {
        xOffset = distance
        zOffset = 0
      } else if (poi.cameraSide === 'left') {
        xOffset = -distance
        zOffset = 0
      }
      
      let focusY = targetHeight
      if (poi.cameraTiltAngle !== undefined) {
        const tiltAngleRad = (poi.cameraTiltAngle * Math.PI) / 180
        focusY = cameraHeight - (distance * Math.tan(tiltAngleRad))
      }
      
      const targetPosition = {
        x: targetPos[0] + xOffset,
        y: cameraHeight,
        z: targetPos[2] + zOffset
      }
      
      const targetFocus = {
        x: targetPos[0],
        y: focusY,
        z: targetPos[2]
      }
      
      gsap.to(camera.position, {
        x: targetPosition.x,
        y: targetPosition.y,
        z: targetPosition.z,
        duration: 1.5,
        ease: "power2.inOut",
        onUpdate: () => {
          controls.update()
        }
      })
      
      gsap.to(controls.target, {
        x: targetFocus.x,
        y: targetFocus.y,
        z: targetFocus.z,
        duration: 1.5,
        ease: "power2.inOut",
        onUpdate: () => {
          controls.update()
        }
      })
    }
  }

  const handleCloseInfo = () => {
    setSelectedPoi(null)
    setIsFocused(false)
    setCrabPeopleImages([])
    setCrabClickCount(0)
    stopCharacterAudio()
    
    if (cameraRef.current && controlsRef.current) {
      const camera = cameraRef.current
      const controls = controlsRef.current
      
      gsap.to(camera.position, {
        x: 0,
        y: 40,
        z: 50,
        duration: 1.5,
        ease: "power2.inOut",
        onUpdate: () => {
          controls.update()
        }
      })
      
      gsap.to(controls.target, {
        x: 0,
        y: 0,
        z: 0,
        duration: 1.5,
        ease: "power2.inOut",
        onUpdate: () => {
          controls.update()
        }
      })
    }
  }

  const handleCrabClick = () => {
    const newClickCount = crabClickCount + 1
    setCrabClickCount(newClickCount)
    
    if (newClickCount >= 5) {
      setCrabPeopleImages(prev => [...prev, {
        x: Math.random() * (window.innerWidth - 200),
        y: Math.random() * (window.innerHeight - 200),
        size: 150 + Math.random() * 100
      }])
    }
  }

  return (
    <div className="app-container">
      {showIntro && <IntroScreen onEnter={handleEnter} />}

      {startLoading && <LoadingScreen onComplete={handleModelsLoaded} />}
      
      {showAudioIntro && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          backgroundColor: '#000',
          zIndex: 9999,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          animation: fadeOutAudio ? 'cloudDisperse 1.5s ease-out forwards' : 'none'
        }}>
          <img 
            src="/images/South_Park_Logo.webp" 
            alt="South Park Logo" 
            style={{
              maxWidth: '80%',
              maxHeight: '80%',
              objectFit: 'contain'
            }}
          />
        </div>
      )}
      
      <style>{`
        @keyframes cloudDisperse {
          0% {
            opacity: 1;
            filter: blur(0px);
            transform: scale(1);
          }
          30% {
            opacity: 0.9;
            filter: blur(10px);
            transform: scale(1.1);
          }
          70% {
            opacity: 0.4;
            filter: blur(40px);
            transform: scale(1.5);
          }
          100% {
            opacity: 0;
            filter: blur(80px);
            transform: scale(2);
          }
        }
      `}</style>

      {(startLoading || showAudioIntro || showScene) && (
        <Canvas
          camera={{
            position: [5, 4, 45.09],
            fov: 75
          }}
          dpr={[1, 1.5]}
          gl={{
            antialias: false,
            powerPreference: 'high-performance',
            stencil: false,
            depth: true
          }}
          onCreated={({ scene, gl, camera, controls }) => {
            const sunriseColor = new THREE.Color('#FF6B35')
            scene.fog = new THREE.FogExp2('#b8d4e8', 0.012)
            scene.background = sunriseColor
            gl.setClearColor('#FF6B35')
            cameraRef.current = camera
            
            sceneRef.current = scene
            
            if (controls) {
              controls.target.set(5, 3.5, 42.09)
              controls.update()
              controls.saveState()
            }
          }}
        >
          <ambientLight intensity={1.2} color="#fff5e6" />
          <directionalLight 
            position={[50, 80, 30]} 
            intensity={1.2}
            color="#fff8f0"
          />
          <directionalLight 
            position={[-50, 60, -30]} 
            intensity={0.8}
            color="#ffe8d0"
          />
          <hemisphereLight 
            intensity={1.2} 
            color="#87ceeb" 
            groundColor="#8b7355" 
          />
          
          <Clouds snowActive={snowActive} />

          <Physics gravity={[0, -9.81, 0]}>
            <SnowSystem isActive={snowActive} />
            
            <RigidBody type="fixed" colliders="cuboid">
              <mesh position={[0, -1, 0]} visible={false}>
                <boxGeometry args={[200, 1, 200]} />
              </mesh>
            </RigidBody>
          </Physics>

          <SouthParkScene 
            onPoiClick={handlePoiClick}
            selectedPoi={selectedPoi}
          />

          <OrbitControls
            ref={controlsRef}
            makeDefault 
            enableDamping={false}
            minDistance={1}
            maxDistance={40}
            minPolarAngle={Math.PI / 6}
            maxPolarAngle={Math.PI / 2.2}
            enablePan={false}
            target={[5, 3.5, 42.09]}
          />
        </Canvas>
      )}

      {showScene && (
        <div className="ui-overlay">
          <h1 className="title">South Park</h1>
        </div>
      )}
      
      {showScene && (
        <div style={{
          position: 'absolute',
          top: '20px',
          right: '20px',
          zIndex: 100,
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          background: 'rgba(0, 0, 0, 0.85)',
          padding: '15px 20px',
          border: '5px solid #000',
          boxShadow: '6px 6px 0 rgba(0, 0, 0, 0.8)'
        }}>
          <span style={{
            color: '#FFD700',
            fontWeight: 'bold',
            fontSize: '18px',
            fontFamily: '"Comic Sans MS", cursive',
            textShadow: '-2px -2px 0 #000, 2px -2px 0 #000, -2px 2px 0 #000, 2px 2px 0 #000'
          }}>
            Snow:
          </span>
          <button 
            onClick={() => {
              setSnowActive(!snowActive)
            }}
            style={{
              width: '60px',
              height: '30px',
              background: snowActive ? '#00FF00' : '#FF0000',
              border: '4px solid #000',
              borderRadius: '15px',
              cursor: 'pointer',
              position: 'relative',
              transition: 'background 0.3s',
              boxShadow: 'inset 2px 2px 0 rgba(0,0,0,0.3)'
            }}
          >
            <div style={{
              position: 'absolute',
              top: '1px',
              left: snowActive ? '28px' : '1px',
              width: '22px',
              height: '22px',
              background: '#FFF',
              border: '3px solid #000',
              borderRadius: '50%',
              transition: 'left 0.3s',
              boxShadow: '2px 2px 0 rgba(0,0,0,0.5)'
            }} />
          </button>
          <span style={{
            color: '#FFF',
            fontWeight: 'bold',
            fontSize: '14px',
            fontFamily: '"Comic Sans MS", cursive',
            minWidth: '30px'
          }}>
            {snowActive ? 'ON' : 'OFF'}
          </span>
        </div>
      )}

      {showScene && <PoiList onPoiSelect={handlePoiClick} selectedPoi={selectedPoi} />}
      
      {showScene && (
        <InfoPanel 
          poi={selectedPoi} 
          onClose={handleCloseInfo} 
          crabPeopleImages={crabPeopleImages}
          onCrabClick={handleCrabClick}
          onPlayAudio={playCharacterAudio}
          onStopAudio={stopCharacterAudio}
        />
      )}
      
      {crabPeopleImages.map((img, index) => (
        <img 
          key={index}
          src="/images/characters/300px-Crab-people.webp"
          alt="Crab Person"
          style={{
            position: 'fixed',
            left: img.x + 'px',
            top: img.y + 'px',
            width: img.size + 'px',
            height: img.size + 'px',
            objectFit: 'contain',
            zIndex: 1000,
            pointerEvents: 'none',
            animation: 'fadeInCrab 0.5s ease-out'
          }}
        />
      ))}
      
      <style>{`
        @keyframes fadeInCrab {
          0% {
            opacity: 0;
            transform: scale(0.5);
          }
          100% {
            opacity: 1;
            transform: scale(1);
          }
        }
      `}</style>
    </div>
  )
}

export default App
