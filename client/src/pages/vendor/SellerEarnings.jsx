import React, { useEffect, useState } from 'react';
import API from '../../services/api';
import {
  DollarSign,
  TrendingUp,
  ShieldCheck,
  Calendar,
  CheckCircle,
  HelpCircle,
} from 'lucide-react';

const SellerEarnings = () => {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    API.get('/vendors/analytics')
      .then((res) => setAnalytics(res.data.analytics))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '5rem 0', color: 'var(--text-muted)' }}>
        Calculating studio earnings and payouts...
      </div>
    );
  }

  const grossSales = analytics?.totalSales || 0;
  const platformFee = analytics?.platformCommission || 0;
  const netEarnings = analytics?.totalEarnings || 0;

  return (
    <div id="seller-earnings-page">
      <div style={{ marginBottom: '2rem' }}>
        <h2>Earnings & Payout Breakdown</h2>
        <p>Transparent accounting with automatic 5% platform commission deductions</p>
      </div>

      {/* Financial Overview Cards */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon-wrapper" style={{ backgroundColor: 'var(--primary-light)', color: 'var(--primary)' }}>
            <DollarSign size={26} />
          </div>
          <div>
            <div className="stat-label">Gross Merchandise Sales</div>
            <div className="stat-val">${grossSales.toFixed(2)}</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon-wrapper" style={{ backgroundColor: 'var(--accent-light)', color: 'var(--accent)' }}>
            <DollarSign size={26} />
          </div>
          <div>
            <div className="stat-label">5% Marketplace Fee</div>
            <div className="stat-val">-${platformFee.toFixed(2)}</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon-wrapper" style={{ backgroundColor: 'var(--secondary-light)', color: 'var(--secondary)' }}>
            <TrendingUp size={26} />
          </div>
          <div>
            <div className="stat-label">Net Artisan Payout (95%)</div>
            <div className="stat-val" style={{ color: 'var(--secondary)' }}>
              ${netEarnings.toFixed(2)}
            </div>
          </div>
        </div>
      </div>

      {/* Commission transparency card */}
      <div className="card" style={{ padding: '2rem', marginBottom: '2.5rem' }}>
        <h3 style={{ fontSize: '1.2rem', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <ShieldCheck size={20} color="var(--secondary)" />
          How Artisan's Corner Commission Works
        </h3>
        <p style={{ lineHeight: '1.7', color: 'var(--text-muted)', marginBottom: '1rem' }}>
          To keep the marketplace sustainable while giving creators the highest return in the industry,
          we charge a flat <strong>5% platform fee</strong> per sale. The remaining <strong>95%</strong> is credited directly to your artisan payout balance.
        </p>

        <div
          style={{
            backgroundColor: 'var(--bg-card-subtle)',
            padding: '1.25rem',
            borderRadius: 'var(--radius-md)',
            border: '1px solid var(--border)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-around',
            textAlign: 'center',
            flexWrap: 'wrap',
            gap: '1rem',
          }}
        >
          <div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-light)', textTransform: 'uppercase' }}>Sample $100 Sale</div>
            <div style={{ fontWeight: 700, fontSize: '1.2rem' }}>$100.00</div>
          </div>
          <span style={{ fontSize: '1.5rem', color: 'var(--text-light)' }}>–</span>
          <div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-light)', textTransform: 'uppercase' }}>Platform Fee (5%)</div>
            <div style={{ fontWeight: 700, fontSize: '1.2rem', color: 'var(--primary)' }}>$5.00</div>
          </div>
          <span style={{ fontSize: '1.5rem', color: 'var(--text-light)' }}>=</span>
          <div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-light)', textTransform: 'uppercase' }}>Your Net Payout</div>
            <div style={{ fontWeight: 800, fontSize: '1.3rem', color: 'var(--secondary)' }}>$95.00</div>
          </div>
        </div>
      </div>

      {/* Payout schedule simulation */}
      <div className="card" style={{ padding: '2rem' }}>
        <h3 style={{ fontSize: '1.2rem', marginBottom: '1.25rem' }}>Automated Payout Simulation</h3>
        <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', marginBottom: '1.5rem' }}>
          Payouts are disbursed every Friday directly to your registered bank account via Stripe Connect.
        </p>

        <div className="table-wrapper">
          <table className="table">
            <thead>
              <tr>
                <th>Disbursement Date</th>
                <th>Transfer Reference</th>
                <th>Gross Volume</th>
                <th>Net Payout</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>{new Date().toLocaleDateString()}</td>
                <td style={{ fontFamily: 'monospace' }}>TR_SIM_{Date.now().toString().slice(-6)}</td>
                <td>${grossSales.toFixed(2)}</td>
                <td style={{ fontWeight: 700, color: 'var(--secondary)' }}>${netEarnings.toFixed(2)}</td>
                <td>
                  <span className="badge badge-success">Processed</span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default SellerEarnings;
