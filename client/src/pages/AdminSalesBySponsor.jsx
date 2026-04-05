import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Nav from '../components/Nav';

export default function AdminSalesBySponsor() {
    const navigate = useNavigate();
    const [report, setReport] = useState([]);
    const [sponsors, setSponsors] = useState([]);
    const [sponsorFilter, setSponsorFilter] = useState('all');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [view, setView] = useState('summary');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch('/api/admin/sales-by-sponsor')
            .then(res => res.json())
            .then(data => {
                setReport(data);
                setLoading(false);
            })
            .catch(err => {
                console.error('Error fetching sales report:', err);
                setLoading(false);
            });

        fetch('/api/sponsors')
            .then(res => res.json())
            .then(data => setSponsors(data))
            .catch(err => console.error('Error fetching sponsors:', err));
    }, []);

    const filteredReport = report.filter(item => {
        const matchesSponsor = sponsorFilter === 'all' || item.sponsor_name === sponsorFilter;
        const itemDate = new Date(item.date);
        const matchesStart = startDate ? itemDate >= new Date(startDate) : true;
        const matchesEnd = endDate ? itemDate <= new Date(endDate + 'T23:59:59') : true;
        return matchesSponsor && matchesStart && matchesEnd;
    });

    // summary view — group by sponsor
    const summaryData = filteredReport.reduce((acc, item) => {
        const existing = acc.find(s => s.sponsor_name === item.sponsor_name);
        if (existing) {
            existing.total_points += item.points_change;
            existing.total_changes += 1;
        } else {
            acc.push({
                sponsor_name: item.sponsor_name,
                total_points: item.points_change,
                total_changes: 1
            });
        }
        return acc;
    }, []);

    const handleDownloadCSV = () => {
        const headers = view === 'summary'
            ? ['Sponsor', 'Total Point Changes', 'Number of Changes']
            : ['Sponsor', 'Driver', 'Points Change', 'Date', 'Reason'];

        const rows = view === 'summary'
            ? summaryData.map(item => [item.sponsor_name, item.total_points, item.total_changes])
            : filteredReport.map(item => [item.sponsor_name, item.driver_name, item.points_change, new Date(item.date).toLocaleString(), item.reason]);

        const csv = [headers, ...rows].map(r => r.join(',')).join('\n');
        const blob = new Blob([csv], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'sales_by_sponsor.csv';
        a.click();
        URL.revokeObjectURL(url);
    };

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
                            Sales by Sponsor
                        </h1>
                        <p style={{ margin: 0, fontSize: '0.95em', opacity: 0.92 }}>
                            Point changes grouped by sponsor
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
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '16px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                            <label style={{ color: '#f4f8ff', fontWeight: '600' }}>Sponsor:</label>
                            <select
                                value={sponsorFilter}
                                onChange={e => setSponsorFilter(e.target.value)}
                                style={{
                                    padding: '8px 12px',
                                    borderRadius: '8px',
                                    border: '1px solid rgba(15, 23, 42, 0.18)',
                                    fontSize: '14px',
                                    fontWeight: '600',
                                    cursor: 'pointer',
                                }}
                            >
                                <option value="all">All Sponsors</option>
                                {sponsors.map(s => (
                                    <option key={s.sponsor_id} value={s.company_name}>{s.company_name}</option>
                                ))}
                            </select>
                            <label style={{ color: '#f4f8ff', fontWeight: '600' }}>View:</label>
                            <select
                                value={view}
                                onChange={e => setView(e.target.value)}
                                style={{
                                    padding: '8px 12px',
                                    borderRadius: '8px',
                                    border: '1px solid rgba(15, 23, 42, 0.18)',
                                    fontSize: '14px',
                                    fontWeight: '600',
                                    cursor: 'pointer',
                                }}
                            >
                                <option value="summary">Summary</option>
                                <option value="detailed">Detailed</option>
                            </select>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                            <label style={{ color: '#f4f8ff', fontWeight: '600' }}>From:</label>
                            <input
                                type="date"
                                value={startDate}
                                onChange={e => setStartDate(e.target.value)}
                                style={{
                                    padding: '8px 12px',
                                    borderRadius: '8px',
                                    border: '1px solid rgba(15, 23, 42, 0.18)',
                                    fontSize: '14px',
                                }}
                            />
                            <label style={{ color: '#f4f8ff', fontWeight: '600' }}>To:</label>
                            <input
                                type="date"
                                value={endDate}
                                onChange={e => setEndDate(e.target.value)}
                                style={{
                                    padding: '8px 12px',
                                    borderRadius: '8px',
                                    border: '1px solid rgba(15, 23, 42, 0.18)',
                                    fontSize: '14px',
                                }}
                            />
                            <button
                                type="button"
                                onClick={handleDownloadCSV}
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
                    </div>

                    {loading ? (
                        <div style={{ color: '#dbe6ff' }}>Loading...</div>
                    ) : view === 'summary' ? (
                        summaryData.length === 0 ? (
                            <div style={{ color: '#dbe6ff' }}>No data found.</div>
                        ) : (
                            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                                <thead>
                                    <tr style={{ backgroundColor: 'rgba(255,255,255,0.1)' }}>
                                        {['Sponsor', 'Total Points Awarded', 'Number of Changes'].map(h => (
                                            <th key={h} style={{
                                                padding: '12px 16px',
                                                textAlign: 'left',
                                                color: '#f4f8ff',
                                                fontWeight: '600',
                                                fontSize: '14px',
                                                borderBottom: '2px solid rgba(255,255,255,0.2)'
                                            }}>
                                                {h}
                                            </th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody>
                                    {summaryData.map((item, index) => (
                                        <tr key={index} style={{ borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                                            <td style={{ padding: '12px 16px', color: '#f4f8ff', fontSize: '14px' }}>{item.sponsor_name}</td>
                                            <td style={{ padding: '12px 16px', color: '#86efac', fontSize: '14px', fontWeight: '600' }}>{item.total_points}</td>
                                            <td style={{ padding: '12px 16px', color: '#f4f8ff', fontSize: '14px' }}>{item.total_changes}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        )
                    ) : (
                        filteredReport.length === 0 ? (
                            <div style={{ color: '#dbe6ff' }}>No data found.</div>
                        ) : (
                            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                                <thead>
                                    <tr style={{ backgroundColor: 'rgba(255,255,255,0.1)' }}>
                                        {['Sponsor', 'Driver', 'Points Change', 'Date', 'Reason'].map(h => (
                                            <th key={h} style={{
                                                padding: '12px 16px',
                                                textAlign: 'left',
                                                color: '#f4f8ff',
                                                fontWeight: '600',
                                                fontSize: '14px',
                                                borderBottom: '2px solid rgba(255,255,255,0.2)'
                                            }}>
                                                {h}
                                            </th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredReport.map((item, index) => (
                                        <tr key={index} style={{ borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                                            <td style={{ padding: '12px 16px', color: '#f4f8ff', fontSize: '14px' }}>{item.sponsor_name}</td>
                                            <td style={{ padding: '12px 16px', color: '#f4f8ff', fontSize: '14px' }}>{item.driver_name}</td>
                                            <td style={{ padding: '12px 16px', fontSize: '14px', color: item.points_change >= 0 ? '#86efac' : '#fca5a5', fontWeight: '600' }}>
                                                {item.points_change >= 0 ? '+' : ''}{item.points_change}
                                            </td>
                                            <td style={{ padding: '12px 16px', color: '#dbe6ff', fontSize: '14px' }}>{new Date(item.date).toLocaleString()}</td>
                                            <td style={{ padding: '12px 16px', color: '#f4f8ff', fontSize: '14px' }}>{item.reason}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        )
                    )}
                </div>
            </div>
        </>
    );
}