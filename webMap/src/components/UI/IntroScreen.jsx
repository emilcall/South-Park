const IntroScreen = ({ onEnter }) => {
  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      background: 'linear-gradient(to bottom, #87CEEB 0%, #98D8E8 50%, #90EE90 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'flex-start',
      paddingLeft: '5%',
      zIndex: 1000
    }}>
      <img 
        src="/images/south-park.webp"
        alt="South Park Banner"
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          zIndex: 0
        }}
      />
      <div style={{
        backgroundColor: 'rgba(0, 0, 0, 0.85)',
        padding: '60px 80px',
        border: '8px solid black',
        boxShadow: '12px 12px 0 rgba(0, 0, 0, 0.5)',
        zIndex: 1
      }}>
        <div style={{
          textAlign: 'center',
          fontFamily: '"Comic Sans MS", cursive'
        }}>
          <h2 style={{
            fontSize: '4rem',
            color: 'white',
            margin: '0 0 10px 0',
            fontWeight: 'bold',
            textShadow: '4px 4px 0 black'
          }}>Welcome to</h2>
          <h1 style={{
            fontSize: '5.5rem',
            color: '#FFD700',
            margin: '0 0 40px 0',
            fontWeight: 'bold',
            textShadow: '5px 5px 0 black',
            WebkitTextStroke: '3px black'
          }}>South Park</h1>
          <button
            onClick={onEnter}
            style={{
              fontFamily: '"Comic Sans MS", cursive',
              fontSize: '2rem',
              fontWeight: 'bold',
              padding: '20px 60px',
              backgroundColor: '#FFD700',
              color: 'black',
              border: '5px solid black',
              cursor: 'pointer',
              boxShadow: '6px 6px 0 black',
              transition: 'all 0.1s'
            }}
            onMouseOver={(e) => {
              e.target.style.transform = 'translate(2px, 2px)'
              e.target.style.boxShadow = '4px 4px 0 black'
            }}
            onMouseOut={(e) => {
              e.target.style.transform = 'translate(0, 0)'
              e.target.style.boxShadow = '6px 6px 0 black'
            }}
          >
            ENTER
          </button>
        </div>
      </div>
    </div>
  )
}

export default IntroScreen
