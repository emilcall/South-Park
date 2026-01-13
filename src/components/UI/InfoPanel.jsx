import { useState, useEffect } from 'react'

const characterAudioMap = {
  'Zombies-zombie-kenny.webp': '/audio/oh-my-god,-they-killed-kenny!-made-with-Voicemod.mp3',
  
  'JeromeChef.webp': '/audio/South Park - Chef - Chocolate Salty Balls.mp3',
  
  'Eric-cartman.webp': '/audio/south-park-cartman-poker-face-part-2-made-with-Voicemod.mp3',
  
  'Timmy.webp': '/audio/Voicy_Timmah.mp3',
  
  'KennyMcCormick.webp': '/audio/Voicy_Yep woo hoo.mp3',
  
  'Mr._Mackey.png': '/audio/mkay-made-with-Voicemod.mp3',
  
  'City-wok-guy.webp': '/audio/welcome-city-wok-i-take-a-order-please.mp3',
  
  'Officer-barbrady.webp': '/audio/0002.wav',
  
  'Craig-tucker.webp': '/audio/can\'t-assist-with-problems-made-with-Voicemod.mp3',
  
  'Wendyy.webp': '/audio/help-those-less-fortunate-wendy-testaburger-south-park-made-with-Voicemod.mp3',
  
  'Manbearpig_no_blood.webp': '/audio/manbearpig-bearpig-manbearpig-southpark.mp3',
  
  'MrsBroflovski.webp': '/audio/south-park-kyles-moms-a-bitch-made-with-Voicemod.mp3',
  
  'Terrance.transparent.webp': '/audio/terrance-and-phillip-are-canada-s-largest-export.mp3',
  'Phillip.transparent.webp': '/audio/terrance-and-phillip-are-canada-s-largest-export.mp3',
  
  'NedG_2.webp': '/audio/there-s-not-many-animals-out-today-jimbo.mp3',
  
  'JimboKernBestImage.webp': '/audio/Video Project.mp3',
  
  'Benny.webp': '/audio/Voicy_Aaand it\'s gone.mp3',
  
  'Randy_transparent_cockmagic.webp': '/audio/Voicy_Brutality And Violence.mp3',
  
  'Mr._Herbert_Garrison.webp': '/audio/Voicy_Did You Tell Anyone Else About This_.mp3',
  
  'Kyle-broflovski.webp': '/audio/south-park-kick-the-baby!-made-with-Voicemod.mp3',
  
  'Jimmy-valmer.webp': '/audio/Voicy_Gay Fish.mp3',
  
  'Token_Black2.webp': '/audio/Voicy_Getting Sick Of Your Stereotypes .mp3',
  
  'ButtersStotch.webp': '/audio/Voicy_Hey Fellas!.mp3',
  
  'Murphy-mitch-harris.webp': '/audio/Voicy_In my report pt2.mp3',
  
  'Mr-Slave.transparent.webp': '/audio/Voicy_Jesus Christ .mp3',
  
  'Stan-marsh-0.webp': '/audio/Voicy_How did you get that on your phone.mp3',
  
  'Ike-current.webp': '/audio/Voicy_Pussy ass bitch.mp3',
  
  'Tweek_pic.webp': '/audio/Voicy_Tweek screaming.mp3',
  
  'Liane_Cartman0.webp': '/audio/where-did-you-get-that-where-did-you-get-that-whered-you-get-that-liane-cartman-south-park.mp3',
  
  'Mr._Hankey_transparent.webp': '/audio/Voicy_Howdy ho 1.mp3',
  
  '1200_900.jpeg': '/audio/chinpokomon-made-with-Voicemod.mp3',
  
  'Crabtree.webp': '/audio/good-morning-mrs-crabtree-sit-down-we-re-late.mp3',
  
  'southpark.webp': '/audio/South Park - Original.mp3',
  
  'Creatures-local-creatures-crab-king.webp': '/audio/crab-people.mp3',
  '300px-Crab-people.webp': '/audio/crab-people.mp3',
  
  'Homeless_People.webp': '/audio/california-love-south-park-eric-cartman-made-with-Voicemod.mp3'
}

