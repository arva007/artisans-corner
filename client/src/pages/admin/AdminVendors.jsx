import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import API from '../../services/api';
import StarRating from '../../components/common/StarRating';
import { Store, ExternalLink } from 'lucide-react';

const AdminVendors = () => {
  const [vendors, setVendors] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    API.get('/admin/vendors')
      .then((res) => setVendors(res.data.vendors))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '5rem 0', color: 'var(--text-muted)' }}>
        Loading artisan store directory...
      </div>
    );
  }

  return (
    <div id="admin-vendors-page">
      <div style={{ marginBottom: '2rem' }}>
        <h2>Artisan Stores Directory ({vendors.length})</h2>
        <p>Review independent maker shops, studio locations, and quality ratings</p>
      </div>

      <div className="table-wrapper">
        <table className="table" id="admin-vendors-table">
          <thead>
            <tr>
              <th>Storefront</th>
              <th>Owner</th>
              <th>Studio Location</th>
              <th>Store Rating</th>
              <th style={{ textAlign: 'right' }}>Storefront Link</th>
            </tr>
          </thead>
          <tbody>
            {vendors.map((ven) => (
              <tr key={ven._id}>
                <td>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
                    {ven.logo ? (
                      <img
                        src={ven.logo}
                        alt={ven.storeName}
                        style={{ width: '40px', height: '40px', borderRadius: 'var(--radius-sm)', objectFit: 'cover' }}
                      />
                    ) : (
                      <div
                        style={{
                          width: '40px',
                          height: '40px',
                          borderRadius: 'var(--radius-sm)',
                          backgroundColor: 'var(--primary-light)',
                          color: 'var(--primary)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                      >
                        <Store size={18} />
                      </div>
                    )}
                    <div>
                      <div style={{ fontWeight: 600 }}>{ven.storeName}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                        Joined {new Date(ven.createdAt).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                </td>
                <td>
                  <div>{ven.owner?.name || 'Artisan'}</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-light)' }}>{ven.owner?.email}</div>
                </td>
                <td>{ven.address || 'Independent Studio'}</td>
                <td>
                  <StarRating rating={ven.rating || 0} count={ven.numberOfReviews || 0} size={14} />
                </td>
                <td style={{ textAlign: 'right' }}>
                  <Link
                    to={`/vendor/${ven._id}`}
                    target="_blank"
                    className="btn btn-outline btn-sm"
                    style={{ fontSize: '0.8rem' }}
                  >
                    View Store <ExternalLink size={12} />
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminVendors;
