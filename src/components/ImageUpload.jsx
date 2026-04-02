import { useRef } from 'react'
import { Upload, Image as ImageIcon } from 'lucide-react'

const ImageUpload = ({ onImageUpload }) => {
  const fileInputRef = useRef(null)

  const handleFileSelect = (event) => {
    const file = event.target.files[0]
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader()
      reader.onload = (e) => {
        const img = new Image()
        img.onload = () => {
          onImageUpload(img)
        }
        img.src = e.target.result
      }
      reader.readAsDataURL(file)
    }
  }

  const handleDrop = (event) => {
    event.preventDefault()
    const file = event.dataTransfer.files[0]
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader()
      reader.onload = (e) => {
        const img = new Image()
        img.onload = () => {
          onImageUpload(img)
        }
        img.src = e.target.result
      }
      reader.readAsDataURL(file)
    }
  }

  const handleDragOver = (event) => {
    event.preventDefault()
  }

  return (
    <div className="w-full max-w-md mx-auto">
      <div
        className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-primary-400 transition-colors cursor-pointer bg-white"
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onClick={() => fileInputRef.current?.click()}
      >
        <div className="space-y-4">
          <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto">
            <Upload className="w-8 h-8 text-primary-600" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Xona Rasmingizni Yuklang
            </h3>
            <p className="text-gray-600 mb-4">
              Rasmni bu yerga sudrab tashlang yoki tanlash uchun bosing
            </p>
            <div className="flex items-center justify-center space-x-2 text-sm text-gray-500">
              <ImageIcon className="w-4 h-4" />
              <span>JPG, PNG, WebP 10MB gacha</span>
            </div>
          </div>
        </div>
      </div>
      
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileSelect}
        className="hidden"
      />
      
      <div className="mt-6 text-center">
        <p className="text-sm text-gray-500 mb-2">
          💡 <strong>Maslahat:</strong> Devorlar aniq ko'rinadigan yaxshi yoritilgan xona rasmlarini ishlating. Cho'tka bilan faqat devorlarni bo'yang.
        </p>
      </div>
    </div>
  )
}

export default ImageUpload