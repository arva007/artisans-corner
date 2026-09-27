import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import API from '../services/api';
import {
  Package,
  Clock,
  CheckCircle,
  Truck,
  ExternalLink,
  ShoppingBag,
  ArrowRight,
} from 'lucide-react';

const OrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        const res = await API.get('/orders/my-orders');
        setOrders(res.data.orders);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch your orders');
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Delivered':
        return <span className="badge badge-success">Delivered</span>;
      case 'Shipped':
        return <span className="badge badge-secondary">Shipped</span>;
      case 'Processing':
        return <span className="badge badge-amber">Processing</span>;
      case 'Cancelled':
        return <span className="badge badge-danger">Cancelled</span>;
      default:
        return <span className="badge badge-primary">{status}</span>;
    }
  };

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '6rem 0', color: 'var(--text-muted)' }}>
        Loading your handcrafted orders...
      </div>
    );
  }

  return (
    <div style={{ padding: '3rem 0 6rem' }} id="orders-page">
      <div className="container">
        <div style={{ marginBottom: '2.5rem' }}>
          <h1>My Handcrafted Purchases</h1>
          <p>Track delivery status and leave reviews for your handcrafted treasures</p>
        </div>

        {orders.length === 0 ? (
          <div
            className="card"
            style={{
              padding: '4rem 2rem',
              textAlign: 'center',
              maxWidth: '540px',
              margin: '0 auto',
            }}
          >
            <div
              style={{
                width: '64px',
                height: '64px',
                borderRadius: '50%',
                backgroundColor: 'var(--primary-light)',
                color: 'var(--primary)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 1.5rem',
              }}
            >
              <ShoppingBag size={30} />
            </div>
            <h3>No Orders Yet</h3>
            <p style={{ margin: '0.75rem 0 1.75rem', color: 'var(--text-muted)' }}>
              You haven't placed any orders yet. Discover unique pottery, woodwork, and textiles crafted with care.
            </p>
            <Link to="/products" className="btn btn-primary">
              Explore Handmade Marketplace
              <ArrowRight size={16} />
            </Link>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            {orders.map((order) => (
              <div
                key={order._id}
                className="card"
                style={{ padding: '2rem' }}
                id={`order-card-${order._id}`}
              >
                {/* Order Header Bar */}
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    flexWrap: 'wrap',
                    gap: '1rem',
                    paddingBottom: '1.25rem',
                    borderBottom: '1px solid var(--border)',
                    marginBottom: '1.25rem',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', flexWrap: 'wrap' }}>
                    <div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-light)', textTransform: 'uppercase' }}>
                        Order ID
                      </div>
                      <div style={{ fontWeight: 700, fontSize: '0.95rem' }}>#{order._id}</div>
                    </div>

                    <div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-light)', textTransform: 'uppercase' }}>
                        Date Placed
                      </div>
                      <div style={{ fontSize: '0.9rem', color: 'var(--text-main)' }}>
                        {new Date(order.createdAt).toLocaleDateString(undefined, {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric',
                        })}
                      </div>
                    </div>

                    <div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-light)', textTransform: 'uppercase' }}>
                        Total Paid
                      </div>
                      <div style={{ fontWeight: 700, color: 'var(--primary)' }}>
                        ${order.totalAmount.toFixed(2)}
                      </div>
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    {getStatusBadge(order.orderStatus)}
                    <span className="badge badge-success" style={{ fontSize: '0.7rem' }}>
                      {order.paymentStatus}
                    </span>
                  </div>
                </div>

                {/* Items in this order */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '1.5rem' }}>
                  {order.orderItems.map((item, idx) => (
                    <div
                      key={idx}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        flexWrap: 'wrap',
                        gap: '1rem',
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        <img
                          src={item.image}
                          alt={item.name}
                          style={{ width: '60px', height: '60px', borderRadius: 'var(--radius-md)', objectFit: 'cover' }}
                        />
                        <div>
                          <Link
                            to={`/products/${item.product}`}
                            style={{ fontWeight: 600, fontSize: '0.95rem', color: 'var(--text-main)' }}
                          >
                            {item.name}
                          </Link>
                          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                            Studio: {item.vendor?.storeName || 'Artisan Studio'} • Qty: {item.quantity} × ${item.price.toFixed(2)}
                          </div>
                        </div>
                      </div>

                      <div>
                        {/* Link to leave a review */}
                        <Link
                          to={`/products/${item.product}#product-reviews-section`}
                          className="btn btn-outline btn-sm"
                          style={{ fontSize: '0.8rem' }}
                        >
                          Write a Review
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Shipping info footer */}
                <div
                  style={{
                    backgroundColor: 'var(--bg-card-subtle)',
                    padding: '0.85rem 1.25rem',
                    borderRadius: 'var(--radius-md)',
                    fontSize: '0.85rem',
                    color: 'var(--text-muted)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                  }}
                >
                  <Truck size={15} color="var(--primary)" />
                  <span>
                    Delivering to <strong>{order.shippingAddress.fullName}</strong> in {order.shippingAddress.city}, {order.shippingAddress.state} ({order.shippingAddress.country})
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default OrdersPage;
