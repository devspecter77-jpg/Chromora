import { useRef, useEffect, useState, forwardRef, useImperativeHandle } from 'react'
import { Camera, CameraOff, Download, Brush, Eraser, Target, Hand } from 'lucide-react'

const RealtimeWallPainter = forwardRef(({ 
  selectedColor, 
  opacity
}, ref) => {
  const videoRef = useRef(null)
  const canvasRef = useRef(null)
  const overlayCanvasRef = useRef(null)
  const [stream, setStream] = useState(null)
  const [isStreaming, setIsStreaming] = useState(false)
  const [isDrawing, setIsDrawing] = useState(false)
  const [tool, setTool] = useState('brush')
  const [brushSize, setBrushSize] = useState(30)
  const [error, setError] = useState(null)

  // Start camera
  const startCamera = async () => {
    try {
      setError(null)
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { 
          width: { ideal: 1280 },
          height: { ideal: 720 },
          facingMode: 'environment'
        }
      })
      
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream
        videoRef.current.play()
      }
      
      setStream(mediaStream)
      setIsStreaming(true)
    } catch (err) {
      console.error('Camera access error:', err)
      setError('Kameraga kirish imkoni yo\'q. Iltimos, kamera ruxsatini bering.')
    }
  }

  // Stop camera
  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop())
      setStream(null)
      setIsStreaming(false)
    }
  }

  // Setup canvas when video loads
  useEffect(() => {
    const video = videoRef.current
    const canvas = canvasRef.current
    const overlayCanvas = overlayCanvasRef.current

    if (video && canvas && overlayCanvas && isStreaming) {
      const updateCanvas = () => {
        if (video.videoWidth && video.videoHeight) {
          canvas.width = video.videoWidth
          canvas.height = video.videoHeight
          overlayCanvas.width = video.videoWidth
          overlayCanvas.height = video.videoHeight
          
          const ctx = canvas.getContext('2d')
          ctx.drawImage(video, 0, 0)
          
          // Composite with overlay
          ctx.drawImage(overlayCanvas, 0, 0)
        }
        if (isStreaming) {
          requestAnimationFrame(updateCanvas)
        }
      }
      
      video.addEventListener('loadedmetadata', updateCanvas)
      updateCanvas()
      
      return () => {
        video.removeEventListener('loadedmetadata', updateCanvas)
      }
    }
  }, [isStreaming])

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
  }

  const stopDrawing = () => {
    if (!isDrawing) return
    
    setIsDrawing(false)
    
    if (overlayCanvasRef.current) {
      const ctx = overlayCanvasRef.current.getContext('2d')
      ctx.globalAlpha = 1
      ctx.globalCompositeOperation = 'source-over'
    }
  }

  // Clear overlay
  const clearOverlay = () => {
    if (overlayCanvasRef.current) {
      const ctx = overlayCanvasRef.current.getContext('2d')
      ctx.clearRect(0, 0, overlayCanvasRef.current.width, overlayCanvasRef.current.height)
    }
  }

  // Capture photo with overlay
  const capturePhoto = () => {
    if (!canvasRef.current || !overlayCanvasRef.current || !videoRef.current) return

    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')
    const video = videoRef.current
    
    canvas.width = video.videoWidth
    canvas.height = video.videoHeight
    
    // Draw video frame
    ctx.drawImage(video, 0, 0)
    
    // Draw overlay
    ctx.drawImage(overlayCanvasRef.current, 0, 0)
    
    // Download
    const link = document.createElement('a')
    link.download = `chromora-realtime-${Date.now()}.png`
    link.href = canvas.toDataURL('image/png', 1.0)
    link.click()
  }

  // Expose methods to parent
  useImperativeHandle(ref, () => ({
    startCamera,
    stopCamera,
    clearOverlay,
    capturePhoto
  }))

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center p-8 bg-red-50 border border-red-200 rounded-lg">
        <CameraOff className="w-16 h-16 text-red-400 mb-4" />
        <h3 className="text-lg font-semibold text-red-800 mb-2">Kamera Xatosi</h3>
        <p className="text-red-600 text-center mb-4">{error}</p>
        <button onClick={startCamera} className="btn-primary">
          Qayta Urinish
        </button>
      </div>
    )
  }

  if (!isStreaming) {
    return (
      <div className="space-y-4">
        <div className="flex flex-col items-center justify-center p-8 bg-gray-50 border border-gray-200 rounded-lg">
          <Camera className="w-16 h-16 text-gray-400 mb-4" />
          <h3 className="text-lg font-semibold text-gray-800 mb-2">Real-time Devor Bo'yash</h3>
          <p className="text-gray-600 text-center mb-4">
            Kamerani yoqing va xonangizni real vaqtda bo'yang
          </p>
          <button onClick={startCamera} className="btn-primary">
            <Camera className="w-5 h-5 mr-2" />
            Kamerani Yoqish
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-3 sm:space-y-4">
      {/* Camera View */}
      <div className="relative border border-gray-300 rounded-lg overflow-hidden shadow-lg bg-black">
        {/* Video element (hidden) */}
        <video
          ref={videoRef}
          className="hidden"
          autoPlay
          playsInline
          muted
        />
        
        {/* Main canvas showing video + overlay */}
        <canvas
          ref={canvasRef}
          className="block w-full h-auto max-w-full"
          style={{ touchAction: 'none' }}
        />
        
        {/* Overlay canvas for drawing */}
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
        
        {/* Live indicator */}
        <div className="absolute top-2 left-2 bg-red-500 text-white text-xs px-2 py-1 rounded flex items-center space-x-1">
          <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
          <span>JONLI</span>
        </div>
        
        {/* Tool indicator */}
        <div className="absolute top-2 right-2 bg-black/50 text-white text-xs px-2 py-1 rounded">
          {tool === 'brush' ? `Bo'yash ${brushSize}px` : `O'chirish ${brushSize}px`}
        </div>
      </div>

      {/* Tools */}
      <div className="bg-white rounded-lg border p-3 sm:p-4 space-y-3 sm:space-y-4">
        <h4 className="font-semibold text-gray-900 flex items-center text-sm sm:text-base">
          <Target className="w-4 h-4 mr-2" />
          Real-time Bo'yash Vositalari
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
            min="10"
            max="100"
            value={brushSize}
            onChange={(e) => setBrushSize(parseInt(e.target.value))}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
          />
        </div>
      </div>

      {/* Instructions */}
      <div className="bg-green-50 border border-green-200 rounded-lg p-3">
        <div className="flex items-start space-x-2">
          <Hand className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
          <div>
            <p className="text-xs sm:text-sm text-green-700 font-medium">
              Real-time Devor Bo'yash
            </p>
            <p className="text-xs text-green-600 mt-1">
              • Kamera orqali xonangizni ko'ring<br/>
              • Cho'tka bilan devorlarni to'g'ridan-to'g'ri bo'yang<br/>
              • O'chirg'ich bilan xatolarni tuzating<br/>
              • Natijani suratga oling va saqlang
            </p>
          </div>
        </div>
      </div>
    </div>
  )
})

RealtimeWallPainter.displayName = 'RealtimeWallPainter'

export default RealtimeWallPainter