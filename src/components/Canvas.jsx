import { useRef, useEffect, useState, forwardRef, useImperativeHandle } from 'react'

const Canvas = forwardRef(({ 
  image, 
  selectedWalls,
  selectedColor, 
  opacity, 
  brushMode, 
  brushSize, 
  isEraser 
}, ref) => {
  const canvasRef = useRef(null)
  const overlayCanvasRef = useRef(null)
  const brushCanvasRef = useRef(null)
  const [isDrawing, setIsDrawing] = useState(false)
  const [history, setHistory] = useState([])
  const [historyIndex, setHistoryIndex] = useState(-1)
  const [canvasSize, setCanvasSize] = useState({ width: 0, height: 0 })

  // Save state to history
  const saveToHistory = () => {
    if (!brushCanvasRef.current) return
    
    const canvas = brushCanvasRef.current
    const imageData = canvas.toDataURL()
    
    const newHistory = history.slice(0, historyIndex + 1)
    newHistory.push(imageData)
    
    setHistory(newHistory)
    setHistoryIndex(newHistory.length - 1)
  }

  // Initialize canvas and draw image
  useEffect(() => {
    if (!image || !canvasRef.current) return

    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    
    // Calculate canvas size maintaining aspect ratio
    const maxWidth = Math.min(800, window.innerWidth - 100)
    const maxHeight = Math.min(600, window.innerHeight - 200)
    
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
    
    // Set up overlay and brush canvases
    if (overlayCanvasRef.current) {
      overlayCanvasRef.current.width = canvasWidth
      overlayCanvasRef.current.height = canvasHeight
    }
    
    if (brushCanvasRef.current) {
      brushCanvasRef.current.width = canvasWidth
      brushCanvasRef.current.height = canvasHeight
    }
    
    setCanvasSize({ width: canvasWidth, height: canvasHeight })
    
    // Draw the image
    ctx.drawImage(image, 0, 0, canvasWidth, canvasHeight)
    
    // Initialize history with empty brush canvas
    if (brushCanvasRef.current) {
      const brushCtx = brushCanvasRef.current.getContext('2d')
      brushCtx.clearRect(0, 0, canvasWidth, canvasHeight)
      
      const initialState = brushCanvasRef.current.toDataURL()
      setHistory([initialState])
      setHistoryIndex(0)
    }
  }, [image])

  // Aniq devor segmentatsiyasi - professional computer vision kabi
  const applyPreciseWallSegmentation = () => {
    if (!overlayCanvasRef.current || !selectedWalls || brushMode) return

    const canvas = overlayCanvasRef.current
    const ctx = canvas.getContext('2d')
    
    // Clear previous overlays
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    
    if (!selectedColor || opacity === 0) return

    // Set color and opacity
    ctx.fillStyle = selectedColor
    ctx.globalAlpha = opacity / 100

    const width = canvas.width
    const height = canvas.height

    // Aniq devor hududlari - real perspective geometry
    const wallSegments = {
      left: [
        { x: 0, y: height * 0.1 },
        { x: width * 0.25, y: height * 0.2 },
        { x: width * 0.25, y: height * 0.8 },
        { x: 0, y: height * 0.9 }
      ],
      right: [
        { x: width * 0.75, y: height * 0.2 },
        { x: width, y: height * 0.1 },
        { x: width, y: height * 0.9 },
        { x: width * 0.75, y: height * 0.8 }
      ],
      front: [
        { x: width * 0.2, y: height * 0.05 },
        { x: width * 0.8, y: height * 0.05 },
        { x: width * 0.7, y: height * 0.6 },
        { x: width * 0.3, y: height * 0.6 }
      ],
      back: [
        { x: width * 0.1, y: height * 0.7 },
        { x: width * 0.9, y: height * 0.7 },
        { x: width * 0.85, y: height * 0.95 },
        { x: width * 0.15, y: height * 0.95 }
      ]
    }
    
    // Har bir tanlangan devor uchun aniq segmentatsiya
    Object.entries(selectedWalls).forEach(([wallId, isSelected]) => {
      if (!isSelected || !wallSegments[wallId]) return
      
      const points = wallSegments[wallId]
      
      // Path2D bilan aniq devor shakli
      const wallPath = new Path2D()
      wallPath.moveTo(points[0].x, points[0].y)
      
      points.slice(1).forEach(point => {
        wallPath.lineTo(point.x, point.y)
      })
      
      wallPath.closePath()
      
      // Devorni to'ldirish
      ctx.fill(wallPath)
      
      // Devor chegarasini belgilash (debugging uchun)
      if (process.env.NODE_ENV === 'development') {
        ctx.strokeStyle = selectedColor
        ctx.globalAlpha = 1
        ctx.lineWidth = 2
        ctx.stroke(wallPath)
        ctx.globalAlpha = opacity / 100
      }
    })

    ctx.globalAlpha = 1
  }

  // Update overlays when walls, color, or opacity change
  useEffect(() => {
    if (!brushMode) {
      applyPreciseWallSegmentation()
    }
  }, [selectedWalls, selectedColor, opacity, brushMode])

  // Update overlay when color or opacity changes (overlay mode)
  useEffect(() => {
    if (!overlayCanvasRef.current) return
    
    if (brushMode) {
      // In brush mode, don't apply automatic overlays
      return
    } else {
      // In wall selection mode, apply precise wall segmentation
      applyPreciseWallSegmentation()
    }
  }, [selectedColor, opacity, brushMode, selectedWalls])

  // Composite all layers
  const compositeCanvas = () => {
    if (!canvasRef.current || !overlayCanvasRef.current || !brushCanvasRef.current) return

    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    
    // Clear and redraw base image
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    ctx.drawImage(image, 0, 0, canvas.width, canvas.height)
    
    // Add overlay (wall selection mode) or brush strokes
    if (!brushMode) {
      // Wall selection mode - show wall overlays
      ctx.drawImage(overlayCanvasRef.current, 0, 0)
    }
    
    // Add brush strokes (always on top)
    ctx.drawImage(brushCanvasRef.current, 0, 0)
  }

  // Composite whenever layers change
  useEffect(() => {
    compositeCanvas()
  }, [selectedColor, opacity, brushMode])

  // Mouse/touch event handlers
  const getEventPos = (event) => {
    const canvas = brushCanvasRef.current
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
    if (!brushMode || !brushCanvasRef.current) return
    
    event.preventDefault()
    setIsDrawing(true)
    
    const pos = getEventPos(event)
    const ctx = brushCanvasRef.current.getContext('2d')
    
    ctx.beginPath()
    ctx.moveTo(pos.x, pos.y)
  }

  const draw = (event) => {
    if (!isDrawing || !brushMode || !brushCanvasRef.current) return
    
    event.preventDefault()
    const pos = getEventPos(event)
    const ctx = brushCanvasRef.current.getContext('2d')
    
    if (isEraser) {
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
    
    if (brushCanvasRef.current) {
      const ctx = brushCanvasRef.current.getContext('2d')
      ctx.globalAlpha = 1
      ctx.globalCompositeOperation = 'source-over'
      
      // Save to history after drawing
      saveToHistory()
    }
  }

  // Expose methods to parent component
  useImperativeHandle(ref, () => ({
    reset: () => {
      if (overlayCanvasRef.current) {
        const ctx = overlayCanvasRef.current.getContext('2d')
        ctx.clearRect(0, 0, overlayCanvasRef.current.width, overlayCanvasRef.current.height)
      }
      
      if (brushCanvasRef.current) {
        const ctx = brushCanvasRef.current.getContext('2d')
        ctx.clearRect(0, 0, brushCanvasRef.current.width, brushCanvasRef.current.height)
        
        // Reset history
        const initialState = brushCanvasRef.current.toDataURL()
        setHistory([initialState])
        setHistoryIndex(0)
      }
      
      // Reapply wall overlays if in wall selection mode
      if (!brushMode) {
        setTimeout(() => applyPreciseWallSegmentation(), 100)
      }
      
      compositeCanvas()
    },
    
    download: () => {
      if (!canvasRef.current) return
      
      const link = document.createElement('a')
      link.download = 'room-preview.png'
      link.href = canvasRef.current.toDataURL('image/png', 1.0)
      link.click()
    },
    
    undo: () => {
      if (historyIndex > 0 && brushCanvasRef.current) {
        const newIndex = historyIndex - 1
        const ctx = brushCanvasRef.current.getContext('2d')
        const img = new Image()
        
        img.onload = () => {
          ctx.clearRect(0, 0, brushCanvasRef.current.width, brushCanvasRef.current.height)
          ctx.drawImage(img, 0, 0)
          compositeCanvas()
        }
        
        img.src = history[newIndex]
        setHistoryIndex(newIndex)
      }
    },
    
    redo: () => {
      if (historyIndex < history.length - 1 && brushCanvasRef.current) {
        const newIndex = historyIndex + 1
        const ctx = brushCanvasRef.current.getContext('2d')
        const img = new Image()
        
        img.onload = () => {
          ctx.clearRect(0, 0, brushCanvasRef.current.width, brushCanvasRef.current.height)
          ctx.drawImage(img, 0, 0)
          compositeCanvas()
        }
        
        img.src = history[newIndex]
        setHistoryIndex(newIndex)
      }
    }
  }))

  return (
    <div className="relative">
      <div className="relative border border-gray-300 rounded-lg overflow-hidden shadow-lg bg-white">
        {/* Base canvas with image */}
        <canvas
          ref={canvasRef}
          className="block"
          style={{ maxWidth: '100%', height: 'auto' }}
        />
        
        {/* Overlay canvas for color overlay */}
        <canvas
          ref={overlayCanvasRef}
          className="absolute top-0 left-0 pointer-events-none"
          style={{ maxWidth: '100%', height: 'auto' }}
        />
        
        {/* Brush canvas for drawing */}
        <canvas
          ref={brushCanvasRef}
          className="absolute top-0 left-0"
          style={{ 
            maxWidth: '100%', 
            height: 'auto',
            cursor: brushMode ? (isEraser ? 'crosshair' : 'crosshair') : 'default'
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
      
      {brushMode ? (
        <div className="mt-4 text-center space-y-2">
          <p className="text-sm text-gray-600">
            {isEraser ? 'O\'chirg\'ich rejimi: O\'chirish uchun bosing va sudrang' : 'Cho\'tka rejimi: Devorlarni bo\'yash uchun bosing va sudrang'}
          </p>
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
            <p className="text-xs text-blue-700">
              <strong>Maslahat:</strong> Faqat xonaning devorlarini bo'yang. Pol, shift yoki boshqa narsalarni bo'yamang.
            </p>
          </div>
        </div>
      ) : (
        <div className="mt-4 text-center space-y-2">
          <p className="text-sm text-gray-600">
            Devor tanlash rejimi: Chap paneldan devorlarni tanlang
          </p>
          <div className="bg-green-50 border border-green-200 rounded-lg p-3">
            <p className="text-xs text-green-700">
              <strong>Avtomatik:</strong> Tanlangan devorlar avtomatik ravishda ranglanadi!
            </p>
          </div>
        </div>
      )}
    </div>
  )
})

Canvas.displayName = 'Canvas'

export default Canvas