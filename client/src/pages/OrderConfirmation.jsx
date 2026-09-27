import React, { useEffect, useState } from 'react';
import { useParams, useLocation, Link } from 'react-router-dom';
import API from '../services/api';
import {
  CheckCircle,
  Package,
  ArrowRight,
  Truck,
  Heart,
  Store,
} from 'lucide-react';

const OrderConfirmation = () => {
  const { id } = useParams();
  const location = useLocation();
  const [order, setOrder] = useState(location.state?.order || null);
  const [loading, setLoading] = useState(!order);

  useEffect(() => {
    if (!order) {
      API.get(`/orders/${id}`)
        .then((res) => setOrder(res.data.order))
        .catch((err) => console.error('Error fetching confirmed order:', err))
        .finally(() => setLoading(false));
    }
  }, [id, order]);

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '6rem 0', color: 'var(--text-muted)' }}>
        Retrieving your confirmed handcrafted order...
      </div>
    );
  }

  if (!order) {
    return (
      <div className="container" style={{ padding: '6rem 1.5rem', textAlign: 'center' }}>
        <h2>Order Information Not Found</h2>
        <Link to="/orders" className="btn btn-primary" style={{ marginTop: '1.5rem' }}>
          View My Orders
        </Link>
      </div>
    );
  }

  return (
    <div style={{ padding: '4rem 0 6rem' }} id="order-confirmation-page">
      <div className="container" style={{ maxWidth: '800px' }}>
        {/* Success Header */}
        <div
          style={{
            textAlign: 'center',
            marginBottom: '3rem',
          }}
        >
          <div
            style={{
              width: '76px',
              height: '76px',
              borderRadius: '50%',
              backgroundColor: 'var(--secondary-light)',
              color: 'var(--secondary)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 1.5rem',
            }}
          >
            <CheckCircle size={42} />
          </div>
          <span className="badge badge-success" style={{ marginBottom: '0.5rem' }}>
            Payment Confirmed
          </span>
          <h1 style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>Thank You For Supporting Makers!</h1>
          <p style={{ fontSize: '1.05rem', color: 'var(--text-muted)' }}>
            Your order has been received and sent to the artisan studios for careful preparation.
          </p>
        </div>

        {/* Order Details Card */}
        <div className="card" style={{ padding: '2.5rem', marginBottom: '2.5rem' }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              paddingBottom: '1.5rem',
              borderBottom: '1px solid var(--border)',
              marginBottom: '1.5rem',
              flexWrap: 'wrap',
              gap: '1rem',
            }}
          >
            <div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-light)', textTransform: 'uppercase' }}>
                Order Number
              </div>
              <div style={{ fontWeight: 700, fontSize: '1.1rem' }} id="confirmed-order-id">
                #{order._id}
              </div>
            </div>

            <div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-light)', textTransform: 'uppercase' }}>
                Order Date
              </div>
              <div style={{ fontWeight: 600 }}>
                {new Date(order.createdAt).toLocaleDateString(undefined, {
                  year: 'numeric',
                  month: 'short',
                  day: 'numeric',
                })}
              </div>
            </div>

            <div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-light)', textTransform: 'uppercase' }}>
                Status
              </div>
              <span className="badge badge-amber">{order.orderStatus}</span>
            </div>
          </div>

          {/* Ordered Items */}
          <div style={{ marginBottom: '2rem' }}>
            <h4 style={{ marginBottom: '1rem' }}>Handcrafted Items ({order.orderItems?.length})</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {order.orderItems?.map((item, idx) => (
                <div
                  key={idx}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '0.75rem',
                    backgroundColor: 'var(--bg-card-subtle)',
                    borderRadius: 'var(--radius-md)',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <img
                      src={item.image}
                      alt={item.name}
                      style={{ width: '56px', height: '56px', borderRadius: 'var(--radius-sm)', objectFit: 'cover' }}
                    />
                    <div>
                      <div style={{ fontWeight: 600, fontSize: '0.95rem' }}>{item.name}</div>
                      <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                        Quantity: {item.quantity} × ${item.price.toFixed(2)}
                      </div>
                    </div>
                  </div>
                  <div style={{ fontWeight: 700, fontSize: '1rem' }}>
                    ${(item.price * item.quantity).toFixed(2)}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Shipping and Payout Info */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', marginBottom: '2rem', fontSize: '0.9rem' }}>
            <div>
              <h4 style={{ fontSize: '0.95rem', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <Truck size={16} /> Destination
              </h4>
              <p style={{ color: 'var(--text-main)', lineHeight: '1.5' }}>
                {order.shippingAddress.fullName}<br />
                {order.shippingAddress.address}<br />
                {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.postalCode}<br />
                {order.shippingAddress.country}
              </p>
            </div>

            <div>
              <h4 style={{ fontSize: '0.95rem', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <Heart size={16} color="var(--primary)" /> Maker Payout Impact
              </h4>
              <p style={{ color: 'var(--text-muted)', lineHeight: '1.5' }}>
                Total Paid: <strong>${order.totalAmount.toFixed(2)}</strong><br />
                Artisan Payout: <strong style={{ color: 'var(--secondary)' }}>${order.vendorPayout.toFixed(2)}</strong> (95%)<br />
                Platform Service: ${order.platformFee.toFixed(2)} (5%)
              </p>
            </div>
          </div>

          {/* Action buttons */}
          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
            <Link to="/orders" className="btn btn-primary" style={{ flex: 1 }}>
              <Package size={16} />
              Track in My Orders
            </Link>
            <Link to="/products" className="btn btn-outline" style={{ flex: 1 }}>
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderConfirmation;
