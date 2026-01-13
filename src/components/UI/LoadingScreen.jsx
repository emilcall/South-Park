import { useProgress } from '@react-three/drei'
import { useEffect } from 'react'

const LoadingScreen = ({ onComplete }) => {
  const { progress } = useProgress()

  useEffect(() => {
    if (progress === 100) {
      setTimeout(() => {
        if (onComplete) onComplete()
      }, 500)
    }
  }, [progress, onComplete])

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      backgroundColor: 'black',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000
    }}>
      <img
        src="/images/Vlcsnap-2015-04-17-11h02m01s83.webp"
        alt="South Park"
        style={{
          width: '70%',
          maxWidth: '700px',
          height: 'auto',
          maxHeight: '60vh',
          objectFit: 'contain',
          marginBottom: '40px'
        }}
      />
      <div style={{
        width: '60%',
        maxWidth: '500px',
        height: '40px',
        backgroundColor: 'black',
        border: '4px solid white',
        padding: '4px',
        boxShadow: '0 0 20px rgba(255, 215, 0, 0.5)'
      }}>
        <div style={{
          width: `${progress}%`,
          height: '100%',
          backgroundColor: '#FFD700',
          transition: 'width 0.3s ease',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontFamily: '"Comic Sans MS", cursive',
          fontWeight: 'bold',
          fontSize: '1.2rem',
          color: 'black'
        }}>
          {progress > 10 && `${Math.round(progress)}%`}
        </div>
      </div>
    </div>
  )
}

export default LoadingScreen
