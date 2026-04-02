import { useState } from 'react'
import { Square, Check } from 'lucide-react'
import React from 'react'

const WallSelector = ({ selectedColor, opacity, onWallsChange }) => {
  const [selectedWalls, setSelectedWalls] = useState({
    left: false,
    right: false,
    front: false,
    back: false
  })

  const walls = [
    { id: 'left', name: 'Chap Devor', icon: '←', position: 'left-0 top-1/2 -translate-y-1/2' },
    { id: 'right', name: 'O\'ng Devor', icon: '→', position: 'right-0 top-1/2 -translate-y-1/2' },
    { id: 'front', name: 'Old Devor', icon: '↑', position: 'top-0 left-1/2 -translate-x-1/2' },
    { id: 'back', name: 'Orqa Devor', icon: '↓', position: 'bottom-0 left-1/2 -translate-x-1/2' }
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

  // Update walls when color or opacity changes
  React.useEffect(() => {
    onWallsChange(selectedWalls, selectedColor, opacity)
  }, [selectedColor, opacity])

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-gray-900 flex items-center">
        <Square className="w-5 h-5 mr-2" />
        Devor Tanlash
      </h3>

      {/* Room Preview */}
      <div className="relative bg-gray-100 rounded-lg p-8 h-48 border-2 border-dashed border-gray-300">
        <div className="absolute inset-4 bg-white rounded border-2 border-gray-400">
          {/* Room representation */}
          <div className="relative w-full h-full">
            {walls.map((wall) => (
              <button
                key={wall.id}
                onClick={() => toggleWall(wall.id)}
                className={`absolute w-8 h-8 rounded-full border-2 transition-all ${wall.position} ${
                  selectedWalls[wall.id]
                    ? 'bg-primary-500 border-primary-600 text-white shadow-lg'
                    : 'bg-white border-gray-400 text-gray-600 hover:border-primary-400'
                }`}
                title={wall.name}
              >
                {selectedWalls[wall.id] ? (
                  <Check className="w-4 h-4 mx-auto" />
                ) : (
                  <span className="text-sm font-bold">{wall.icon}</span>
                )}
              </button>
            ))}
            
            {/* Room center */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-xs text-gray-500">
              Xona
            </div>
          </div>
        </div>
        
        {/* Color preview for selected walls */}
        {Object.values(selectedWalls).some(Boolean) && (
          <div className="absolute top-2 right-2 flex items-center space-x-2">
            <div 
              className="w-6 h-6 rounded border-2 border-white shadow-sm"
              style={{ 
                backgroundColor: selectedColor,
                opacity: opacity / 100
              }}
            />
            <span className="text-xs text-gray-600">{opacity}%</span>
          </div>
        )}
      </div>

      {/* Wall Selection Buttons */}
      <div className="grid grid-cols-2 gap-2">
        {walls.map((wall) => (
          <button
            key={wall.id}
            onClick={() => toggleWall(wall.id)}
            className={`p-3 rounded-lg border-2 transition-all text-left ${
              selectedWalls[wall.id]
                ? 'border-primary-500 bg-primary-50 text-primary-700'
                : 'border-gray-200 hover:border-gray-300'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">{wall.name}</span>
              {selectedWalls[wall.id] && (
                <Check className="w-4 h-4 text-primary-600" />
              )}
            </div>
          </button>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 gap-2">
        <button
          onClick={selectAllWalls}
          className="btn-secondary text-sm py-2"
        >
          Barchasini Tanlash
        </button>
        <button
          onClick={clearAllWalls}
          className="btn-secondary text-sm py-2"
        >
          Tozalash
        </button>
      </div>

      {/* Selected Walls Info */}
      {Object.values(selectedWalls).some(Boolean) && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
          <p className="text-sm text-blue-700">
            <strong>Tanlangan devorlar:</strong>{' '}
            {walls
              .filter(wall => selectedWalls[wall.id])
              .map(wall => wall.name)
              .join(', ')}
          </p>
          <p className="text-xs text-blue-600 mt-1">
            Rang: {selectedColor} • Shaffoflik: {opacity}%
          </p>
        </div>
      )}
    </div>
  )
}

export default WallSelector