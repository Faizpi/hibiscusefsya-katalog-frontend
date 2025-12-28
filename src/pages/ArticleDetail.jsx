import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { getHomepageData } from '../services/api'
import { 
  LetterReveal, 
  WordReveal,
  ScrollReveal 
} from '../components/AnimatedComponents'
import './ArticleDetail.css'

function ArticleDetail() {
  const { slug } = useParams()
  const [article, setArticle] = useState(null)
  const [relatedArticles, setRelatedArticles] = useState([])
  const [loading, setLoading] = useState(true)

  // Dummy articles data for fallback
  const dummyArticles = [
    { 
      id: 1, 
      title: 'Tips Mengatasi Bau Badan', 
      slug: 'tips-mengatasi-bau-badan', 
      content: 'Gunakan deodorant secara teratur dan bedak tabur untuk menyerap keringat berlebih.',
      image: 'tips1.jpg',
      fullContent: `
        <h3>Mengapa Bau Badan Terjadi?</h3>
        <p>Bau badan disebabkan oleh bakteri yang berkembang di area lembab tubuh. Keringat sendiri sebenarnya tidak berbau, namun ketika bercampur dengan bakteri di kulit, bau tidak sedap pun muncul.</p>
        
        <h3>Tips Efektif Mengatasi Bau Badan</h3>
        <ol>
          <li><strong>Mandi secara teratur</strong> - Mandi minimal 2 kali sehari, terutama setelah beraktivitas yang mengeluarkan keringat.</li>
          <li><strong>Gunakan deodorant</strong> - Pilih deodorant yang sesuai dengan jenis kulit Anda. Deodorant M.B.K tersedia dalam berbagai varian untuk pria dan wanita.</li>
          <li><strong>Pakai bedak tabur</strong> - Bedak tabur membantu menyerap keringat berlebih dan menjaga kulit tetap kering.</li>
          <li><strong>Pilih pakaian yang tepat</strong> - Gunakan pakaian berbahan katun yang menyerap keringat dengan baik.</li>
          <li><strong>Perhatikan pola makan</strong> - Kurangi makanan berbau menyengat seperti bawang putih dan makanan pedas.</li>
        </ol>
        
        <h3>Produk Rekomendasi</h3>
        <p>M.B.K Indonesia menyediakan berbagai produk perawatan tubuh yang efektif mengatasi bau badan:</p>
        <ul>
          <li>MBK Deodorant Roll On - Perlindungan hingga 24 jam</li>
          <li>MBK P.O. Powder - Bedak tabur dengan aroma segar</li>
          <li>MBK Bedak Biang Keringat - Menyerap keringat berlebih</li>
        </ul>
      `
    },
    { 
      id: 2, 
      title: 'Manfaat Bedak Tabur untuk Tubuh', 
      slug: 'manfaat-bedak-tabur', 
      content: 'Bedak tabur membantu menjaga kulit tetap kering dan memberikan aroma harum.',
      image: 'tips2.jpg',
      fullContent: `
        <h3>Apa Itu Bedak Tabur?</h3>
        <p>Bedak tabur adalah produk perawatan tubuh dalam bentuk serbuk halus yang diaplikasikan pada kulit untuk berbagai manfaat. Bedak tabur M.B.K terbuat dari bahan berkualitas yang aman untuk semua jenis kulit.</p>
        
        <h3>Manfaat Utama Bedak Tabur</h3>
        <ol>
          <li><strong>Menyerap keringat</strong> - Bedak tabur efektif menyerap keringat berlebih, menjaga kulit tetap kering sepanjang hari.</li>
          <li><strong>Memberikan aroma segar</strong> - Dengan parfum pilihan, bedak tabur memberikan keharuman yang tahan lama.</li>
          <li><strong>Mencegah iritasi</strong> - Membantu mengurangi gesekan kulit yang dapat menyebabkan iritasi.</li>
          <li><strong>Menjaga kelembutan kulit</strong> - Tekstur halus bedak membuat kulit terasa lebih lembut.</li>
          <li><strong>Cocok untuk semua usia</strong> - Aman digunakan dari bayi hingga dewasa.</li>
        </ol>
        
        <h3>Cara Penggunaan yang Benar</h3>
        <p>Untuk hasil maksimal, gunakan bedak tabur setelah mandi saat kulit sudah kering. Aplikasikan secara merata pada area yang mudah berkeringat seperti ketiak, leher, dan lipatan kulit.</p>
        
        <h3>Pilihan Produk M.B.K</h3>
        <ul>
          <li>MBK P.O. Powder Silver Sachet - Praktis dibawa bepergian</li>
          <li>MBK P.O. Powder Putih Tin - Kemasan ekonomis untuk keluarga</li>
          <li>MBK Bedak Biang Keringat - Khusus untuk kulit sensitif</li>
        </ul>
      `
    },
    { 
      id: 3, 
      title: 'Cara Memilih Deodorant yang Tepat', 
      slug: 'cara-memilih-deodorant', 
      content: 'Pilih deodorant yang sesuai dengan jenis kulit dan aktivitas Anda.',
      image: 'tips4.webp',
      fullContent: `
        <h3>Pentingnya Memilih Deodorant yang Tepat</h3>
        <p>Tidak semua deodorant cocok untuk semua orang. Memilih deodorant yang tepat sangat penting untuk kenyamanan dan efektivitas perlindungan terhadap bau badan.</p>
        
        <h3>Faktor yang Perlu Dipertimbangkan</h3>
        <ol>
          <li><strong>Jenis kulit</strong> - Kulit sensitif memerlukan deodorant dengan formula lembut tanpa alkohol.</li>
          <li><strong>Tingkat aktivitas</strong> - Aktivitas berat memerlukan deodorant dengan perlindungan ekstra.</li>
          <li><strong>Preferensi aroma</strong> - Pilih aroma yang sesuai dengan kepribadian Anda.</li>
          <li><strong>Bentuk produk</strong> - Roll-on, stick, atau spray - pilih yang paling nyaman digunakan.</li>
        </ol>
        
        <h3>Mengapa Memilih MBK Deodorant Roll On?</h3>
        <ul>
          <li><strong>Formula aman</strong> - Bersertifikat halal dan telah teruji dermatologis</li>
          <li><strong>Perlindungan 24 jam</strong> - Efektif mencegah bau badan sepanjang hari</li>
          <li><strong>Tidak meninggalkan noda</strong> - Aman untuk pakaian berwarna</li>
          <li><strong>Varian lengkap</strong> - Tersedia untuk pria dan wanita dengan berbagai aroma</li>
        </ul>
        
        <h3>Tips Penggunaan</h3>
        <p>Aplikasikan deodorant pada kulit ketiak yang bersih dan kering. Untuk hasil terbaik, gunakan setelah mandi dan sebelum tidur agar formula bekerja optimal saat tubuh beristirahat.</p>
      `
    }
  ]

  useEffect(() => {
    fetchArticle()
  }, [slug])

  const fetchArticle = async () => {
    setLoading(true)
    try {
      const response = await getHomepageData()
      if (response && response.data && response.data.inspirations) {
        const inspirations = response.data.inspirations
        const found = inspirations.find(item => item.slug === slug)
        
        if (found) {
          // Merge with dummy data for full content
          const dummyMatch = dummyArticles.find(d => d.slug === slug)
          setArticle({
            ...found,
            image: dummyMatch?.image || 'tips1.jpg',
            fullContent: dummyMatch?.fullContent || `<p>${found.content}</p>`
          })
          setRelatedArticles(inspirations.filter(item => item.slug !== slug).slice(0, 2))
        } else {
          // Use dummy data
          const dummyMatch = dummyArticles.find(d => d.slug === slug)
          if (dummyMatch) {
            setArticle(dummyMatch)
            setRelatedArticles(dummyArticles.filter(d => d.slug !== slug).slice(0, 2))
          }
        }
      } else {
        // Use dummy data
        const dummyMatch = dummyArticles.find(d => d.slug === slug)
        if (dummyMatch) {
          setArticle(dummyMatch)
          setRelatedArticles(dummyArticles.filter(d => d.slug !== slug).slice(0, 2))
        }
      }
    } catch (err) {
      // Fallback to dummy
      const dummyMatch = dummyArticles.find(d => d.slug === slug)
      if (dummyMatch) {
        setArticle(dummyMatch)
        setRelatedArticles(dummyArticles.filter(d => d.slug !== slug).slice(0, 2))
      }
    }
    setLoading(false)
  }

  // Helper to get image path
  const getImagePath = (imageName) => {
    return `${import.meta.env.BASE_URL}${imageName}`
  }

  if (loading) {
    return (
      <div className="article-detail">
        <div className="container">
          <div className="article-loading">
            <div className="loading-spinner"></div>
            <p>Memuat artikel...</p>
          </div>
        </div>
      </div>
    )
  }

  if (!article) {
    return (
      <div className="article-detail">
        <div className="container">
          <div className="article-not-found">
            <h2>Artikel Tidak Ditemukan</h2>
            <p>Maaf, artikel yang Anda cari tidak tersedia.</p>
            <Link to="/" className="btn btn-primary">Kembali ke Beranda</Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="article-detail">
      {/* Hero Section */}
      <section className="article-hero">
        <div className="article-hero-image">
          <img 
            src={getImagePath(article.image)} 
            alt={article.title}
            onError={(e) => { e.target.src = getImagePath('logo.png') }}
          />
          <div className="article-hero-overlay"></div>
        </div>
        <div className="container">
          <div className="article-hero-content">
            <Link to="/#inspirasi" className="article-breadcrumb">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M19 12H5M12 19l-7-7 7-7"/>
              </svg>
              Kembali ke Inspirasi
            </Link>
            <ScrollReveal animation="fadeInUp">
              <h1><LetterReveal text={article.title} delay={30} /></h1>
            </ScrollReveal>
            <ScrollReveal animation="fadeInUp" delay={200}>
              <p className="article-excerpt">{article.content}</p>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* Article Content */}
      <section className="article-content-section">
        <div className="container">
          <ScrollReveal animation="fadeInUp">
            <div 
              className="article-body"
              dangerouslySetInnerHTML={{ __html: article.fullContent }}
            />
          </ScrollReveal>

          {/* CTA Section */}
          <ScrollReveal animation="fadeInUp" delay={200}>
            <div className="article-cta">
              <h3>Tertarik dengan Produk Kami?</h3>
              <p>Jelajahi koleksi lengkap produk perawatan tubuh M.B.K Indonesia</p>
              <Link to="/katalog" className="btn btn-primary btn-lg shine">
                Lihat Katalog Produk
              </Link>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* Related Articles */}
      {relatedArticles.length > 0 && (
        <section className="related-articles-section">
          <div className="container">
            <ScrollReveal animation="fadeInUp">
              <h2>Artikel Lainnya</h2>
            </ScrollReveal>
            <div className="related-articles-grid">
              {relatedArticles.map((item, index) => {
                const dummyMatch = dummyArticles.find(d => d.slug === item.slug)
                const itemImage = dummyMatch?.image || 'tips1.jpg'
                
                return (
                  <ScrollReveal key={item.id} animation="fadeInUp" delay={index * 150}>
                    <Link to={`/artikel/${item.slug}`} className="related-article-card hover-lift">
                      <div className="related-article-image">
                        <img 
                          src={getImagePath(itemImage)} 
                          alt={item.title}
                          onError={(e) => { e.target.src = getImagePath('logo.png') }}
                        />
                      </div>
                      <div className="related-article-content">
                        <h4>{item.title}</h4>
                        <p>{item.content}</p>
                        <span className="read-more">
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
    </div>
  )
}

export default ArticleDetail
