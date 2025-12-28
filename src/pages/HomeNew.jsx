import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import ProductCard from '../components/ProductCard'
import { getHomepageData } from '../services/api'
import TextType from '../components/TextType'
import ScrollReveal from '../components/ScrollReveal'
import '@fortawesome/fontawesome-free/css/all.min.css'

function Home() {
  const getDummyData = () => ({
    featured_products: [],
    latest_products: [],
    categories: [],
    inspirations: [],
    stats: { total_products: 14, total_categories: 5 },
    settings: {
      site_name: 'Hibiscus Efsya',
      site_tagline: 'Part of M.B.K Indonesia',
      hero_subtitle: 'Part of M.B.K Indonesia, Deodorant Roll On, P.O. Powder, Bedak Biang Keringat, Halal & Berkualitas',
      hero_description: 'Produk perawatan tubuh berkualitas untuk menjaga kesegaran dan kebersihan Anda. Deodorant dan bedak tabur yang efektif mengatasi bau badan.',
      about_title: 'Tentang Kami',
      about_content: 'M.B.K Indonesia adalah produsen produk kosmetik perawatan tubuh yang telah dipercaya masyarakat Indonesia.'
    }
  })

  const [data, setData] = useState(getDummyData())
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      setLoading(true)
      const response = await getHomepageData()
      if (response && response.data) {
        setData(response.data)
      }
    } catch (err) {
      console.log('Using dummy data due to API error')
    } finally {
      setLoading(false)
    }
  }

  // Parse hero_subtitle untuk TextType array
  const getHeroSubtitleArray = () => {
    const subtitle = data?.settings?.hero_subtitle || ''
    // Split by comma atau titik koma
    const parts = subtitle.split(/[,;]+/).map(s => s.trim()).filter(s => s)
    return parts.length > 0 ? parts : ['Part of M.B.K Indonesia', 'Deodorant Roll On', 'P.O. Powder', 'Halal & Berkualitas']
  }

  const getCategoryIcon = (slug) => {
    const icons = {
      'deodorant-roll-on': 'fa-spray-can-sparkles',
      'po-powder': 'fa-wand-magic-sparkles',
      'bedak-biang-keringat': 'fa-snowflake',
      'body-mist': 'fa-wind',
      'body-lotion': 'fa-pump-soap'
    }
    return icons[slug] || 'fa-box'
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center pt-24 pb-16 overflow-hidden bg-gradient-to-br from-white via-gray-50 to-gray-100">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Hero Content */}
            <ScrollReveal animation="fadeUp" delay={0.2}>
              <div className="text-center lg:text-left">
                <span className="inline-flex items-center gap-2 px-4 py-2 bg-red-50 text-red-600 rounded-full text-sm font-semibold mb-6">
                  <i className="fas fa-sparkles"></i>
                  Kosmetik & Perawatan Tubuh
                </span>
                
                <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6">
                  {data?.settings?.site_name || 'Hibiscus Efsya'}
                </h1>
                
                {/* TextType Animation */}
                <div className="h-8 mb-6">
                  <TextType
                    text={getHeroSubtitleArray()}
                    typingSpeed={75}
                    pauseDuration={2000}
                    deletingSpeed={40}
                    showCursor={true}
                    cursorCharacter="|"
                    className="text-red-600 font-semibold text-lg"
                    cursorClassName="text-red-600"
                  />
                </div>
                
                <p className="text-gray-600 text-lg leading-relaxed mb-8 max-w-xl mx-auto lg:mx-0">
                  {data?.settings?.hero_description || 'Produk perawatan tubuh berkualitas untuk menjaga kesegaran dan kebersihan Anda.'}
                </p>
                
                <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                  <Link 
                    to="/katalog" 
                    className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-red-600 text-white font-semibold rounded-xl hover:bg-red-700 transition-all duration-300 shadow-lg hover:shadow-xl hover:-translate-y-1"
                  >
                    <span>Telusuri Katalog</span>
                    <i className="fas fa-arrow-right"></i>
                  </Link>
                  <a 
                    href="#about" 
                    className="inline-flex items-center justify-center gap-2 px-8 py-4 border-2 border-gray-300 text-gray-700 font-semibold rounded-xl hover:border-red-600 hover:text-red-600 transition-all duration-300"
                  >
                    Tentang Kami
                  </a>
                </div>
              </div>
            </ScrollReveal>

            {/* Hero Visual */}
            <ScrollReveal animation="fadeIn" delay={0.4}>
              <div className="relative">
                <div className="relative aspect-square max-w-md mx-auto">
                  <div className="w-full h-full bg-gradient-to-br from-red-400 to-red-600 rounded-3xl flex items-center justify-center shadow-2xl">
                    <i className="fas fa-pump-soap text-white/80 text-8xl"></i>
                  </div>
                </div>
                {/* Stats Card */}
                <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 bg-white rounded-2xl shadow-xl px-8 py-4 flex gap-8">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-red-600">{data?.stats?.total_products || 14}+</div>
                    <div className="text-gray-500 text-sm">Produk</div>
                  </div>
                  <div className="w-px bg-gray-200"></div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-red-600">{data?.stats?.total_categories || 5}</div>
                    <div className="text-gray-500 text-sm">Kategori</div>
                  </div>
                </div>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 lg:px-8">
          <ScrollReveal>
            <div className="text-center mb-12">
              <h2 className="font-display text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Kategori Produk
              </h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Temukan berbagai produk perawatan tubuh untuk kesegaran Anda
              </p>
            </div>
          </ScrollReveal>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {data?.categories?.map((category, index) => (
              <ScrollReveal key={category.id} delay={index * 0.1}>
                <Link
                  to={`/katalog/${category.slug}`}
                  className="group bg-gray-50 hover:bg-red-50 rounded-2xl p-6 text-center transition-all duration-300 hover:-translate-y-2 hover:shadow-lg"
                >
                  <div className="w-16 h-16 mx-auto mb-4 bg-white rounded-xl flex items-center justify-center shadow-sm group-hover:bg-red-100 transition-colors">
                    <i className={`fas ${getCategoryIcon(category.slug)} text-2xl text-red-600`}></i>
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-1">{category.name}</h3>
                  <span className="text-sm text-gray-500">{category.product_count} produk</span>
                </Link>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      {data?.featured_products?.length > 0 && (
        <section id="featured" className="py-20 bg-gray-50">
          <div className="container mx-auto px-4 lg:px-8">
            <ScrollReveal>
              <div className="text-center mb-12">
                <h2 className="font-display text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                  Produk Unggulan
                </h2>
                <p className="text-gray-600 max-w-2xl mx-auto">
                  Produk terbaik pilihan pelanggan kami
                </p>
              </div>
            </ScrollReveal>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {data.featured_products.map((product, index) => (
                <ScrollReveal key={product.id} delay={index * 0.1}>
                  <ProductCard product={product} />
                </ScrollReveal>
              ))}
            </div>

            <ScrollReveal delay={0.4}>
              <div className="text-center mt-12">
                <Link
                  to="/katalog"
                  className="inline-flex items-center gap-2 px-8 py-4 bg-red-600 text-white font-semibold rounded-xl hover:bg-red-700 transition-all duration-300"
                >
                  Lihat Semua Produk
                  <i className="fas fa-arrow-right"></i>
                </Link>
              </div>
            </ScrollReveal>
          </div>
        </section>
      )}

      {/* Benefits Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 lg:px-8">
          <ScrollReveal>
            <div className="text-center mb-12">
              <h2 className="font-display text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Mengapa Memilih Kami
              </h2>
            </div>
          </ScrollReveal>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: 'fa-certificate', title: 'Halal & Aman', desc: 'Produk bersertifikat halal MUI dan aman untuk kulit' },
              { icon: 'fa-clock', title: 'Tahan Lama', desc: 'Perlindungan hingga 24 jam dari bau badan' },
              { icon: 'fa-leaf', title: 'Bahan Berkualitas', desc: 'Terbuat dari tawas, talc, dan parfum pilihan' },
              { icon: 'fa-tag', title: 'Harga Terjangkau', desc: 'Kualitas premium dengan harga ekonomis' }
            ].map((benefit, index) => (
              <ScrollReveal key={index} delay={index * 0.1}>
                <div className="bg-gray-50 rounded-2xl p-6 text-center hover:bg-red-50 transition-all duration-300 hover:-translate-y-2">
                  <div className="w-14 h-14 mx-auto mb-4 bg-red-100 rounded-xl flex items-center justify-center">
                    <i className={`fas ${benefit.icon} text-xl text-red-600`}></i>
                  </div>
                  <h4 className="font-semibold text-gray-900 mb-2">{benefit.title}</h4>
                  <p className="text-gray-600 text-sm">{benefit.desc}</p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-20 bg-gray-50 scroll-mt-20">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <ScrollReveal animation="slideRight">
              <div>
                <h2 className="font-display text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                  {data?.settings?.about_title || 'Tentang Kami'}
                </h2>
                <p className="text-gray-600 text-lg leading-relaxed mb-8">
                  {data?.settings?.about_content || 'M.B.K Indonesia adalah produsen produk kosmetik perawatan tubuh yang telah dipercaya masyarakat Indonesia.'}
                </p>
                <div className="flex flex-wrap gap-4">
                  <div className="flex items-center gap-3 bg-white px-4 py-3 rounded-xl shadow-sm">
                    <i className="fas fa-industry text-red-600"></i>
                    <span className="font-medium">Produksi Indonesia</span>
                  </div>
                  <div className="flex items-center gap-3 bg-white px-4 py-3 rounded-xl shadow-sm">
                    <i className="fas fa-certificate text-red-600"></i>
                    <span className="font-medium">Bersertifikat Halal</span>
                  </div>
                  <div className="flex items-center gap-3 bg-white px-4 py-3 rounded-xl shadow-sm">
                    <i className="fas fa-shield-halved text-red-600"></i>
                    <span className="font-medium">BPOM Approved</span>
                  </div>
                </div>
              </div>
            </ScrollReveal>

            <ScrollReveal animation="slideLeft" delay={0.2}>
              <div className="relative">
                <div className="aspect-video bg-gradient-to-br from-red-500 to-red-700 rounded-3xl flex items-center justify-center shadow-xl">
                  <i className="fas fa-building text-white/50 text-6xl"></i>
                </div>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-gray-900 to-gray-800">
        <div className="container mx-auto px-4 lg:px-8">
          <ScrollReveal>
            <div className="text-center max-w-2xl mx-auto">
              <h2 className="font-display text-3xl md:text-4xl font-bold text-white mb-4">
                Siap Tampil Segar Sepanjang Hari?
              </h2>
              <p className="text-gray-400 text-lg mb-8">
                Jelajahi koleksi lengkap produk M.B.K dan temukan solusi perawatan tubuh yang tepat untuk Anda
              </p>
              <Link
                to="/katalog"
                className="inline-flex items-center gap-2 px-8 py-4 bg-red-600 text-white font-semibold rounded-xl hover:bg-red-700 transition-all duration-300 shadow-lg hover:shadow-xl"
              >
                Mulai Jelajahi
                <i className="fas fa-arrow-right"></i>
              </Link>
            </div>
          </ScrollReveal>
        </div>
      </section>
    </div>
  )
}

export default Home
