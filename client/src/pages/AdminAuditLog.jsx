import {useState, useEffect} from 'react';
import {useNavigate} from 'react-router-dom';
import Nav from '../components/Nav';

export default function AdminAuditLog() {
    const navigate = useNavigate();
    const [logs, setLogs] = useState([]);
    const [filter, setFilter] = useState('all');
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');

    useEffect( () => {
        setLoading(true);
        fetch('/api/admin/audit-log?type=' + filter)
        .then(res => res.json())
        .then(data =>{
            setLogs(data);
            setLoading(false);
        })
        .catch(err => {
            console.error('There was an error fetching audit logs!', err);
            setLoading(false);
        });
    },[filter]);

    const filteredLogs = logs.filter(item =>
        item.label.toLowerCase().includes(search.toLowerCase())
    )


    return (
        <>
            <Nav />
            <div className="admin-dashboard">
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    background: 'rgba(255, 255, 255, 0.16)',
                    border: '1px solid rgba(255, 255, 255, 0.24)',
                    backdropFilter: 'blur(8px)',
                    padding: '16px 22px',
                    borderRadius: '12px',
                    color: 'white',
                    boxShadow: '0 10px 24px rgba(0,0,0,0.2)'
                }}>
                    <div>
                        <h1 style={{ margin: '0 0 4px 0', fontSize: '1.5em', fontWeight: '600', color: 'white' }}>
                            Audit Log
                        </h1>
                        <p style={{ margin: 0, fontSize: '0.95em', opacity: 0.92 }}>
                            System activity history
                        </p>
                    </div>
                    <button
                        type="button"
                        onClick={() => navigate('/admin-page')}
                        className="admin-cream-btn"
                        style={{
                            padding: '10px 22px',
                            color: '#1f2937',
                            border: '1px solid rgba(15, 23, 42, 0.22)',
                            borderRadius: '10px',
                            cursor: 'pointer',
                            fontSize: '14px',
                            fontWeight: '700',
                        }}
                    >
                        Back to Dashboard
                    </button>
                </div>

                <div style={{
                    background: 'rgba(255, 255, 255, 0.16)',
                    border: '1px solid rgba(255, 255, 255, 0.22)',
                    backdropFilter: 'blur(8px)',
                    padding: '18px',
                    borderRadius: '10px',
                    boxShadow: '0 6px 16px rgba(0,0,0,0.16)'
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                        <label style={{ color: '#f4f8ff', fontWeight: '600' }}>Filter by type:</label>
                        <select
                            value={filter}
                            onChange={e => setFilter(e.target.value)}
                            style={{
                                padding: '8px 12px',
                                borderRadius: '8px',
                                border: '1px solid rgba(15, 23, 42, 0.18)',
                                fontSize: '14px',
                                fontWeight: '600',
                                cursor: 'pointer',
                            }}
                        >
                            <option value="all">All Activity</option>
                            <option value="login">Login Attempts</option>
                            <option value="application">Applications</option>
                            <option value="points">Point Changes</option>
                        </select>
                    <input 
                        type = "text"
                        placeholder = "Search by email...."
                        value = {search}
                        onChange={e => setSearch(e.target.value)}
                        style= {{
                            padding: '10px 14px',
                            borderRadius : '8px',
                            border: '1px solid rgba(15,23,42,0.18)',
                            fontSize: '14px',
                            width: '250px',
            
                    }}
                    />
                    </div>
        

                    {loading ? (
                        <div style={{ color: '#dbe6ff' }}>Loading...</div>
                    ) : logs.length === 0 ? (
                        <div style={{ color: '#dbe6ff' }}>No activity found.</div>
                    ) : (
                        filteredLogs.map((item, index) => (
                            <div key={index} style={{
                                padding: '12px',
                                background: 'rgba(255, 255, 255, 0.16)',
                                borderRadius: '6px',
                                borderLeft: '4px solid #f4efe1',
                                color: '#f4f8ff',
                                marginBottom: '10px',
                            }}>
                                <strong>{item.type === 'login' ? 'Login attempt' : item.type === 'application' ? 'Application' : 'Points change'}:</strong> {item.label}
                                {item.type === 'login' && (
                                    <span style={{ marginLeft: '8px', color: item.success ? '#86efac' : '#fca5a5' }}>
                                        {item.success ? 'Success' : 'Failed'}
                                    </span>
                                )}
                                <div style={{ fontSize: '0.85em', color: '#dbe6ff', marginTop: '4px' }}>
                                    {new Date(item.timestamp).toLocaleString()}
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </>
    );

}