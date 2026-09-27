import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { updateProfile } from '../redux/slices/authSlice';
import {
  User,
  Mail,
  Store,
  Package,
  Check,
  AlertCircle,
  Key,
} from 'lucide-react';

const ProfilePage = () => {
  const dispatch = useDispatch();
  const { user, loading } = useSelector((state) => state.auth);

  const [formData, setFormData] = useState({
    name: user?.name || '',
    bio: user?.bio || '',
    profileImage: user?.profileImage || '',
    currentPassword: '',
    newPassword: '',
  });

  const [feedback, setFeedback] = useState(null);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFeedback(null);

    const payload = {
      name: formData.name,
      bio: formData.bio,
      profileImage: formData.profileImage,
    };

    if (formData.newPassword) {
      if (!formData.currentPassword) {
        setFeedback({ type: 'error', message: 'Current password required to change password' });
        return;
      }
      payload.currentPassword = formData.currentPassword;
      payload.newPassword = formData.newPassword;
    }

    const result = await dispatch(updateProfile(payload));
    if (updateProfile.fulfilled.match(result)) {
      setFeedback({ type: 'success', message: 'Profile updated successfully!' });
      setFormData((prev) => ({ ...prev, currentPassword: '', newPassword: '' }));
      setTimeout(() => setFeedback(null), 3500);
    } else {
      setFeedback({ type: 'error', message: result.payload || 'Failed to update profile' });
    }
  };

  return (
    <div style={{ padding: '3.5rem 0 6rem' }} id="user-profile-page">
      <div className="container" style={{ maxWidth: '820px' }}>
        <div style={{ marginBottom: '2.5rem' }}>
          <h1>My Patron Account</h1>
          <p>Manage your account settings, profile information, and artisan credentials</p>
        </div>

        {feedback && (
          <div
            style={{
              backgroundColor: feedback.type === 'success' ? 'var(--success-bg)' : 'var(--danger-bg)',
              color: feedback.type === 'success' ? 'var(--success)' : 'var(--danger)',
              padding: '1rem 1.25rem',
              borderRadius: 'var(--radius-md)',
              marginBottom: '2rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem',
            }}
          >
            {feedback.type === 'success' ? <Check size={18} /> : <AlertCircle size={18} />}
            <div>{feedback.message}</div>
          </div>
        )}

        <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: '2.5rem', alignItems: 'start' }}>
          {/* Main Edit Form */}
          <form onSubmit={handleSubmit} className="card" style={{ padding: '2rem' }}>
            <h3 style={{ fontSize: '1.2rem', marginBottom: '1.5rem', borderBottom: '1px solid var(--border)', paddingBottom: '0.75rem' }}>
              Personal Information
            </h3>

            <div className="form-group">
              <label className="form-label" htmlFor="profile-name">Full Name</label>
              <input
                type="text"
                id="profile-name"
                name="name"
                className="form-control"
                required
                value={formData.name}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Email Address (Read-only)</label>
              <input
                type="email"
                className="form-control"
                value={user?.email || ''}
                readOnly
                style={{ backgroundColor: 'var(--bg-card-subtle)', cursor: 'not-allowed' }}
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="profile-bio">Bio / About Me</label>
              <textarea
                id="profile-bio"
                name="bio"
                className="form-control"
                rows={3}
                placeholder="Share your appreciation for slow craft, pottery, or artisanal traditions..."
                value={formData.bio}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="profileImage">Profile Avatar URL</label>
              <input
                type="url"
                id="profileImage"
                name="profileImage"
                className="form-control"
                placeholder="https://images.unsplash.com/..."
                value={formData.profileImage}
                onChange={handleChange}
              />
            </div>

            <h3 style={{ fontSize: '1.2rem', margin: '2rem 0 1rem', borderBottom: '1px solid var(--border)', paddingBottom: '0.75rem' }}>
              Security & Password
            </h3>

            <div className="form-group">
              <label className="form-label" htmlFor="currentPassword">Current Password</label>
              <input
                type="password"
                id="currentPassword"
                name="currentPassword"
                className="form-control"
                placeholder="Leave blank if keeping existing password"
                value={formData.currentPassword}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="newPassword">New Password</label>
              <input
                type="password"
                id="newPassword"
                name="newPassword"
                className="form-control"
                placeholder="Minimum 6 characters"
                value={formData.newPassword}
                onChange={handleChange}
              />
            </div>

            <button
              type="submit"
              className="btn btn-primary btn-lg"
              disabled={loading}
              style={{ width: '100%', marginTop: '1rem' }}
            >
              {loading ? 'Saving Updates...' : 'Save Profile Changes'}
            </button>
          </form>

          {/* Account Role & Shortcuts Sidebar */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div className="card" style={{ padding: '1.75rem' }}>
              <h3 style={{ fontSize: '1.15rem', marginBottom: '1rem' }}>Account Role</h3>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
                <span
                  className={`badge ${
                    user?.role === 'admin'
                      ? 'badge-secondary'
                      : user?.role === 'vendor'
                      ? 'badge-primary'
                      : 'badge-amber'
                  }`}
                  style={{ fontSize: '0.85rem', padding: '0.35rem 0.85rem' }}
                >
                  {user?.role?.toUpperCase()}
                </span>
              </div>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: '1.5' }}>
                {user?.role === 'buyer' &&
                  'You currently have Buyer privileges. You can browse handcrafted pieces, order from independent studios, and leave verified reviews.'}
                {user?.role === 'vendor' &&
                  'You have Vendor privileges. You can list handcrafted creations, manage inventory, and fulfill customer orders in your Studio.'}
                {user?.role === 'admin' &&
                  'You have Administrative privileges with platform-wide governance and revenue analytics access.'}
              </p>

              {user?.role === 'buyer' && (
                <Link
                  to="/become-seller"
                  className="btn btn-outline btn-sm"
                  style={{ width: '100%', marginTop: '1.25rem' }}
                >
                  <Store size={16} />
                  Upgrade to Artisan Vendor
                </Link>
              )}
            </div>

            <div className="card" style={{ padding: '1.75rem' }}>
              <h3 style={{ fontSize: '1.15rem', marginBottom: '1rem' }}>Quick Shortcuts</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                <Link to="/orders" className="btn btn-outline btn-sm" style={{ justifyContent: 'flex-start' }}>
                  <Package size={16} />
                  My Purchase Orders
                </Link>
                {user?.role === 'vendor' && (
                  <Link to="/dashboard/seller" className="btn btn-outline btn-sm" style={{ justifyContent: 'flex-start' }}>
                    <Store size={16} />
                    Artisan Studio Dashboard
                  </Link>
                )}
                {user?.role === 'admin' && (
                  <Link to="/dashboard/admin" className="btn btn-outline btn-sm" style={{ justifyContent: 'flex-start' }}>
                    <User size={16} />
                    Admin Control Center
                  </Link>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
