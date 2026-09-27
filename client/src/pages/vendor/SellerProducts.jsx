import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import API from '../../services/api';
import StarRating from '../../components/common/StarRating';
import {
  Package,
  PlusCircle,
  Edit,
  Trash2,
  ExternalLink,
  AlertCircle,
  Check,
} from 'lucide-react';

const SellerProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [actionMsg, setActionMsg] = useState(null);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const res = await API.get('/vendors/products');
      setProducts(res.data.products);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load products');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Are you sure you want to retire and delete "${name}"?`)) {
      return;
    }

    try {
      await API.delete(`/products/${id}`);
      setProducts(products.filter((p) => p._id !== id));
      setActionMsg(`"${name}" was successfully removed from your catalog.`);
      setTimeout(() => setActionMsg(null), 3000);
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to delete product');
    }
  };

  return (
    <div id="seller-products-page">
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '2rem',
          flexWrap: 'wrap',
          gap: '1rem',
        }}
      >
        <div>
          <h2>Artisan Catalog ({products.length})</h2>
          <p>Manage inventory, modify piece descriptions, and monitor customer ratings</p>
        </div>

        <Link to="/dashboard/seller/products/new" className="btn btn-primary btn-sm" id="seller-add-product-btn">
          <PlusCircle size={16} />
          Add New Craft
        </Link>
      </div>

      {actionMsg && (
        <div
          style={{
            backgroundColor: 'var(--success-bg)',
            color: 'var(--success)',
            padding: '0.85rem 1.25rem',
            borderRadius: 'var(--radius-md)',
            marginBottom: '1.5rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
          }}
        >
          <Check size={16} />
          {actionMsg}
        </div>
      )}

      {loading ? (
        <div style={{ textAlign: 'center', padding: '5rem 0', color: 'var(--text-muted)' }}>
          Loading your handcrafted pieces...
        </div>
      ) : products.length === 0 ? (
        <div className="card" style={{ padding: '4rem 2rem', textAlign: 'center' }}>
          <div
            style={{
              width: '64px',
              height: '64px',
              borderRadius: '50%',
              backgroundColor: 'var(--primary-light)',
              color: 'var(--primary)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 1.5rem',
            }}
          >
            <Package size={30} />
          </div>
          <h3>No Products in Your Studio Yet</h3>
          <p style={{ margin: '0.5rem 0 1.5rem', color: 'var(--text-muted)' }}>
            List your first handcrafted piece and make it discoverable to mindful buyers.
          </p>
          <Link to="/dashboard/seller/products/new" className="btn btn-primary">
            <PlusCircle size={16} />
            Create Your First Listing
          </Link>
        </div>
      ) : (
        <div className="table-wrapper">
          <table className="table" id="seller-products-table">
            <thead>
              <tr>
                <th>Piece</th>
                <th>Category</th>
                <th>Price</th>
                <th>Stock</th>
                <th>Rating</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map((prod) => (
                <tr key={prod._id} id={`vendor-row-${prod._id}`}>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
                      <img
                        src={prod.image}
                        alt={prod.name}
                        style={{ width: '48px', height: '48px', borderRadius: 'var(--radius-sm)', objectFit: 'cover' }}
                      />
                      <div>
                        <div style={{ fontWeight: 600, fontSize: '0.95rem' }}>{prod.name}</div>
                        <Link
                          to={`/products/${prod._id}`}
                          style={{ fontSize: '0.75rem', color: 'var(--primary)', display: 'inline-flex', alignItems: 'center', gap: '2px' }}
                          target="_blank"
                        >
                          View in storefront <ExternalLink size={10} />
                        </Link>
                      </div>
                    </div>
                  </td>
                  <td>
                    <span className="badge badge-primary" style={{ fontSize: '0.7rem' }}>
                      {prod.category}
                    </span>
                  </td>
                  <td style={{ fontWeight: 700 }}>${prod.price.toFixed(2)}</td>
                  <td>
                    {prod.stock <= 0 ? (
                      <span className="badge badge-danger">Out of Stock</span>
                    ) : prod.stock <= 3 ? (
                      <span className="badge badge-warning">{prod.stock} left</span>
                    ) : (
                      <span className="badge badge-success">{prod.stock} units</span>
                    )}
                  </td>
                  <td>
                    <StarRating rating={prod.rating || 0} count={prod.numberOfReviews || 0} size={13} />
                  </td>
                  <td style={{ textAlign: 'right' }}>
                    <div style={{ display: 'inline-flex', gap: '0.5rem' }}>
                      <Link
                        to={`/dashboard/seller/products/edit/${prod._id}`}
                        className="btn btn-outline btn-sm"
                        style={{ padding: '0.35rem 0.65rem' }}
                        title="Edit product"
                        id={`edit-product-${prod._id}`}
                      >
                        <Edit size={14} />
                      </Link>
                      <button
                        type="button"
                        onClick={() => handleDelete(prod._id, prod.name)}
                        className="btn btn-outline btn-sm"
                        style={{ padding: '0.35rem 0.65rem', color: 'var(--danger)', borderColor: 'var(--border)' }}
                        title="Delete product"
                        id={`delete-product-${prod._id}`}
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default SellerProducts;
