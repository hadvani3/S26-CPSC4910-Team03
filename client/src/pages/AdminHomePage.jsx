import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Nav from '../components/Nav';

const btnBase = {
    padding: '12px 16px',
    color: '#1f2937',
    border: '1px solid rgba(15, 23, 42, 0.18)',
    borderRadius: '10px',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: '700',
    transition: 'background-color 0.2s, transform 0.15s',
    width: '100%',
    textAlign: 'center',
    boxShadow: '0 3px 10px rgba(0,0,0,0.12)',
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

    const [recentActivity, setRecentActivity] = useState([]);

    useEffect(() => {
        fetch('/api/admin/recent-activity')
            .then(res => res.json())
            .then(data => {
                setRecentActivity(data);
            })
            .catch(err => {
                console.error('Error fetching recent activity:', err);
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
                    background: 'rgba(255, 255, 255, 0.16)',
                    border: '1px solid rgba(255, 255, 255, 0.24)',
                    backdropFilter: 'blur(8px)',
                    padding: '16px 22px',
                    borderRadius: '12px',
                    color: 'white',
                    boxShadow: '0 10px 24px rgba(0,0,0,0.2)'
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
                        background: 'rgba(255, 255, 255, 0.16)',
                        border: '1px solid rgba(255, 255, 255, 0.24)',
                        backdropFilter: 'blur(8px)',
                        padding: '18px',
                        borderRadius: '10px',
                        color: 'white',
                        boxShadow: '0 6px 16px rgba(0,0,0,0.18)'
                    }}>
                        <div style={{ fontSize: '2.25em', fontWeight: 'bold', margin: '0' }}>
                            {stats.totalUsers}
                        </div>
                        <div style={{ fontSize: '0.95em', marginTop: '6px', opacity: 0.9 }}>
                            Total Users
                        </div>
                    </div>
                    <div style={{
                        background: 'rgba(255, 255, 255, 0.16)',
                        border: '1px solid rgba(255, 255, 255, 0.24)',
                        backdropFilter: 'blur(8px)',
                        padding: '18px',
                        borderRadius: '10px',
                        color: 'white',
                        boxShadow: '0 6px 16px rgba(0,0,0,0.18)'
                    }}>
                        <div style={{ fontSize: '2.25em', fontWeight: 'bold', margin: '0' }}>
                            {stats.totalDrivers}
                        </div>
                        <div style={{ fontSize: '0.95em', marginTop: '6px', opacity: 0.9 }}>
                            Drivers
                        </div>
                    </div>
                    <div style={{
                        background: 'rgba(255, 255, 255, 0.16)',
                        border: '1px solid rgba(255, 255, 255, 0.24)',
                        backdropFilter: 'blur(8px)',
                        padding: '18px',
                        borderRadius: '10px',
                        color: 'white',
                        boxShadow: '0 6px 16px rgba(0,0,0,0.18)'
                    }}>
                        <div style={{ fontSize: '2.25em', fontWeight: 'bold', margin: '0' }}>
                            {stats.totalSponsors}
                        </div>
                        <div style={{ fontSize: '0.95em', marginTop: '6px', opacity: 0.9 }}>
                            Sponsor Organizations
                        </div>
                    </div>
                    <div style={{
                        background: 'rgba(255, 255, 255, 0.16)',
                        border: '1px solid rgba(255, 255, 255, 0.24)',
                        backdropFilter: 'blur(8px)',
                        padding: '18px',
                        borderRadius: '10px',
                        color: 'white',
                        boxShadow: '0 6px 16px rgba(0,0,0,0.18)'
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
                        background: 'rgba(255, 255, 255, 0.16)',
                        border: '1px solid rgba(255, 255, 255, 0.22)',
                        backdropFilter: 'blur(8px)',
                        padding: '18px',
                        borderRadius: '10px',
                        boxShadow: '0 6px 16px rgba(0,0,0,0.16)',
                        display: 'flex',
                        flexDirection: 'column',
                    }}>
                        <h2 style={{ ...sectionTitle, color: '#f4f8ff' }}>Driver Management</h2>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', flex: 1 }}>
                            <button
                                type="button"
                                onClick={() => navigate('/admin/users?role=driver')}
                                className="admin-cream-btn"
                                style={btnBase}
                            >
                                View All Drivers
                            </button>
                            <button
                                type="button"
                                onClick={() => navigate('/admin/users/create?role=driver')}
                                className="admin-cream-btn"
                                style={btnBase}
                            >
                                Add New Driver
                            </button>
                            <button
                                type="button"
                                onClick={() => navigate('/admin/applications')}
                                className="admin-cream-btn"
                                style={btnBase}
                            >
                                Manage Applications
                            </button>
                            <button
                                type = "button"
                                onClick= {() => navigate('/admin/reports/sales-by-driver')}
                                className = "admin-cream-btn"
                                style = {btnBase}
                                >
                                View Driver Reports
                            </button>
                        </div>
                    </div>

                    <div style={{
                        background: 'rgba(255, 255, 255, 0.16)',
                        border: '1px solid rgba(255, 255, 255, 0.22)',
                        backdropFilter: 'blur(8px)',
                        padding: '18px',
                        borderRadius: '10px',
                        boxShadow: '0 6px 16px rgba(0,0,0,0.16)',
                        display: 'flex',
                        flexDirection: 'column',
                    }}>
                        <h2 style={{ ...sectionTitle, color: '#f4f8ff' }}>Sponsor Management</h2>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', flex: 1 }}>
                            <button
                                type="button"
                                onClick={() => navigate('/admin/users?role=sponsor')}
                                className="admin-cream-btn"
                                style={btnBase}
                            >
                                View All Sponsors
                            </button>
                            <button
                                type="button"
                                onClick={() => navigate('/admin/users/create?role=sponsor')}
                                className="admin-cream-btn"
                                style={btnBase}
                            >
                                Add New Sponsor User
                            </button>
                            <button
                                type="button"
                                onClick={() => navigate('/admin/sponsors/create')}
                                className="admin-cream-btn"
                                style={btnBase}
                            >
                                Create Sponsor Organization
                                </button>
                            <button
                                type="button"
                                onClick={() => navigate('/admin/reports/sales-by-sponsor')}
                                className="admin-cream-btn"
                                style={btnBase}
                            >
                                View Reports
                            </button>
                        </div>
                    </div>

                    <div style={{
                        background: 'rgba(255, 255, 255, 0.16)',
                        padding: '18px',
                        borderRadius: '10px',
                        border: '1px solid rgba(255, 255, 255, 0.22)',
                        backdropFilter: 'blur(8px)',
                        display: 'flex',
                        flexDirection: 'column',
                        minHeight: 0,
                    }}>
                        <h2 style={{ ...sectionTitle, color: '#f4f8ff' }}>Recent Activity</h2>
                        <div style={{
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '10px',
                            maxHeight: '260px',
                            overflowY: 'auto',
                            flex: 1,
                        }}>
                            {recentActivity.length === 0 ? (
                                <div style={{ padding: '12px', color: '#dbe6ff' }}>
                                    No recent activity
                                </div>
                            ) : (
                                recentActivity.map((item, index) => (
                                    <div key={index} style={{
                                        padding: '12px',
                                        background: 'rgba(255, 255, 255, 0.16)',
                                        borderRadius: '6px',
                                        borderLeft: '4px solid #f4efe1',
                                        color: '#f4f8ff'
                                    }}>
                                        <strong>{item.type === 'login' ? 'Login attempt' : item.type === 'application' ? 'Application' : 'Points change'}:</strong> {item.label}
                                        {item.type === 'login' && (
                                            <span style={{marginLeft: '8px', color: item.success ? '#86efac' : '#fca5a5'}}>
                                                {item.success ? 'Success' : 'Failed'}
                                                </span>

                                        )

                                        }
                                        <div style={{ fontSize: '0.85em', color: '#dbe6ff', marginTop: '4px' }}>
                                            {new Date(item.timestamp).toLocaleString()}
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </div>

                <div style={{
                    backdropFilter: 'blur(8px)',
                    padding: '18px',
                    borderRadius: '10px',
                    boxShadow: '0 6px 16px rgba(0,0,0,0.16)'
                }}>
                    <h2 style={{ ...sectionTitle, color: '#f4f8ff' }}>System Actions</h2>
                    <div
                        className="admin-dashboard-actions"
                        style={{
                            display: 'grid',
                            gridTemplateColumns: 'repeat(4, minmax(0, 1fr))',
                            gap: '12px',
                        }}
                    >
                        <button
                            type="button"
                            onClick={() => navigate('/admin/bulk-upload')}
                            className="admin-cream-btn"
                            style={{
                                padding: '12px 14px',
                                color: '#1f2937',
                                border: '1px solid rgba(15, 23, 42, 0.18)',
                                borderRadius: '10px',
                                cursor: 'pointer',
                                fontSize: '14px',
                                fontWeight: '700',
                            }}
                        >
                            Bulk Upload
                        </button>
                        <button
                                type="button"
                                onClick={() => navigate('/admin/users/create?role=admin')}
                                className="admin-cream-btn"
                                style={{
                                    padding: '12px 14px',
                                    color: '#1f2937',
                                    border: '1px solid rgba(15, 23, 42, 0.18)',
                                    borderRadius: '10px',
                                    cursor: 'pointer',
                                    fontSize: '14px',
                                    fontWeight: '700',
                                }}
                            >
                                Add New Admin
                            </button>


                        <button
                            type="button"
                            onClick={() => navigate('/admin/audit-log')}
                            className="admin-cream-btn"
                            style={{
                                padding: '12px 14px',
                                color: '#1f2937',
                                border: '1px solid rgba(15, 23, 42, 0.18)',
                                borderRadius: '10px',
                                cursor: 'pointer',
                                fontSize: '14px',
                                fontWeight: '700',
                            }}
                        >
                            View Audit Logs
                        </button>
                        <button
                            type="button"
                            onClick={() => navigate('/admin/reports')}
                            className="admin-cream-btn"
                            style={{
                                padding: '12px 14px',
                                color: '#1f2937',
                                border: '1px solid rgba(15, 23, 42, 0.18)',
                                borderRadius: '10px',
                                cursor: 'pointer',
                                fontSize: '14px',
                                fontWeight: '700',
                            }}
                        >
                            Generate Reports
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
}
