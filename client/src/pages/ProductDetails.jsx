import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchProductById,
  clearCurrentProduct,
  addProductReview,
  resetReviewState,
} from '../redux/slices/productSlice';
import { addToCart } from '../redux/slices/cartSlice';
import StarRating from '../components/common/StarRating';
import {
  ShoppingBag,
  Store,
  ShieldCheck,
  Truck,
  RotateCcw,
  Check,
  AlertCircle,
  Clock,
  Send,
  User,
} from 'lucide-react';

const ProductDetails = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { currentProduct: product, reviews, detailLoading, error, reviewError, reviewSuccess } = useSelector(
    (state) => state.products
  );
  const { user } = useSelector((state) => state.auth);

  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

  // Review Form state
  const [newRating, setNewRating] = useState(5);
  const [newComment, setNewComment] = useState('');
  const [submittingReview, setSubmittingReview] = useState(false);

  useEffect(() => {
    dispatch(fetchProductById(id));
    return () => {
      dispatch(clearCurrentProduct());
      dispatch(resetReviewState());
    };
  }, [id, dispatch]);

  const handleAddToCart = () => {
    if (!product || product.stock <= 0) return;

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
        quantity: Number(quantity),
      })
    );

    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    setSubmittingReview(true);
    await dispatch(
      addProductReview({
        productId: product._id,
        rating: newRating,
        comment: newComment.trim(),
      })
    );
    setSubmittingReview(false);
    setNewComment('');
  };

  if (detailLoading) {
    return (
      <div style={{ textAlign: 'center', padding: '6rem 0', color: 'var(--text-muted)' }}>
        Loading handcrafted piece details...
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="container" style={{ padding: '6rem 1.5rem', textAlign: 'center' }}>
        <AlertCircle size={44} color="var(--danger)" style={{ marginBottom: '1rem' }} />
        <h2>Handcrafted Item Not Found</h2>
        <p style={{ marginBottom: '2rem' }}>
          This piece may have been retired by the artisan or the link is incorrect.
        </p>
        <Link to="/products" className="btn btn-primary">
          Explore Handcrafted Goods
        </Link>
      </div>
    );
  }

  const isOutOfStock = product.stock <= 0;
  const isLowStock = product.stock > 0 && product.stock <= 3;

  return (
    <div style={{ padding: '3rem 0 6rem' }} id="product-details-page">
      <div className="container">
        {/* Breadcrumb */}
        <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '2rem' }}>
          <Link to="/">Home</Link> / <Link to={`/products?category=${encodeURIComponent(product.category)}`}>{product.category}</Link> /{' '}
          <span style={{ color: 'var(--text-main)', fontWeight: 600 }}>{product.name}</span>
        </div>

        {/* Product Hero Info Grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1.05fr 0.95fr',
            gap: '3.5rem',
            alignItems: 'start',
            marginBottom: '4.5rem',
          }}
        >
          {/* Main Product Image */}
          <div style={{ position: 'sticky', top: '100px' }}>
            <div
              style={{
                borderRadius: 'var(--radius-xl)',
                overflow: 'hidden',
                backgroundColor: 'var(--bg-card)',
                border: '1px solid var(--border)',
                boxShadow: 'var(--shadow-md)',
              }}
            >
              <img
                src={product.image}
                alt={product.name}
                style={{ width: '100%', height: 'auto', maxHeight: '560px', objectFit: 'cover', display: 'block' }}
                id="main-product-image"
              />
            </div>
          </div>

          {/* Product Actions & Details */}
          <div>
            {/* Category badge */}
            <span className="badge badge-primary" style={{ marginBottom: '0.75rem' }}>
              {product.category}
            </span>

            <h1 style={{ fontSize: '2.25rem', marginBottom: '0.75rem', lineHeight: '1.25' }} id="product-title">
              {product.name}
            </h1>

            {/* Maker Link */}
            {product.vendor && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '1.25rem' }}>
                <div
                  style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '50%',
                    backgroundColor: 'var(--primary-light)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'var(--primary)',
                  }}
                >
                  <Store size={16} />
                </div>
                <div>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Crafted by </span>
                  <Link
                    to={`/vendor/${product.vendor._id || product.vendor}`}
                    style={{ fontWeight: 600, color: 'var(--primary)' }}
                    id="product-vendor-link"
                  >
                    {product.vendor.storeName || 'Artisan Studio'}
                  </Link>
                </div>
              </div>
            )}

            {/* Rating row */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
              <StarRating rating={product.rating || 0} count={product.numberOfReviews || 0} size={18} />
              <span style={{ color: 'var(--border)' }}>•</span>
              <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                {product.numberOfReviews > 0 ? `${product.numberOfReviews} customer reviews` : 'Be the first to review'}
              </span>
            </div>

            {/* Price & Stock */}
            <div
              style={{
                display: 'flex',
                alignItems: 'baseline',
                gap: '1rem',
                marginBottom: '1.5rem',
                paddingBottom: '1.5rem',
                borderBottom: '1px solid var(--border)',
              }}
            >
              <div style={{ fontSize: '2.25rem', fontWeight: 700, color: 'var(--text-main)' }} id="product-price">
                ${product.price.toFixed(2)}
              </div>
              <div>
                {isOutOfStock ? (
                  <span className="badge badge-danger">Sold Out</span>
                ) : isLowStock ? (
                  <span className="badge badge-warning">Only {product.stock} Left</span>
                ) : (
                  <span className="badge badge-success">In Stock ({product.stock} available)</span>
                )}
              </div>
            </div>

            {/* Description */}
            <div style={{ marginBottom: '2rem' }}>
              <h4 style={{ marginBottom: '0.5rem', fontSize: '1rem' }}>Artisan Notes & Materials</h4>
              <p style={{ lineHeight: '1.7', whiteSpace: 'pre-line', color: 'var(--text-muted)' }}>
                {product.description}
              </p>
            </div>

            {/* Tags */}
            {product.tags && product.tags.length > 0 && (
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '2rem' }}>
                {product.tags.map((tag) => (
                  <span
                    key={tag}
                    style={{
                      fontSize: '0.75rem',
                      backgroundColor: 'var(--bg-card-subtle)',
                      padding: '0.25rem 0.65rem',
                      borderRadius: 'var(--radius-full)',
                      color: 'var(--text-muted)',
                      border: '1px solid var(--border)',
                    }}
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            )}

            {/* Quantity Selector & Add to Cart */}
            <div
              style={{
                backgroundColor: 'var(--bg-card-subtle)',
                padding: '1.5rem',
                borderRadius: 'var(--radius-lg)',
                border: '1px solid var(--border)',
                marginBottom: '2rem',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
                {!isOutOfStock && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <label htmlFor="product-qty-select" style={{ fontSize: '0.9rem', fontWeight: 600 }}>
                      Qty:
                    </label>
                    <select
                      id="product-qty-select"
                      className="form-control"
                      value={quantity}
                      onChange={(e) => setQuantity(Number(e.target.value))}
                      style={{ width: '70px', padding: '0.5rem 0.75rem' }}
                    >
                      {[...Array(Math.min(product.stock, 10)).keys()].map((n) => (
                        <option key={n + 1} value={n + 1}>
                          {n + 1}
                        </option>
                      ))}
                    </select>
                  </div>
                )}

                <button
                  type="button"
                  className={`btn btn-lg ${added ? 'btn-secondary' : 'btn-primary'}`}
                  id="product-add-to-cart-btn"
                  onClick={handleAddToCart}
                  disabled={isOutOfStock}
                  style={{ flex: 1 }}
                >
                  {added ? (
                    <>
                      <Check size={18} />
                      Added to Cart!
                    </>
                  ) : isOutOfStock ? (
                    'Piece is Sold Out'
                  ) : (
                    <>
                      <ShoppingBag size={18} />
                      Add to Handcrafted Cart
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Trust Assurances */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                <Truck size={16} color="var(--primary)" />
                <span>Free shipping on orders over $75 • Ships securely in protective packaging</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                <ShieldCheck size={16} color="var(--secondary)" />
                <span>Authentic handmade guarantee • 5% platform fee supports fair artisan trade</span>
              </div>
            </div>
          </div>
        </div>

        {/* Customer Reviews Section */}
        <section
          style={{
            borderTop: '1px solid var(--border)',
            paddingTop: '3.5rem',
            marginTop: '2rem',
          }}
          id="product-reviews-section"
        >
          <div style={{ maxWidth: '820px' }}>
            <div style={{ marginBottom: '2.5rem' }}>
              <span className="badge badge-amber" style={{ marginBottom: '0.5rem' }}>
                Community Feedback
              </span>
              <h2>Verified Customer Reviews</h2>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginTop: '0.5rem' }}>
                <StarRating rating={product.rating || 0} count={product.numberOfReviews || 0} size={20} />
                <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>
                  Based on {product.numberOfReviews || 0} verified customer evaluations
                </span>
              </div>
            </div>

            {/* Review Submission Form (Only logged in verified buyers) */}
            <div
              className="card"
              style={{ padding: '2rem', marginBottom: '3rem', backgroundColor: 'var(--bg-card)' }}
              id="submit-review-card"
            >
              <h4 style={{ marginBottom: '0.75rem' }}>Leave a Review for This Creation</h4>
              <p style={{ fontSize: '0.85rem', marginBottom: '1.25rem' }}>
                Only verified patrons who completed a purchase of this handcrafted item can submit a review.
              </p>

              {reviewSuccess && (
                <div
                  style={{
                    backgroundColor: 'var(--success-bg)',
                    color: 'var(--success)',
                    padding: '0.85rem 1rem',
                    borderRadius: 'var(--radius-md)',
                    marginBottom: '1rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    fontSize: '0.9rem',
                  }}
                >
                  <Check size={16} />
                  Review submitted successfully! Thank you for supporting independent craft.
                </div>
              )}

              {reviewError && (
                <div
                  style={{
                    backgroundColor: 'var(--danger-bg)',
                    color: 'var(--danger)',
                    padding: '0.85rem 1rem',
                    borderRadius: 'var(--radius-md)',
                    marginBottom: '1rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    fontSize: '0.9rem',
                  }}
                >
                  <AlertCircle size={16} />
                  {reviewError}
                </div>
              )}

              {user ? (
                <form onSubmit={handleReviewSubmit}>
                  <div className="form-group">
                    <label className="form-label">Your Rating (1 to 5 Stars):</label>
                    <StarRating
                      rating={newRating}
                      size={24}
                      showCount={false}
                      interactive={true}
                      onRatingChange={(val) => setNewRating(val)}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label" htmlFor="review-comment-input">
                      Your Written Review:
                    </label>
                    <textarea
                      id="review-comment-input"
                      className="form-control"
                      placeholder="Share your thoughts on the craftsmanship, material quality, and how you use this piece..."
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                      required
                      rows={3}
                    />
                  </div>

                  <button
                    type="submit"
                    className="btn btn-primary btn-sm"
                    id="submit-review-btn"
                    disabled={submittingReview || !newComment.trim()}
                  >
                    <Send size={14} />
                    {submittingReview ? 'Submitting...' : 'Submit Verified Review'}
                  </button>
                </form>
              ) : (
                <div style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>
                  Please{' '}
                  <Link to="/login" style={{ color: 'var(--primary)', fontWeight: 600 }}>
                    sign in
                  </Link>{' '}
                  to leave a verified buyer review.
                </div>
              )}
            </div>

            {/* Reviews List */}
            {reviews && reviews.length > 0 ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                {reviews.map((rev) => (
                  <div
                    key={rev._id}
                    className="card"
                    style={{ padding: '1.5rem' }}
                    id={`review-${rev._id}`}
                  >
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        marginBottom: '0.75rem',
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        {rev.buyer?.profileImage ? (
                          <img
                            src={rev.buyer.profileImage}
                            alt={rev.buyer.name}
                            style={{ width: '38px', height: '38px', borderRadius: '50%', objectFit: 'cover' }}
                          />
                        ) : (
                          <div
                            style={{
                              width: '38px',
                              height: '38px',
                              borderRadius: '50%',
                              backgroundColor: 'var(--bg-card-subtle)',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              color: 'var(--text-muted)',
                            }}
                          >
                            <User size={18} />
                          </div>
                        )}
                        <div>
                          <div style={{ fontWeight: 600, fontSize: '0.95rem' }}>
                            {rev.buyer?.name || 'Verified Customer'}
                          </div>
                          <span className="badge badge-success" style={{ fontSize: '0.65rem' }}>
                            Verified Purchase
                          </span>
                        </div>
                      </div>

                      <div style={{ textAlign: 'right' }}>
                        <StarRating rating={rev.rating} size={14} showCount={false} />
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-light)', marginTop: '2px' }}>
                          {new Date(rev.createdAt).toLocaleDateString()}
                        </div>
                      </div>
                    </div>

                    <p style={{ fontSize: '0.925rem', color: 'var(--text-main)', lineHeight: '1.6' }}>
                      {rev.comment}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <div
                style={{
                  padding: '2.5rem',
                  textAlign: 'center',
                  backgroundColor: 'var(--bg-card-subtle)',
                  borderRadius: 'var(--radius-lg)',
                  color: 'var(--text-muted)',
                }}
              >
                No reviews yet for this handcrafted item. If you ordered this piece, be the first to share your experience!
              </div>
            )}
          </div>
        </section>
      </div>
    </div>
  );
};

export default ProductDetails;
