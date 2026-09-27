import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  increaseQuantity,
  decreaseQuantity,
  removeFromCart,
  clearCart,
} from '../redux/slices/cartSlice';
import {
  ShoppingBag,
  Trash2,
  Plus,
  Minus,
  ArrowRight,
  ShieldCheck,
  Truck,
  RotateCcw,
} from 'lucide-react';

const CartPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { cartItems, itemsCount, subtotal, shipping, estimatedTax, total } = useSelector(
    (state) => state.cart
  );
  const { user } = useSelector((state) => state.auth);

  const handleCheckoutClick = () => {
    if (!user) {
      navigate('/login?redirect=/checkout');
    } else {
      navigate('/checkout');
    }
  };

  if (cartItems.length === 0) {
    return (
      <div className="container" style={{ padding: '6rem 1.5rem', textAlign: 'center' }} id="empty-cart-view">
        <div
          style={{
            width: '72px',
            height: '72px',
            borderRadius: '50%',
            backgroundColor: 'var(--primary-light)',
            color: 'var(--primary)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 1.5rem',
          }}
        >
          <ShoppingBag size={34} />
        </div>
        <h2 style={{ marginBottom: '0.75rem' }}>Your Artisan Basket is Empty</h2>
        <p style={{ maxWidth: '440px', margin: '0 auto 2rem' }}>
          Discover one-of-a-kind ceramics, hand-hewn woodwork, and natural fiber textiles created with care by independent makers.
        </p>
        <Link to="/products" className="btn btn-primary btn-lg" id="explore-goods-btn">
          Explore Handcrafted Goods
          <ArrowRight size={18} />
        </Link>
      </div>
    );
  }

  return (
    <div style={{ padding: '3rem 0 6rem' }} id="cart-page">
      <div className="container">
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '2rem',
            paddingBottom: '1rem',
            borderBottom: '1px solid var(--border)',
          }}
        >
          <div>
            <h1>Handcrafted Cart</h1>
            <p>You have {itemsCount} {itemsCount === 1 ? 'item' : 'items'} in your basket</p>
          </div>

          <button
            type="button"
            className="btn btn-outline btn-sm"
            onClick={() => dispatch(clearCart())}
            id="clear-cart-btn"
          >
            <Trash2 size={14} />
            Empty Basket
          </button>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: '3rem', alignItems: 'start' }}>
          {/* Cart Items List */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            {cartItems.map((item) => (
              <div
                key={item.product}
                className="card"
                style={{
                  padding: '1.25rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '1.25rem',
                }}
                id={`cart-item-${item.product}`}
              >
                <img
                  src={item.image}
                  alt={item.name}
                  style={{
                    width: '90px',
                    height: '90px',
                    borderRadius: 'var(--radius-md)',
                    objectFit: 'cover',
                  }}
                />

                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-light)', textTransform: 'uppercase' }}>
                    {item.vendorName || 'Artisan Studio'}
                  </div>
                  <Link
                    to={`/products/${item.product}`}
                    style={{ fontWeight: 600, fontSize: '1rem', color: 'var(--text-main)', display: 'block' }}
                  >
                    {item.name}
                  </Link>
                  <div style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--primary)', marginTop: '0.25rem' }}>
                    ${item.price.toFixed(2)}
                  </div>
                </div>

                {/* Quantity Controls */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <button
                    type="button"
                    className="btn btn-outline btn-sm"
                    style={{ padding: '0.35rem', borderRadius: 'var(--radius-sm)' }}
                    onClick={() => dispatch(decreaseQuantity(item.product))}
                    id={`qty-decrease-${item.product}`}
                  >
                    <Minus size={14} />
                  </button>

                  <span style={{ fontWeight: 700, minWidth: '24px', textAlign: 'center' }}>
                    {item.quantity}
                  </span>

                  <button
                    type="button"
                    className="btn btn-outline btn-sm"
                    style={{ padding: '0.35rem', borderRadius: 'var(--radius-sm)' }}
                    onClick={() => dispatch(increaseQuantity(item.product))}
                    disabled={item.quantity >= item.stock}
                    title={item.quantity >= item.stock ? 'Maximum stock reached' : 'Increase quantity'}
                    id={`qty-increase-${item.product}`}
                  >
                    <Plus size={14} />
                  </button>
                </div>

                {/* Item Total */}
                <div style={{ fontWeight: 700, fontSize: '1.05rem', minWidth: '80px', textAlign: 'right' }}>
                  ${(item.price * item.quantity).toFixed(2)}
                </div>

                {/* Remove Button */}
                <button
                  type="button"
                  onClick={() => dispatch(removeFromCart(item.product))}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: 'var(--text-light)',
                    cursor: 'pointer',
                    padding: '0.5rem',
                  }}
                  title="Remove item"
                  id={`remove-item-${item.product}`}
                >
                  <Trash2 size={16} />
                </button>
              </div>
            ))}
          </div>

          {/* Order Summary Card */}
          <div
            className="card"
            style={{ padding: '2rem', backgroundColor: 'var(--bg-card)', position: 'sticky', top: '100px' }}
            id="order-summary-card"
          >
            <h3 style={{ fontSize: '1.35rem', marginBottom: '1.5rem', borderBottom: '1px solid var(--border)', paddingBottom: '0.75rem' }}>
              Order Summary
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem', marginBottom: '1.5rem', fontSize: '0.925rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-muted)' }}>Items Subtotal:</span>
                <span style={{ fontWeight: 600 }}>${subtotal.toFixed(2)}</span>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-muted)' }}>Estimated Shipping:</span>
                <span>{shipping === 0 ? <strong style={{ color: 'var(--success)' }}>FREE</strong> : `$${shipping.toFixed(2)}`}</span>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-muted)' }}>Estimated Tax (6%):</span>
                <span>${estimatedTax.toFixed(2)}</span>
              </div>

              <div
                style={{
                  borderTop: '1px solid var(--border)',
                  paddingTop: '0.85rem',
                  marginTop: '0.5rem',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'baseline',
                }}
              >
                <span style={{ fontWeight: 700, fontSize: '1.15rem' }}>Estimated Total:</span>
                <span style={{ fontWeight: 800, fontSize: '1.5rem', color: 'var(--text-main)' }}>
                  ${total.toFixed(2)}
                </span>
              </div>
            </div>

            {/* Platform Commission info note */}
            <div
              style={{
                backgroundColor: 'var(--primary-light)',
                padding: '0.75rem 1rem',
                borderRadius: 'var(--radius-md)',
                fontSize: '0.8rem',
                color: 'var(--primary)',
                marginBottom: '1.5rem',
                lineHeight: '1.4',
              }}
            >
              <strong>Transparent Maker Fee:</strong> 95% of your purchase goes directly to the independent artisans. Our 5% platform fee covers secure hosting & payments.
            </div>

            <button
              type="button"
              className="btn btn-primary btn-lg"
              style={{ width: '100%' }}
              id="proceed-to-checkout-btn"
              onClick={handleCheckoutClick}
            >
              Proceed to Secure Checkout
              <ArrowRight size={18} />
            </button>

            <div style={{ marginTop: '1.5rem', textAlign: 'center' }}>
              <Link to="/products" style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                ← Continue Browsing More Goods
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;
