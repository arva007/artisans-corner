import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { registerUser, clearError } from '../redux/slices/authSlice';
import {
  Sparkles,
  ArrowRight,
  AlertCircle,
  User,
  Store,
} from 'lucide-react';

const RegisterPage = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('buyer');

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user, loading, error } = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(clearError());
    if (user) {
      if (user.role === 'vendor') {
        navigate('/become-seller');
      } else {
        navigate('/');
      }
    }
  }, [user, navigate, dispatch]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name || !email || !password) return;
    dispatch(registerUser({ name, email, password, role }));
  };

  return (
    <div style={{ padding: '4rem 1.5rem 6rem' }} id="register-page">
      <div className="container" style={{ maxWidth: '520px' }}>
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
          <h1 style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>Join Artisan's Corner</h1>
          <p style={{ fontSize: '0.95rem', color: 'var(--text-muted)' }}>
            Become part of a mindful community celebrating slow craft and independent makers
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
            id="register-error-message"
          >
            <AlertCircle size={18} />
            <div>{error}</div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="card" style={{ padding: '2.5rem' }}>
          {/* Role selector */}
          <div style={{ marginBottom: '1.75rem' }}>
            <label className="form-label" style={{ marginBottom: '0.5rem' }}>
              I want to join as a:
            </label>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div
                style={{
                  border: `2px solid ${role === 'buyer' ? 'var(--primary)' : 'var(--border)'}`,
                  borderRadius: 'var(--radius-md)',
                  padding: '1rem',
                  cursor: 'pointer',
                  textAlign: 'center',
                  backgroundColor: role === 'buyer' ? 'var(--primary-light)' : 'transparent',
                }}
                onClick={() => setRole('buyer')}
              >
                <User size={22} style={{ color: role === 'buyer' ? 'var(--primary)' : 'var(--text-muted)', marginBottom: '4px' }} />
                <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>Mindful Buyer</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Discover & collect handmade wares</div>
              </div>

              <div
                style={{
                  border: `2px solid ${role === 'vendor' ? 'var(--primary)' : 'var(--border)'}`,
                  borderRadius: 'var(--radius-md)',
                  padding: '1rem',
                  cursor: 'pointer',
                  textAlign: 'center',
                  backgroundColor: role === 'vendor' ? 'var(--primary-light)' : 'transparent',
                }}
                onClick={() => setRole('vendor')}
              >
                <Store size={22} style={{ color: role === 'vendor' ? 'var(--primary)' : 'var(--text-muted)', marginBottom: '4px' }} />
                <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>Artisan Seller</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Open a studio & list creations</div>
              </div>
            </div>
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="register-name">
              Full Name
            </label>
            <input
              type="text"
              id="register-name"
              className="form-control"
              placeholder="e.g. Maya Lin"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="register-email">
              Email Address
            </label>
            <input
              type="email"
              id="register-email"
              className="form-control"
              placeholder="you@artisancorner.com"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="form-group" style={{ marginBottom: '2rem' }}>
            <label className="form-label" htmlFor="register-password">
              Password
            </label>
            <input
              type="password"
              id="register-password"
              className="form-control"
              placeholder="At least 6 characters"
              required
              minLength={6}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button
            type="submit"
            className="btn btn-primary btn-lg"
            id="register-submit-btn"
            disabled={loading}
            style={{ width: '100%' }}
          >
            {loading ? 'Creating Account...' : 'Create My Account'}
            <ArrowRight size={16} />
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: '1.75rem', fontSize: '0.9rem', color: 'var(--text-muted)' }}>
          Already have an account?{' '}
          <Link to="/login" style={{ color: 'var(--primary)', fontWeight: 600 }}>
            Sign In here
          </Link>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
