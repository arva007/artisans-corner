import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import API from '../services/api';
import ProductCard from '../components/product/ProductCard';
import StarRating from '../components/common/StarRating';
import { Store, MapPin, Phone, Sparkles, ArrowLeft } from 'lucide-react';

const VendorStorePage = () => {
  const { id } = useParams();
  const [vendor, setVendor] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchVendorStore = async () => {
      try {
        setLoading(true);
        const res = await API.get(`/vendors/${id}`);
        setVendor(res.data.vendor);
        setProducts(res.data.products);
      } catch (err) {
        setError(err.response?.data?.message || 'Artisan store not found');
      } finally {
        setLoading(false);
      }
    };

    fetchVendorStore();
  }, [id]);

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '6rem 0', color: 'var(--text-muted)' }}>
        Visiting artisan studio...
      </div>
    );
  }

  if (error || !vendor) {
    return (
      <div className="container" style={{ padding: '6rem 1.5rem', textAlign: 'center' }}>
        <h2>Artisan Store Not Found</h2>
        <p style={{ marginBottom: '2rem' }}>The requested store profile does not exist.</p>
        <Link to="/products" className="btn btn-primary">
          Explore Handcrafted Goods
        </Link>
      </div>
    );
  }

  return (
    <div style={{ paddingBottom: '6rem' }} id="vendor-store-page">
      {/* Banner */}
      <div
        style={{
          height: '240px',
          width: '100%',
          backgroundColor: 'var(--primary-light)',
          backgroundImage: vendor.banner ? `url(${vendor.banner})` : undefined,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          position: 'relative',
        }}
      >
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(to top, rgba(0,0,0,0.4) 0%, transparent 100%)',
          }}
        />
      </div>

      <div className="container" style={{ position: 'relative', marginTop: '-60px' }}>
        {/* Store Header Card */}
        <div
          className="card"
          style={{
            padding: '2.5rem',
            marginBottom: '3.5rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '1.5rem',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.75rem', flexWrap: 'wrap' }}>
            {vendor.logo ? (
              <img
                src={vendor.logo}
                alt={vendor.storeName}
                style={{
                  width: '96px',
                  height: '96px',
                  borderRadius: 'var(--radius-lg)',
                  objectFit: 'cover',
                  border: '3px solid #fff',
                  boxShadow: 'var(--shadow-md)',
                }}
              />
            ) : (
              <div
                style={{
                  width: '96px',
                  height: '96px',
                  borderRadius: 'var(--radius-lg)',
                  backgroundColor: 'var(--primary-light)',
                  color: 'var(--primary)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  border: '3px solid #fff',
                  boxShadow: 'var(--shadow-md)',
                }}
              >
                <Store size={44} />
              </div>
            )}

            <div>
              <span className="badge badge-primary" style={{ marginBottom: '0.4rem' }}>
                Independent Maker
              </span>
              <h1 style={{ fontSize: '2.25rem', marginBottom: '0.35rem' }}>{vendor.storeName}</h1>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', flexWrap: 'wrap' }}>
                <StarRating rating={vendor.rating || 0} count={vendor.numberOfReviews || 0} size={16} />
                {vendor.address && (
                  <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                    <MapPin size={14} />
                    {vendor.address}
                  </span>
                )}
                {vendor.phone && (
                  <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                    <Phone size={14} />
                    {vendor.phone}
                  </span>
                )}
              </div>
            </div>
          </div>

          <div style={{ borderTop: '1px solid var(--border)', paddingTop: '1.25rem' }}>
            <h4 style={{ fontSize: '1rem', marginBottom: '0.5rem' }}>Studio Story & Philosophy</h4>
            <p style={{ lineHeight: '1.7', color: 'var(--text-muted)', maxWidth: '850px' }}>
              {vendor.description}
            </p>
          </div>
        </div>

        {/* Studio Product Catalog */}
        <div style={{ marginBottom: '2rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2rem' }}>
            <div>
              <h2>Handcrafted Creations</h2>
              <p>Browse all pieces crafted by {vendor.storeName} ({products.length} available)</p>
            </div>
            <Link to="/products" className="btn btn-outline btn-sm">
              <ArrowLeft size={14} /> All Marketplace Goods
            </Link>
          </div>

          {products.length > 0 ? (
            <div className="product-grid">
              {products.map((p) => (
                <ProductCard key={p._id} product={{ ...p, vendor }} />
              ))}
            </div>
          ) : (
            <div
              style={{
                textAlign: 'center',
                padding: '4rem 2rem',
                backgroundColor: 'var(--bg-card)',
                borderRadius: 'var(--radius-lg)',
                border: '1px solid var(--border)',
                color: 'var(--text-muted)',
              }}
            >
              This studio currently has no listed pieces. Please check back soon!
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default VendorStorePage;
