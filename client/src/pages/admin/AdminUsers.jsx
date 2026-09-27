import React, { useEffect, useState } from 'react';
import API from '../../services/api';
import { Users, Check, AlertCircle } from 'lucide-react';

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [updatingId, setUpdatingId] = useState(null);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await API.get('/admin/users');
      setUsers(res.data.users);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch users');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleRoleChange = async (userId, newRole) => {
    setUpdatingId(userId);
    try {
      await API.put(`/admin/users/${userId}/role`, { role: newRole });
      setUsers(
        users.map((u) => (u._id === userId ? { ...u, role: newRole } : u))
      );
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to update user role');
    } finally {
      setUpdatingId(null);
    }
  };

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '5rem 0', color: 'var(--text-muted)' }}>
        Loading registered user directory...
      </div>
    );
  }

  return (
    <div id="admin-users-page">
      <div style={{ marginBottom: '2rem' }}>
        <h2>User Management & Access Control</h2>
        <p>Review registered accounts, grant artisan/vendor privileges, or assign administrative roles</p>
      </div>

      <div className="table-wrapper">
        <table className="table" id="admin-users-table">
          <thead>
            <tr>
              <th>User</th>
              <th>Email</th>
              <th>Joined Date</th>
              <th>Current Role</th>
              <th style={{ textAlign: 'right' }}>Modify Role</th>
            </tr>
          </thead>
          <tbody>
            {users.length === 0 ? (
              <tr>
                <td colSpan={5} style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
                  No registered users found.
                </td>
              </tr>
            ) : users.map((u) => (
              <tr key={u._id}>
                <td>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    {u.profileImage ? (
                      <img
                        src={u.profileImage}
                        alt={u.name}
                        style={{ width: '36px', height: '36px', borderRadius: '50%', objectFit: 'cover' }}
                      />
                    ) : (
                      <div
                        style={{
                          width: '36px',
                          height: '36px',
                          borderRadius: '50%',
                          backgroundColor: 'var(--bg-card-subtle)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                      >
                        <Users size={16} />
                      </div>
                    )}
                    <span style={{ fontWeight: 600 }}>{u.name}</span>
                  </div>
                </td>
                <td style={{ color: 'var(--text-muted)' }}>{u.email}</td>
                <td>{new Date(u.createdAt).toLocaleDateString()}</td>
                <td>
                  <span
                    className={`badge ${
                      u.role === 'admin'
                        ? 'badge-secondary'
                        : u.role === 'vendor'
                        ? 'badge-primary'
                        : 'badge-amber'
                    }`}
                  >
                    {u.role}
                  </span>
                </td>
                <td style={{ textAlign: 'right' }}>
                  <select
                    className="form-control"
                    style={{ width: 'auto', display: 'inline-block', padding: '0.35rem 0.65rem', fontSize: '0.85rem' }}
                    value={u.role}
                    disabled={updatingId === u._id}
                    onChange={(e) => handleRoleChange(u._id, e.target.value)}
                  >
                    <option value="buyer">Buyer</option>
                    <option value="vendor">Vendor</option>
                    <option value="admin">Admin</option>
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminUsers;
