import React, { useEffect, useState } from 'react';
import API from '../../services/api';
import {
  DollarSign,
  TrendingUp,
  Users,
  Store,
  Package,
  ShoppingBag,
  ShieldCheck,
  Award,
} from 'lucide-react';

const AdminDashboard = () => {
  const [metrics, setMetrics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    API.get('/admin/analytics')
      .then((res) => setMetrics(res.data.metrics))
      .catch((err) => setError(err.response?.data?.message || 'Failed to fetch admin metrics'))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '5rem 0', color: 'var(--text-muted)' }}>
        Loading platform analytics...
      </div>
    );
  }

  if (error || !metrics) {
    return (
      <div className="card" style={{ padding: '3rem', textAlign: 'center' }}>
        <p style={{ color: 'var(--danger)' }}>{error || 'Failed to load metrics'}</p>
      </div>
    );
  }

  return (
    <div id="admin-dashboard-page">
      <div style={{ marginBottom: '2rem' }}>
        <h2>Marketplace Platform Control</h2>
        <p>Global revenue, active artisan count, transaction volumes, and 5% commission yield</p>
      </div>

      {/* KPI Stats Grid */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon-wrapper" style={{ backgroundColor: 'var(--primary-light)', color: 'var(--primary)' }}>
            <DollarSign size={26} />
          </div>
          <div>
            <div className="stat-label">Gross Merchandise Value</div>
            <div className="stat-val">${metrics.grossMerchandiseValue?.toFixed(2) || '0.00'}</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon-wrapper" style={{ backgroundColor: 'var(--accent-light)', color: 'var(--accent)' }}>
            <Award size={26} />
          </div>
          <div>
            <div className="stat-label">Platform Revenue (5%)</div>
            <div className="stat-val" style={{ color: 'var(--primary)' }}>
              ${metrics.totalPlatformCommission?.toFixed(2) || '0.00'}
            </div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon-wrapper" style={{ backgroundColor: 'var(--secondary-light)', color: 'var(--secondary)' }}>
            <TrendingUp size={26} />
          </div>
          <div>
            <div className="stat-label">Vendor Disbursements</div>
            <div className="stat-val" style={{ color: 'var(--secondary)' }}>
              ${metrics.totalVendorPayouts?.toFixed(2) || '0.00'}
            </div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon-wrapper" style={{ backgroundColor: 'var(--bg-card-subtle)', color: 'var(--text-main)' }}>
            <Users size={26} />
          </div>
          <div>
            <div className="stat-label">Total Users</div>
            <div className="stat-val">{metrics.totalUsers || 0}</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon-wrapper" style={{ backgroundColor: 'var(--bg-card-subtle)', color: 'var(--text-main)' }}>
            <Store size={26} />
          </div>
          <div>
            <div className="stat-label">Artisan Stores</div>
            <div className="stat-val">{metrics.totalStores || 0}</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon-wrapper" style={{ backgroundColor: 'var(--bg-card-subtle)', color: 'var(--text-main)' }}>
            <ShoppingBag size={26} />
          </div>
          <div>
            <div className="stat-label">Total Orders</div>
            <div className="stat-val">{metrics.totalOrders || 0}</div>
          </div>
        </div>
      </div>

      {/* User breakdown */}
      <div className="card" style={{ padding: '2rem', marginBottom: '2.5rem' }}>
        <h3 style={{ fontSize: '1.15rem', marginBottom: '1.25rem' }}>User Community Breakdown</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1.5rem' }}>
          <div style={{ padding: '1rem', backgroundColor: 'var(--bg-card-subtle)', borderRadius: 'var(--radius-md)' }}>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-light)', textTransform: 'uppercase' }}>Buyers</div>
            <div style={{ fontSize: '1.5rem', fontWeight: 700 }}>{metrics.breakdown?.buyers || 0}</div>
          </div>
          <div style={{ padding: '1rem', backgroundColor: 'var(--primary-light)', borderRadius: 'var(--radius-md)' }}>
            <div style={{ fontSize: '0.8rem', color: 'var(--primary)', textTransform: 'uppercase' }}>Artisans / Vendors</div>
            <div style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--primary)' }}>{metrics.breakdown?.vendors || 0}</div>
          </div>
          <div style={{ padding: '1rem', backgroundColor: 'var(--secondary-light)', borderRadius: 'var(--radius-md)' }}>
            <div style={{ fontSize: '0.8rem', color: 'var(--secondary)', textTransform: 'uppercase' }}>Staff Admins</div>
            <div style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--secondary)' }}>{metrics.breakdown?.admins || 0}</div>
          </div>
        </div>
      </div>

      {/* Recent Orders Overview */}
      <div className="table-wrapper">
        <div style={{ padding: '1.25rem 1.5rem', borderBottom: '1px solid var(--border)' }}>
          <h3 style={{ fontSize: '1.15rem' }}>Recent Platform Transactions</h3>
        </div>

        {metrics.recentOrders && metrics.recentOrders.length > 0 ? (
          <table className="table">
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Customer</th>
                <th>GMV Total</th>
                <th>Platform Fee (5%)</th>
                <th>Payment</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {metrics.recentOrders.map((ord) => (
                <tr key={ord._id}>
                  <td style={{ fontWeight: 600, fontSize: '0.85rem' }}>#{ord._id.slice(-8)}</td>
                  <td>{ord.buyer?.name || 'Customer'}</td>
                  <td style={{ fontWeight: 700 }}>${ord.totalAmount?.toFixed(2)}</td>
                  <td style={{ fontWeight: 600, color: 'var(--primary)' }}>${ord.platformFee?.toFixed(2)}</td>
                  <td>
                    <span className="badge badge-success">{ord.paymentStatus}</span>
                  </td>
                  <td>
                    <span className="badge badge-amber">{ord.orderStatus}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div style={{ padding: '2.5rem', textAlign: 'center', color: 'var(--text-muted)' }}>
            No platform orders recorded yet.
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
