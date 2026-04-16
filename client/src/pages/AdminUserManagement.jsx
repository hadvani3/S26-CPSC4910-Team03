import { useState, useEffect, useContext} from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import Nav from '../components/Nav';
import {AuthContext} from '../components/AuthContext';

export default function AdminUserManagement() {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [sponsors, setSponsors] = useState([]);
    const [sponsorFilter, setSponsorFilter] = useState('all');
    const [filters, setFilters] = useState({
        role: searchParams.get('role') || 'all',
        status: 'all',
        search: ''
    });

        
    useEffect(() => {
        fetchUsers();
    }, [filters, sponsorFilter, navigate]);

    useEffect(() => {
        fetch('/api/sponsors')
        .then(res => res.json())
        .then(data => setSponsors(data))
        .catch(err => console.error('Error fetching sponsors:', err));
    }, []);

        const fetchUsers = async () => {
        setLoading(true);
        try {
            const params = new URLSearchParams();
            if (filters.role !== 'all') params.append('role', filters.role);
            if (filters.status !== 'all') params.append('status', filters.status);
            if (filters.search) params.append('search', filters.search);
            if(sponsorFilter !== 'all') params.append('sponsor_id', sponsorFilter);

            const res = await fetch(`/api/admin/users?${params}`);
            const data = await res.json();

            if (res.ok) {
                setUsers(data.users || []);
            } else {
                console.error('Failed to fetch users');
            }
        } catch (err) {
            console.error('Error fetching users:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleToggleStatus = async (userId, currentStatus) => {
        if (!confirm(`Are you sure you want to ${currentStatus ? 'deactivate' : 'activate'} this user?`)) {
            return;
        }

        try {
            const res = await fetch(`/api/admin/users/${userId}/toggle-status`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ is_active: currentStatus ? 0 : 1 })
            });

            const data = await res.json();

            if (res.ok) {
                alert(data.message);
                fetchUsers();
            } else {
                alert(data.error || 'Failed to update user status');
            }
        } catch (err) {
            console.error(err);
            alert('Error updating user status');
        }
    };

    const handleDelete = async (userId) => {
        if (!confirm('Are you sure you want to DELETE this user? This action cannot be undone!')) {
            return;
        }

        try {
            const res = await fetch(`/api/admin/users/${userId}`, {
                method: 'DELETE'
            });

            const data = await res.json();

            if (res.ok) {
                alert(data.message);
                fetchUsers();
            } else {
                alert(data.error || 'Failed to delete user');
            }
        } catch (err) {
            console.error(err);
            alert('Error deleting user');
        }
    };

    const {token,impersonate} = useContext(AuthContext);
    
    // handle impersonating function
    const handleImpersonate = async (userId, roleType) => {
        try {
            const res = await fetch(`/api/admin/impersonate/${userId}`, {
                method : 'POST',
                headers : {'Authorization': `Bearer ${token}`}
            });
            const data = await res.json();

            if(!res.ok) {
                return alert(data.error); 
            }
            impersonate(data.impersonateToken, data.role);

            if(data.role === 'driver'){
                navigate('/driver-page');
                window.scrollTo(0,0);
            }
            else if(data.role === 'sponsor'){  
                navigate('/sponsor-page');
                window.scrollTo(0,0);  
            }
        } catch (err) {
            console.error('Error during impersonation:', err);
            alert('Failed to impersonate user');
        }

        
    };

    return (
        <>
            <Nav />
            <div className="container">
                <div style={{
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    padding: '40px 30px',
                    borderRadius: '12px',
                    color: 'white',
                    textAlign: 'center',
                    marginBottom: '30px',
                    boxShadow: '0 4px 15px rgba(0,0,0,0.2)'
                }}>
                    <h1 style={{ margin: '0 0 10px 0', fontSize: '2em', fontWeight: '600' }}>
                        User Management
                    </h1>
                    <p style={{ margin: '0', fontSize: '1.1em', opacity: '0.95' }}>
                        View, edit, and manage all system users
                    </p>
                </div>


                <div style={{
                    backgroundColor: 'white',
                    padding: '20px',
                    borderRadius: '10px',
                    marginBottom: '20px',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                    display: 'flex',
                    gap: '15px',
                    flexWrap: 'wrap',
                    alignItems: 'center'
                }}>
                    <select
                        value={filters.role}
                        onChange={(e) => setFilters({ ...filters, role: e.target.value })}
                        style={{
                            padding: '10px 15px',
                            border: '1px solid #ddd',
                            borderRadius: '6px',
                            fontSize: '15px',
                            cursor: 'pointer'
                        }}
                    >
                        <option value="all">All Roles</option>
                        <option value="driver">Drivers</option>
                        <option value="sponsor">Sponsors</option>
                        <option value="admin">Admins</option>
                    </select>

                    <select
                        value={filters.status}
                        onChange={(e) => setFilters({ ...filters, status: e.target.value })}
                        style={{
                            padding: '10px 15px',
                            border: '1px solid #ddd',
                            borderRadius: '6px',
                            fontSize: '15px',
                            cursor: 'pointer'
                        }}
                    >
                        <option value="all">All Status</option>
                        <option value="active">Active</option>
                        <option value="inactive">Inactive</option>
                    </select>
                    {filters.role === 'sponsor' && (
                        <select
                            value={sponsorFilter}
                            onChange={(e) => setSponsorFilter(e.target.value)}
                            style={{
                                padding: '10px 15px',
                                border: '1px solid #ddd',
                                borderRadius: '6px',
                                fontSize: '15px',
                                cursor: 'pointer'
                            }}
                        >
                            <option value="all">All Sponsors</option>
                            {sponsors.map(s => (
                                <option key={s.sponsor_id} value={s.sponsor_id}>{s.company_name}</option>
                            ))}
                        </select>
                    )}

                    <input
                        type="text"
                        placeholder="Search by email..."
                        value={filters.search}
                        onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                        style={{
                            flex: 1,
                            minWidth: '200px',
                            padding: '10px 15px',
                            border: '1px solid #ddd',
                            borderRadius: '6px',
                            fontSize: '15px'
                        }}
                    />

                    <button
                        onClick={() => navigate('/admin/users/create')}
                        style={{
                            padding: '10px 20px',
                            backgroundColor: '#4caf50',
                            color: 'white',
                            border: 'none',
                            borderRadius: '6px',
                            fontSize: '15px',
                            fontWeight: '600',
                            cursor: 'pointer'
                        }}
                    >
                        + Create User
                    </button>
                </div>


                <div style={{
                    backgroundColor: 'white',
                    borderRadius: '10px',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                    overflow: 'auto'
                }}>
                    {loading ? (
                        <div style={{ padding: '50px', textAlign: 'center' }}>
                            Loading users...
                        </div>
                    ) : users.length === 0 ? (
                        <div style={{ padding: '50px', textAlign: 'center', color: '#666' }}>
                            No users found
                        </div>
                    ) : (
                        <table style={{
                            width: '100%',
                            borderCollapse: 'collapse'
                        }}>
                            <thead>
                                <tr style={{ backgroundColor: '#f8f9fa', borderBottom: '2px solid #dee2e6' }}>
                                    <th style={{ padding: '15px', textAlign: 'left', fontWeight: '600' }}>ID</th>
                                    <th style={{ padding: '15px', textAlign: 'left', fontWeight: '600' }}>Email</th>
                                    <th style={{ padding: '15px', textAlign: 'left', fontWeight: '600' }}>Role</th>
                                    <th style={{ padding: '15px', textAlign: 'left', fontWeight: '600' }}>Status</th>
                                    <th style={{ padding: '15px', textAlign: 'left', fontWeight: '600' }}>Created</th>
                                    <th style={{ padding: '15px', textAlign: 'left', fontWeight: '600' }}>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {users.map(user => (
                                    <tr key={user.user_id} style={{ borderBottom: '1px solid #dee2e6' }}>
                                        <td style={{ padding: '15px' }}>{user.user_id}</td>
                                        <td style={{ padding: '15px' }}>{user.email}</td>
                                        <td style={{ padding: '15px' }}>
                                            <span style={{
                                                padding: '4px 12px',
                                                borderRadius: '12px',
                                                fontSize: '13px',
                                                fontWeight: '600',
                                                backgroundColor: 
                                                    user.role_type === 'admin' ? '#e3f2fd' :
                                                    user.role_type === 'sponsor' ? '#e8f5e9' : '#fff3e0',
                                                color:
                                                    user.role_type === 'admin' ? '#1976d2' :
                                                    user.role_type === 'sponsor' ? '#388e3c' : '#e65100'
                                            }}>
                                                {user.role_type}
                                            </span>
                                        </td>
                                        <td style={{ padding: '15px' }}>
                                            <span style={{
                                                padding: '4px 12px',
                                                borderRadius: '12px',
                                                fontSize: '13px',
                                                fontWeight: '600',
                                                backgroundColor: user.is_active ? '#d4edda' : '#f8d7da',
                                                color: user.is_active ? '#155724' : '#721c24'
                                            }}>
                                                {user.is_active ? 'Active' : 'Inactive'}
                                            </span>
                                        </td>
                                        <td style={{ padding: '15px', fontSize: '14px', color: '#666' }}>
                                            {new Date(user.created_at).toLocaleDateString()}
                                        </td>
                                        <td style={{ padding: '15px' }}>
                                            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                                                <button
                                                    onClick={() => handleToggleStatus(user.user_id, user.is_active)}
                                                    style={{
                                                        padding: '6px 12px',
                                                        backgroundColor: user.is_active ? '#ff9800' : '#4caf50',
                                                        color: 'white',
                                                        border: 'none',
                                                        borderRadius: '4px',
                                                        fontSize: '13px',
                                                        cursor: 'pointer'
                                                    }}
                                                >
                                                    {user.is_active ? ' Deactivate' : '✓ Activate'}
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(user.user_id)}
                                                    style={{
                                                        padding: '6px 12px',
                                                        backgroundColor: '#dc3545',
                                                        color: 'white',
                                                        border: 'none',
                                                        borderRadius: '4px',
                                                        fontSize: '13px',
                                                        cursor: 'pointer'
                                                    }}
                                                >
                                                     Delete
                                                </button>

                                                {user.role_type !== 'admin' && (
                                                    <button
                                                        onClick = {() => handleImpersonate(user.user_id, user.role_type)}
                                                        style = {{
                                                            padding : '6px 12px',
                                                            backgroundColor : '#667eea',
                                                            color : 'white',
                                                            border : 'none',
                                                            borderRadius : '4px',
                                                            fontSize : '13px',
                                                            cursor : 'pointer',
                                                        }}
                                                    >
                                                        Impersonate User
                                                    </button>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>

                <div style={{ marginTop: '30px', textAlign: 'center' }}>
                    <button
                        onClick={() => navigate('/admin-page')}
                        style={{
                            padding: '12px 30px',
                            backgroundColor: '#6c757d',
                            color: 'white',
                            border: 'none',
                            borderRadius: '8px',
                            fontSize: '16px',
                            fontWeight: '600',
                            cursor: 'pointer'
                        }}
                    >
                         Back to Dashboard
                    </button>
                </div>
            </div>
        </>
    );
}