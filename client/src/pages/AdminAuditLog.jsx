import {useState, useEffect} from 'react';
import {useNavigate} from 'react-router-dom';
import Nav from '../components/Nav';

export default function AdminAuditLog() {
    const navigate = useNavigate();
    const [logs, setLogs] = useState([]);
    const [filter, setFilter] = useState('all');
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [sponsorFilter, setSponsorFilter] = useState('all');
    const [sponsors, setSponsors] = useState([]);


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

        fetch('/api/sponsors')
        .then(res => res.json())
        .then(data => {
            setSponsors(data);
        })
        .catch(err => {
            console.error('There was an error fetching sponsors!', err);
        });
    },[filter]);

    const filteredLogs = logs.filter(item => {
        const searchMatch = item.label.toLowerCase().includes(search.toLowerCase());
        const itemDate = new Date(item.timestamp);
        const startDateMatch = startDate ? itemDate >= new Date(startDate) : true;
        const endDateMatch = endDate ? itemDate <= new Date(endDate) : true;
        const sponsorMatch = sponsorFilter !== 'all' ? item.label.toLowerCase().includes(sponsorFilter.toLowerCase()) : true;

        return searchMatch && startDateMatch && endDateMatch && sponsorMatch;
    });


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

                    <input 
                        type = "date"
                        value = {startDate}
                        onChange={e => setStartDate(e.target.value)}
                        style = {{
                            padding: '10px 14px',
                            borderRadius : '8px',
                            border : '1px solid rgba(15,23,42,0.18)',
                            fontSize : '14px'
                        }}   
                    />
                    <input 
                        type = "date"
                        value = {endDate}
                        onChange={e => setEndDate(e.target.value)}
                        style = {{
                            padding: '10px 14px',
                            borderRadius : '8px',
                            border : '1px solid rgba(15,23,42,0.18)',
                            fontSize : '14px'
                        }}
                    />
                    <label style={{ color: '#f4f8ff', fontWeight: '600' }}>Sponsor</label>
                    <select 
                        value={sponsorFilter}
                        onChange = {e => setSponsorFilter(e.target.value)}
                        style = {{
                            padding: '10px 14px',
                            borderRadius : '8px',
                            border : '1px solid rgba(15,23,42,0.18)',
                            fontSize : '14px'
                        }}
                    >
                        <option value = "all">All Sponsors</option>
                        {sponsors.map(s => (
                            <option key={s.sponsor_id} value={s.company_name}>{s.company_name}
                            </option>
                        ))
                        }
    
                    </select>
                    <button
                        type="button"
                        onClick={() => {
                            const headers = ['Type', 'Label', 'Success', 'Timestamp'];
                            const rows = filteredLogs.map(item => [
                                item.type,
                                item.label,
                                item.type === 'login' ? (item.success ? 'Success' : 'Failed') : '',
                                new Date(item.timestamp).toLocaleString()
                            ]);
                            const csv = [headers, ...rows].map(r => r.join(',')).join('\n');
                            const blob = new Blob([csv], { type: 'text/csv' });
                            const url = URL.createObjectURL(blob);
                            const a = document.createElement('a');
                            a.href = url;
                            a.download = 'audit_log.csv';
                            a.click();
                            URL.revokeObjectURL(url);
                        }}
                        style={{
                            padding: '8px 16px',
                            backgroundColor: '#4caf50',
                            color: 'white',
                            border: 'none',
                            borderRadius: '8px',
                            fontSize: '14px',
                            fontWeight: '600',
                            cursor: 'pointer',
                        }}
                    >
                        Download CSV
                    </button>
                   
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