import { useRef, useEffect, useState, forwardRef, useImperativeHandle } from 'react'
import { Brush, Eraser, RotateCcw, Download, Target, Hand, Square } from 'lucide-react'

const InteractiveWallPainter = forwardRef(({ 
  image, 
  selectedColor, 
  opacity,
  imageSource = 'image' // 'image' or 'camera'
}, ref) => {
  const canvasRef = useRef(null)
  const overlayCanvasRef = useRef(null)
  const [isDrawing, setIsDrawing] = useState(false)
  const [tool, setTool] = useState('brush') // 'brush' or 'eraser'
  const [brushSize, setBrushSize] = useState(30)
  const [history, setHistory] = useState([])
  const [historyIndex, setHistoryIndex] = useState(-1)

  // Initialize canvas
  useEffect(() => {
    if (!image || !canvasRef.current) return

    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    
    // Calculate canvas size maintaining aspect ratio - mobile optimized
    const maxWidth = Math.min(600, window.innerWidth - 20)
    const maxHeight = Math.min(400, window.innerHeight - 300)
    
    const aspectRatio = image.width / image.height
    let canvasWidth, canvasHeight
    
    if (aspectRatio > maxWidth / maxHeight) {
      canvasWidth = maxWidth
      canvasHeight = maxWidth / aspectRatio
    } else {
      canvasHeight = maxHeight
      canvasWidth = maxHeight * aspectRatio
    }
    
    canvas.width = canvasWidth
    canvas.height = canvasHeight
    
    // Set up overlay canvas
    if (overlayCanvasRef.current) {
      overlayCanvasRef.current.width = canvasWidth
      overlayCanvasRef.current.height = canvasHeight
    }
    
    // Draw the image
    ctx.drawImage(image, 0, 0, canvasWidth, canvasHeight)
    
    // Initialize history
    saveToHistory()
  }, [image])

  // Save state to history
  const saveToHistory = () => {
    if (!overlayCanvasRef.current) return
    
    const canvas = overlayCanvasRef.current
    const imageData = canvas.toDataURL()
    
    const newHistory = history.slice(0, historyIndex + 1)
    newHistory.push(imageData)
    
    setHistory(newHistory)
    setHistoryIndex(newHistory.length - 1)
  }

  // Composite layers
  const compositeCanvas = () => {
    if (!canvasRef.current || !overlayCanvasRef.current) return

    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    
    // Clear and redraw base image
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    ctx.drawImage(image, 0, 0, canvas.width, canvas.height)
    
    // Add overlay
    ctx.drawImage(overlayCanvasRef.current, 0, 0)
  }

  // Mouse/touch event handlers
  const getEventPos = (event) => {
    const canvas = overlayCanvasRef.current
    const rect = canvas.getBoundingClientRect()
    const scaleX = canvas.width / rect.width
    const scaleY = canvas.height / rect.height
    
    let clientX, clientY
    
    if (event.touches) {
      clientX = event.touches[0].clientX
      clientY = event.touches[0].clientY
    } else {
      clientX = event.clientX
      clientY = event.clientY
    }
    
    return {
      x: (clientX - rect.left) * scaleX,
      y: (clientY - rect.top) * scaleY
    }
  }

  const startDrawing = (event) => {
    if (!overlayCanvasRef.current) return
    
    event.preventDefault()
    setIsDrawing(true)
    
    const pos = getEventPos(event)
    const ctx = overlayCanvasRef.current.getContext('2d')
    
    ctx.beginPath()
    ctx.moveTo(pos.x, pos.y)
  }

  const draw = (event) => {
    if (!isDrawing || !overlayCanvasRef.current) return
    
    event.preventDefault()
    const pos = getEventPos(event)
    const ctx = overlayCanvasRef.current.getContext('2d')
    
    if (tool === 'eraser') {
      ctx.globalCompositeOperation = 'destination-out'
      ctx.lineWidth = brushSize
    } else {
      ctx.globalCompositeOperation = 'source-over'
      ctx.strokeStyle = selectedColor
      ctx.globalAlpha = opacity / 100
      ctx.lineWidth = brushSize
    }
    
    ctx.lineCap = 'round'
    ctx.lineJoin = 'round'
    
    ctx.lineTo(pos.x, pos.y)
    ctx.stroke()
    
    // Composite the result
    compositeCanvas()
  }

  const stopDrawing = () => {
    if (!isDrawing) return
    
    setIsDrawing(false)
    
    if (overlayCanvasRef.current) {
      const ctx = overlayCanvasRef.current.getContext('2d')
      ctx.globalAlpha = 1
      ctx.globalCompositeOperation = 'source-over'
      
      // Save to history after drawing
      saveToHistory()
    }
  }

  // Quick wall selection helpers
  const paintWallArea = (area) => {
    if (!overlayCanvasRef.current) return

    const canvas = overlayCanvasRef.current
    const ctx = canvas.getContext('2d')
    
    ctx.fillStyle = selectedColor
    ctx.globalAlpha = opacity / 100
    
    const width = canvas.width
    const height = canvas.height
    
    // Paint the specified area
    area.forEach(point => {
      ctx.fillRect(point.x * width, point.y * height, point.w * width, point.h * height)
    })
    
    ctx.globalAlpha = 1
    compositeCanvas()
    saveToHistory()
  }

  // Predefined wall areas for quick selection
  const quickWallAreas = {
    leftWall: [
      { x: 0, y: 0.1, w: 0.3, h: 0.8 }
    ],
    rightWall: [
      { x: 0.7, y: 0.1, w: 0.3, h: 0.8 }
    ],
    backWall: [
      { x: 0.2, y: 0.05, w: 0.6, h: 0.5 }
    ],
    floorWall: [
      { x: 0.1, y: 0.7, w: 0.8, h: 0.25 }
    ]
  }

  // Expose methods to parent
  useImperativeHandle(ref, () => ({
    reset: () => {
      if (overlayCanvasRef.current) {
        const ctx = overlayCanvasRef.current.getContext('2d')
        ctx.clearRect(0, 0, overlayCanvasRef.current.width, overlayCanvasRef.current.height)
        compositeCanvas()
        saveToHistory()
      }
    },
    
    download: () => {
      if (!canvasRef.current) return
      
      const link = document.createElement('a')
      link.download = `chromora-wall-paint-${Date.now()}.png`
      link.href = canvasRef.current.toDataURL('image/png', 1.0)
      link.click()
    },
    
    undo: () => {
      if (historyIndex > 0 && overlayCanvasRef.current) {
        const newIndex = historyIndex - 1
        const ctx = overlayCanvasRef.current.getContext('2d')
        const img = new Image()
        
        img.onload = () => {
          ctx.clearRect(0, 0, overlayCanvasRef.current.width, overlayCanvasRef.current.height)
          ctx.drawImage(img, 0, 0)
          compositeCanvas()
        }
        
        img.src = history[newIndex]
        setHistoryIndex(newIndex)
      }
    },
    
    redo: () => {
      if (historyIndex < history.length - 1 && overlayCanvasRef.current) {
        const newIndex = historyIndex + 1
        const ctx = overlayCanvasRef.current.getContext('2d')
        const img = new Image()
        
        img.onload = () => {
          ctx.clearRect(0, 0, overlayCanvasRef.current.width, overlayCanvasRef.current.height)
          ctx.drawImage(img, 0, 0)
          compositeCanvas()
        }
        
        img.src = history[newIndex]
        setHistoryIndex(newIndex)
      }
    }
  }))

  return (
    <div className="space-y-3 sm:space-y-4">
      {/* Canvas */}
      <div className="relative border border-gray-300 rounded-lg overflow-hidden shadow-lg bg-white">
        {/* Base canvas with image */}
        <canvas
          ref={canvasRef}
          className="block w-full h-auto max-w-full"
          style={{ touchAction: 'none' }}
        />
        
        {/* Overlay canvas for painting */}
        <canvas
          ref={overlayCanvasRef}
          className="absolute top-0 left-0 w-full h-auto max-w-full"
          style={{ 
            cursor: tool === 'brush' ? 'crosshair' : 'grab',
            touchAction: 'none'
          }}
          onMouseDown={startDrawing}
          onMouseMove={draw}
          onMouseUp={stopDrawing}
          onMouseLeave={stopDrawing}
          onTouchStart={startDrawing}
          onTouchMove={draw}
          onTouchEnd={stopDrawing}
        />
      </div>

      {/* Tools */}
      <div className="bg-white rounded-lg border p-3 sm:p-4 space-y-3 sm:space-y-4">
        <h4 className="font-semibold text-gray-900 flex items-center text-sm sm:text-base">
          <Target className="w-4 h-4 mr-2" />
          Devor Bo'yash Vositalari
        </h4>

        {/* Tool Selection */}
        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={() => setTool('brush')}
            className={`p-2 sm:p-3 rounded-lg border-2 transition-all ${
              tool === 'brush'
                ? 'border-primary-500 bg-primary-50 text-primary-700'
                : 'border-gray-200 hover:border-gray-300'
            }`}
          >
            <Brush className="w-4 h-4 sm:w-5 sm:h-5 mx-auto mb-1" />
            <div className="text-xs sm:text-sm font-medium">Bo'yash</div>
          </button>
          <button
            onClick={() => setTool('eraser')}
            className={`p-2 sm:p-3 rounded-lg border-2 transition-all ${
              tool === 'eraser'
                ? 'border-primary-500 bg-primary-50 text-primary-700'
                : 'border-gray-200 hover:border-gray-300'
            }`}
          >
            <Eraser className="w-4 h-4 sm:w-5 sm:h-5 mx-auto mb-1" />
            <div className="text-xs sm:text-sm font-medium">O'chirish</div>
          </button>
        </div>

        {/* Brush Size */}
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <label className="text-xs sm:text-sm font-medium text-gray-700">
              {tool === 'brush' ? 'Cho\'tka Hajmi' : 'O\'chirg\'ich Hajmi'}
            </label>
            <span className="text-xs sm:text-sm text-gray-500">{brushSize}px</span>
          </div>
          <input
            type="range"
            min="5"
            max="100"
            value={brushSize}
            onChange={(e) => setBrushSize(parseInt(e.target.value))}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
          />
        </div>

        {/* Quick Wall Areas */}
        <div className="space-y-2">
          <label className="text-xs sm:text-sm font-medium text-gray-700">Tezkor Devor Tanlash:</label>
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => paintWallArea(quickWallAreas.leftWall)}
              className="btn-secondary text-xs py-2 flex items-center justify-center space-x-1"
            >
              <Square className="w-3 h-3" />
              <span>Chap</span>
            </button>
            <button
              onClick={() => paintWallArea(quickWallAreas.rightWall)}
              className="btn-secondary text-xs py-2 flex items-center justify-center space-x-1"
            >
              <Square className="w-3 h-3" />
              <span>O'ng</span>
            </button>
            <button
              onClick={() => paintWallArea(quickWallAreas.backWall)}
              className="btn-secondary text-xs py-2 flex items-center justify-center space-x-1"
            >
              <Square className="w-3 h-3" />
              <span>Orqa</span>
            </button>
            <button
              onClick={() => paintWallArea(quickWallAreas.floorWall)}
              className="btn-secondary text-xs py-2 flex items-center justify-center space-x-1"
            >
              <Square className="w-3 h-3" />
              <span>Pol</span>
            </button>
          </div>
        </div>
      </div>

      {/* Instructions */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
        <div className="flex items-start space-x-2">
          <Hand className="w-4 h-4 text-blue-500 mt-0.5 flex-shrink-0" />
          <div>
            <p className="text-xs sm:text-sm text-blue-700 font-medium">
              Qo'lda Devor Bo'yash
            </p>
            <p className="text-xs text-blue-600 mt-1">
              • Cho'tka bilan aniq devorlarni bo'yang<br/>
              • O'chirg'ich bilan xatolarni tuzating<br/>
              • Tezkor tugmalar bilan katta hududlarni bo'yang<br/>
              • Rasmda ko'rinadigan haqiqiy devorlarni tanlang
            </p>
          </div>
        </div>
      </div>
    </div>
  )
})

InteractiveWallPainter.displayName = 'InteractiveWallPainter'

export default InteractiveWallPainter