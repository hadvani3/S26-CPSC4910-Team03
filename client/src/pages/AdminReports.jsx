import { useNavigate } from 'react-router-dom';
import Nav from '../components/Nav';

export default function AdminReports() {
    const navigate = useNavigate();

    return (
        <>
            <Nav />
            <div className="admin-dashboard">
                <div style={{
                    background: 'rgba(255, 255, 255, 0.16)',
                    border: '1px solid rgba(255, 255, 255, 0.24)',
                    backdropFilter: 'blur(8px)',
                    padding: '16px 22px',
                    borderRadius: '12px',
                    color: 'white',
                    boxShadow: '0 10px 24px rgba(0,0,0,0.2)'
                }}>
                    <h1 style={{ margin: '0 0 4px 0', fontSize: '1.5em', fontWeight: '600', color: 'white' }}>
                        Reports
                    </h1>
                    <p style={{ margin: 0, fontSize: '0.95em', opacity: 0.92 }}>
                        Select a report to view
                    </p>
                </div>

                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
                    gap: '14px',
                }}>
                    <div style={{
                        background: 'rgba(255, 255, 255, 0.16)',
                        border: '1px solid rgba(255, 255, 255, 0.22)',
                        backdropFilter: 'blur(8px)',
                        padding: '24px',
                        borderRadius: '10px',
                        boxShadow: '0 6px 16px rgba(0,0,0,0.16)'
                    }}>
                        <h2 style={{ color: '#f4f8ff', marginTop: 0 }}>Sales by Sponsor</h2>
                        <p style={{ color: '#dbe6ff', fontSize: '14px' }}>View point changes grouped by sponsor organization with summary and detailed views.</p>
                        <button
                            type="button"
                            onClick={() => navigate('/admin/reports/sales-by-sponsor')}
                            className="admin-cream-btn"
                            style={{
                                padding: '10px 20px',
                                color: '#1f2937',
                                border: '1px solid rgba(15, 23, 42, 0.18)',
                                borderRadius: '10px',
                                cursor: 'pointer',
                                fontSize: '14px',
                                fontWeight: '700',
                            }}
                        >
                            View Report
                        </button>
                    </div>
                    <div style={{
                        background: 'rgba(255, 255, 255, 0.16)',
                        border: '1px solid rgba(255, 255, 255, 0.22)',
                        backdropFilter: 'blur(8px)',
                        padding: '24px',
                        borderRadius: '10px',
                        boxShadow: '0 6px 16px rgba(0,0,0,0.16)'
                    }}>
                        <h2 style={{ color: '#f4f8ff', marginTop: 0 }}>Sales by Driver</h2>
                        <p style={{ color: '#dbe6ff', fontSize: '14px' }}>View point changes grouped by driver with summary and detailed views.</p>
                        <button
                            type="button"
                            onClick={() => navigate('/admin/reports/sales-by-driver')}
                            className="admin-cream-btn"
                            style={{
                                padding: '10px 20px',
                                color: '#1f2937',
                                border: '1px solid rgba(15, 23, 42, 0.18)',
                                borderRadius: '10px',
                                cursor: 'pointer',
                                fontSize: '14px',
                                fontWeight: '700',
                            }}
                        >
                            View Report
                        </button>
                    </div>

                </div>
            </div>
        </>
    );
}