import { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import ProductCard from '../components/ProductCard'
import { getHomepageData } from '../services/api'
import { 
  LetterReveal, 
  WordReveal, 
  AnimatedCounter,
  FloatingElement,
  ScrollProgress,
  ScrollReveal
} from '../components/AnimatedComponents'
import TextType from '../components/TextType'
import Stack from '../components/Stack'
import { useScrollReveal } from '../hooks/useScrollReveal.jsx'
import './Home.css'

function Home() {
  // Dummy data for demo/development
  const getDummyData = () => ({
    featured_products: [
      { id: 1, name: 'MBK Deodorant Roll On Pink (Women)', slug: 'mbk-deodorant-roll-on-pink', price_formatted: 'Rp 15.000', category_name: 'Deodorant Roll On', featured: true, image_url: null },
      { id: 2, name: 'MBK P.O. Powder Silver Sachet', slug: 'mbk-po-powder-silver-sachet', price_formatted: 'Rp 35.000', category_name: 'P.O. Powder', featured: true, image_url: null },
      { id: 3, name: 'MBK Deodorant Roll On Black (Men)', slug: 'mbk-deodorant-roll-on-black', price_formatted: 'Rp 15.000', category_name: 'Deodorant Roll On', featured: true, image_url: null },
      { id: 4, name: 'MBK P.O. Powder Putih Tin', slug: 'mbk-po-powder-putih-tin', price_formatted: 'Rp 14.000', category_name: 'P.O. Powder', featured: true, image_url: null },
    ],
    latest_products: [
      { id: 1, name: 'MBK Deodorant Roll On Pink (Women)', slug: 'mbk-deodorant-roll-on-pink', price_formatted: 'Rp 15.000', category_name: 'Deodorant Roll On', image_url: null },
      { id: 2, name: 'MBK Deodorant Roll On Purple (Women)', slug: 'mbk-deodorant-roll-on-purple', price_formatted: 'Rp 15.000', category_name: 'Deodorant Roll On', image_url: null },
      { id: 3, name: 'MBK P.O. Powder Silver Sachet', slug: 'mbk-po-powder-silver-sachet', price_formatted: 'Rp 35.000', category_name: 'P.O. Powder', image_url: null },
      { id: 4, name: 'MBK Bedak Biang Keringat Biru', slug: 'mbk-bedak-biang-keringat-biru', price_formatted: 'Rp 9.000', category_name: 'Bedak Biang Keringat', image_url: null },
    ],
    categories: [
      { id: 1, name: 'Deodorant Roll On', slug: 'deodorant-roll-on', product_count: 4 },
      { id: 2, name: 'P.O. Powder', slug: 'po-powder', product_count: 4 },
      { id: 3, name: 'Bedak Biang Keringat', slug: 'bedak-biang-keringat', product_count: 4 },
      { id: 4, name: 'Body Mist', slug: 'body-mist', product_count: 1 },
      { id: 5, name: 'Body Lotion', slug: 'body-lotion', product_count: 1 },
    ],
    inspirations: [
      { id: 1, title: 'Tips Mengatasi Bau Badan', slug: 'tips-mengatasi-bau-badan', content: 'Gunakan deodorant secara teratur dan bedak tabur untuk menyerap keringat berlebih.' },
      { id: 2, title: 'Manfaat Bedak Tabur untuk Tubuh', slug: 'manfaat-bedak-tabur', content: 'Bedak tabur membantu menjaga kulit tetap kering dan memberikan aroma harum.' },
      { id: 3, title: 'Cara Memilih Deodorant yang Tepat', slug: 'cara-memilih-deodorant', content: 'Pilih deodorant yang sesuai dengan jenis kulit dan aktivitas Anda.' },
    ],
    stats: { total_products: 14, total_categories: 5 },
    settings: {
      site_name: 'Hibiscus Efsya',
      site_tagline: 'Part of M.B.K Indonesia',
      hero_subtitle: '✦ part of M.B.K Indonesia ✦ Deodorant Roll On ✦ P.O. Powder ✦ Bedak Biang Keringat ✦ Halal & Berkualitas',
      hero_description: 'Produk perawatan tubuh berkualitas untuk menjaga kesegaran dan kebersihan Anda. Deodorant dan bedak tabur yang efektif mengatasi bau badan.',
      about_title: 'Tentang Kami',
      about_content: 'M.B.K Indonesia adalah produsen produk kosmetik perawatan tubuh yang telah dipercaya masyarakat Indonesia.'
    },
    hero_images: [
      'https://api.hibiscusefsya.com/uploads/products/default1.jpg',
      'https://api.hibiscusefsya.com/uploads/products/default2.jpg',
      'https://api.hibiscusefsya.com/uploads/products/default3.jpg',
      'https://api.hibiscusefsya.com/uploads/products/default4.jpg'
    ]
  })

  const [data, setData] = useState(getDummyData())
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  
  // Public logo path (place file in katalog/public/logo.png)
  const logoSrc = `${import.meta.env.BASE_URL}logo.png`
  
  // Scroll reveal refs
  const heroRef = useScrollReveal()
  const categoriesRef = useScrollReveal({ threshold: 0.2 })
  const featuredRef = useScrollReveal({ threshold: 0.1 })
  const benefitsRef = useScrollReveal({ threshold: 0.2 })
  const aboutRef = useScrollReveal({ threshold: 0.2 })
  const inspirationRef = useScrollReveal({ threshold: 0.2 })
  const ctaRef = useScrollReveal({ threshold: 0.3 })

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      const response = await getHomepageData()
      if (response && response.data) {
        setData(response.data)
      }
    } catch (err) {
      console.log('Using dummy data due to API error')
      // Keep using dummy data already set
    }
  }

  // Helper function to parse hero_subtitle into array for TextType component
  const getHeroSubtitleArray = () => {
    const subtitle = data?.settings?.hero_subtitle || ''
    const parts = subtitle.split(/[,;✦]+/).map(s => s.trim()).filter(s => s)
    return parts.length > 0 ? parts : ['Part of M.B.K Indonesia', 'Deodorant Roll On', 'P.O. Powder']
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
            <span className="hero-badge animate-fadeIn">✨ Kosmetik & Perawatan Tubuh</span>
            <h1 className="hero-title">
              <LetterReveal text={data?.settings?.site_name || "Hibiscus Efsya"} className="text-display" delay={50} />
            </h1>
            <div className="hero-marquee">
              <TextType 
                text={getHeroSubtitleArray()}
                typingSpeed={75}
                pauseDuration={2000}
                deletingSpeed={40}
                showCursor={true}
                cursorCharacter="|"
                className="hero-subtitle-marquee"
              />
            </div>
            <p className="hero-desc animate-fadeInUp">
              <WordReveal 
                text={data?.settings?.hero_description || "Produk perawatan tubuh berkualitas untuk menjaga kesegaran dan kebersihan Anda. Deodorant dan bedak tabur yang efektif mengatasi bau badan."}
                delay={80}
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
            <div className="hero-stack-wrapper">
              <Stack
                randomRotation={true}
                sensitivity={180}
                sendToBackOnClick={true}
                autoplay={true}
                autoplayDelay={3000}
                pauseOnHover={true}
                cards={(data?.hero_images || data?.featured_products?.slice(0, 4) || []).map((item, i) => {
                  const imgSrc = typeof item === 'string' 
                    ? item 
                    : (item?.image_url || `${logoSrc}`)
                  return (
                    <img 
                      key={i} 
                      src={imgSrc} 
                      alt={`Product ${i + 1}`} 
                      style={{ 
                        width: '100%', 
                        height: '100%', 
                        objectFit: 'cover',
                        backgroundColor: '#f5f5f5'
                      }} 
                      onError={(e) => { e.target.src = logoSrc }}
                    />
                  )
                })}
              />
            </div>
            <div className="hero-stats animate-scaleIn" style={{ animationDelay: '0.8s' }}>
              <div className="stat-item">
                <span className="stat-number">
                  <AnimatedCounter target={data?.stats?.total_products || 14} duration={2000} />+
                </span>
                <span className="stat-label">Produk</span>
              </div>
              <div className="stat-item">
                <span className="stat-number">
                  <AnimatedCounter target={data?.stats?.total_categories || 5} duration={1500} />
                </span>
                <span className="stat-label">Kategori</span>
              </div>
            </div>
          </div>
        </div>
        
        {/* Decorative floating elements */}
        <div className="hero-decorations">
          <FloatingElement amplitude={20} duration={5}>
            <span className="deco-flower deco-1">✨</span>
          </FloatingElement>
          <FloatingElement amplitude={15} duration={6}>
            <span className="deco-flower deco-2">💫</span>
          </FloatingElement>
          <FloatingElement amplitude={25} duration={4}>
            <span className="deco-flower deco-3">🌟</span>
          </FloatingElement>
        </div>
      </section>

      {/* Categories Section */}
      <section className="section categories-section" id="categories" ref={categoriesRef}>
        <div className="container">
          <div className="section-header reveal-fade">
            <h2><LetterReveal text="Kategori Produk" delay={40} /></h2>
            <p>Temukan berbagai produk perawatan tubuh untuk kesegaran Anda</p>
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
                    {category.slug === 'deodorant-roll-on' && (
                      <img src={logoSrc} alt="Hibiscus Efsya" style={{ width: 48, height: 48, objectFit: 'contain' }} />
                    )}
                    {category.slug === 'po-powder' && '✨'}
                    {category.slug === 'bedak-biang-keringat' && '💫'}
                    {category.slug === 'body-mist' && '🌸'}
                    {category.slug === 'body-lotion' && (
                      <img src={logoSrc} alt="Hibiscus Efsya" style={{ width: 48, height: 48, objectFit: 'contain' }} />
                    )}
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
            <h2><LetterReveal text="Produk Unggulan" delay={40} /></h2>
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
              { icon: '✅', title: 'Halal & Aman', desc: 'Produk bersertifikat halal MUI dan aman untuk kulit' },
              { icon: '💪', title: 'Tahan Lama', desc: 'Perlindungan hingga 24 jam dari bau badan' },
              { icon: '🌿', title: 'Bahan Berkualitas', desc: 'Terbuat dari tawas, talc, dan parfum pilihan' },
              { icon: '💰', title: 'Harga Terjangkau', desc: 'Kualitas premium dengan harga ekonomis' }
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
              <h2><LetterReveal text="Inspirasi" delay={50} /></h2>
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

      {/* About Section */}
      <section className="section about-section" id="about" ref={aboutRef}>
        <div className="container">
          <div className="about-content reveal-fade">
            <div className="about-text">
              <h2><LetterReveal text={data?.settings?.about_title || "Tentang Kami"} delay={40} /></h2>
              <p className="about-desc">
                <WordReveal 
                  text={data?.settings?.about_content || "M.B.K Indonesia adalah produsen produk kosmetik perawatan tubuh yang telah dipercaya masyarakat Indonesia."}
                  delay={50}
                />
              </p>
            </div>
            <div className="about-features">
              <div className="about-feature">
                <span className="feature-icon">🏭</span>
                <span>Produksi Indonesia</span>
              </div>
              <div className="about-feature">
                <span className="feature-icon">✅</span>
                <span>Bersertifikat Halal</span>
              </div>
              <div className="about-feature">
                <span className="feature-icon">🛡️</span>
                <span>BPOM Approved</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="section cta-section" ref={ctaRef}>
        <div className="container">
          <div className="cta-content reveal-fade">
            <h2><LetterReveal text="Siap Tampil Segar Sepanjang Hari?" delay={30} /></h2>
            <p>Jelajahi koleksi lengkap produk M.B.K dan temukan solusi perawatan tubuh yang tepat untuk Anda</p>
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
