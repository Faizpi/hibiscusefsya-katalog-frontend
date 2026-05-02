import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import ProductCard from '../components/ProductCard'
import { getProductBySlug, getSettings } from '../services/api'
import './ProductDetail.css'

function ProductDetail() {
  const { slug } = useParams()
  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [whatsappNumber, setWhatsappNumber] = useState('')

  // Logo paths
  const shopeeLogoSrc = `${import.meta.env.BASE_URL}Shopee_logo.svg`
  const tokopediaLogoSrc = `${import.meta.env.BASE_URL}Tokopedia_Mascot.png`
  const whatsappLogoSrc = `${import.meta.env.BASE_URL}whatsapp-logo.svg`

  const defaultWhatsappNumber = '6281234567890'
  const normalizeWhatsapp = (value) => (value || '').toString().replace(/[^0-9]/g, '')

  useEffect(() => {
    fetchProduct()
    fetchContactSettings()
  }, [slug])

  // If product has its own whatsapp number, prefer it over site settings
  useEffect(() => {
    if (product && product.whatsapp) {
      const normalized = normalizeWhatsapp(product.whatsapp)
      if (normalized) setWhatsappNumber(normalized)
    }
  }, [product])

  const fetchProduct = async () => {
    try {
      setLoading(true)
      const response = await getProductBySlug(slug)
      setProduct(response.data)
    } catch (err) {
      setError('Produk tidak ditemukan')
      // Use dummy product for demo
      setProduct({
        id: 1,
        name: 'MBK Deodorant Roll On Pink (Women)',
        slug: 'mbk-deodorant-roll-on-pink',
        description: 'Deodorant roll on khusus wanita dengan warna pink yang feminin. Tahan lama hingga 24 jam, halal, dan aman untuk kulit sensitif. Efektif mencegah bau badan dan menjaga ketiak tetap kering.\n\nKeunggulan:\n- Tahan lama hingga 24 jam\n- Formula halal dan aman\n- Tidak meninggalkan noda di pakaian\n- Aroma lembut dan feminin\n- Cocok untuk kulit sensitif\n\nCara Pakai:\n- Oleskan pada ketiak yang bersih dan kering\n- Gunakan setelah mandi untuk hasil maksimal',
        price: 15000,
        price_formatted: 'Rp 15.000',
        category_name: 'Deodorant Roll On',
        category_slug: 'deodorant-roll-on',
        featured: true,
        image_url: null,
        related_products: [
          { id: 2, name: 'MBK Deodorant Roll On Purple', slug: 'mbk-deodorant-roll-on-purple', price_formatted: 'Rp 15.000', image_url: null },
          { id: 3, name: 'MBK P.O. Powder Silver Sachet', slug: 'mbk-po-powder-silver-sachet', price_formatted: 'Rp 35.000', image_url: null },
        ]
      })
    } finally {
      setLoading(false)
    }
  }

  const fetchContactSettings = async () => {
    try {
      const response = await getSettings()
      const rawWhatsapp = response?.data?.contact?.whatsapp || response?.data?.contact_whatsapp
      const normalizedWhatsapp = normalizeWhatsapp(rawWhatsapp)
      setWhatsappNumber(normalizedWhatsapp || defaultWhatsappNumber)
    } catch (err) {
      setWhatsappNumber(defaultWhatsappNumber)
    }
  }

  const defaultImage = 'https://via.placeholder.com/600x600/FAF8F5/D4A574?text=No+Image'

  if (loading) {
    return (
      <div className="product-detail-page">
        <div className="loading">
          <div className="loading-spinner"></div>
          <p>Memuat produk...</p>
        </div>
      </div>
    )
  }

  if (error && !product) {
    return (
      <div className="product-detail-page">
        <div className="container">
          <div className="error-state">
            <h3>Produk Tidak Ditemukan</h3>
            <p>Maaf, produk yang Anda cari tidak tersedia</p>
            <Link to="/katalog" className="btn btn-primary">
              Kembali ke Katalog
            </Link>
          </div>
        </div>
      </div>
    )
  }

  const whatsappText = product
    ? `Halo, saya tertarik dengan produk ${product.name}${product.price_formatted ? ` (${product.price_formatted})` : ''}`
    : 'Halo, saya tertarik dengan produk Anda'
  const whatsappLink = `https://wa.me/${whatsappNumber || defaultWhatsappNumber}?text=${encodeURIComponent(whatsappText)}`

  return (
    <div className="product-detail-page">
      {/* Breadcrumb */}
      <section className="product-breadcrumb">
        <div className="container">
          <div className="breadcrumb">
            <Link to="/">Beranda</Link>
            <span>/</span>
            <Link to="/katalog">Katalog</Link>
            {product.category_name && (
              <>
                <span>/</span>
                <Link to={`/katalog/${product.category_slug}`}>{product.category_name}</Link>
              </>
            )}
            <span>/</span>
            <span>{product.name}</span>
          </div>
        </div>
      </section>

      {/* Product Detail */}
      <section className="product-detail">
        <div className="container">
          <div className="product-detail-grid">
            {/* Product Image */}
            <div className="product-image-section">
              <div className="product-image-main">
                <img 
                  src={product.image_url || defaultImage} 
                  alt={product.name}
                />
                {product.featured && (
                  <span className="product-badge">Unggulan</span>
                )}
              </div>
            </div>

            {/* Product Info */}
            <div className="product-info-section">
              {product.category_name && (
                <Link to={`/katalog/${product.category_slug}`} className="product-category-link">
                  {product.category_name}
                </Link>
              )}
              
              <h1 className="product-title">{product.name}</h1>
              
              <div className="product-price-box">
                <span className="product-price">{product.price_formatted}</span>
              </div>

              <div className="product-description">
                <h3>Deskripsi Produk</h3>
                <div className="description-content">
                  {product.description?.split('\n').map((line, i) => (
                    <p key={i}>{line || <br />}</p>
                  ))}
                </div>
              </div>

              {/* Contact CTA */}
              <div className="product-cta">
                {/* Marketplace Buttons */}
                {(product.shopee_link || product.tokopedia_link) && (
                  <div className="product-marketplace-buttons">
                    {product.shopee_link && (
                      <a 
                        href={product.shopee_link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn btn-marketplace btn-shopee"
                      >
                        <img src={shopeeLogoSrc} alt="Shopee" />
                        Beli di Shopee
                      </a>
                    )}
                    {product.tokopedia_link && (
                      <a 
                        href={product.tokopedia_link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn btn-marketplace btn-tokopedia"
                      >
                        <img src={tokopediaLogoSrc} alt="Tokopedia" />
                        Beli di Tokopedia
                      </a>
                    )}
                  </div>
                )}
                <a 
                  href={whatsappLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-primary btn-lg btn-whatsapp"
                >
                  <img className="whatsapp-logo" src={whatsappLogoSrc} alt="WhatsApp" />
                  Hubungi via WhatsApp
                </a>
                <Link to="/katalog" className="btn btn-outline btn-lg">
                  Lihat Produk Lain
                </Link>
              </div>

              {/* Product Meta */}
              <div className="product-meta">
                <div className="meta-item">
                  <span className="meta-label">Kategori:</span>
                  <Link to={`/katalog/${product.category_slug}`}>{product.category_name}</Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Related Products */}
      {product.related_products?.length > 0 && (
        <section className="related-products section">
          <div className="container">
            <div className="section-header">
              <h2>Produk Terkait</h2>
              <p>Produk lain yang mungkin Anda suka</p>
            </div>
            <div className="products-grid">
              {product.related_products.map((item) => (
                <ProductCard key={item.id} product={item} />
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  )
}

export default ProductDetail
