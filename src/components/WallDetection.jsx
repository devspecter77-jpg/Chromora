import { useRef, useEffect, useState } from 'react'
import { Square, Wand2, Eye, EyeOff } from 'lucide-react'

const WallDetection = ({ selectedColor, opacity, onWallsChange }) => {
  const [selectedWalls, setSelectedWalls] = useState({
    left: false,
    right: false,
    front: false,
    back: false
  })
  
  const [detectionMode, setDetectionMode] = useState('manual') // 'manual' or 'smart'
  const [showOverlay, setShowOverlay] = useState(true)

  const walls = [
    { 
      id: 'left', 
      name: 'Chap Devor', 
      icon: '←', 
      description: 'Rasmning chap tomonidagi devor',
      area: { x: 0, y: 0.2, width: 0.35, height: 0.6 }
    },
    { 
      id: 'right', 
      name: 'O\'ng Devor', 
      icon: '→', 
      description: 'Rasmning o\'ng tomonidagi devor',
      area: { x: 0.65, y: 0.2, width: 0.35, height: 0.6 }
    },
    { 
      id: 'front', 
      name: 'Old Devor', 
      icon: '↑', 
      description: 'Rasmning markazidagi asosiy devor',
      area: { x: 0.2, y: 0.1, width: 0.6, height: 0.5 }
    },
    { 
      id: 'back', 
      name: 'Orqa Devor', 
      icon: '↓', 
      description: 'Rasmning pastki qismidagi orqa devor',
      area: { x: 0.15, y: 0.65, width: 0.7, height: 0.25 }
    }
  ]

  const toggleWall = (wallId) => {
    const newSelectedWalls = {
      ...selectedWalls,
      [wallId]: !selectedWalls[wallId]
    }
    setSelectedWalls(newSelectedWalls)
    onWallsChange(newSelectedWalls, selectedColor, opacity)
  }

  const selectAllWalls = () => {
    const allSelected = {
      left: true,
      right: true,
      front: true,
      back: true
    }
    setSelectedWalls(allSelected)
    onWallsChange(allSelected, selectedColor, opacity)
  }

  const clearAllWalls = () => {
    const noneSelected = {
      left: false,
      right: false,
      front: false,
      back: false
    }
    setSelectedWalls(noneSelected)
    onWallsChange(noneSelected, selectedColor, opacity)
  }

  // Smart detection (simplified AI-like logic)
  const smartDetection = () => {
    // Simulate smart wall detection
    const smartWalls = {
      left: Math.random() > 0.3,
      right: Math.random() > 0.3,
      front: Math.random() > 0.2, // More likely to detect front wall
      back: Math.random() > 0.6
    }
    setSelectedWalls(smartWalls)
    onWallsChange(smartWalls, selectedColor, opacity)
  }

  // Update walls when color or opacity changes
  useEffect(() => {
    onWallsChange(selectedWalls, selectedColor, opacity)
  }, [selectedColor, opacity])

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900 flex items-center">
          <Square className="w-5 h-5 mr-2" />
          Devor Aniqlash
        </h3>
        <button
          onClick={() => setShowOverlay(!showOverlay)}
          className="p-2 text-gray-500 hover:text-gray-700"
          title={showOverlay ? 'Ko\'rsatkichni yashirish' : 'Ko\'rsatkichni ko\'rsatish'}
        >
          {showOverlay ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
        </button>
      </div>

      {/* Detection Mode Toggle */}
      <div className="grid grid-cols-2 gap-2">
        <button
          onClick={() => setDetectionMode('manual')}
          className={`p-3 rounded-lg border-2 transition-all ${
            detectionMode === 'manual'
              ? 'border-primary-500 bg-primary-50 text-primary-700'
              : 'border-gray-200 hover:border-gray-300'
          }`}
        >
          <Square className="w-5 h-5 mx-auto mb-1" />
          <div className="text-sm font-medium">Qo'lda</div>
        </button>
        <button
          onClick={() => {
            setDetectionMode('smart')
            smartDetection()
          }}
          className={`p-3 rounded-lg border-2 transition-all ${
            detectionMode === 'smart'
              ? 'border-primary-500 bg-primary-50 text-primary-700'
              : 'border-gray-200 hover:border-gray-300'
          }`}
        >
          <Wand2 className="w-5 h-5 mx-auto mb-1" />
          <div className="text-sm font-medium">Aqlli</div>
        </button>
      </div>

      {/* Room Preview with Wall Areas */}
      {showOverlay && (
        <div className="relative bg-gradient-to-b from-blue-50 to-gray-100 rounded-lg p-4 h-64 border-2 border-dashed border-gray-300">
          <div className="relative w-full h-full bg-white rounded border-2 border-gray-400 overflow-hidden">
            {/* Wall area overlays */}
            {walls.map((wall) => (
              <div
                key={wall.id}
                className={`absolute border-2 border-dashed transition-all cursor-pointer ${
                  selectedWalls[wall.id]
                    ? 'bg-primary-200 border-primary-500'
                    : 'bg-gray-100 border-gray-300 hover:bg-gray-200'
                }`}
                style={{
                  left: `${wall.area.x * 100}%`,
                  top: `${wall.area.y * 100}%`,
                  width: `${wall.area.width * 100}%`,
                  height: `${wall.area.height * 100}%`
                }}
                onClick={() => toggleWall(wall.id)}
                title={wall.description}
              >
                <div className="flex items-center justify-center h-full">
                  <div className="text-center">
                    <div className="text-lg font-bold text-gray-600">{wall.icon}</div>
                    <div className="text-xs text-gray-500">{wall.name}</div>
                  </div>
                </div>
              </div>
            ))}
            
            {/* Room center indicator */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-xs text-gray-400 bg-white px-2 py-1 rounded shadow">
              Xona Markazi
            </div>
          </div>
          
          {/* Color preview */}
          {Object.values(selectedWalls).some(Boolean) && (
            <div className="absolute top-2 right-2 flex items-center space-x-2 bg-white rounded-lg px-2 py-1 shadow">
              <div 
                className="w-4 h-4 rounded border border-gray-300"
                style={{ 
                  backgroundColor: selectedColor,
                  opacity: opacity / 100
                }}
              />
              <span className="text-xs text-gray-600">{opacity}%</span>
            </div>
          )}
        </div>
      )}

      {/* Wall Selection List */}
      <div className="space-y-2">
        <h4 className="text-sm font-medium text-gray-700">Devorlarni Tanlang:</h4>
        {walls.map((wall) => (
          <label
            key={wall.id}
            className={`flex items-center p-3 rounded-lg border-2 cursor-pointer transition-all ${
              selectedWalls[wall.id]
                ? 'border-primary-500 bg-primary-50'
                : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
            }`}
          >
            <input
              type="checkbox"
              checked={selectedWalls[wall.id]}
              onChange={() => toggleWall(wall.id)}
              className="sr-only"
            />
            <div className="flex items-center space-x-3 flex-1">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                selectedWalls[wall.id]
                  ? 'bg-primary-500 text-white'
                  : 'bg-gray-200 text-gray-600'
              }`}>
                {wall.icon}
              </div>
              <div>
                <div className="font-medium text-gray-900">{wall.name}</div>
                <div className="text-xs text-gray-500">{wall.description}</div>
              </div>
            </div>
            {selectedWalls[wall.id] && (
              <div className="w-5 h-5 bg-primary-500 rounded-full flex items-center justify-center">
                <div className="w-2 h-2 bg-white rounded-full"></div>
              </div>
            )}
          </label>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-3 gap-2">
        <button
          onClick={selectAllWalls}
          className="btn-secondary text-xs py-2"
        >
          Barchasi
        </button>
        <button
          onClick={clearAllWalls}
          className="btn-secondary text-xs py-2"
        >
          Tozalash
        </button>
        <button
          onClick={smartDetection}
          className="btn-primary text-xs py-2 flex items-center justify-center space-x-1"
        >
          <Wand2 className="w-3 h-3" />
          <span>Aqlli</span>
        </button>
      </div>

      {/* Detection Info */}
      {Object.values(selectedWalls).some(Boolean) && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
          <div className="flex items-start space-x-2">
            <div className="w-2 h-2 bg-blue-500 rounded-full mt-1.5"></div>
            <div>
              <p className="text-sm text-blue-700 font-medium">
                Tanlangan: {walls.filter(wall => selectedWalls[wall.id]).map(wall => wall.name).join(', ')}
              </p>
              <p className="text-xs text-blue-600 mt-1">
                Rang: {selectedColor} • Shaffoflik: {opacity}%
              </p>
              <p className="text-xs text-blue-500 mt-1">
                💡 Agar devor aniqlanmasa, qo'lda tanlang yoki "Aqlli" tugmasini bosing
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default WallDetection