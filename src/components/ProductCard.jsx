import { Link } from 'react-router-dom'
import './ProductCard.css'

function ProductCard({ product }) {
  const defaultImage = 'https://via.placeholder.com/400x400/FAF8F5/D4A574?text=No+Image'
  const shopeeLogoSrc = `${import.meta.env.BASE_URL}Shopee_logo.svg`
  const tokopediaLogoSrc = `${import.meta.env.BASE_URL}Tokopedia_Mascot.png`

  return (
    <div className="product-card">
      <Link to={`/produk/${product.slug}`} className="product-card-link">
        <div className="product-card-image">
          <img 
            src={product.image_url || defaultImage} 
            alt={product.name}
            loading="lazy"
          />
          {product.featured && (
            <span className="product-badge">Unggulan</span>
          )}
        </div>
        <div className="product-card-content">
          {product.category_name && (
            <span className="product-category">{product.category_name}</span>
          )}
          <h3 className="product-name">{product.name}</h3>
          <p className="product-price">{product.price_formatted}</p>
        </div>
      </Link>
      {(product.shopee_link || product.tokopedia_link) && (
        <div className="product-marketplace-links">
          {product.shopee_link && (
            <a 
              href={product.shopee_link} 
              target="_blank" 
              rel="noopener noreferrer"
              className="marketplace-btn shopee-btn"
              onClick={(e) => e.stopPropagation()}
            >
              <img src={shopeeLogoSrc} alt="Shopee" />
              <span>Shopee</span>
            </a>
          )}
          {product.tokopedia_link && (
            <a 
              href={product.tokopedia_link} 
              target="_blank" 
              rel="noopener noreferrer"
              className="marketplace-btn tokopedia-btn"
              onClick={(e) => e.stopPropagation()}
            >
              <img src={tokopediaLogoSrc} alt="Tokopedia" />
              <span>Tokopedia</span>
            </a>
          )}
        </div>
      )}
    </div>
  )
}

export default ProductCard
