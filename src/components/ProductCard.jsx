import { Link } from 'react-router-dom'
import './ProductCard.css'

function ProductCard({ product }) {
  const defaultImage = 'https://via.placeholder.com/400x400/FAF8F5/D4A574?text=No+Image'

  return (
    <Link to={`/produk/${product.slug}`} className="product-card">
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
  )
}

export default ProductCard
