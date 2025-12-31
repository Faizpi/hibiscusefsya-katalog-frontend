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
import Squares from '../components/Squares'
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
        <div className="hero-bg">
          <Squares 
            speed={0.3} 
            squareSize={50}
            direction='diagonal'
            borderColor='rgba(220, 38, 38, 0.08)'
            hoverFillColor='rgba(220, 38, 38, 0.1)'
          />
        </div>
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
            <span className="deco-flower deco-1"></span>
          </FloatingElement>
          <FloatingElement amplitude={15} duration={6}>
            <span className="deco-flower deco-2"></span>
          </FloatingElement>
          <FloatingElement amplitude={25} duration={4}>
            <span className="deco-flower deco-3"></span>
          </FloatingElement>
        </div>
      </section>

      {/* Categories Section */}
      <section className="section categories-section" id="categories" ref={categoriesRef}>
        <div className="container">
          <div className="section-header">
            <ScrollReveal animation="fadeInUp">
              <h2><LetterReveal text="Kategori Produk" delay={40} /></h2>
            </ScrollReveal>
            <ScrollReveal animation="fadeInUp" delay={200}>
              <p>Temukan berbagai produk perawatan tubuh untuk kesegaran Anda</p>
            </ScrollReveal>
          </div>
          <div className="categories-grid">
            {data?.categories?.map((category, index) => {
              // Clean outline icons like AZKO style
              const getCategoryIcon = (slug) => {
                switch(slug) {
                  case 'deodorant-roll-on':
                    return (
                      <svg viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                        <rect x="16" y="8" width="16" height="32" rx="4"/>
                        <circle cx="24" cy="36" r="3"/>
                        <rect x="18" y="12" width="12" height="8" rx="2"/>
                        <ellipse cx="24" cy="6" rx="4" ry="2"/>
                      </svg>
                    );
                  case 'po-powder':
                    return (
                      <svg viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="24" cy="28" r="14"/>
                        <ellipse cx="24" cy="16" rx="10" ry="4"/>
                        <line x1="14" y1="16" x2="14" y2="28"/>
                        <line x1="34" y1="16" x2="34" y2="28"/>
                        <circle cx="24" cy="28" r="6" strokeDasharray="2 2"/>
                      </svg>
                    );
                  case 'bedak-biang-keringat':
                    return (
                      <svg viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                        <rect x="14" y="16" width="20" height="26" rx="3"/>
                        <rect x="18" y="8" width="12" height="10" rx="2"/>
                        <circle cx="24" cy="12" r="2"/>
                        <circle cx="20" cy="28" r="1.5"/>
                        <circle cx="28" cy="28" r="1.5"/>
                        <circle cx="24" cy="32" r="1.5"/>
                        <circle cx="20" cy="36" r="1.5"/>
                        <circle cx="28" cy="36" r="1.5"/>
                      </svg>
                    );
                  case 'body-mist':
                    return (
                      <svg viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M18 16v24a4 4 0 004 4h4a4 4 0 004-4V16"/>
                        <rect x="20" y="8" width="8" height="8" rx="1"/>
                        <line x1="24" y1="4" x2="24" y2="8"/>
                        <path d="M12 10c-2-2-2-6 0-8" strokeWidth="1"/>
                        <path d="M36 10c2-2 2-6 0-8" strokeWidth="1"/>
                        <path d="M10 16c-2-2-2-6 0-8" strokeWidth="1"/>
                        <path d="M38 16c2-2 2-6 0-8" strokeWidth="1"/>
                      </svg>
                    );
                  case 'body-lotion':
                    return (
                      <svg viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M16 18v22a4 4 0 004 4h8a4 4 0 004-4V18"/>
                        <rect x="20" y="8" width="8" height="10" rx="2"/>
                        <path d="M16 18h16"/>
                        <path d="M20 28c2 3 6 3 8 0"/>
                        <circle cx="24" cy="36" r="2"/>
                      </svg>
                    );
                  default:
                    return (
                      <svg viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="24" cy="24" r="16"/>
                        <path d="M24 12l3 8h8l-6 5 2 8-7-5-7 5 2-8-6-5h8z"/>
                      </svg>
                    );
                }
              };

              return (
                <ScrollReveal 
                  key={category.id} 
                  animation={['fadeInUp', 'fadeInLeft', 'fadeInRight', 'zoomIn', 'fadeInUp'][index % 5]} 
                  delay={index * 100}
                >
                  <Link 
                    to={`/katalog/${category.slug}`}
                    className="category-card hover-lift"
                  >
                    <FloatingElement amplitude={5} duration={3 + index * 0.5}>
                      <div className="category-icon">
                        {getCategoryIcon(category.slug)}
                      </div>
                    </FloatingElement>
                    <h3>{category.name}</h3>
                    <span className="category-count">{category.product_count} produk</span>
                  </Link>
                </ScrollReveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="section featured-section" id="featured" ref={featuredRef}>
        <div className="container">
          <div className="section-header">
            <ScrollReveal animation="fadeInUp">
              <h2><LetterReveal text="Produk Unggulan" delay={40} /></h2>
            </ScrollReveal>
            <ScrollReveal animation="fadeInUp" delay={200}>
              <p>Pilihan terbaik yang paling diminati</p>
            </ScrollReveal>
          </div>
          <div className="products-grid">
            {data?.featured_products?.map((product, index) => (
              <ScrollReveal 
                key={product.id} 
                animation={['fadeInLeft', 'fadeInUp', 'fadeInUp', 'fadeInRight'][index % 4]} 
                delay={index * 100}
                style={{ display: 'flex', flexDirection: 'column' }}
              >
                <ProductCard product={product} />
              </ScrollReveal>
            ))}
          </div>
          <ScrollReveal animation="fadeInUp" delay={400}>
            <div className="section-footer">
              <Link to="/katalog" className="btn btn-primary shine">
                Lihat Semua Produk
              </Link>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="section benefits-section" ref={benefitsRef}>
        <div className="container">
          <div className="benefits-grid">
            {[
              { 
                icon: '✅', 
                title: 'Halal & Aman', 
                desc: 'Produk bersertifikat halal MUI dan aman untuk kulit' 
              },
              { 
                icon: '⏱️', 
                title: 'Tahan Lama', 
                desc: 'Perlindungan hingga 24 jam dari bau badan' 
              },
              { 
                icon: '🌿', 
                title: 'Bahan Berkualitas', 
                desc: 'Dari bahan premium berkualitas pilihan' 
              },
              { 
                icon: '💰', 
                title: 'Harga Terjangkau', 
                desc: 'Kualitas premium dengan harga ekonomis' 
              }
            ].map((benefit, index) => (
              <ScrollReveal 
                key={index} 
                animation={['fadeInLeft', 'fadeInUp', 'fadeInUp', 'fadeInRight'][index % 4]} 
                delay={index * 100}
              >
                <div className="benefit-card hover-lift">
                  <FloatingElement amplitude={8} duration={3 + index * 0.3}>
                    <div className="benefit-icon">{benefit.icon}</div>
                  </FloatingElement>
                  <h4>{benefit.title}</h4>
                  <p>{benefit.desc}</p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Tips & Artikel Section */}
      {data?.inspirations?.length > 0 && (
        <section className="section inspiration-section" id="artikel" ref={inspirationRef}>
          <div className="container">
            <div className="section-header">
              <ScrollReveal animation="fadeInUp">
                <h2><LetterReveal text="Tips & Artikel" delay={50} /></h2>
              </ScrollReveal>
              <ScrollReveal animation="fadeInUp" delay={200}>
                <p>Panduan dan informasi seputar perawatan tubuh</p>
              </ScrollReveal>
            </div>
            <div className="inspiration-grid">
              {data.inspirations.map((item, index) => {
                // Use image_url from API, fallback to static images
                const getInspirationImage = (item) => {
                  if (item.image_url) {
                    return item.image_url
                  }
                  // Fallback to static images based on slug
                  switch(item.slug) {
                    case 'tips-mengatasi-bau-badan':
                      return `${import.meta.env.BASE_URL}tips1.jpg`
                    case 'manfaat-bedak-tabur':
                      return `${import.meta.env.BASE_URL}tips2.jpg`
                    case 'cara-memilih-deodorant':
                      return `${import.meta.env.BASE_URL}tips4.webp`
                    default:
                      return `${import.meta.env.BASE_URL}tips1.jpg`
                  }
                }
                const imageSrc = getInspirationImage(item)
                
                return (
                  <ScrollReveal 
                    key={item.id} 
                    animation={['fadeInLeft', 'fadeInUp', 'fadeInRight'][index % 3]} 
                    delay={index * 150}
                  >
                    <Link to={`/artikel/${item.slug}`} className="inspiration-card hover-lift">
                      <div className="inspiration-image shine">
                        <img 
                          src={imageSrc} 
                          alt={item.title}
                          onError={(e) => { e.target.src = logoSrc }}
                        />
                      </div>
                      <div className="inspiration-content">
                        <h4>{item.title}</h4>
                        <p>{item.preview_text || item.excerpt || item.content}</p>
                        <span className="inspiration-link">
                          Baca Selengkapnya
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M5 12h14M12 5l7 7-7 7"/>
                          </svg>
                        </span>
                      </div>
                    </Link>
                  </ScrollReveal>
                )
              })}
            </div>
          </div>
        </section>
      )}

      {/* About Section */}
      <section className="section about-section" id="about" ref={aboutRef}>
        <div className="container">
          <div className="about-content">
            <ScrollReveal animation="fadeInLeft">
              <div className="about-text">
                <h2><LetterReveal text={data?.settings?.about_title || "Tentang Kami"} delay={40} /></h2>
                <p className="about-desc">
                  <WordReveal 
                    text={data?.settings?.about_content || "M.B.K Indonesia adalah produsen produk kosmetik perawatan tubuh yang telah dipercaya masyarakat Indonesia."}
                    delay={50}
                  />
                </p>
              </div>
            </ScrollReveal>
            <div className="about-features">
              {[
                { 
                  icon: (
                    <img src={`${import.meta.env.BASE_URL}about1.jpg`} alt="Produksi Indonesia" />
                  ), 
                  text: 'Produksi Indonesia' 
                },
                { 
                  icon: (
                    <img src={`${import.meta.env.BASE_URL}about2.svg`} alt="Sertifikat Halal" className="halal-icon" />
                  ), 
                  text: 'Bersertifikat Halal' 
                },
                { 
                  icon: (
                    <img src={`${import.meta.env.BASE_URL}about3.svg`} alt="BPOM" />
                  ), 
                  text: 'BPOM Approved' 
                }
              ].map((feature, index) => (
                <ScrollReveal key={index} animation={['fadeInUp', 'zoomIn', 'fadeInRight'][index % 3]} delay={index * 150}>
                  <div className="about-feature hover-lift">
                    <div className="feature-icon">
                      {feature.icon}
                    </div>
                    <span className="feature-text">{feature.text}</span>
                  </div>
                </ScrollReveal>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="section cta-section" ref={ctaRef}>
        <div className="container">
          <div className="cta-content">
            <ScrollReveal animation="zoomIn">
              <h2><LetterReveal text="Siap Tampil Segar Sepanjang Hari?" delay={30} /></h2>
            </ScrollReveal>
            <ScrollReveal animation="fadeInUp" delay={200}>
              <p>Jelajahi koleksi lengkap produk M.B.K dan temukan solusi perawatan tubuh yang tepat untuk Anda</p>
            </ScrollReveal>
            <ScrollReveal animation="fadeInUp" delay={400}>
              <Link to="/katalog" className="btn btn-primary btn-lg shine ripple">
                Mulai Jelajahi
              </Link>
            </ScrollReveal>
          </div>
        </div>
      </section>
    </div>
  )
}

export default Home
