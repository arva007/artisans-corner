import React, { useEffect, useState } from 'react';
import API from '../../services/api';
import { Store, Check, AlertCircle } from 'lucide-react';

const SellerProfile = () => {
  const [formData, setFormData] = useState({
    storeName: '',
    description: '',
    logo: '',
    banner: '',
    phone: '',
    address: '',
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    API.get('/vendors/me')
      .then((res) => {
        const v = res.data.vendor;
        setFormData({
          storeName: v.storeName || '',
          description: v.description || '',
          logo: v.logo || '',
          banner: v.banner || '',
          phone: v.phone || '',
          address: v.address || '',
        });
      })
      .catch((err) => setError(err.response?.data?.message || 'Failed to load store profile'))
      .finally(() => setLoading(false));
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    setSuccessMsg(null);

    try {
      await API.put('/vendors/me', formData);
      setSuccessMsg('Your store profile has been successfully updated.');
      setTimeout(() => setSuccessMsg(null), 3500);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update store profile');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '5rem 0', color: 'var(--text-muted)' }}>
        Loading store settings...
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '780px' }} id="seller-profile-page">
      <div style={{ marginBottom: '2rem' }}>
        <h2>Artisan Storefront Profile</h2>
        <p>Customize your maker story, studio branding, and public storefront details</p>
      </div>

      {successMsg && (
        <div
          style={{
            backgroundColor: 'var(--success-bg)',
            color: 'var(--success)',
            padding: '1rem 1.25rem',
            borderRadius: 'var(--radius-md)',
            marginBottom: '1.5rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
          }}
        >
          <Check size={18} />
          {successMsg}
        </div>
      )}

      {error && (
        <div
          style={{
            backgroundColor: 'var(--danger-bg)',
            color: 'var(--danger)',
            padding: '1rem 1.25rem',
            borderRadius: 'var(--radius-md)',
            marginBottom: '1.5rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
          }}
        >
          <AlertCircle size={18} />
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="card" style={{ padding: '2.5rem' }}>
        <div className="form-group">
          <label className="form-label" htmlFor="storeName">Store Name *</label>
          <input
            type="text"
            id="storeName"
            name="storeName"
            className="form-control"
            required
            value={formData.storeName}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label className="form-label" htmlFor="description">Maker Story & Craft Philosophy *</label>
          <textarea
            id="description"
            name="description"
            className="form-control"
            rows={4}
            required
            value={formData.description}
            onChange={handleChange}
          />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
          <div className="form-group">
            <label className="form-label" htmlFor="logo">Logo Image URL</label>
            <input
              type="url"
              id="logo"
              name="logo"
              className="form-control"
              placeholder="https://..."
              value={formData.logo}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="banner">Banner Image URL</label>
            <input
              type="url"
              id="banner"
              name="banner"
              className="form-control"
              placeholder="https://..."
              value={formData.banner}
              onChange={handleChange}
            />
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
          <div className="form-group">
            <label className="form-label" htmlFor="phone">Contact Phone</label>
            <input
              type="text"
              id="phone"
              name="phone"
              className="form-control"
              placeholder="+1 (555) 000-0000"
              value={formData.phone}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="address">Studio Location / City, State</label>
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
        </div>

        <button
          type="submit"
          className="btn btn-primary btn-lg"
          disabled={saving}
          style={{ marginTop: '1rem', width: '100%' }}
        >
          {saving ? 'Saving Changes...' : 'Save Store Profile'}
        </button>
      </form>
    </div>
  );
};

export default SellerProfile;
