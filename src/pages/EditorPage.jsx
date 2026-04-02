import { useState, useRef, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { 
  ArrowLeft, 
  Upload, 
  Download, 
  RotateCcw, 
  Palette,
  Brush,
  Eraser,
  Undo,
  Redo,
  Camera,
  Image as ImageIcon
} from 'lucide-react'
import ImageUpload from '../components/ImageUpload'
import InteractiveWallPainter from '../components/InteractiveWallPainter'
import RealtimeWallPainter from '../components/RealtimeWallPainter'
import ColorControls from '../components/ColorControls'

const EditorPage = () => {
  const [image, setImage] = useState(null)
  const [selectedColor, setSelectedColor] = useState('#3b82f6')
  const [opacity, setOpacity] = useState(50)
  const [mode, setMode] = useState('select') // 'select', 'camera', 'image'
  const painterRef = useRef(null)
  const realtimePainterRef = useRef(null)

  const handleReset = () => {
    if (mode === 'camera' && realtimePainterRef.current) {
      realtimePainterRef.current.clearOverlay()
    } else if (mode === 'image' && painterRef.current) {
      painterRef.current.reset()
    }
  }

  const handleDownload = () => {
    if (mode === 'camera' && realtimePainterRef.current) {
      realtimePainterRef.current.capturePhoto()
    } else if (mode === 'image' && painterRef.current) {
      painterRef.current.download()
    }
  }

  const handleUndo = () => {
    if (mode === 'image' && painterRef.current) {
      painterRef.current.undo()
    }
  }

  const handleRedo = () => {
    if (mode === 'image' && painterRef.current) {
      painterRef.current.redo()
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b sticky top-0 z-10">
        <div className="px-3 sm:px-4 py-3 flex items-center justify-between">
          <div className="flex items-center space-x-2 sm:space-x-4">
            <Link 
              to="/" 
              className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors"
            >
              <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5" />
              <span className="text-sm sm:text-base">Bosh Sahifaga</span>
            </Link>
            <div className="hidden sm:block w-px h-6 bg-gray-300"></div>
            <h1 className="hidden md:block text-base sm:text-lg font-semibold text-gray-900">
              Xona Dizayn Muharriri
            </h1>
          </div>
          
          <div className="flex items-center space-x-1 sm:space-x-2">
            {mode === 'image' && (
              <>
                <button
                  onClick={handleUndo}
                  className="p-1.5 sm:p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
                  title="Bekor Qilish"
                >
                  <Undo className="w-4 h-4 sm:w-5 sm:h-5" />
                </button>
                <button
                  onClick={handleRedo}
                  className="p-1.5 sm:p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
                  title="Qaytarish"
                >
                  <Redo className="w-4 h-4 sm:w-5 sm:h-5" />
                </button>
              </>
            )}
            <button
              onClick={handleReset}
              className="p-1.5 sm:p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
              title="Qayta Boshlash"
            >
              <RotateCcw className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
            <button
              onClick={handleDownload}
              className="btn-primary flex items-center space-x-1 sm:space-x-2 text-sm sm:text-base px-3 sm:px-4 py-2 sm:py-3"
              disabled={mode === 'select'}
            >
              <Download className="w-3 h-3 sm:w-4 sm:h-4" />
              <span className="hidden sm:inline">
                {mode === 'camera' ? 'Suratga Olish' : 'Yuklab Olish'}
              </span>
              <span className="sm:hidden">
                {mode === 'camera' ? 'Surat' : 'Yuklab'}
              </span>
            </button>
          </div>
        </div>
      </header>

      <div className="flex flex-col xl:flex-row min-h-[calc(100vh-73px)]">
        {/* Main Canvas Area */}
        <div className="flex-1 flex items-center justify-center p-2 sm:p-4 bg-gray-100 min-h-[50vh] xl:min-h-auto">
          {mode === 'select' ? (
            // Mode selection
            <div className="w-full max-w-md mx-auto space-y-4">
              <div className="text-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Rejimni Tanlang</h2>
                <p className="text-gray-600">Xonangizni qanday ko'rishni xohlaysiz?</p>
              </div>
              
              <div className="grid gap-4">
                {/* Camera Mode */}
                <button
                  onClick={() => setMode('camera')}
                  className="p-6 bg-white border-2 border-gray-200 rounded-xl hover:border-primary-500 hover:bg-primary-50 transition-all group"
                >
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center group-hover:bg-primary-200">
                      <Camera className="w-6 h-6 text-primary-600" />
                    </div>
                    <div className="text-left">
                      <h3 className="text-lg font-semibold text-gray-900">Real-time Kamera</h3>
                      <p className="text-sm text-gray-600">Kamera orqali devorlarni to'g'ridan-to'g'ri bo'yang</p>
                    </div>
                  </div>
                </button>

                {/* Image Upload Mode */}
                <button
                  onClick={() => setMode('image')}
                  className="p-6 bg-white border-2 border-gray-200 rounded-xl hover:border-primary-500 hover:bg-primary-50 transition-all group"
                >
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center group-hover:bg-primary-200">
                      <ImageIcon className="w-6 h-6 text-primary-600" />
                    </div>
                    <div className="text-left">
                      <h3 className="text-lg font-semibold text-gray-900">Rasm Yuklash</h3>
                      <p className="text-sm text-gray-600">Rasm yuklang va aniq devorlarni bo'yang</p>
                    </div>
                  </div>
                </button>
              </div>
            </div>
          ) : mode === 'camera' ? (
            // Camera mode - Real-time wall painting
            <RealtimeWallPainter
              ref={realtimePainterRef}
              selectedColor={selectedColor}
              opacity={opacity}
            />
          ) : mode === 'image' ? (
            // Image mode - Interactive wall painting
            !image ? (
              <ImageUpload onImageUpload={setImage} />
            ) : (
              <InteractiveWallPainter
                ref={painterRef}
                image={image}
                selectedColor={selectedColor}
                opacity={opacity}
                imageSource="image"
              />
            )
          ) : null}
        </div>

        {/* Controls Sidebar */}
        <div className="w-full xl:w-80 bg-white border-t xl:border-t-0 xl:border-l border-gray-200 p-3 sm:p-4 space-y-4 sm:space-y-6 overflow-y-auto max-h-[50vh] xl:max-h-none">
          {/* Mode Selection */}
          {mode !== 'select' && (
            <div className="space-y-3">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                <Upload className="w-5 h-5 mr-2" />
                Rejim
              </h3>
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <span className="text-sm font-medium text-gray-700">
                  {mode === 'camera' ? 'Real-time Kamera' : 'Interaktiv Rasm Bo\'yash'}
                </span>
                <button
                  onClick={() => {
                    setMode('select')
                    setImage(null)
                    if (realtimePainterRef.current) {
                      realtimePainterRef.current.stopCamera()
                    }
                  }}
                  className="text-sm text-primary-600 hover:text-primary-700"
                >
                  O'zgartirish
                </button>
              </div>
            </div>
          )}

          {mode === 'image' && image && (
            <div className="space-y-3">
              <button
                onClick={() => setImage(null)}
                className="btn-secondary w-full"
              >
                Yangi Rasm Yuklash
              </button>
            </div>
          )}

          {(mode === 'camera' || (mode === 'image' && image)) && (
            <>
              {/* Color Controls */}
              <ColorControls
                selectedColor={selectedColor}
                setSelectedColor={setSelectedColor}
                opacity={opacity}
                setOpacity={setOpacity}
                brushMode={true} // Always brush mode for interactive painting
              />

              {/* Quick Actions */}
              <div className="space-y-3 pt-4 border-t border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900">Amallar</h3>
                <div className="space-y-2">
                  <button
                    onClick={handleReset}
                    className="btn-secondary w-full flex items-center justify-center space-x-2"
                  >
                    <RotateCcw className="w-4 h-4" />
                    <span>Tozalash</span>
                  </button>
                  <button
                    onClick={handleDownload}
                    className="btn-primary w-full flex items-center justify-center space-x-2"
                  >
                    <Download className="w-4 h-4" />
                    <span>{mode === 'camera' ? 'Suratga Olish' : 'Rasmni Yuklab Olish'}</span>
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

export default EditorPage