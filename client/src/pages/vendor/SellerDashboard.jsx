import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import API from '../../services/api';
import {
  DollarSign,
  Package,
  ShoppingBag,
  TrendingUp,
  PlusCircle,
  Store,
  ExternalLink,
  Clock,
  CheckCircle,
} from 'lucide-react';

const SellerDashboard = () => {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        setLoading(true);
        const res = await API.get('/vendors/analytics');
        setAnalytics(res.data.analytics);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch vendor analytics');
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, []);

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '5rem 0', color: 'var(--text-muted)' }}>
        Loading Artisan Studio analytics...
      </div>
    );
  }

  if (error || !analytics) {
    return (
      <div className="card" style={{ padding: '3rem', textAlign: 'center' }}>
        <p style={{ color: 'var(--danger)', marginBottom: '1.5rem' }}>{error || 'Could not load studio metrics'}</p>
        <Link to="/become-seller" className="btn btn-primary">
          Complete Studio Onboarding
        </Link>
      </div>
    );
  }

  return (
    <div id="seller-dashboard-page">
      {/* Top Banner */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '1rem',
          marginBottom: '2rem',
        }}
      >
        <div>
          <h2>Artisan Studio Overview</h2>
          <p>Real-time metrics, order fulfillment, and net earnings</p>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <Link to="/dashboard/seller/products/new" className="btn btn-primary btn-sm" id="dashboard-add-craft-btn">
            <PlusCircle size={16} />
            Add New Craft
          </Link>
          <Link to="/dashboard/seller/profile" className="btn btn-outline btn-sm">
            <Store size={16} />
            Edit Store Profile
          </Link>
        </div>
      </div>

      {/* KPI Stats Grid */}
      <div className="stats-grid">
        {/* Gross Sales */}
        <div className="stat-card">
          <div className="stat-icon-wrapper" style={{ backgroundColor: 'var(--primary-light)', color: 'var(--primary)' }}>
            <DollarSign size={26} />
          </div>
          <div>
            <div className="stat-label">Gross Sales</div>
            <div className="stat-val">${analytics.totalSales?.toFixed(2) || '0.00'}</div>
          </div>
        </div>

        {/* Net Earnings (95%) */}
        <div className="stat-card">
          <div className="stat-icon-wrapper" style={{ backgroundColor: 'var(--secondary-light)', color: 'var(--secondary)' }}>
            <TrendingUp size={26} />
          </div>
          <div>
            <div className="stat-label">Net Payout (95%)</div>
            <div className="stat-val" style={{ color: 'var(--secondary)' }}>
              ${analytics.totalEarnings?.toFixed(2) || '0.00'}
            </div>
          </div>
        </div>

        {/* Platform Fee (5%) */}
        <div className="stat-card">
          <div className="stat-icon-wrapper" style={{ backgroundColor: 'var(--accent-light)', color: 'var(--accent)' }}>
            <DollarSign size={26} />
          </div>
          <div>
            <div className="stat-label">5% Platform Fee</div>
            <div className="stat-val">${analytics.platformCommission?.toFixed(2) || '0.00'}</div>
          </div>
        </div>

        {/* Total Orders */}
        <div className="stat-card">
          <div className="stat-icon-wrapper" style={{ backgroundColor: 'var(--bg-card-subtle)', color: 'var(--text-main)' }}>
            <ShoppingBag size={26} />
          </div>
          <div>
            <div className="stat-label">Orders Handled</div>
            <div className="stat-val">{analytics.totalOrders || 0}</div>
          </div>
        </div>

        {/* Active Products */}
        <div className="stat-card">
          <div className="stat-icon-wrapper" style={{ backgroundColor: 'var(--bg-card-subtle)', color: 'var(--text-main)' }}>
            <Package size={26} />
          </div>
          <div>
            <div className="stat-label">Active Listings</div>
            <div className="stat-val">{analytics.totalProducts || 0}</div>
          </div>
        </div>
      </div>

      {/* Sales Visual Chart representation */}
      <div className="card" style={{ padding: '2rem', marginBottom: '2.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
          <div>
            <h3 style={{ fontSize: '1.15rem' }}>Sales & Volume Distribution</h3>
            <p style={{ fontSize: '0.85rem' }}>Visual breakdown of gross revenue, artisan net payout, and marketplace fees</p>
          </div>
          <span className="badge badge-secondary">95% Maker Retention Rate</span>
        </div>

        {/* Interactive progress/revenue bar chart */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '0.4rem' }}>
              <span>Artisan Payout Share (95%)</span>
              <strong style={{ color: 'var(--secondary)' }}>${analytics.totalEarnings?.toFixed(2) || '0.00'}</strong>
            </div>
            <div style={{ height: '14px', backgroundColor: 'var(--bg-card-subtle)', borderRadius: 'var(--radius-full)', overflow: 'hidden' }}>
              <div
                style={{
                  height: '100%',
                  width: `${analytics.totalSales > 0 ? (analytics.totalEarnings / analytics.totalSales) * 100 : 95}%`,
                  backgroundColor: 'var(--secondary)',
                  borderRadius: 'var(--radius-full)',
                }}
              />
            </div>
          </div>

          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '0.4rem' }}>
              <span>Platform Service & Hosting Fee (5%)</span>
              <strong style={{ color: 'var(--primary)' }}>${analytics.platformCommission?.toFixed(2) || '0.00'}</strong>
            </div>
            <div style={{ height: '14px', backgroundColor: 'var(--bg-card-subtle)', borderRadius: 'var(--radius-full)', overflow: 'hidden' }}>
              <div
                style={{
                  height: '100%',
                  width: `${analytics.totalSales > 0 ? (analytics.platformCommission / analytics.totalSales) * 100 : 5}%`,
                  backgroundColor: 'var(--primary)',
                  borderRadius: 'var(--radius-full)',
                }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Recent Orders Table */}
      <div className="table-wrapper">
        <div
          style={{
            padding: '1.25rem 1.5rem',
            borderBottom: '1px solid var(--border)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <h3 style={{ fontSize: '1.15rem' }}>Recent Studio Orders</h3>
          <Link to="/dashboard/seller/orders" style={{ fontSize: '0.85rem', color: 'var(--primary)', fontWeight: 600 }}>
            Manage All Orders →
          </Link>
        </div>

        {analytics.recentOrders && analytics.recentOrders.length > 0 ? (
          <table className="table" id="seller-recent-orders-table">
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Date</th>
                <th>Customer</th>
                <th>Items</th>
                <th>Studio Share</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {analytics.recentOrders.map((ord) => (
                <tr key={ord._id}>
                  <td style={{ fontWeight: 600, fontSize: '0.85rem' }}>#{ord._id.slice(-8)}</td>
                  <td>{new Date(ord.createdAt).toLocaleDateString()}</td>
                  <td>{ord.buyer}</td>
                  <td>{ord.itemsCount}</td>
                  <td style={{ fontWeight: 700, color: 'var(--primary)' }}>${ord.vendorSubtotal?.toFixed(2)}</td>
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
        ) : (
          <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)' }}>
            No orders received yet. Once customers purchase your creations, they will appear here!
          </div>
        )}
      </div>
    </div>
  );
};

export default SellerDashboard;
