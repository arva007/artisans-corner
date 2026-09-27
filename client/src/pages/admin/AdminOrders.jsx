import React, { useEffect, useState } from 'react';
import API from '../../services/api';
import { ShoppingBag, Truck, CheckCircle } from 'lucide-react';

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    API.get('/orders/admin/all')
      .then((res) => setOrders(res.data.orders))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '5rem 0', color: 'var(--text-muted)' }}>
        Loading global marketplace orders...
      </div>
    );
  }

  return (
    <div id="admin-orders-page">
      <div style={{ marginBottom: '2rem' }}>
        <h2>Global Orders Inspector ({orders.length})</h2>
        <p>Real-time log of customer transactions, payment settlements, and fulfillment lifecycles</p>
      </div>

      <div className="table-wrapper">
        <table className="table" id="admin-orders-table">
          <thead>
            <tr>
              <th>Order ID</th>
              <th>Date</th>
              <th>Customer</th>
              <th>Gross GMV</th>
              <th>Platform 5%</th>
              <th>Vendor Payout</th>
              <th>Fulfillment</th>
            </tr>
          </thead>
          <tbody>
            {orders.length === 0 ? (
              <tr>
                <td colSpan={7} style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
                  No marketplace orders yet.
                </td>
              </tr>
            ) : orders.map((ord) => (
              <tr key={ord._id}>
                <td style={{ fontWeight: 600, fontSize: '0.85rem' }}>#{ord._id.slice(-8)}</td>
                <td>{new Date(ord.createdAt).toLocaleDateString()}</td>
                <td>
                  <div>{ord.buyer?.name || 'Customer'}</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-light)' }}>{ord.buyer?.email}</div>
                </td>
                <td style={{ fontWeight: 700 }}>${ord.totalAmount?.toFixed(2)}</td>
                <td style={{ fontWeight: 600, color: 'var(--primary)' }}>
                  ${ord.platformFee?.toFixed(2)}
                </td>
                <td style={{ fontWeight: 600, color: 'var(--secondary)' }}>
                  ${ord.vendorPayout?.toFixed(2)}
                </td>
                <td>
                  <span
                    className={`badge ${
                      ord.orderStatus === 'Delivered'
                        ? 'badge-success'
                        : ord.orderStatus === 'Shipped'
                        ? 'badge-secondary'
                        : 'badge-amber'
                    }`}
                  >
                    {ord.orderStatus}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminOrders;
