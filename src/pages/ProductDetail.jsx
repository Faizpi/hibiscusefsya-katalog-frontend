import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import ProductCard from '../components/ProductCard'
import { getProductBySlug } from '../services/api'
import './ProductDetail.css'

function ProductDetail() {
  const { slug } = useParams()
  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    fetchProduct()
  }, [slug])

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
                <a 
                  href={`https://wa.me/6281234567890?text=Halo, saya tertarik dengan produk ${product.name} (${product.price_formatted})`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-primary btn-lg btn-whatsapp"
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/>
                  </svg>
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
