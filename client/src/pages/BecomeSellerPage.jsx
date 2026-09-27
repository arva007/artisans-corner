import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { becomeSeller } from '../redux/slices/authSlice';
import confetti from 'canvas-confetti';
import {
  Store,
  Sparkles,
  ShieldCheck,
  CheckCircle,
  AlertCircle,
  ArrowRight,
  Heart,
} from 'lucide-react';

const BecomeSellerPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);

  const [formData, setFormData] = useState({
    storeName: '',
    description: '',
    logo: '',
    banner: '',
    phone: '',
    address: '',
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (!formData.storeName || !formData.description) {
      setError('Please provide your studio name and craft story');
      return;
    }

    setLoading(true);

    const result = await dispatch(becomeSeller(formData));

    if (becomeSeller.fulfilled.match(result)) {
      try {
        confetti({
          particleCount: 150,
          spread: 80,
          origin: { y: 0.6 },
        });
      } catch (e) {}
      navigate('/dashboard/seller');
    } else {
      setError(result.payload || 'Failed to initialize artisan store');
      setLoading(false);
    }
  };

  // If already a vendor, offer shortcut to dashboard
  if (user && user.role === 'vendor') {
    return (
      <div className="container" style={{ padding: '6rem 1.5rem', textAlign: 'center' }}>
        <CheckCircle size={48} color="var(--secondary)" style={{ marginBottom: '1rem' }} />
        <h2>Your Artisan Studio Is Active!</h2>
        <p style={{ margin: '1rem 0 2rem', color: 'var(--text-muted)' }}>
          You are already registered as an artisan seller on Artisan's Corner.
        </p>
        <Link to="/dashboard/seller" className="btn btn-primary btn-lg">
          Go to Artisan Studio Dashboard
          <ArrowRight size={18} />
        </Link>
      </div>
    );
  }

  return (
    <div style={{ padding: '3.5rem 0 6rem' }} id="become-seller-page">
      <div className="container" style={{ maxWidth: '840px' }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <span className="badge badge-primary" style={{ marginBottom: '0.75rem' }}>
            Artisan Onboarding
          </span>
          <h1 style={{ fontSize: '2.5rem', marginBottom: '0.75rem' }}>
            Open Your Handcrafted Storefront
          </h1>
          <p style={{ maxWidth: '580px', margin: '0 auto', fontSize: '1.05rem', color: 'var(--text-muted)' }}>
            Join our curated community of independent makers. Share your craft with patrons who value human hands, natural materials, and authentic quality.
          </p>
        </div>

        {/* 3 Pillars info bar */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: '1.5rem',
            marginBottom: '3rem',
          }}
        >
          <div className="card" style={{ padding: '1.5rem', textAlign: 'center' }}>
            <div style={{ color: 'var(--primary)', fontWeight: 800, fontSize: '1.8rem', marginBottom: '0.25rem' }}>
              95%
            </div>
            <div style={{ fontWeight: 600, fontSize: '0.95rem', marginBottom: '0.25rem' }}>Net Maker Payout</div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>You keep 95% of every transaction</div>
          </div>

          <div className="card" style={{ padding: '1.5rem', textAlign: 'center' }}>
            <div style={{ color: 'var(--secondary)', fontWeight: 800, fontSize: '1.8rem', marginBottom: '0.25rem' }}>
              5%
            </div>
            <div style={{ fontWeight: 600, fontSize: '0.95rem', marginBottom: '0.25rem' }}>Platform Fee</div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Covers payment fees, hosting & reach</div>
          </div>

          <div className="card" style={{ padding: '1.5rem', textAlign: 'center' }}>
            <div style={{ color: 'var(--accent)', fontWeight: 800, fontSize: '1.8rem', marginBottom: '0.25rem' }}>
              $0
            </div>
            <div style={{ fontWeight: 600, fontSize: '0.95rem', marginBottom: '0.25rem' }}>Listing Fees</div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>List as many creations as you want for free</div>
          </div>
        </div>

        {error && (
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
          >
            <AlertCircle size={20} />
            <div>{error}</div>
          </div>
        )}

        {/* Onboarding Form */}
        <form onSubmit={handleSubmit} className="card" style={{ padding: '2.5rem' }}>
          <h3 style={{ fontSize: '1.3rem', marginBottom: '1.5rem', borderBottom: '1px solid var(--border)', paddingBottom: '0.75rem' }}>
            Studio Profile Information
          </h3>

          <div className="form-group">
            <label className="form-label" htmlFor="storeName">
              Studio / Brand Name *
            </label>
            <input
              type="text"
              id="storeName"
              name="storeName"
              className="form-control"
              placeholder="e.g. Terra & Timber Studio"
              required
              value={formData.storeName}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="description">
              Maker Story & Craftsmanship Philosophy *
            </label>
            <textarea
              id="description"
              name="description"
              className="form-control"
              rows={4}
              placeholder="Tell patrons about your craft: what materials do you use? What is your studio process? Why do you create?"
              required
              value={formData.description}
              onChange={handleChange}
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
            <div className="form-group">
              <label className="form-label" htmlFor="logo">
                Studio Logo URL
              </label>
              <input
                type="url"
                id="logo"
                name="logo"
                className="form-control"
                placeholder="https://images.unsplash.com/..."
                value={formData.logo}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="banner">
                Studio Banner Cover URL
              </label>
              <input
                type="url"
                id="banner"
                name="banner"
                className="form-control"
                placeholder="https://images.unsplash.com/..."
                value={formData.banner}
                onChange={handleChange}
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
            <div className="form-group">
              <label className="form-label" htmlFor="address">
                Studio Location (City, State / Country)
              </label>
              <input
                type="text"
                id="address"
                name="address"
                className="form-control"
                placeholder="e.g. Hood River, Oregon"
                value={formData.address}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="phone">
                Contact Phone
              </label>
              <input
                type="tel"
                id="phone"
                name="phone"
                className="form-control"
                placeholder="+1 (555) 000-0000"
                value={formData.phone}
                onChange={handleChange}
              />
            </div>
          </div>

          <div
            style={{
              backgroundColor: 'var(--bg-card-subtle)',
              padding: '1.25rem',
              borderRadius: 'var(--radius-md)',
              margin: '1.5rem 0',
              fontSize: '0.85rem',
              color: 'var(--text-muted)',
              lineHeight: '1.5',
            }}
          >
            By opening a studio storefront, you agree to fulfill orders mindfully, communicate openly with patrons, and adhere to our 5% platform commission policy.
          </div>

          <button
            type="submit"
            className="btn btn-primary btn-lg"
            id="submit-become-seller-btn"
            disabled={loading}
            style={{ width: '100%' }}
          >
            {loading ? 'Initializing Studio...' : 'Launch My Artisan Storefront'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default BecomeSellerPage;
