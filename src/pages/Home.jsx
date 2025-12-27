import { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import ProductCard from '../components/ProductCard'
import { getHomepageData } from '../services/api'
import { 
  MarqueeText, 
  LetterReveal, 
  WordReveal, 
  AnimatedCounter,
  FloatingElement,
  ScrollProgress 
} from '../components/AnimatedComponents'
import { useScrollReveal } from '../hooks/useScrollReveal.jsx'
import './Home.css'

function Home() {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  
  // Scroll reveal refs
  const heroRef = useScrollReveal()
  const categoriesRef = useScrollReveal({ threshold: 0.2 })
  const featuredRef = useScrollReveal({ threshold: 0.1 })
  const benefitsRef = useScrollReveal({ threshold: 0.2 })
  const inspirationRef = useScrollReveal({ threshold: 0.2 })
  const ctaRef = useScrollReveal({ threshold: 0.3 })

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      setLoading(true)
      const response = await getHomepageData()
      setData(response.data)
    } catch (err) {
      setError('Gagal memuat data')
      // Use dummy data for demo
      setData(getDummyData())
    } finally {
      setLoading(false)
    }
  }

  // Dummy data for demo/development
  const getDummyData = () => ({
    featured_products: [
      { id: 1, name: 'Rose Elegance Bouquet', slug: 'rose-elegance-bouquet', price_formatted: 'Rp 350.000', category_name: 'Bouquet', featured: true, image_url: null },
      { id: 2, name: 'Sunflower Joy', slug: 'sunflower-joy', price_formatted: 'Rp 275.000', category_name: 'Bouquet', featured: true, image_url: null },
      { id: 3, name: 'Classic Vas Arrangement', slug: 'classic-vas-arrangement', price_formatted: 'Rp 500.000', category_name: 'Vas Bunga', featured: true, image_url: null },
      { id: 4, name: 'Flower Hampers Gift', slug: 'flower-hampers-gift', price_formatted: 'Rp 750.000', category_name: 'Hampers', featured: true, image_url: null },
    ],
    latest_products: [
      { id: 1, name: 'Rose Elegance Bouquet', slug: 'rose-elegance-bouquet', price_formatted: 'Rp 350.000', category_name: 'Bouquet', image_url: null },
      { id: 2, name: 'Sunflower Joy', slug: 'sunflower-joy', price_formatted: 'Rp 275.000', category_name: 'Bouquet', image_url: null },
      { id: 3, name: 'Lily White Dream', slug: 'lily-white-dream', price_formatted: 'Rp 400.000', category_name: 'Bouquet', image_url: null },
      { id: 4, name: 'Classic Vas Arrangement', slug: 'classic-vas-arrangement', price_formatted: 'Rp 500.000', category_name: 'Vas Bunga', image_url: null },
    ],
    categories: [
      { id: 1, name: 'Bouquet', slug: 'bouquet', product_count: 3 },
      { id: 2, name: 'Vas Bunga', slug: 'vas-bunga', product_count: 1 },
      { id: 3, name: 'Dekorasi', slug: 'dekorasi', product_count: 1 },
      { id: 4, name: 'Hampers', slug: 'hampers', product_count: 1 },
    ],
    inspirations: [
      { id: 1, title: 'Tips Merawat Bunga Potong', slug: 'tips-merawat-bunga-potong', content: 'Bunga potong bisa bertahan lebih lama dengan perawatan yang tepat.' },
      { id: 2, title: 'Makna Warna Bunga', slug: 'makna-warna-bunga', content: 'Setiap warna bunga memiliki makna tersendiri.' },
      { id: 3, title: 'Inspirasi Dekorasi Rumah', slug: 'inspirasi-dekorasi-rumah', content: 'Hadirkan kesegaran dengan rangkaian bunga di sudut ruangan.' },
    ],
    stats: { total_products: 6, total_categories: 4 }
  })

  if (loading) {
    return (
      <div className="loading">
        <div className="loading-spinner"></div>
        <p>Memuat...</p>
      </div>
    )
  }

  return (
    <div className="home">
      {/* Scroll Progress Bar */}
      <ScrollProgress />
      
      {/* Hero Section */}
      <section className="hero" ref={heroRef}>
        <div className="hero-bg"></div>
        <div className="container hero-container">
          <div className="hero-content">
            <span className="hero-badge animate-fadeIn">🌺 Katalog Bunga Premium</span>
            <h1 className="hero-title">
              <LetterReveal text="Hibiscus Efsya" className="text-display" delay={0.05} />
            </h1>
            <div className="hero-marquee">
              <MarqueeText 
                text="✦ part of M.B.K Indonesia ✦ Premium Flower Catalog ✦ Fresh & Beautiful ✦ Elegant Design " 
                speed={25}
                className="hero-subtitle-marquee"
              />
            </div>
            <p className="hero-desc animate-fadeInUp">
              <WordReveal 
                text="Menghadirkan keindahan bunga untuk setiap momen spesial Anda. Rangkaian bunga premium dengan sentuhan elegan dan penuh makna."
                delay={0.03}
              />
            </p>
            <div className="hero-actions animate-fadeInUp" style={{ animationDelay: '0.5s' }}>
              <Link to="/katalog" className="btn btn-primary btn-lg shine ripple">
                <span>Telusuri Katalog</span>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M5 12h14M12 5l7 7-7 7"/>
                </svg>
              </Link>
              <a href="#featured" className="btn btn-outline btn-lg hover-glow">
                Lihat Koleksi
              </a>
            </div>
          </div>
          <div className="hero-visual">
            <FloatingElement amplitude={15} duration={4}>
              <div className="hero-image-wrapper">
                <div className="hero-image-placeholder pulse-subtle">
                  <span>🌺</span>
                </div>
              </div>
            </FloatingElement>
            <div className="hero-stats animate-scaleIn" style={{ animationDelay: '0.8s' }}>
              <div className="stat-item">
                <span className="stat-number">
                  <AnimatedCounter end={data?.stats?.total_products || 6} duration={2000} />+
                </span>
                <span className="stat-label">Produk</span>
              </div>
              <div className="stat-item">
                <span className="stat-number">
                  <AnimatedCounter end={data?.stats?.total_categories || 4} duration={1500} />
                </span>
                <span className="stat-label">Kategori</span>
              </div>
            </div>
          </div>
        </div>
        
        {/* Decorative floating elements */}
        <div className="hero-decorations">
          <FloatingElement amplitude={20} duration={5}>
            <span className="deco-flower deco-1">🌸</span>
          </FloatingElement>
          <FloatingElement amplitude={15} duration={6}>
            <span className="deco-flower deco-2">🌹</span>
          </FloatingElement>
          <FloatingElement amplitude={25} duration={4}>
            <span className="deco-flower deco-3">🌷</span>
          </FloatingElement>
        </div>
      </section>

      {/* Categories Section */}
      <section className="section categories-section" id="about" ref={categoriesRef}>
        <div className="container">
          <div className="section-header reveal-fade">
            <h2><LetterReveal text="Koleksi Kami" delay={0.04} /></h2>
            <p>Temukan berbagai pilihan rangkaian bunga untuk setiap momen</p>
          </div>
          <div className="categories-grid">
            {data?.categories?.map((category, index) => (
              <Link 
                key={category.id} 
                to={`/katalog/${category.slug}`}
                className="category-card hover-lift reveal-item"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <FloatingElement amplitude={5} duration={3 + index * 0.5}>
                  <div className="category-icon">
                    {category.slug === 'bouquet' && '💐'}
                    {category.slug === 'vas-bunga' && '🏺'}
                    {category.slug === 'dekorasi' && '🎀'}
                    {category.slug === 'hampers' && '🎁'}
                  </div>
                </FloatingElement>
                <h3>{category.name}</h3>
                <span className="category-count">{category.product_count} produk</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="section featured-section" id="featured" ref={featuredRef}>
        <div className="container">
          <div className="section-header reveal-fade">
            <h2><LetterReveal text="Produk Unggulan" delay={0.04} /></h2>
            <p>Pilihan terbaik yang paling diminati</p>
          </div>
          <div className="products-grid">
            {data?.featured_products?.map((product, index) => (
              <div key={product.id} className="reveal-item" style={{ animationDelay: `${index * 0.15}s` }}>
                <ProductCard product={product} />
              </div>
            ))}
          </div>
          <div className="section-footer reveal-fade">
            <Link to="/katalog" className="btn btn-primary shine">
              Lihat Semua Produk
            </Link>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="section benefits-section" ref={benefitsRef}>
        <div className="container">
          <div className="benefits-grid">
            {[
              { icon: '✨', title: 'Kualitas Premium', desc: 'Bunga segar pilihan dengan kualitas terbaik' },
              { icon: '🚚', title: 'Pengiriman Cepat', desc: 'Dikirim dengan aman dan tepat waktu' },
              { icon: '🎨', title: 'Desain Eksklusif', desc: 'Rangkaian unik dengan sentuhan artistik' },
              { icon: '💝', title: 'Penuh Makna', desc: 'Setiap rangkaian penuh pesan dan cinta' }
            ].map((benefit, index) => (
              <div 
                key={index} 
                className="benefit-card hover-lift reveal-item"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <FloatingElement amplitude={8} duration={3 + index * 0.3}>
                  <div className="benefit-icon">{benefit.icon}</div>
                </FloatingElement>
                <h4>{benefit.title}</h4>
                <p>{benefit.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Inspiration Section */}
      {data?.inspirations?.length > 0 && (
        <section className="section inspiration-section" ref={inspirationRef}>
          <div className="container">
            <div className="section-header reveal-fade">
              <h2><LetterReveal text="Inspirasi" delay={0.05} /></h2>
              <p>Tips dan ide untuk Anda</p>
            </div>
            <div className="inspiration-grid">
              {data.inspirations.map((item, index) => (
                <div 
                  key={item.id} 
                  className="inspiration-card hover-lift reveal-item"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="inspiration-image shine">
                    <span>📖</span>
                  </div>
                  <div className="inspiration-content">
                    <h4>{item.title}</h4>
                    <p>{item.content}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA Section */}
      <section className="section cta-section" ref={ctaRef}>
        <div className="container">
          <div className="cta-content reveal-fade">
            <h2><LetterReveal text="Siap Menemukan Bunga Sempurna?" delay={0.03} /></h2>
            <p>Jelajahi koleksi lengkap kami dan temukan rangkaian yang tepat untuk momen spesial Anda</p>
            <Link to="/katalog" className="btn btn-primary btn-lg shine ripple">
              Mulai Jelajahi
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}

export default Home
