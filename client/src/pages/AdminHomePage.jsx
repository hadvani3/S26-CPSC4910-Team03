import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Nav from '../components/Nav';

const btnBase = {
    padding: '12px 16px',
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: '500',
    transition: 'background-color 0.2s',
    width: '100%',
    textAlign: 'center',
};

const sectionTitle = {
    marginTop: '0',
    fontSize: '1.15em',
    marginBottom: '14px',
};

export default function AdminHomePage() {
    const navigate = useNavigate();
    const [stats, setStats] = useState({
        totalUsers: 0,
        totalDrivers: 0,
        totalSponsors: 0,
        pendingApplications: 0
    });

    useEffect(() => {
       fetch('/api/admin/stats')
        .then(res => res.json())
        .then(data => {
            setStats({
                totalUsers: data.totalUsers,
                totalDrivers: data.totalDrivers,
                totalSponsors: data.totalSponsors,
                pendingApplications: data.pendingApplications
            });
        })
        .catch(err => {
            console.error('Error fetching stats:', err);
        });
    }, []);

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("role");
        localStorage.removeItem("user");
        sessionStorage.clear();
        navigate("/");
    };

    return (
        <>
            <Nav />
            <div className="admin-dashboard">
                <div style={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: '14px',
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    padding: '16px 22px',
                    borderRadius: '12px',
                    color: 'white',
                    boxShadow: '0 4px 15px rgba(0,0,0,0.2)'
                }}>
                    <div style={{ textAlign: 'left' }}>
                        <h1 style={{
                            margin: '0 0 4px 0',
                            fontSize: '1.5em',
                            fontWeight: '600',
                            color: 'white',
                        }}>
                            Admin Dashboard
                        </h1>
                        <p style={{ margin: 0, fontSize: '0.95em', opacity: 0.92 }}>
                            System management & overview
                        </p>
                    </div>
                    <button
                        type="button"
                        onClick={handleLogout}
                        style={{
                            padding: '10px 22px',
                            backgroundColor: 'rgba(0,0,0,0.2)',
                            color: 'white',
                            border: '1px solid rgba(255,255,255,0.35)',
                            borderRadius: '8px',
                            cursor: 'pointer',
                            fontSize: '14px',
                            fontWeight: '600',
                        }}
                    >
                        Logout
                    </button>
                </div>

                <div
                    className="admin-dashboard-stat-grid"
                    style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(4, minmax(0, 1fr))',
                        gap: '14px',
                    }}
                >
                    <div style={{
                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                        padding: '18px',
                        borderRadius: '10px',
                        color: 'white',
                        boxShadow: '0 4px 12px rgba(102, 126, 234, 0.3)'
                    }}>
                        <div style={{ fontSize: '2.25em', fontWeight: 'bold', margin: '0' }}>
                            {stats.totalUsers}
                        </div>
                        <div style={{ fontSize: '0.95em', marginTop: '6px', opacity: 0.9 }}>
                            Total Users
                        </div>
                    </div>
                    <div style={{
                        background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
                        padding: '18px',
                        borderRadius: '10px',
                        color: 'white',
                        boxShadow: '0 4px 12px rgba(79, 172, 254, 0.3)'
                    }}>
                        <div style={{ fontSize: '2.25em', fontWeight: 'bold', margin: '0' }}>
                            {stats.totalDrivers}
                        </div>
                        <div style={{ fontSize: '0.95em', marginTop: '6px', opacity: 0.9 }}>
                            Drivers
                        </div>
                    </div>
                    <div style={{
                        background: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
                        padding: '18px',
                        borderRadius: '10px',
                        color: 'white',
                        boxShadow: '0 4px 12px rgba(67, 233, 123, 0.3)'
                    }}>
                        <div style={{ fontSize: '2.25em', fontWeight: 'bold', margin: '0' }}>
                            {stats.totalSponsors}
                        </div>
                        <div style={{ fontSize: '0.95em', marginTop: '6px', opacity: 0.9 }}>
                            Sponsors
                        </div>
                    </div>
                    <div style={{
                        background: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
                        padding: '18px',
                        borderRadius: '10px',
                        color: 'white',
                        boxShadow: '0 4px 12px rgba(250, 112, 154, 0.3)'
                    }}>
                        <div style={{ fontSize: '2.25em', fontWeight: 'bold', margin: '0' }}>
                            {stats.pendingApplications}
                        </div>
                        <div style={{ fontSize: '0.95em', marginTop: '6px', opacity: 0.9 }}>
                            Pending Applications
                        </div>
                    </div>
                </div>

                <div
                    className="admin-dashboard-main-cols"
                    style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(3, minmax(0, 1fr))',
                        gap: '14px',
                        alignItems: 'stretch',
                    }}
                >
                    <div style={{
                        backgroundColor: '#e3f2fd',
                        padding: '18px',
                        borderRadius: '10px',
                        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                        display: 'flex',
                        flexDirection: 'column',
                    }}>
                        <h2 style={{ ...sectionTitle, color: '#1976d2' }}>Driver Management</h2>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', flex: 1 }}>
                            <button
                                type="button"
                                onClick={() => navigate('/admin/users?role=driver')}
                                style={{ ...btnBase, backgroundColor: '#2196f3' }}
                            >
                                View All Drivers
                            </button>
                            <button
                                type="button"
                                onClick={() => navigate('/admin/users/create?role=driver')}
                                style={{ ...btnBase, backgroundColor: '#4caf50' }}
                            >
                                Add New Driver
                            </button>
                            <button
                                type="button"
                                onClick={() => navigate('/admin/applications')}
                                style={{ ...btnBase, backgroundColor: '#ff9800' }}
                            >
                                Manage Applications
                            </button>
                        </div>
                    </div>

                    <div style={{
                        backgroundColor: '#e8f5e9',
                        padding: '18px',
                        borderRadius: '10px',
                        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                        display: 'flex',
                        flexDirection: 'column',
                    }}>
                        <h2 style={{ ...sectionTitle, color: '#388e3c' }}>Sponsor Management</h2>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', flex: 1 }}>
                            <button
                                type="button"
                                onClick={() => navigate('/admin/users?role=sponsor')}
                                style={{ ...btnBase, backgroundColor: '#4caf50' }}
                            >
                                View All Sponsors
                            </button>
                            <button
                                type="button"
                                onClick={() => navigate('/admin/users/create?role=sponsor')}
                                style={{ ...btnBase, backgroundColor: '#66bb6a' }}
                            >
                                Add New Sponsor
                            </button>
                            <button
                                type="button"
                                onClick={() => navigate('/admin/reports')}
                                style={{ ...btnBase, backgroundColor: '#81c784' }}
                            >
                                View Reports
                            </button>
                        </div>
                    </div>

                    <div style={{
                        backgroundColor: '#fff',
                        padding: '18px',
                        borderRadius: '10px',
                        border: '1px solid #e0e0e0',
                        display: 'flex',
                        flexDirection: 'column',
                        minHeight: 0,
                    }}>
                        <h2 style={{ ...sectionTitle, color: '#34495e' }}>Recent Activity</h2>
                        <div style={{
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '10px',
                            maxHeight: '260px',
                            overflowY: 'auto',
                            flex: 1,
                        }}>
                            <div style={{
                                padding: '12px',
                                backgroundColor: '#f8f9fa',
                                borderRadius: '6px',
                                borderLeft: '4px solid #4caf50'
                            }}>
                                <strong>New driver registered:</strong> John Doe
                                <div style={{ fontSize: '0.85em', color: '#666', marginTop: '4px' }}>
                                    2 hours ago
                                </div>
                            </div>
                            <div style={{
                                padding: '12px',
                                backgroundColor: '#f8f9fa',
                                borderRadius: '6px',
                                borderLeft: '4px solid #2196f3'
                            }}>
                                <strong>Application approved:</strong> Jane Smith
                                <div style={{ fontSize: '0.85em', color: '#666', marginTop: '4px' }}>
                                    5 hours ago
                                </div>
                            </div>
                            <div style={{
                                padding: '12px',
                                backgroundColor: '#f8f9fa',
                                borderRadius: '6px',
                                borderLeft: '4px solid #ff9800'
                            }}>
                                <strong>New sponsor joined:</strong> ABC Transport Co.
                                <div style={{ fontSize: '0.85em', color: '#666', marginTop: '4px' }}>
                                    1 day ago
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div style={{
                    backgroundColor: '#fff3e0',
                    padding: '18px',
                    borderRadius: '10px',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.05)'
                }}>
                    <h2 style={{ ...sectionTitle, color: '#e65100' }}>System Actions</h2>
                    <div
                        className="admin-dashboard-actions"
                        style={{
                            display: 'grid',
                            gridTemplateColumns: 'repeat(5, minmax(0, 1fr))',
                            gap: '12px',
                        }}
                    >
                        <button
                            type="button"
                            onClick={() => navigate('/admin/bulk-upload')}
                            style={{
                                padding: '12px 14px',
                                backgroundColor: '#ff9800',
                                color: 'white',
                                border: 'none',
                                borderRadius: '6px',
                                cursor: 'pointer',
                                fontSize: '14px',
                                fontWeight: '500',
                            }}
                        >
                            Bulk Upload
                        </button>
                        <button
                            type="button"
                            style={{
                                padding: '12px 14px',
                                backgroundColor: '#ff9800',
                                color: 'white',
                                border: 'none',
                                borderRadius: '6px',
                                cursor: 'pointer',
                                fontSize: '14px',
                                fontWeight: '500',
                            }}
                        >
                            View Analytics
                        </button>
                        <button
                            type="button"
                            style={{
                                padding: '12px 14px',
                                backgroundColor: '#9c27b0',
                                color: 'white',
                                border: 'none',
                                borderRadius: '6px',
                                cursor: 'pointer',
                                fontSize: '14px',
                                fontWeight: '500',
                            }}
                        >
                            Generate Reports
                        </button>
                        <button
                            type="button"
                            style={{
                                padding: '12px 14px',
                                backgroundColor: '#00bcd4',
                                color: 'white',
                                border: 'none',
                                borderRadius: '6px',
                                cursor: 'pointer',
                                fontSize: '14px',
                                fontWeight: '500',
                            }}
                        >
                            System Settings
                        </button>
                        <button
                            type="button"
                            style={{
                                padding: '12px 14px',
                                backgroundColor: '#607d8b',
                                color: 'white',
                                border: 'none',
                                borderRadius: '6px',
                                cursor: 'pointer',
                                fontSize: '14px',
                                fontWeight: '500',
                            }}
                        >
                            Backup Data
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
}
