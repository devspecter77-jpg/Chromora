import { Link } from 'react-router-dom'
import { Palette, Upload, Download, Sparkles, Check, Star } from 'lucide-react'

const HomePage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50">
      {/* Navigation */}
      <nav className="px-4 sm:px-6 py-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center">
            <img 
              src="/chromora-logo.png" 
              alt="Chromora" 
              className="h-10 w-10 sm:h-12 sm:w-12 object-contain border-2 border-black rounded-md"
            />
          </div>
          <Link to="/editor" className="btn-secondary text-sm sm:text-base px-3 sm:px-4 py-2 sm:py-3">
            Sinab Ko'ring
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="px-4 sm:px-6 py-12 sm:py-20">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-3xl sm:text-5xl md:text-6xl font-bold text-gray-900 mb-4 sm:mb-6 animate-fade-in">
            Xonangizni Ko'ring
            <span className="block bg-gradient-to-r from-primary-500 to-primary-600 bg-clip-text text-transparent">
              Real Vaqtda
            </span>
          </h1>
          <p className="text-base sm:text-xl text-gray-600 mb-6 sm:mb-8 max-w-2xl mx-auto animate-slide-up">
            Kamera orqali xonangizni real vaqtda ko'ring va devorlarni darhol bo'yang. Yoki mavjud rasmingizni yuklang va tahrirlang.
          </p>
          <Link to="/editor" className="btn-primary text-base sm:text-lg animate-slide-up inline-flex items-center">
            <Sparkles className="inline-block w-4 h-4 sm:w-5 sm:h-5 mr-2" />
            Dizaynni Boshlash
          </Link>
        </div>
      </section>

      {/* Features Section */}
      <section className="px-6 py-16 bg-white/50">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            Qanday Ishlaydi
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center p-6 glass-card rounded-xl">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Upload className="w-8 h-8 text-primary-600" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Xona Rasmini Yuklang</h3>
              <p className="text-gray-600">
                Xonangiz rasmini oddiy yuklang. Bizning vositamiz har qanday xona rasmi bilan ishlaydi.
              </p>
            </div>
            <div className="text-center p-6 glass-card rounded-xl">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Palette className="w-8 h-8 text-primary-600" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Devorlarni Tanlang</h3>
              <p className="text-gray-600">
                Chap, o'ng, old yoki orqa devorlarni tanlang. Tanlangan devorlar avtomatik ranglanadi.
              </p>
            </div>
            <div className="text-center p-6 glass-card rounded-xl">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Download className="w-8 h-8 text-primary-600" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Natijani Yuklab Oling</h3>
              <p className="text-gray-600">
                Yuqori sifatli ko'rinish rasmingizni saqlang va keyinroq ulashing yoki foydalaning.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="px-6 py-16">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            Tarifni Tanlang
          </h2>
          <div className="grid md:grid-cols-2 gap-8">
            {/* Free Plan */}
            <div className="glass-card rounded-xl p-8 border-2 border-gray-200">
              <div className="text-center mb-6">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Bepul</h3>
                <div className="text-4xl font-bold text-gray-900 mb-4">
                  $0<span className="text-lg text-gray-600">/month</span>
                </div>
              </div>
              <ul className="space-y-3 mb-8">
                <li className="flex items-center">
                  <Check className="w-5 h-5 text-green-500 mr-3" />
                  <span>Xona rasmlarini yuklash</span>
                </li>
                <li className="flex items-center">
                  <Check className="w-5 h-5 text-green-500 mr-3" />
                  <span>Asosiy rang qoplami</span>
                </li>
                <li className="flex items-center">
                  <Check className="w-5 h-5 text-green-500 mr-3" />
                  <span>Ko'rinishlarni yuklab olish</span>
                </li>
                <li className="flex items-center">
                  <Check className="w-5 h-5 text-green-500 mr-3" />
                  <span>Oyiga 5 ta loyiha</span>
                </li>
              </ul>
              <Link to="/editor" className="btn-secondary w-full text-center block">
                Boshlash
              </Link>
            </div>

            {/* Premium Plan */}
            <div className="glass-card rounded-xl p-8 border-2 border-primary-500 relative">
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                <span className="bg-primary-500 text-white px-4 py-1 rounded-full text-sm font-semibold flex items-center">
                  <Star className="w-4 h-4 mr-1" />
                  Popular
                </span>
              </div>
              <div className="text-center mb-6">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Premium</h3>
                <div className="text-4xl font-bold text-gray-900 mb-4">
                  $9<span className="text-lg text-gray-600">/month</span>
                </div>
              </div>
              <ul className="space-y-3 mb-8">
                <li className="flex items-center">
                  <Check className="w-5 h-5 text-green-500 mr-3" />
                  <span>Bepuldagi hamma imkoniyatlar</span>
                </li>
                <li className="flex items-center">
                  <Check className="w-5 h-5 text-green-500 mr-3" />
                  <span>Rivojlangan cho'tka vositalari</span>
                </li>
                <li className="flex items-center">
                  <Check className="w-5 h-5 text-green-500 mr-3" />
                  <span>Bir nechta rang qatlamlari</span>
                </li>
                <li className="flex items-center">
                  <Check className="w-5 h-5 text-green-500 mr-3" />
                  <span>Cheksiz loyihalar</span>
                </li>
                <li className="flex items-center">
                  <Check className="w-5 h-5 text-green-500 mr-3" />
                  <span>HD eksportlar</span>
                </li>
              </ul>
              <button className="btn-primary w-full">
                Premium'ga O'tish
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="px-6 py-16 bg-gray-900 text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-6">Makoningizni O'zgartirishga Tayyormisiz?</h2>
          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            Chromora yordamida ishonchli rang tanlovlari qilayotgan minglab uy egalariga qo'shiling.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/editor" className="btn-primary">
              Loyihangizni Boshlang
            </Link>
            <a href="mailto:hello@chromora.com" className="btn-secondary bg-gray-800 hover:bg-gray-700 text-white border-gray-600">
              Yordam Xizmati
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="px-6 py-8 bg-gray-800 text-gray-300">
        <div className="max-w-6xl mx-auto text-center">
          <div className="flex items-center justify-center mb-4">
            <img 
              src="/chromora-logo.png" 
              alt="Chromora" 
              className="h-10 w-10 object-contain border-2 border-black rounded-md"
            />
          </div>
          <p className="text-sm">
            © 2026 Chromora. Barcha huquqlar himoyalangan. Uy dizaynerlari uchun ❤️ bilan yaratilgan.
          </p>
        </div>
      </footer>
    </div>
  )
}

export default HomePage