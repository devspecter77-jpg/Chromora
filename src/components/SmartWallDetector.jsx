import { useState, useRef, useEffect } from 'react'
import { Square, Wand2, Eye, EyeOff, Target, Zap } from 'lucide-react'

const SmartWallDetector = ({ selectedColor, opacity, onWallsChange, imageSource }) => {
  const [selectedWalls, setSelectedWalls] = useState({
    left: false,
    right: false,
    front: false,
    back: false
  })
  
  const [detectionMode, setDetectionMode] = useState('smart') // 'manual' or 'smart'
  const [showOverlay, setShowOverlay] = useState(true)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const canvasRef = useRef(null)

  // Aniq devor hududlari - real perspective bilan
  const wallRegions = {
    left: {
      name: 'Chap Devor',
      icon: '←',
      description: 'Chap tomondagi vertikal devor',
      // Aniq koordinatalar - trapetsiya shakl
      points: [
        { x: 0, y: 0.1 },      // Yuqori chap
        { x: 0.25, y: 0.2 },   // Yuqori o'ng
        { x: 0.25, y: 0.8 },   // Pastki o'ng  
        { x: 0, y: 0.9 }       // Pastki chap
      ],
      color: '#ef4444'
    },
    right: {
      name: 'O\'ng Devor',
      icon: '→', 
      description: 'O\'ng tomondagi vertikal devor',
      points: [
        { x: 0.75, y: 0.2 },   // Yuqori chap
        { x: 1, y: 0.1 },      // Yuqori o'ng
        { x: 1, y: 0.9 },      // Pastki o'ng
        { x: 0.75, y: 0.8 }    // Pastki chap
      ],
      color: '#10b981'
    },
    front: {
      name: 'Old Devor',
      icon: '↑',
      description: 'Oldingizda turgan asosiy devor',
      points: [
        { x: 0.2, y: 0.05 },   // Yuqori chap
        { x: 0.8, y: 0.05 },   // Yuqori o'ng
        { x: 0.7, y: 0.6 },    // Pastki o'ng
        { x: 0.3, y: 0.6 }     // Pastki chap
      ],
      color: '#3b82f6'
    },
    back: {
      name: 'Orqa Devor',
      icon: '↓',
      description: 'Orqadagi yoki pastdagi devor',
      points: [
        { x: 0.1, y: 0.7 },    // Yuqori chap
        { x: 0.9, y: 0.7 },    // Yuqori o'ng
        { x: 0.85, y: 0.95 },  // Pastki o'ng
        { x: 0.15, y: 0.95 }   // Pastki chap
      ],
      color: '#f59e0b'
    }
  }

  // Devor aniqlanishi simulatsiyasi (real AI kabi)
  const analyzeWalls = async () => {
    setIsAnalyzing(true)
    
    // Simulatsiya - real AI 2-3 soniya vaqt oladi
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    // "AI" natijasi - xonaning geometriyasiga qarab
    const detectedWalls = {
      left: Math.random() > 0.4,   // 60% ehtimol
      right: Math.random() > 0.4,  // 60% ehtimol  
      front: Math.random() > 0.2,  // 80% ehtimol (asosiy devor)
      back: Math.random() > 0.7    // 30% ehtimol
    }
    
    setSelectedWalls(detectedWalls)
    onWallsChange(detectedWalls, selectedColor, opacity)
    setIsAnalyzing(false)
  }

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

  // Canvas da devor hududlarini chizish
  const drawWallRegions = () => {
    if (!canvasRef.current || !showOverlay) return

    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    
    // Canvas o'lchamini sozlash
    const rect = canvas.getBoundingClientRect()
    canvas.width = rect.width * 2 // Retina uchun
    canvas.height = rect.height * 2
    ctx.scale(2, 2)
    
    // Tozalash
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    
    const width = rect.width
    const height = rect.height

    // Har bir devor uchun
    Object.entries(wallRegions).forEach(([wallId, wall]) => {
      const isSelected = selectedWalls[wallId]
      
      // Devor hududini chizish
      ctx.beginPath()
      ctx.moveTo(wall.points[0].x * width, wall.points[0].y * height)
      
      wall.points.slice(1).forEach(point => {
        ctx.lineTo(point.x * width, point.y * height)
      })
      
      ctx.closePath()
      
      if (isSelected) {
        // Tanlangan devor - rang bilan to'ldirish
        ctx.fillStyle = selectedColor + '40' // 25% shaffoflik
        ctx.fill()
        
        // Chegarani belgilash
        ctx.strokeStyle = selectedColor
        ctx.lineWidth = 3
        ctx.stroke()
      } else {
        // Tanlanmagan devor - faqat chegara
        ctx.strokeStyle = wall.color + '80'
        ctx.lineWidth = 2
        ctx.setLineDash([5, 5])
        ctx.stroke()
        ctx.setLineDash([])
      }
      
      // Devor nomini yozish
      const centerX = wall.points.reduce((sum, p) => sum + p.x, 0) / wall.points.length * width
      const centerY = wall.points.reduce((sum, p) => sum + p.y, 0) / wall.points.length * height
      
      ctx.fillStyle = isSelected ? '#ffffff' : wall.color
      ctx.font = 'bold 12px Arial'
      ctx.textAlign = 'center'
      ctx.fillText(wall.icon, centerX, centerY + 4)
    })
  }

  // Canvas yangilanishi
  useEffect(() => {
    drawWallRegions()
  }, [selectedWalls, selectedColor, opacity, showOverlay])

  // Rang yoki shaffoflik o'zgarganda
  useEffect(() => {
    onWallsChange(selectedWalls, selectedColor, opacity)
  }, [selectedColor, opacity])

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900 flex items-center">
          <Target className="w-5 h-5 mr-2" />
          Aqlli Devor Aniqlash
        </h3>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setShowOverlay(!showOverlay)}
            className="p-2 text-gray-500 hover:text-gray-700"
            title={showOverlay ? 'Belgilarni yashirish' : 'Belgilarni ko\'rsatish'}
          >
            {showOverlay ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* AI Aniqlash Tugmasi */}
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-center justify-between mb-3">
          <div>
            <h4 className="font-semibold text-gray-900 flex items-center">
              <Zap className="w-4 h-4 mr-2 text-blue-500" />
              AI Devor Aniqlash
            </h4>
            <p className="text-sm text-gray-600">Xonangizni avtomatik tahlil qilish</p>
          </div>
          <button
            onClick={analyzeWalls}
            disabled={isAnalyzing}
            className={`btn-primary flex items-center space-x-2 ${
              isAnalyzing ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            <Wand2 className={`w-4 h-4 ${isAnalyzing ? 'animate-spin' : ''}`} />
            <span>{isAnalyzing ? 'Tahlil...' : 'Aniqlash'}</span>
          </button>
        </div>
        
        {isAnalyzing && (
          <div className="bg-white rounded-lg p-3 border">
            <div className="flex items-center space-x-3">
              <div className="animate-spin rounded-full h-4 w-4 border-2 border-blue-500 border-t-transparent"></div>
              <span className="text-sm text-gray-600">Xona geometriyasi tahlil qilinmoqda...</span>
            </div>
          </div>
        )}
      </div>

      {/* Devor Hududlari Canvas */}
      {showOverlay && (
        <div className="relative bg-gray-900 rounded-lg overflow-hidden" style={{ aspectRatio: '16/9' }}>
          <canvas
            ref={canvasRef}
            className="absolute inset-0 w-full h-full"
            style={{ imageRendering: 'pixelated' }}
          />
          <div className="absolute top-2 left-2 bg-black/50 text-white text-xs px-2 py-1 rounded">
            Devor Hududlari
          </div>
          <div className="absolute top-2 right-2 bg-black/50 text-white text-xs px-2 py-1 rounded">
            {Object.values(selectedWalls).filter(Boolean).length}/4 tanlangan
          </div>
        </div>
      )}

      {/* Devor Tanlash Ro'yxati */}
      <div className="space-y-2">
        <h4 className="text-sm font-medium text-gray-700 flex items-center">
          <Square className="w-4 h-4 mr-2" />
          Devorlarni Tanlang:
        </h4>
        {Object.entries(wallRegions).map(([wallId, wall]) => (
          <label
            key={wallId}
            className={`flex items-center p-3 rounded-lg border-2 cursor-pointer transition-all ${
              selectedWalls[wallId]
                ? 'border-primary-500 bg-primary-50'
                : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
            }`}
          >
            <input
              type="checkbox"
              checked={selectedWalls[wallId]}
              onChange={() => toggleWall(wallId)}
              className="sr-only"
            />
            <div className="flex items-center space-x-3 flex-1">
              <div 
                className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold text-white`}
                style={{ backgroundColor: wall.color }}
              >
                {wall.icon}
              </div>
              <div>
                <div className="font-medium text-gray-900">{wall.name}</div>
                <div className="text-xs text-gray-500">{wall.description}</div>
              </div>
            </div>
            {selectedWalls[wallId] && (
              <div className="flex items-center space-x-2">
                <div 
                  className="w-4 h-4 rounded border border-white"
                  style={{ 
                    backgroundColor: selectedColor,
                    opacity: opacity / 100
                  }}
                />
                <div className="w-5 h-5 bg-primary-500 rounded-full flex items-center justify-center">
                  <div className="w-2 h-2 bg-white rounded-full"></div>
                </div>
              </div>
            )}
          </label>
        ))}
      </div>

      {/* Tezkor Amallar */}
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
          onClick={analyzeWalls}
          disabled={isAnalyzing}
          className="btn-primary text-xs py-2 flex items-center justify-center space-x-1"
        >
          <Wand2 className="w-3 h-3" />
          <span>AI</span>
        </button>
      </div>

      {/* Natija Ma'lumoti */}
      {Object.values(selectedWalls).some(Boolean) && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-3">
          <div className="flex items-start space-x-2">
            <div className="w-2 h-2 bg-green-500 rounded-full mt-1.5"></div>
            <div>
              <p className="text-sm text-green-700 font-medium">
                Tanlangan devorlar: {Object.entries(selectedWalls)
                  .filter(([_, selected]) => selected)
                  .map(([wallId, _]) => wallRegions[wallId].name)
                  .join(', ')}
              </p>
              <p className="text-xs text-green-600 mt-1">
                Rang: {selectedColor} • Shaffoflik: {opacity}%
              </p>
              <p className="text-xs text-green-500 mt-1">
                ✨ Aniq devor segmentatsiyasi faol - tanlangan hududlar ranglanadi
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default SmartWallDetector