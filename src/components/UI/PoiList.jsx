import { useState } from 'react'
import '../../styles/PoiList.css'
import { poiData } from '../../data/poiData'

const PoiList = ({ onPoiSelect, selectedPoi }) => {
  const [isOpen, setIsOpen] = useState(true)

  const houseCategories = ['house']
  const housePois = poiData.filter(poi => 
    houseCategories.includes(poi.category) && 
    poi.interactive !== false
  )

  const buildingCategories = ['main', 'business', 'government', 'other', 'nature']
  const excludeFromBuildings = ['busstop', 'playground', 'starkspond']
  const buildingPois = poiData.filter(poi => 
    buildingCategories.includes(poi.category) && 
    !excludeFromBuildings.includes(poi.id) &&
    poi.interactive !== false
  )

  const landmarkIds = ['busstop', 'spsign', 'playground', 'starkspond']
  const landmarkPois = poiData.filter(poi => landmarkIds.includes(poi.id))

  const categories = {
    'Houses': housePois,
    'Buildings': buildingPois,
    'Landmarks': landmarkPois
  }

  const handlePoiClick = (poi) => {
    onPoiSelect(poi)
  }

  return (
    <>
      <div className={`poi-sidebar ${isOpen ? 'open' : 'closed'}`}>
        {isOpen && (
          <div className="poi-content">
            <h2 className="poi-title">LOCATIONS</h2>
            
            {Object.entries(categories).map(([categoryName, pois]) => (
              <div key={categoryName} className="category-section">
                <h3 className="category-header">{categoryName.toUpperCase()}</h3>
                {pois.map(poi => (
                  <div
                    key={poi.id}
                    className={`poi-item ${selectedPoi?.id === poi.id ? 'selected' : ''}`}
                    onClick={() => handlePoiClick(poi)}
                  >
                    {poi.name}
                  </div>
                ))}
              </div>
            ))}
          </div>
        )}
      </div>
      <button 
        className={`toggle-button ${isOpen ? 'open' : 'closed'}`}
        onClick={() => {
          setIsOpen(!isOpen)
        }}
      >
        {isOpen ? '◀' : '▶'}
      </button>
    </>
  )
}

export default PoiList
