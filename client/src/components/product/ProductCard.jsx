import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { addToCart } from '../../redux/slices/cartSlice';
import StarRating from '../common/StarRating';
import { ShoppingBag, Check, Store } from 'lucide-react';

const ProductCard = ({ product }) => {
  const dispatch = useDispatch();
  const [added, setAdded] = useState(false);

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (product.stock <= 0) return;

    dispatch(
      addToCart({
        product: product._id,
        name: product.name,
        price: product.price,
        image: product.image,
        category: product.category,
        stock: product.stock,
        vendor: product.vendor?._id || product.vendor,
        vendorName: product.vendor?.storeName || 'Artisan Studio',
        quantity: 1,
      })
    );

    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  const isOutOfStock = product.stock <= 0;
  const isLowStock = product.stock > 0 && product.stock <= 3;

  return (
    <div className="product-card" id={`product-card-${product._id}`}>
      <Link to={`/products/${product._id}`} className="product-img-wrapper">
        <img
          src={product.image}
          alt={product.name}
          className="product-img"
          loading="lazy"
        />
        <span className="product-category-tag">{product.category}</span>
        {isOutOfStock && (
          <div
            style={{
              position: 'absolute',
              inset: 0,
              backgroundColor: 'rgba(0, 0, 0, 0.45)',
              color: '#fff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 700,
              fontSize: '0.9rem',
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
            }}
          >
            Sold Out
          </div>
        )}
      </Link>

      <div className="product-info">
        {product.vendor && (
          <Link
            to={`/vendor/${product.vendor._id || product.vendor}`}
            className="product-vendor-link"
          >
            <Store size={13} />
            <span>{product.vendor.storeName || 'Artisan Studio'}</span>
          </Link>
        )}

        <Link to={`/products/${product._id}`} className="product-title" title={product.name}>
          {product.name}
        </Link>

        <div className="product-rating-row">
          <StarRating rating={product.rating || 0} count={product.numberOfReviews || 0} size={14} />
        </div>

        {isLowStock && (
          <div style={{ fontSize: '0.75rem', color: 'var(--warning)', fontWeight: 600, marginBottom: '0.5rem' }}>
            Only {product.stock} available
          </div>
        )}

        <div className="product-footer">
          <div className="product-price">${product.price.toFixed(2)}</div>

          <button
            type="button"
            className={`btn btn-sm ${added ? 'btn-secondary' : 'btn-primary'}`}
            id={`add-to-cart-${product._id}`}
            onClick={handleAddToCart}
            disabled={isOutOfStock}
            title={isOutOfStock ? 'Item is out of stock' : 'Add to cart'}
          >
            {added ? (
              <>
                <Check size={14} />
                Added
              </>
            ) : isOutOfStock ? (
              'Sold Out'
            ) : (
              <>
                <ShoppingBag size={14} />
                Add
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
