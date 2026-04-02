import { Brush, Eraser } from 'lucide-react'

const BrushControls = ({ 
  brushSize, 
  setBrushSize, 
  isEraser, 
  setIsEraser 
}) => {
  const presetSizes = [5, 10, 20, 30, 50, 80]

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-gray-900 flex items-center">
        <Brush className="w-5 h-5 mr-2" />
        Cho'tka Vositalari
      </h3>
      
      {/* Brush/Eraser Toggle */}
      <div className="space-y-3">
        <label className="block text-sm font-medium text-gray-700">
          Vosita Rejimi
        </label>
        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={() => setIsEraser(false)}
            className={`p-3 rounded-lg border-2 transition-all ${
              !isEraser
                ? 'border-primary-500 bg-primary-50 text-primary-700'
                : 'border-gray-200 hover:border-gray-300'
            }`}
          >
            <Brush className="w-5 h-5 mx-auto mb-1" />
            <div className="text-sm font-medium">Cho'tka</div>
          </button>
          <button
            onClick={() => setIsEraser(true)}
            className={`p-3 rounded-lg border-2 transition-all ${
              isEraser
                ? 'border-primary-500 bg-primary-50 text-primary-700'
                : 'border-gray-200 hover:border-gray-300'
            }`}
          >
            <Eraser className="w-5 h-5 mx-auto mb-1" />
            <div className="text-sm font-medium">O'chirg'ich</div>
          </button>
        </div>
      </div>

      {/* Brush Size Slider */}
      <div className="space-y-3">
        <div className="flex justify-between items-center">
          <label className="block text-sm font-medium text-gray-700">
            {isEraser ? 'O\'chirg\'ich Hajmi' : 'Cho\'tka Hajmi'}
          </label>
          <span className="text-sm text-gray-500">{brushSize}px</span>
        </div>
        <input
          type="range"
          min="1"
          max="100"
          value={brushSize}
          onChange={(e) => setBrushSize(parseInt(e.target.value))}
          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
        />
      </div>

      {/* Preset Sizes */}
      <div className="space-y-3">
        <label className="block text-sm font-medium text-gray-700">
          Tezkor Hajmlar
        </label>
        <div className="grid grid-cols-3 gap-2">
          {presetSizes.map((size) => (
            <button
              key={size}
              onClick={() => setBrushSize(size)}
              className={`p-2 text-sm rounded-lg border transition-all ${
                brushSize === size
                  ? 'border-primary-500 bg-primary-50 text-primary-700'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              {size}px
            </button>
          ))}
        </div>
      </div>

      {/* Brush Preview */}
      <div className="space-y-3">
        <label className="block text-sm font-medium text-gray-700">
          Hajm Ko'rinishi
        </label>
        <div className="h-20 bg-gray-100 rounded-lg flex items-center justify-center">
          <div 
            className={`rounded-full border-2 ${
              isEraser 
                ? 'border-red-400 border-dashed bg-red-50' 
                : 'border-gray-400 bg-gray-600'
            }`}
            style={{ 
              width: `${Math.min(brushSize, 60)}px`, 
              height: `${Math.min(brushSize, 60)}px` 
            }}
          />
        </div>
        <p className="text-xs text-gray-500 text-center">
          {isEraser ? 'O\'chirg\'ich ko\'rinishi' : 'Cho\'tka ko\'rinishi'} (maksimal 60px ko'rsatiladi)
        </p>
      </div>
    </div>
  )
}

export default BrushControls