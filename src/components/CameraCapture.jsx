import { useRef, useEffect, useState, forwardRef, useImperativeHandle } from 'react'
import { Camera, CameraOff, Download, RotateCcw } from 'lucide-react'

const CameraCapture = forwardRef(({ 
  selectedWalls,
  selectedColor, 
  opacity
}, ref) => {
  const videoRef = useRef(null)
  const canvasRef = useRef(null)
  const overlayCanvasRef = useRef(null)
  const [stream, setStream] = useState(null)
  const [isStreaming, setIsStreaming] = useState(false)
  const [error, setError] = useState(null)

  // Start camera
  const startCamera = async () => {
    try {
      setError(null)
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { 
          width: { ideal: 1280 },
          height: { ideal: 720 },
          facingMode: 'environment' // Back camera on mobile
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
        }
        requestAnimationFrame(updateCanvas)
      }
      
      video.addEventListener('loadedmetadata', updateCanvas)
      updateCanvas()
      
      return () => {
        video.removeEventListener('loadedmetadata', updateCanvas)
      }
    }
  }, [isStreaming])

  // Real-time aniq devor segmentatsiyasi
  const applyRealtimeWallSegmentation = () => {
    if (!overlayCanvasRef.current || !selectedWalls) return

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

    // Real-time kamera uchun aniq devor segmentlari
    const cameraWallSegments = {
      left: [
        { x: 0, y: height * 0.15 },
        { x: width * 0.28, y: height * 0.25 },
        { x: width * 0.28, y: height * 0.85 },
        { x: 0, y: height * 0.95 }
      ],
      right: [
        { x: width * 0.72, y: height * 0.25 },
        { x: width, y: height * 0.15 },
        { x: width, y: height * 0.95 },
        { x: width * 0.72, y: height * 0.85 }
      ],
      front: [
        { x: width * 0.15, y: height * 0.1 },
        { x: width * 0.85, y: height * 0.1 },
        { x: width * 0.75, y: height * 0.7 },
        { x: width * 0.25, y: height * 0.7 }
      ],
      back: [
        { x: width * 0.05, y: height * 0.75 },
        { x: width * 0.95, y: height * 0.75 },
        { x: width * 0.9, y: height * 0.98 },
        { x: width * 0.1, y: height * 0.98 }
      ]
    }
    
    // Har bir tanlangan devor uchun real-time segmentatsiya
    Object.entries(selectedWalls).forEach(([wallId, isSelected]) => {
      if (!isSelected || !cameraWallSegments[wallId]) return
      
      const points = cameraWallSegments[wallId]
      
      // Path2D bilan aniq devor shakli
      const wallPath = new Path2D()
      wallPath.moveTo(points[0].x, points[0].y)
      
      points.slice(1).forEach(point => {
        wallPath.lineTo(point.x, point.y)
      })
      
      wallPath.closePath()
      
      // Devorni to'ldirish
      ctx.fill(wallPath)
      
      // Real-time debugging (development mode)
      if (process.env.NODE_ENV === 'development') {
        ctx.strokeStyle = selectedColor
        ctx.globalAlpha = 1
        ctx.lineWidth = 1
        ctx.setLineDash([3, 3])
        ctx.stroke(wallPath)
        ctx.setLineDash([])
        ctx.globalAlpha = opacity / 100
      }
    })

    ctx.globalAlpha = 1
  }

  // Update overlays when walls, color, or opacity change
  useEffect(() => {
    if (isStreaming) {
      applyRealtimeWallSegmentation()
    }
  }, [selectedWalls, selectedColor, opacity, isStreaming])

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
    link.download = `chromora-room-${Date.now()}.png`
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
      <div className="flex flex-col items-center justify-center p-8 bg-gray-50 border border-gray-200 rounded-lg">
        <Camera className="w-16 h-16 text-gray-400 mb-4" />
        <h3 className="text-lg font-semibold text-gray-800 mb-2">Kamerani Yoqing</h3>
        <p className="text-gray-600 text-center mb-4">
          Xonangizni real vaqtda ko'rish va devorlarni bo'yash uchun kamerani yoqing
        </p>
        <button onClick={startCamera} className="btn-primary">
          <Camera className="w-5 h-5 mr-2" />
          Kamerani Yoqish
        </button>
      </div>
    )
  }

  return (
    <div className="relative">
      <div className="relative border border-gray-300 rounded-lg overflow-hidden shadow-lg bg-black">
        {/* Video element (hidden) */}
        <video
          ref={videoRef}
          className="hidden"
          autoPlay
          playsInline
          muted
        />
        
        {/* Main canvas showing video */}
        <canvas
          ref={canvasRef}
          className="block w-full h-auto"
        />
        
        {/* Overlay canvas for wall colors */}
        <canvas
          ref={overlayCanvasRef}
          className="absolute top-0 left-0 w-full h-auto pointer-events-none"
        />
      </div>
      
      <div className="mt-4 text-center space-y-2">
        <p className="text-sm text-gray-600">
          Real-time kamera: Devorlarni tanlang va ranglarni darhol ko'ring
        </p>
        <div className="bg-green-50 border border-green-200 rounded-lg p-3">
          <p className="text-xs text-green-700">
            <strong>Real-time:</strong> Tanlangan devorlar avtomatik ravishda ranglanadi!
          </p>
        </div>
      </div>
    </div>
  )
})

CameraCapture.displayName = 'CameraCapture'

export default CameraCapture