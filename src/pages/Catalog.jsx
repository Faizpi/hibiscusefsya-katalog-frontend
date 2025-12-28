import { useState, useEffect } from 'react'
import { useParams, useSearchParams, Link } from 'react-router-dom'
import ProductCard from '../components/ProductCard'
import { ScrollReveal } from '../components/AnimatedComponents'
import { getProducts, getCategories } from '../services/api'
import './Catalog.css'

function Catalog() {
  const { category: categorySlug } = useParams()
  const [searchParams, setSearchParams] = useSearchParams()
  
  const [products, setProducts] = useState([])
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [meta, setMeta] = useState(null)
  const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '')

  const currentPage = parseInt(searchParams.get('page')) || 1

  useEffect(() => {
    fetchCategories()
  }, [])

  useEffect(() => {
    fetchProducts()
  }, [categorySlug, currentPage, searchParams])

  const fetchCategories = async () => {
    try {
      const response = await getCategories()
      setCategories(response.data)
    } catch (err) {
      // Use dummy categories
      setCategories([
        { id: 1, name: 'Deodorant Roll On', slug: 'deodorant-roll-on', product_count: 4 },
        { id: 2, name: 'P.O. Powder', slug: 'po-powder', product_count: 4 },
        { id: 3, name: 'Bedak Biang Keringat', slug: 'bedak-biang-keringat', product_count: 4 },
        { id: 4, name: 'Body Mist', slug: 'body-mist', product_count: 1 },
        { id: 5, name: 'Body Lotion', slug: 'body-lotion', product_count: 1 },
      ])
    }
  }

  const fetchProducts = async () => {
    try {
      setLoading(true)
      const params = {
        page: currentPage,
        limit: 12
      }
      
      if (categorySlug) {
        params.category = categorySlug
      }
      
      const search = searchParams.get('search')
      if (search) {
        params.search = search
      }

      const response = await getProducts(params)
      setProducts(response.data)
      setMeta(response.meta)
    } catch (err) {
      setError('Gagal memuat produk')
      // Use dummy products
      setProducts([
        { id: 1, name: 'MBK Deodorant Roll On Pink (Women)', slug: 'mbk-deodorant-roll-on-pink', price_formatted: 'Rp 15.000', category_name: 'Deodorant Roll On', featured: true, image_url: null },
        { id: 2, name: 'MBK Deodorant Roll On Purple (Women)', slug: 'mbk-deodorant-roll-on-purple', price_formatted: 'Rp 15.000', category_name: 'Deodorant Roll On', image_url: null },
        { id: 3, name: 'MBK Deodorant Roll On Black (Men)', slug: 'mbk-deodorant-roll-on-black', price_formatted: 'Rp 15.000', category_name: 'Deodorant Roll On', featured: true, image_url: null },
        { id: 4, name: 'MBK P.O. Powder Silver Sachet', slug: 'mbk-po-powder-silver-sachet', price_formatted: 'Rp 35.000', category_name: 'P.O. Powder', featured: true, image_url: null },
        { id: 5, name: 'MBK P.O. Powder Putih Tin', slug: 'mbk-po-powder-putih-tin', price_formatted: 'Rp 14.000', category_name: 'P.O. Powder', image_url: null },
        { id: 6, name: 'MBK Bedak Biang Keringat Biru', slug: 'mbk-bedak-biang-keringat-biru', price_formatted: 'Rp 9.000', category_name: 'Bedak Biang Keringat', image_url: null },
      ])
      setMeta({ total: 14, page: 1, limit: 12, total_pages: 2 })
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = (e) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      setSearchParams({ search: searchQuery.trim() })
    } else {
      setSearchParams({})
    }
  }

  const handlePageChange = (page) => {
    const params = new URLSearchParams(searchParams)
    params.set('page', page)
    setSearchParams(params)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const clearFilters = () => {
    setSearchQuery('')
    setSearchParams({})
  }

  const currentCategory = categories.find(c => c.slug === categorySlug)

  return (
    <div className="catalog-page">
      {/* Header */}
      <section className="catalog-header">
        <div className="container">
          <div className="breadcrumb">
            <Link to="/">Beranda</Link>
            <span>/</span>
            <span>Katalog</span>
            {currentCategory && (
              <>
                <span>/</span>
                <span>{currentCategory.name}</span>
              </>
            )}
          </div>
          <h1>{currentCategory ? currentCategory.name : 'Katalog Produk'}</h1>
          <p>Temukan produk perawatan tubuh M.B.K untuk kesegaran Anda</p>
        </div>
      </section>

      {/* Main Content */}
      <section className="catalog-content">
        <div className="container">
          <div className="catalog-layout">
            {/* Sidebar */}
            <aside className="catalog-sidebar">
              {/* Search */}
              <div className="sidebar-section">
                <h3>Cari Produk</h3>
                <form onSubmit={handleSearch} className="search-form">
                  <input
                    type="text"
                    className="input"
                    placeholder="Cari produk..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                  <button type="submit" className="btn btn-primary">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <circle cx="11" cy="11" r="8"/>
                      <path d="m21 21-4.35-4.35"/>
                    </svg>
                  </button>
                </form>
              </div>

              {/* Categories Filter */}
              <div className="sidebar-section">
                <h3>Kategori</h3>
                <ul className="category-filter">
                  <li>
                    <Link 
                      to="/katalog" 
                      className={`filter-link ${!categorySlug ? 'active' : ''}`}
                    >
                      Semua Produk
                    </Link>
                  </li>
                  {categories.map((cat) => (
                    <li key={cat.id}>
                      <Link 
                        to={`/katalog/${cat.slug}`}
                        className={`filter-link ${categorySlug === cat.slug ? 'active' : ''}`}
                      >
                        {cat.name}
                        <span className="count">({cat.product_count})</span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Active Filters */}
              {(categorySlug || searchParams.get('search')) && (
                <div className="sidebar-section">
                  <h3>Filter Aktif</h3>
                  <div className="active-filters">
                    {categorySlug && (
                      <span className="filter-tag">
                        {currentCategory?.name}
                        <Link to="/katalog" className="remove-filter">×</Link>
                      </span>
                    )}
                    {searchParams.get('search') && (
                      <span className="filter-tag">
                        "{searchParams.get('search')}"
                        <button onClick={clearFilters} className="remove-filter">×</button>
                      </span>
                    )}
                  </div>
                  <button onClick={clearFilters} className="btn btn-outline btn-sm clear-all">
                    Hapus Semua Filter
                  </button>
                </div>
              )}
            </aside>

            {/* Products Grid */}
            <div className="catalog-main">
              {/* Results Info */}
              <div className="results-info">
                <p>
                  Menampilkan {products.length} dari {meta?.total || 0} produk
                  {searchParams.get('search') && ` untuk "${searchParams.get('search')}"`}
                </p>
              </div>

              {loading ? (
                <div className="loading">
                  <div className="loading-spinner"></div>
                  <p>Memuat produk...</p>
                </div>
              ) : products.length > 0 ? (
                <>
                  <div className="products-grid">
                    {products.map((product, index) => (
                      <ScrollReveal key={product.id} animation="fadeInUp" delay={index * 80}>
                        <ProductCard product={product} />
                      </ScrollReveal>
                    ))}
                  </div>

                  {/* Pagination */}
                  {meta && meta.total_pages > 1 && (
                    <div className="pagination">
                      <button
                        className="pagination-btn"
                        disabled={!meta.has_prev}
                        onClick={() => handlePageChange(currentPage - 1)}
                      >
                        ← Sebelumnya
                      </button>
                      
                      <div className="pagination-pages">
                        {[...Array(meta.total_pages)].map((_, i) => (
                          <button
                            key={i}
                            className={`pagination-page ${currentPage === i + 1 ? 'active' : ''}`}
                            onClick={() => handlePageChange(i + 1)}
                          >
                            {i + 1}
                          </button>
                        ))}
                      </div>
                      
                      <button
                        className="pagination-btn"
                        disabled={!meta.has_next}
                        onClick={() => handlePageChange(currentPage + 1)}
                      >
                        Selanjutnya →
                      </button>
                    </div>
                  )}
                </>
              ) : (
                <div className="empty-state">
                  <div className="empty-state-icon">🔍</div>
                  <h3>Produk Tidak Ditemukan</h3>
                  <p>Coba ubah kata kunci pencarian atau filter Anda</p>
                  <button onClick={clearFilters} className="btn btn-primary">
                    Reset Filter
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default Catalog
