import { useState, useRef, useEffect, useMemo } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
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
import { poiData } from './data/poiData'

const MistPlane = () => {
  const texture = useMemo(() => {
    const canvas = document.createElement('canvas')
    canvas.width = 512
    canvas.height = 512
    const ctx = canvas.getContext('2d')
    
    const gradient = ctx.createRadialGradient(256, 256, 0, 256, 256, 256)
    gradient.addColorStop(0, 'rgba(255, 255, 255, 1)')
    gradient.addColorStop(0.3, 'rgba(255, 255, 255, 0.9)')
    gradient.addColorStop(0.6, 'rgba(255, 255, 255, 0.5)')
    gradient.addColorStop(0.8, 'rgba(255, 255, 255, 0.2)')
    gradient.addColorStop(1, 'rgba(255, 255, 255, 0)')
    
    ctx.fillStyle = gradient
    ctx.fillRect(0, 0, 512, 512)
    
    const tex = new THREE.CanvasTexture(canvas)
    tex.needsUpdate = true
    return tex
  }, [])
  
  return (
    <mesh position={[0, -35, 0]} rotation={[-Math.PI / 2, 0, 0]}>
      <planeGeometry args={[1000, 1000]} />
      <meshBasicMaterial map={texture} transparent depthWrite={false} />
    </mesh>
  )
}

