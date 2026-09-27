import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { loginUser, clearError } from '../redux/slices/authSlice';
import {
  Sparkles,
  Lock,
  Mail,
  ArrowRight,
  AlertCircle,
  CheckCircle,
  Store,
  User,
  ShieldCheck,
} from 'lucide-react';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const { user, loading, error } = useSelector((state) => state.auth);

  // Check redirect URL parameter
  const searchParams = new URLSearchParams(location.search);
  const redirect = searchParams.get('redirect') || (location.state?.from?.pathname || '/');

  useEffect(() => {
    dispatch(clearError());
    if (user) {
      navigate(redirect);
    }
  }, [user, navigate, redirect, dispatch]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) return;
    dispatch(loginUser({ email, password }));
  };

  const handleQuickDemoLogin = (demoEmail, demoPassword) => {
    setEmail(demoEmail);
    setPassword(demoPassword);
    dispatch(loginUser({ email: demoEmail, password: demoPassword }));
  };

  return (
    <div style={{ padding: '4rem 1.5rem 6rem' }} id="login-page">
      <div className="container" style={{ maxWidth: '480px' }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
          <div
            style={{
              width: '48px',
              height: '48px',
              borderRadius: '12px',
              backgroundColor: 'var(--primary-light)',
              color: 'var(--primary)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 1rem',
            }}
          >
            <Sparkles size={26} />
          </div>
          <h1 style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>Welcome Back</h1>
          <p style={{ fontSize: '0.95rem', color: 'var(--text-muted)' }}>
            Sign in to access your handcrafted purchases, studio, or admin dashboard
          </p>
        </div>

        {error && (
          <div
            style={{
              backgroundColor: 'var(--danger-bg)',
              color: 'var(--danger)',
              padding: '0.85rem 1.25rem',
              borderRadius: 'var(--radius-md)',
              marginBottom: '1.5rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              fontSize: '0.9rem',
            }}
            id="login-error-message"
          >
            <AlertCircle size={18} />
            <div>{error}</div>
          </div>
        )}

        {/* Demo Accounts Instant Fill */}
        <div
          className="card"
          style={{
            padding: '1.25rem',
            marginBottom: '2rem',
            backgroundColor: 'var(--bg-card-subtle)',
            border: '1px solid var(--border)',
          }}
        >
          <div style={{ fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-light)', marginBottom: '0.75rem' }}>
            Instant Demo Account Switcher
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.5rem' }}>
            <button
              type="button"
              className="btn btn-outline btn-sm"
              onClick={() => handleQuickDemoLogin('buyer@artisancorner.com', 'Buyer123!')}
              id="quick-login-buyer"
              style={{ fontSize: '0.75rem', padding: '0.4rem 0.2rem' }}
            >
              <User size={13} />
              Buyer
            </button>
            <button
              type="button"
              className="btn btn-outline btn-sm"
              onClick={() => handleQuickDemoLogin('vendor@artisancorner.com', 'Vendor123!')}
              id="quick-login-vendor"
              style={{ fontSize: '0.75rem', padding: '0.4rem 0.2rem', color: 'var(--primary)' }}
            >
              <Store size={13} />
              Artisan
            </button>
            <button
              type="button"
              className="btn btn-outline btn-sm"
              onClick={() => handleQuickDemoLogin('admin@artisancorner.com', 'Admin123!')}
              id="quick-login-admin"
              style={{ fontSize: '0.75rem', padding: '0.4rem 0.2rem', color: 'var(--secondary)' }}
            >
              <ShieldCheck size={13} />
              Admin
            </button>
          </div>
        </div>

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="card" style={{ padding: '2.5rem' }}>
          <div className="form-group">
            <label className="form-label" htmlFor="email-input">
              Email Address
            </label>
            <input
              type="email"
              id="email-input"
              className="form-control"
              placeholder="you@artisancorner.com"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="form-group" style={{ marginBottom: '1.75rem' }}>
            <label className="form-label" htmlFor="password-input">
              Password
            </label>
            <input
              type="password"
              id="password-input"
              className="form-control"
              placeholder="••••••••"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button
            type="submit"
            className="btn btn-primary btn-lg"
            id="login-submit-btn"
            disabled={loading}
            style={{ width: '100%' }}
          >
            {loading ? 'Authenticating...' : 'Sign In'}
            <ArrowRight size={16} />
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: '1.75rem', fontSize: '0.9rem', color: 'var(--text-muted)' }}>
          Don't have an artisan or patron account yet?{' '}
          <Link to="/register" style={{ color: 'var(--primary)', fontWeight: 600 }}>
            Create one free
          </Link>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
