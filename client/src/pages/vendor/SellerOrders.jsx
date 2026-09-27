import React, { useEffect, useState } from 'react';
import API from '../../services/api';
import {
  ShoppingBag,
  Truck,
  CheckCircle,
  Clock,
  AlertCircle,
  ExternalLink,
} from 'lucide-react';

const SellerOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [updatingId, setUpdatingId] = useState(null);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const res = await API.get('/orders/vendor/my-orders');
      setOrders(res.data.orders);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch vendor orders');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleStatusUpdate = async (orderId, newStatus) => {
    setUpdatingId(orderId);
    try {
      await API.put(`/orders/${orderId}/status`, { orderStatus: newStatus });
      setOrders(
        orders.map((ord) =>
          ord._id === orderId ? { ...ord, orderStatus: newStatus } : ord
        )
      );
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to update order status');
    } finally {
      setUpdatingId(null);
    }
  };

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '5rem 0', color: 'var(--text-muted)' }}>
        Loading customer orders...
      </div>
    );
  }

  return (
    <div id="seller-orders-page">
      <div style={{ marginBottom: '2rem' }}>
        <h2>Customer Orders & Fulfillment</h2>
        <p>Review customer shipping addresses and mark packages as shipped or delivered</p>
      </div>

      {orders.length === 0 ? (
        <div className="card" style={{ padding: '4rem 2rem', textAlign: 'center' }}>
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
          <h3>No Orders Received Yet</h3>
          <p style={{ margin: '0.5rem 0 1.5rem', color: 'var(--text-muted)' }}>
            Once a buyer orders pieces from your studio, their order and delivery destination will appear here.
          </p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
          {orders.map((order) => (
            <div key={order._id} className="card" style={{ padding: '2rem' }}>
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
                <div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-light)', textTransform: 'uppercase' }}>
                    Order ID
                  </div>
                  <div style={{ fontWeight: 700, fontSize: '0.95rem' }}>#{order._id}</div>
                </div>

                <div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-light)', textTransform: 'uppercase' }}>
                    Date
                  </div>
                  <div style={{ fontSize: '0.9rem' }}>
                    {new Date(order.createdAt).toLocaleDateString()}
                  </div>
                </div>

                <div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-light)', textTransform: 'uppercase' }}>
                    Studio Payout (Est)
                  </div>
                  <div style={{ fontWeight: 700, color: 'var(--secondary)' }}>
                    ${(order.vendorSubtotal * 0.95).toFixed(2)}
                  </div>
                </div>

                {/* Status Update Dropdown */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <label htmlFor={`status-select-${order._id}`} style={{ fontSize: '0.85rem', fontWeight: 600 }}>
                    Status:
                  </label>
                  <select
                    id={`status-select-${order._id}`}
                    className="form-control"
                    style={{ width: 'auto', padding: '0.4rem 0.85rem', fontSize: '0.85rem' }}
                    value={order.orderStatus}
                    disabled={updatingId === order._id}
                    onChange={(e) => handleStatusUpdate(order._id, e.target.value)}
                  >
                    <option value="Processing">Processing</option>
                    <option value="Shipped">Shipped</option>
                    <option value="Delivered">Delivered</option>
                    <option value="Cancelled">Cancelled</option>
                  </select>
                </div>
              </div>

              {/* Items belonging to vendor */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '1.25rem' }}>
                {order.orderItems.map((item, idx) => (
                  <div
                    key={idx}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '0.65rem 0.85rem',
                      backgroundColor: 'var(--bg-card-subtle)',
                      borderRadius: 'var(--radius-sm)',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
                      <img
                        src={item.image}
                        alt={item.name}
                        style={{ width: '44px', height: '44px', borderRadius: 'var(--radius-sm)', objectFit: 'cover' }}
                      />
                      <div>
                        <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>{item.name}</div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                          Qty: {item.quantity} × ${item.price.toFixed(2)}
                        </div>
                      </div>
                    </div>
                    <div style={{ fontWeight: 700, fontSize: '0.95rem' }}>
                      ${(item.price * item.quantity).toFixed(2)}
                    </div>
                  </div>
                ))}
              </div>

              {/* Shipping address info */}
              <div
                style={{
                  padding: '0.85rem 1.25rem',
                  backgroundColor: 'var(--primary-light)',
                  borderRadius: 'var(--radius-md)',
                  fontSize: '0.85rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem',
                }}
              >
                <Truck size={18} color="var(--primary)" />
                <div>
                  <strong>Ship to: </strong>
                  {order.shippingAddress.fullName} • {order.shippingAddress.address}, {order.shippingAddress.city},{' '}
                  {order.shippingAddress.state} {order.shippingAddress.postalCode} ({order.shippingAddress.phone})
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SellerOrders;
