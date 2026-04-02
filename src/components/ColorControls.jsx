import { Palette } from 'lucide-react'

const ColorControls = ({ 
  selectedColor, 
  setSelectedColor, 
  opacity, 
  setOpacity, 
  brushMode 
}) => {
  const presetColors = [
    '#3b82f6', // Blue
    '#ef4444', // Red
    '#10b981', // Green
    '#f59e0b', // Yellow
    '#8b5cf6', // Purple
    '#f97316', // Orange
    '#06b6d4', // Cyan
    '#84cc16', // Lime
    '#ec4899', // Pink
    '#6b7280', // Gray
    '#1f2937', // Dark Gray
    '#ffffff'  // White
  ]

  return (
    <div className="space-y-3 sm:space-y-4">
      <h3 className="text-base sm:text-lg font-semibold text-gray-900 flex items-center">
        <Palette className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
        Rang va Shaffoflik
      </h3>
      
      {/* Color Picker */}
      <div className="space-y-2 sm:space-y-3">
        <label className="block text-xs sm:text-sm font-medium text-gray-700">
          Tanlangan Rang
        </label>
        <div className="flex items-center space-x-2 sm:space-x-3">
          <input
            type="color"
            value={selectedColor}
            onChange={(e) => setSelectedColor(e.target.value)}
            className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg border-2 border-gray-200 cursor-pointer"
          />
          <input
            type="text"
            value={selectedColor}
            onChange={(e) => setSelectedColor(e.target.value)}
            className="flex-1 px-2 sm:px-3 py-1.5 sm:py-2 border border-gray-300 rounded-lg text-xs sm:text-sm font-mono"
            placeholder="#3b82f6"
          />
        </div>
      </div>

      {/* Preset Colors */}
      <div className="space-y-2 sm:space-y-3">
        <label className="block text-xs sm:text-sm font-medium text-gray-700">
          Tezkor Ranglar
        </label>
        <div className="grid grid-cols-6 gap-1.5 sm:gap-2">
          {presetColors.map((color) => (
            <button
              key={color}
              onClick={() => setSelectedColor(color)}
              className={`w-6 h-6 sm:w-8 sm:h-8 rounded-lg border-2 transition-all ${
                selectedColor === color
                  ? 'border-gray-900 scale-110'
                  : 'border-gray-200 hover:border-gray-400'
              }`}
              style={{ backgroundColor: color }}
              title={color}
            />
          ))}
        </div>
      </div>

      {/* Opacity Slider */}
      <div className="space-y-2 sm:space-y-3">
        <div className="flex justify-between items-center">
          <label className="block text-xs sm:text-sm font-medium text-gray-700">
            Cho'tka Shaffofligi
          </label>
          <span className="text-xs sm:text-sm text-gray-500">{opacity}%</span>
        </div>
        <div className="relative">
          <input
            type="range"
            min="1"
            max="100"
            value={opacity}
            onChange={(e) => setOpacity(parseInt(e.target.value))}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
          />
          <div 
            className="absolute top-0 left-0 h-2 bg-gradient-to-r from-transparent to-current rounded-lg pointer-events-none"
            style={{ 
              width: `${opacity}%`,
              color: selectedColor
            }}
          />
        </div>
      </div>

      {/* Color Preview */}
      <div className="space-y-2 sm:space-y-3">
        <label className="block text-xs sm:text-sm font-medium text-gray-700">
          Ko'rinish
        </label>
        <div className="relative h-12 sm:h-16 bg-gray-100 rounded-lg overflow-hidden">
          <div className="absolute inset-0 bg-white"></div>
          <div 
            className="absolute inset-0"
            style={{ 
              backgroundColor: selectedColor,
              opacity: opacity / 100
            }}
          />
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-xs font-medium text-gray-600 bg-white/80 px-2 py-1 rounded">
              {opacity}% {selectedColor}
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ColorControls