const SceneLights = ({ dimmed }) => {
  const ambientRef = useRef()
  const dir1Ref = useRef()
  const dir2Ref = useRef()
  const hemiRef = useRef()
  const currentIntensity = useRef(1.2)
  
  useFrame((state, delta) => {
    const targetIntensity = dimmed ? 0.3 : 1.2
    const speed = 2
    
    if (currentIntensity.current < targetIntensity) {
      currentIntensity.current = Math.min(currentIntensity.current + delta * speed, targetIntensity)
    } else if (currentIntensity.current > targetIntensity) {
      currentIntensity.current = Math.max(currentIntensity.current - delta * speed, targetIntensity)
    }
    
    if (ambientRef.current) ambientRef.current.intensity = currentIntensity.current
    if (dir1Ref.current) dir1Ref.current.intensity = currentIntensity.current
    if (dir2Ref.current) dir2Ref.current.intensity = currentIntensity.current * 0.67
    if (hemiRef.current) hemiRef.current.intensity = currentIntensity.current
  })
  
  return (
    <>
      <ambientLight ref={ambientRef} intensity={1.2} color="#fff5e6" />
      <directionalLight 
        ref={dir1Ref}
        position={[50, 80, 30]} 
        intensity={1.2}
        color="#fff8f0"
      />
      <directionalLight 
        ref={dir2Ref}
        position={[-50, 60, -30]} 
        intensity={0.8}
        color="#ffe8d0"
      />
      <hemisphereLight 
        ref={hemiRef}
        intensity={1.2} 
        color="#87ceeb" 
        groundColor="#8b7355" 
      />
    </>
  )
}

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
  const [teleportFlash, setTeleportFlash] = useState(false)
  const [showScope, setShowScope] = useState(false)
  const [scopeTransition, setScopeTransition] = useState(false)
  const [sparrowShot, setSparrowShot] = useState(false)
  const [showBloodEffect, setShowBloodEffect] = useState(false)
  const [sparrowReviving, setSparrowReviving] = useState(false)
  const [glowIntensity, setGlowIntensity] = useState(0)
  const [showHeavenlyGlow, setShowHeavenlyGlow] = useState(false)
  const [heavenlyGlowFading, setHeavenlyGlowFading] = useState(false)
  const [introComplete, setIntroComplete] = useState(false)
  
  const cameraRef = useRef()
  const churchAudioRef = useRef(null)
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
    if (!sparrowShot) {
      resumeBirdsAudio()
    }
  }
  
  const handleJesusClick = () => {
    stopBirdsAudio()
    stopCharacterAudio()
    
    if (churchAudioRef.current) {
      churchAudioRef.current.pause()
    }
    churchAudioRef.current = new Audio('/audio/Video Project 5.mp3')
    churchAudioRef.current.volume = 0.6
    churchAudioRef.current.play().catch(err => {})
    
    churchAudioRef.current.onended = () => {
      setHeavenlyGlowFading(true)
      setTimeout(() => {
        setShowHeavenlyGlow(false)
        setHeavenlyGlowFading(false)
      }, 2000)
      if (!sparrowShot) {
        resumeBirdsAudio()
      }
    }
    
    setShowHeavenlyGlow(true)
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
          },
          onComplete: () => {
            setIntroComplete(true)
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

  const handlePoiClick = (poi, {scopeMode = false} = {}) => {
    if (selectedPoi && selectedPoi.id === poi.id) {
      setSelectedPoi(poi)
      return
    }
    
    stopCharacterAudio()
    
    setCrabPeopleImages([])
    setCrabClickCount(0)
    
    setSelectedPoi(poi)
    setIsFocused(true)
    
    if (poi.id === 'sparrowprince' && scopeMode) {
      setTimeout(() => {
        setShowScope(true)
      }, 1000)
    }
    
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
      
      const camAnimDuration = scopeMode ? 2.2 : 1.5
      const camProps = scopeMode && poi.id === 'sparrowprince'
        ? { x: targetPosition.x + 0.2, y: targetPosition.y + 0.2, z: targetPosition.z - 0.2 }
        : targetPosition
      const lookProps = scopeMode && poi.id === 'sparrowprince'
        ? { x: targetFocus.x, y: targetFocus.y + 0.1, z: targetFocus.z }
        : targetFocus
      
      gsap.to(camera.position, {
        ...camProps,
        duration: camAnimDuration,
        ease: "power2.inOut",
        onUpdate: () => {
          controls.update()
        },
        onComplete: () => {
          controls.maxDistance = 15
        }
      })
      gsap.to(controls.target, {
        ...lookProps,
        duration: camAnimDuration,
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
    setShowScope(false)
    setShowHeavenlyGlow(false)
    
    if (churchAudioRef.current) {
      churchAudioRef.current.pause()
      churchAudioRef.current = null
    }
    
    if (cameraRef.current && controlsRef.current) {
      const camera = cameraRef.current
      const controls = controlsRef.current
      
      controls.maxDistance = 40
      
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

  const handleExternalUrl = (url) => {
    if (cameraRef.current && controlsRef.current) {
      const camera = cameraRef.current
      const controls = controlsRef.current
      
      const whooshAudio = new Audio('/audio/transition-whoosh.mp3')
      whooshAudio.volume = 0.5
      whooshAudio.play().catch(err => {})
      
      controls.maxDistance = 3000
      
      gsap.to(camera.position, {
        x: 0,
        y: 2000,
        z: 5,
        duration: 2,
        ease: "power2.in",
        onUpdate: () => {
          controls.update()
        },
        onComplete: () => {
          setTeleportFlash(true)
          setTimeout(() => {
            window.open(url, '_blank')
            setTimeout(() => {
              setTeleportFlash(false)
              camera.position.set(0, 40, 50)
              controls.target.set(0, 0, 0)
              controls.maxDistance = 40
              controls.update()
            }, 500)
          }, 800)
        }
      })
      
      gsap.to(controls.target, {
        x: 0,
        y: 0,
        z: 0,
        duration: 2,
        ease: "power2.in",
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
        size: 150 + Math.random() * 100,
        rotation: (Math.random() - 0.5) * 40
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

      {teleportFlash && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          backgroundColor: 'white',
          zIndex: 9999,
          animation: 'flashIn 0.5s ease-out forwards'
        }} />
      )}
      
      <style>{`
        @keyframes flashIn {
          0% { opacity: 0; }
          100% { opacity: 1; }
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
          <SceneLights dimmed={showHeavenlyGlow} />
          
          <Clouds snowActive={snowActive} />

          <mesh position={[0, -300, 0]} rotation={[-Math.PI / 2, 0, 0]}>
            <planeGeometry args={[5000, 5000]} />
            <meshBasicMaterial color="white" />
          </mesh>
          
          <MistPlane />

          <Physics gravity={[0, -9.81, 0]}>
            <SnowSystem isActive={snowActive} />
            
            <RigidBody type="fixed" colliders="cuboid">
              <mesh position={[0, -1, 0]} visible={false}>
                <boxGeometry args={[200, 1, 200]} />
              </mesh>
            </RigidBody>
          </Physics>

          <SouthParkScene 
            onPoiClick={(showScope || !introComplete) ? null : handlePoiClick}
            selectedPoi={selectedPoi}
            onOpenExternalUrl={handleExternalUrl}
            sparrowShot={sparrowShot}
            showBloodEffect={showBloodEffect}
            sparrowReviving={sparrowReviving}
            glowIntensity={glowIntensity}
            showHeavenlyGlow={showHeavenlyGlow}
            heavenlyGlowFading={heavenlyGlowFading}
            introComplete={introComplete}
          />

          <OrbitControls
            ref={controlsRef}
            makeDefault
            enableDamping={false}
            minDistance={0.1}
            maxDistance={40}
            minPolarAngle={Math.PI / 6}
            maxPolarAngle={Math.PI / 2.15}
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

      {showScene && !showScope && (
        <button
          onClick={() => {
            if (sparrowShot) {
              const reviveAudio = new Audio('/audio/2019-03-30_18-13-20.mp3')
              reviveAudio.volume = 0.5
              reviveAudio.play()
              
              setTimeout(() => {
                const fadeStepsAudio = 40
                const fadeIntervalAudio = 4000 / fadeStepsAudio
                let audioStep = 0
                const audioFadeTimer = setInterval(() => {
                  audioStep++
                  reviveAudio.volume = Math.max(0.5 * (1 - audioStep / fadeStepsAudio), 0)
                  if (audioStep >= fadeStepsAudio) {
                    clearInterval(audioFadeTimer)
                    reviveAudio.pause()
                  }
                }, fadeIntervalAudio)
              }, 2000)
              
              const sparrowPoi = poiData.find(poi => poi.id === 'sparrowprince')
              if (sparrowPoi) {
                handlePoiClick(sparrowPoi)
              }
              
              setSparrowReviving(true)
              setGlowIntensity(4)
              
              setTimeout(() => {
                setSparrowShot(false)
              }, 500)
              
              const fadeSteps = 60
              const fadeInterval = 6000 / fadeSteps
              let step = 0
              const fadeTimer = setInterval(() => {
                step++
                const newIntensity = 4 * (1 - step / fadeSteps)
                setGlowIntensity(newIntensity)
                if (step >= fadeSteps) {
                  clearInterval(fadeTimer)
                  setSparrowReviving(false)
                  setGlowIntensity(0)
                }
              }, fadeInterval)
              
              setTimeout(() => {
                resumeBirdsAudio()
              }, 1000)
            } else {
              setScopeTransition(true)
              const sparrowPoi = poiData.find(poi => poi.id === 'sparrowprince')
              
              if (selectedPoi?.id === 'sparrowprince') {
                setTimeout(() => {
                  setShowScope(true)
                }, 1000)
              } else if (sparrowPoi) {
                handlePoiClick(sparrowPoi, {scopeMode: true})
              }
              setTimeout(() => {
                setScopeTransition(false)
              }, 1500)
            }
          }}
          style={{
            position: 'fixed',
            top: '20px',
            left: '50%',
            transform: 'translateX(-50%)',
            padding: '12px 24px',
            backgroundColor: sparrowShot ? '#006400' : '#8B0000',
            color: '#FFD700',
            border: '4px solid #000',
            fontFamily: '"Comic Sans MS", cursive',
            fontSize: '18px',
            fontWeight: 'bold',
            cursor: 'pointer',
            boxShadow: '4px 4px 0 #000',
            zIndex: 200,
            textShadow: '2px 2px 0 #000',
            transition: 'transform 0.2s, box-shadow 0.2s, background-color 0.3s'
          }}
          onMouseOver={(e) => {
            e.currentTarget.style.transform = 'translateX(-50%) scale(1.05)'
            e.currentTarget.style.boxShadow = '6px 6px 0 #000'
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.transform = 'translateX(-50%) scale(1)'
            e.currentTarget.style.boxShadow = '4px 4px 0 #000'
          }}
        >
          {sparrowShot ? 'REVIVE SPARROW PRINCE' : 'KILL THE SOUND'}
        </button>
      )}

      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        backgroundColor: '#000',
        zIndex: 300,
        opacity: scopeTransition ? 1 : 0,
        transition: 'opacity 0.8s ease-in-out',
        pointerEvents: scopeTransition ? 'auto' : 'none',
      }} />

      {showScope && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          zIndex: 150,
          pointerEvents: 'none',
        }}>
          <div style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: 'calc(50vw - 45vh)',
            height: '100vh',
            backgroundColor: '#000',
            zIndex: 151,
          }} />
          <div style={{
            position: 'absolute',
            top: 0,
            right: 0,
            width: 'calc(50vw - 45vh)',
            height: '100vh',
            backgroundColor: '#000',
            zIndex: 151,
          }} />
          <img
            src="/images/scope.png"
            alt="Scope Overlay"
            style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              height: '105vh',
              width: 'auto',
              maxWidth: 'none',
              objectFit: 'contain',
              zIndex: 152,
              pointerEvents: 'none',
              userSelect: 'none',
            }}
          />
          <button
            onClick={() => {
              const gunAudio = new Audio('/audio/gun-shot-sound-effect-224087.mp3')
              gunAudio.volume = 0.4
              gunAudio.play()
              if (birdsAudioRef.current) {
                birdsAudioRef.current.pause()
                birdsAudioRef.current.currentTime = 0
              }
              setTimeout(() => {
                setShowBloodEffect(true)
              }, 200)
              setTimeout(() => {
                setShowBloodEffect(false)
              }, 1300)
              setTimeout(() => {
                setSparrowShot(true)
              }, 500)
              setTimeout(() => {
                setShowScope(false)
              }, 1500)
            }}
            style={{
              position: 'absolute',
              left: '50%',
              top: '85%',
              transform: 'translate(-50%, -50%)',
              padding: '12px 24px',
              backgroundColor: '#8B0000',
              color: '#FFD700',
              border: '4px solid #000',
              fontFamily: '"Comic Sans MS", cursive',
              fontSize: '18px',
              fontWeight: 'bold',
              cursor: 'pointer',
              boxShadow: '4px 4px 0 #000',
              zIndex: 153,
              pointerEvents: 'auto',
              textShadow: '2px 2px 0 #000',
              transition: 'transform 0.2s, box-shadow 0.2s'
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.transform = 'translate(-50%, -50%) scale(1.05)'
              e.currentTarget.style.boxShadow = '6px 6px 0 #000'
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.transform = 'translate(-50%, -50%) scale(1)'
              e.currentTarget.style.boxShadow = '4px 4px 0 #000'
            }}
          >
            Shoot
          </button>
        </div>
      )}

      {showScene && introComplete && <PoiList onPoiSelect={handlePoiClick} selectedPoi={selectedPoi} />}
      
      {showScene && (
        <InfoPanel 
          poi={selectedPoi} 
          onClose={handleCloseInfo} 
          crabPeopleImages={crabPeopleImages}
          onCrabClick={handleCrabClick}
          onPlayAudio={playCharacterAudio}
          onStopAudio={stopCharacterAudio}
          onOpenExternalUrl={handleExternalUrl}
          sparrowShot={sparrowShot}
          onJesusClick={handleJesusClick}
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
            transform: `rotate(${img.rotation}deg)`,
            animation: 'fadeInCrab 0.5s ease-out'
          }}
        />
      ))}
      
      <style>{`
        @keyframes fadeInDark {
          0% {
            opacity: 0;
          }
          100% {
            opacity: 1;
          }
        }
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