const InfoPanel = ({ poi, onClose, crabPeopleImages, onCrabClick, onPlayAudio, onStopAudio }) => {
  const [crabClickCount, setCrabClickCount] = useState(0)

  useEffect(() => {
    if (poi) {
      setCrabClickCount(0)
    }
  }, [poi])

  if (!poi) return null

  const getImages = () => {
    if (!poi.image) return []
    if (Array.isArray(poi.image)) return poi.image
    return [poi.image]
  }

  const images = getImages()

  const handleImageClick = (imagePath, index) => {
    const filename = imagePath.split('/').pop()
    const audioSrc = characterAudioMap[filename]
    
    if (audioSrc && onPlayAudio) {
      onPlayAudio(audioSrc)
    }
    
    if (poi.name === "Crab People Lair" || poi.id === "crabpeople" || poi.id === "dmobile") {
      const newCount = crabClickCount + 1
      setCrabClickCount(newCount)
      if (onCrabClick) {
        onCrabClick()
      }
    }
  }

  return (
    <div style={{
      position: 'fixed',
      right: '20px',
      bottom: '20px',
      width: '400px',
      backgroundColor: 'white',
      border: '5px solid black',
      boxShadow: '8px 8px 0 black',
      fontFamily: '"Comic Sans MS", cursive',
      zIndex: 200
    }}>
      <button
        onClick={onClose}
        style={{
          position: 'absolute',
          top: '10px',
          right: '10px',
          width: '35px',
          height: '35px',
          backgroundColor: '#FF0000',
          color: 'white',
          border: '3px solid black',
          fontSize: '1.5rem',
          fontWeight: 'bold',
          cursor: 'pointer',
          boxShadow: '3px 3px 0 black',
          lineHeight: '1',
          padding: 0,
          zIndex: 10
        }}
      >
        ×
      </button>


      <div style={{
        padding: '15px 50px 15px 15px',
        borderBottom: '4px solid black',
        backgroundColor: '#FFD700'
      }}>
        <h2 style={{
          margin: 0,
          fontSize: '1.5rem',
          fontWeight: 'bold',
          color: 'black',
          textShadow: '2px 2px 0 white'
        }}>
          {poi.name}
        </h2>
      </div>

      <div style={{
        padding: '15px'
      }}>
        {images.length > 0 && (
          <div style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: '12px',
            marginBottom: '15px',
            justifyContent: 'center'
          }}>
            {images.map((img, idx) => {
              const filename = img.split('/').pop()
              const hasAudio = !!characterAudioMap[filename]
              const isSPSign = filename === 'southpark.webp'
              
              return (
              <div
                key={idx}
                onClick={() => handleImageClick(img, idx)}
                style={{
                  width: isSPSign ? '280px' : '140px',
                  height: '140px',
                  position: 'relative',
                  border: '4px solid black',
                  boxShadow: '4px 4px 0 black',
                  backgroundColor: '#d0d0d0',
                  cursor: hasAudio ? 'pointer' : 'default',
                  transition: hasAudio ? 'transform 0.2s, box-shadow 0.2s' : 'none',
                  overflow: 'hidden'
                }}
                onMouseOver={(e) => {
                  if (hasAudio) {
                    e.currentTarget.style.transform = 'scale(1.05) rotate(-2deg)'
                    e.currentTarget.style.boxShadow = '6px 6px 0 black'
                  }
                }}
                onMouseOut={(e) => {
                  if (hasAudio) {
                    e.currentTarget.style.transform = 'scale(1) rotate(0deg)'
                    e.currentTarget.style.boxShadow = '4px 4px 0 black'
                  }
                }}
              >
                <img
                  src={img}
                  alt={`${poi.name} ${idx + 1}`}
                  style={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    width: '90%',
                    height: '90%',
                    objectFit: 'contain'
                  }}
                />
              </div>
            )})}
          </div>
        )}

        <p style={{
          fontSize: '1.15rem',
          lineHeight: '1.6',
          margin: 0,
          fontWeight: 'bold',
          color: '#333'
        }}>
          {poi.description}
        </p>

        {crabPeopleImages && crabPeopleImages.length > 0 && poi.name === "Crab People Lair" && (
          <div style={{
            marginTop: '15px',
            display: 'grid',
            gridTemplateColumns: 'repeat(2, 1fr)',
            gap: '8px'
          }}>
            {crabPeopleImages.map((img, idx) => (
              <img
                key={idx}
                src="/images/characters/300px-Crab-people.webp"
                alt={`Crab ${idx + 1}`}
                style={{
                  width: '100%',
                  border: '3px solid black',
                  boxShadow: '3px 3px 0 black'
                }}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default InfoPanel
