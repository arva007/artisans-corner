import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { saveShippingAddress, clearCart } from '../redux/slices/cartSlice';
import API from '../services/api';
import confetti from 'canvas-confetti';
import {
  ShieldCheck,
  CreditCard,
  Truck,
  CheckCircle2,
  Lock,
  ArrowRight,
  AlertCircle,
} from 'lucide-react';

const CheckoutPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { cartItems, subtotal, shipping, estimatedTax, total, shippingAddress } = useSelector(
    (state) => state.cart
  );
  const { user } = useSelector((state) => state.auth);

  const [formData, setFormData] = useState({
    fullName: shippingAddress?.fullName || user?.name || '',
    address: shippingAddress?.address || '',
    city: shippingAddress?.city || '',
    state: shippingAddress?.state || '',
    postalCode: shippingAddress?.postalCode || '',
    country: shippingAddress?.country || 'United States',
    phone: shippingAddress?.phone || '',
  });

  const [paymentMethod, setPaymentMethod] = useState('Stripe');
  const [processing, setProcessing] = useState(false);
  const [checkoutError, setCheckoutError] = useState(null);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleCheckoutSubmit = async (e) => {
    e.preventDefault();
    setCheckoutError(null);

    if (cartItems.length === 0) {
      setCheckoutError('Your cart is empty');
      return;
    }

    if (!formData.fullName || !formData.address || !formData.city || !formData.postalCode) {
      setCheckoutError('Please fill out all required shipping fields');
      return;
    }

    // Save shipping in redux
    dispatch(saveShippingAddress(formData));
    setProcessing(true);

    try {
      // 1. Create Payment Intent on backend
      const intentRes = await API.post('/payments/create-intent', {
        amount: total,
        metadata: {
          customerName: formData.fullName,
          itemCount: cartItems.length,
        },
      });

      const { paymentIntentId } = intentRes.data;

      // 2. Submit order to backend
      const orderItems = cartItems.map((item) => ({
        product: item.product,
        vendor: item.vendor,
        name: item.name,
        image: item.image,
        price: item.price,
        quantity: item.quantity,
      }));

      const orderRes = await API.post('/orders', {
        orderItems,
        shippingAddress: formData,
        paymentMethod: paymentMethod === 'Stripe' ? 'Stripe Card' : 'Test Mode Payment',
        paymentStatus: 'completed',
        stripePaymentIntentId: paymentIntentId,
      });

      const createdOrder = orderRes.data.order;

      // 3. Clear cart
      dispatch(clearCart());

      // 4. Trigger celebration confetti
      try {
        confetti({
          particleCount: 120,
          spread: 70,
          origin: { y: 0.6 },
        });
      } catch (e) {}

      // 5. Navigate to confirmation
      navigate(`/order-confirmation/${createdOrder._id}`, { state: { order: createdOrder } });
    } catch (err) {
      console.error('Checkout error:', err);
      setCheckoutError(
        err.response?.data?.message || 'Payment or order creation failed. Please try again.'
      );
    } finally {
      setProcessing(false);
    }
  };

  if (cartItems.length === 0) {
    return (
      <div className="container" style={{ padding: '6rem 1.5rem', textAlign: 'center' }}>
        <h2>Your Cart is Empty</h2>
        <p style={{ margin: '1rem 0 2rem' }}>Add some handcrafted creations before checking out.</p>
        <Link to="/products" className="btn btn-primary">
          Explore Handcrafted Goods
        </Link>
      </div>
    );
  }

  return (
    <div style={{ padding: '3rem 0 6rem' }} id="checkout-page">
      <div className="container">
        <div style={{ marginBottom: '2.5rem' }}>
          <h1>Secure Checkout</h1>
          <p>Complete your handcrafted order with guaranteed buyer protection</p>
        </div>

        {checkoutError && (
          <div
            style={{
              backgroundColor: 'var(--danger-bg)',
              color: 'var(--danger)',
              padding: '1rem 1.25rem',
              borderRadius: 'var(--radius-md)',
              marginBottom: '2rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem',
            }}
            id="checkout-error-banner"
          >
            <AlertCircle size={20} />
            <div>{checkoutError}</div>
          </div>
        )}

        <form onSubmit={handleCheckoutSubmit}>
          <div style={{ display: 'grid', gridTemplateColumns: '1.25fr 0.75fr', gap: '3.5rem', alignItems: 'start' }}>
            {/* Left Column: Shipping & Payment */}
            <div>
              {/* Shipping Address Section */}
              <div className="card" style={{ padding: '2rem', marginBottom: '2rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
                  <div
                    style={{
                      width: '36px',
                      height: '36px',
                      borderRadius: '50%',
                      backgroundColor: 'var(--primary-light)',
                      color: 'var(--primary)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <Truck size={18} />
                  </div>
                  <h3>1. Shipping Address</h3>
                </div>

                <div className="form-group">
                  <label className="form-label" htmlFor="fullName">Full Name</label>
                  <input
                    type="text"
                    id="fullName"
                    name="fullName"
                    className="form-control"
                    required
                    value={formData.fullName}
                    onChange={handleChange}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label" htmlFor="address">Street Address</label>
                  <input
                    type="text"
                    id="address"
                    name="address"
                    className="form-control"
                    placeholder="e.g. 742 Evergreen Terrace, Apt 4"
                    required
                    value={formData.address}
                    onChange={handleChange}
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div className="form-group">
                    <label className="form-label" htmlFor="city">City</label>
                    <input
                      type="text"
                      id="city"
                      name="city"
                      className="form-control"
                      required
                      value={formData.city}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label" htmlFor="state">State / Province</label>
                    <input
                      type="text"
                      id="state"
                      name="state"
                      className="form-control"
                      required
                      value={formData.state}
                      onChange={handleChange}
                    />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div className="form-group">
                    <label className="form-label" htmlFor="postalCode">Postal / ZIP Code</label>
                    <input
                      type="text"
                      id="postalCode"
                      name="postalCode"
                      className="form-control"
                      required
                      value={formData.postalCode}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label" htmlFor="phone">Phone Number</label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      className="form-control"
                      placeholder="For delivery updates"
                      required
                      value={formData.phone}
                      onChange={handleChange}
                    />
                  </div>
                </div>
              </div>

              {/* Payment Section */}
              <div className="card" style={{ padding: '2rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
                  <div
                    style={{
                      width: '36px',
                      height: '36px',
                      borderRadius: '50%',
                      backgroundColor: 'var(--secondary-light)',
                      color: 'var(--secondary)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <CreditCard size={18} />
                  </div>
                  <h3>2. Payment Method</h3>
                </div>

                {/* Stripe Card Option */}
                <div
                  style={{
                    border: `2px solid ${paymentMethod === 'Stripe' ? 'var(--primary)' : 'var(--border)'}`,
                    borderRadius: 'var(--radius-md)',
                    padding: '1.25rem',
                    marginBottom: '1rem',
                    backgroundColor: paymentMethod === 'Stripe' ? 'var(--primary-light)' : 'transparent',
                    cursor: 'pointer',
                  }}
                  onClick={() => setPaymentMethod('Stripe')}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                      <input
                        type="radio"
                        id="stripe-radio"
                        name="paymentMethod"
                        checked={paymentMethod === 'Stripe'}
                        onChange={() => setPaymentMethod('Stripe')}
                      />
                      <label htmlFor="stripe-radio" style={{ fontWeight: 600, cursor: 'pointer' }}>
                        Credit or Debit Card (Stripe Powered)
                      </label>
                    </div>
                    <span className="badge badge-secondary">Secure 256-bit</span>
                  </div>

                  {paymentMethod === 'Stripe' && (
                    <div style={{ marginTop: '1rem', borderTop: '1px solid var(--border)', paddingTop: '1rem' }}>
                      <div className="form-group">
                        <label className="form-label">Card Number</label>
                        <input
                          type="text"
                          className="form-control"
                          placeholder="•••• •••• •••• 4242 (Stripe Test Card)"
                          defaultValue="4242 •••• •••• 4242"
                          readOnly
                          style={{ backgroundColor: '#fff' }}
                        />
                      </div>
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                        <div className="form-group">
                          <label className="form-label">Expiration Date</label>
                          <input
                            type="text"
                            className="form-control"
                            placeholder="MM / YY"
                            defaultValue="12 / 28"
                            readOnly
                            style={{ backgroundColor: '#fff' }}
                          />
                        </div>
                        <div className="form-group">
                          <label className="form-label">Security CVC</label>
                          <input
                            type="text"
                            className="form-control"
                            placeholder="CVC"
                            defaultValue="•••"
                            readOnly
                            style={{ backgroundColor: '#fff' }}
                          />
                        </div>
                      </div>
                      <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                        <Lock size={12} />
                        Connected to Stripe Payment Intent backend architecture with automated 5% commission calculation.
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Right Column: Order Summary & Place Order */}
            <div>
              <div className="card" style={{ padding: '2rem', position: 'sticky', top: '100px' }}>
                <h3 style={{ fontSize: '1.25rem', marginBottom: '1.25rem', borderBottom: '1px solid var(--border)', paddingBottom: '0.75rem' }}>
                  Items in Order ({cartItems.length})
                </h3>

                <div
                  style={{
                    maxHeight: '260px',
                    overflowY: 'auto',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '0.85rem',
                    marginBottom: '1.5rem',
                    paddingRight: '0.5rem',
                  }}
                >
                  {cartItems.map((item) => (
                    <div key={item.product} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                      <img
                        src={item.image}
                        alt={item.name}
                        style={{ width: '48px', height: '48px', borderRadius: 'var(--radius-sm)', objectFit: 'cover' }}
                      />
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontSize: '0.875rem', fontWeight: 600, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                          {item.name}
                        </div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                          Qty: {item.quantity} × ${item.price.toFixed(2)}
                        </div>
                      </div>
                      <div style={{ fontWeight: 700, fontSize: '0.9rem' }}>
                        ${(item.price * item.quantity).toFixed(2)}
                      </div>
                    </div>
                  ))}
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem', marginBottom: '1.5rem', fontSize: '0.9rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: 'var(--text-muted)' }}>Subtotal:</span>
                    <span>${subtotal.toFixed(2)}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: 'var(--text-muted)' }}>Shipping:</span>
                    <span>{shipping === 0 ? 'FREE' : `$${shipping.toFixed(2)}`}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: 'var(--text-muted)' }}>Estimated Tax:</span>
                    <span>${estimatedTax.toFixed(2)}</span>
                  </div>
                  <div
                    style={{
                      borderTop: '1px solid var(--border)',
                      paddingTop: '0.75rem',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'baseline',
                    }}
                  >
                    <span style={{ fontWeight: 700, fontSize: '1.1rem' }}>Total:</span>
                    <span style={{ fontWeight: 800, fontSize: '1.4rem', color: 'var(--primary)' }}>
                      ${total.toFixed(2)}
                    </span>
                  </div>
                </div>

                <button
                  type="submit"
                  className="btn btn-primary btn-lg"
                  id="place-order-btn"
                  disabled={processing}
                  style={{ width: '100%', marginBottom: '1rem' }}
                >
                  <Lock size={16} />
                  {processing ? 'Processing Payment...' : `Authorize & Pay $${total.toFixed(2)}`}
                </button>

                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', fontSize: '0.75rem', color: 'var(--text-light)' }}>
                  <ShieldCheck size={14} color="var(--secondary)" />
                  <span>Stripe 256-Bit Encrypted Payment</span>
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CheckoutPage;
