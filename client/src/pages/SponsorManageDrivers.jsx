import { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import Nav from '../components/Nav';
import { AuthContext } from '../components/AuthContext.jsx';

export default function SponsorManageDrivers() {
    const navigate = useNavigate();
    const { token, role, impersonate } = useContext(AuthContext);
    const [error, setError] = useState(null);
    const [sponsorID, setID] = useState(null);
    const [drivers, setDrivers] = useState(null);
    const [pointsChanges, setPointsChanges] = useState({});
    const [pointsReason, setPointsReason] = useState('');
    const [company_name, setCompanyName] = useState('');

    useEffect(() => {
        async function fetchSponsor() {
            try {
                const res = await fetch('https://team03.cpsc4911.com/GetSponsor', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ key: token }),
                });
                const result = await res.json();
                if (res.ok) {
                    setID(result.sponsor_id);
                    setCompanyName(result.company_name)
                } else {
                    setError('Failed to fetch sponsor ID');
                }
            } catch (err) {
                console.error(err);
                setError('Server error');
            }
        }

        if (token && role === 'sponsor') {
            fetchSponsor();
        }
    }, [token, role]);

    useEffect(() => {
        async function fetchSponsorDrivers() {
            try {
                const res = await fetch('https://team03.cpsc4911.com/GetSponsorDrivers', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ sponsorID }),
                });
                const result = await res.json();
                if (res.ok) {
                    setDrivers(result);
                } else {
                    setError('Failed to fetch sponsor drivers');
                }
            } catch (err) {
                console.error(err);
                setError('Server error');
            }
        }

        if (sponsorID) {
            fetchSponsorDrivers();
        }
    }, [sponsorID]);

    const handleChangePoints = async (driver_id) => {
        const change = pointsChanges[driver_id];
        if (!change) return alert('Enter a value');
        if (!pointsReason) return alert('Enter a reason');

        try {
            const res = await fetch('https://team03.cpsc4911.com/ChangePoints', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    driver_id,
                    change,
                    sponsor_id: sponsorID,
                    reason: pointsReason,
                    company_name: company_name,
                }),
            });
            const result = await res.json();
            if (res.ok && result.success) {
                setDrivers((prev) =>
                    prev.map((d) =>
                        d.driver_id === driver_id
                            ? { ...d, points: Number(d.points || 0) + Number(change) }
                            : d
                    )
                );
                setPointsChanges((prev) => ({ ...prev, [driver_id]: '' }));
                setPointsReason('');
            } else {
                alert('Failed to update points');
            }
        } catch (err) {
            console.error(err);
            alert('Server error');
        }
    };

    const handleSponsorImpersonate = async (userId) => {
        try {
            const res = await fetch(`/api/sponsor/impersonate/${userId}`, {
                method: 'POST',
                headers: { Authorization: `Bearer ${token}` },
            });
            const data = await res.json();
            if (!res.ok) return alert(data.error);
            impersonate(data.impersonateToken, data.role);
            navigate('/driver-page');
        } catch (err) {
            console.error(err);
            alert('Failed to impersonate driver');
        }
    };

    if (role !== 'sponsor') {
        return (
            <>
                <Nav />
                <div className="admin-dashboard" style={{ color: 'white', padding: '24px' }}>
                    <p>This page is only available to sponsor accounts.</p>
                    <button type="button" className="admin-cream-btn" onClick={() => navigate('/sponsor-page')}>
                        Back to dashboard
                    </button>
                </div>
            </>
        );
    }

    return (
        <>
            <Nav />
            <div className="admin-dashboard">
                <div
                     style={{
                        display : 'flex',
                        alignItems : 'center',
                        justifyContent : 'space-between',
                        background: 'rgba(255, 255, 255, 0.16)',
                        border: '1px solid rgba(255, 255, 255, 0.24)',
                        backdropFilter: 'blur(8px)',
                        padding: '16px 22px',
                        borderRadius: '12px',
                        color: 'white',
                        textAlign: 'center',
                        boxShadow: '0 10px 24px rgba(0,0,0,0.2)',
                    }}
                >
                    <h1 style={{ margin: '0 0 10px 0', fontSize: '2em', fontWeight: '600' }}>Manage Drivers</h1>
                    <p style={{ margin: '0', fontSize: '1.1em', opacity: '0.95' }}>
                        View sponsored drivers, adjust points, and open their view
                    </p>
                </div>

                {error && (
                    <p style={{ color: '#fecaca', marginBottom: '16px' }} role="alert">
                        {error}
                    </p>
                )}

                {drivers && drivers.length > 0 ? (
                    <>
                    <div style={{
                    background: 'rgba(255, 255, 255, 0.16)',
                    border: '1px solid rgba(255, 255, 255, 0.22)',
                    backdropFilter: 'blur(8px)',
                    padding: '18px',
                    borderRadius: '10px',
                    boxShadow: '0 6px 16px rgba(0,0,0,0.16)',
                    marginTop: '16px',
                }}>
                    <input
                        type="text"
                        placeholder="Enter reason for points change"
                        value={pointsReason}
                        onChange={(e) => setPointsReason(e.target.value)}
                        style={{
                            padding: '10px 14px',
                            borderRadius: '8px',
                            border: '1px solid rgba(15,23,42,0.18)',
                            fontSize: '14px',
                            width: '100%',
                            marginBottom: '16px',
                            boxSizing: 'border-box',
                        }}
                    />
                    <table style={{ width: '100%', borderCollapse: 'collapse', color: 'white' }}>
                        <thead>
                            <tr style={{ borderBottom: '2px solid rgba(255,255,255,0.2)' }}>
                                <th style={{ padding: '10px 12px', textAlign: 'left' }}>First Name</th>
                                <th style={{ padding: '10px 12px', textAlign: 'left' }}>Last Name</th>
                                <th style={{ padding: '10px 12px', textAlign: 'left' }}>Phone</th>
                                <th style={{ padding: '10px 12px', textAlign: 'left' }}>Points</th>
                                <th style={{ padding: '10px 12px', textAlign: 'left' }}>Points Change</th>
                                <th style={{ padding: '10px 12px', textAlign: 'left' }}>Update</th>
                                <th style={{ padding: '10px 12px', textAlign: 'left' }}>Impersonate</th>
                            </tr>
                        </thead>
                        <tbody>
                            {drivers.map((driver, index) => (
                                <tr key={index} style={{ borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                                    <td style={{ padding: '10px 12px' }}>{driver.firstname}</td>
                                    <td style={{ padding: '10px 12px' }}>{driver.lastname}</td>
                                    <td style={{ padding: '10px 12px' }}>{driver.phone}</td>
                                    <td style={{ padding: '10px 12px' }}>{driver.points}</td>
                                    <td style={{ padding: '10px 12px' }}>
                                        <input
                                            type="number"
                                            value={pointsChanges[driver.driver_id] || ''}
                                            onChange={(e) =>
                                                setPointsChanges({
                                                    ...pointsChanges,
                                                    [driver.driver_id]: Number(e.target.value),
                                                })
                                            }
                                            style={{
                                                padding: '6px 10px',
                                                borderRadius: '6px',
                                                border: '1px solid rgba(15,23,42,0.18)',
                                                fontSize: '14px',
                                                width: '100px',
                                            }}
                                        />
                                    </td>
                                    <td style={{ padding: '10px 12px' }}>
                                        <button
                                            type="button"
                                            onClick={() => handleChangePoints(driver.driver_id)}
                                            className="admin-cream-btn"
                                            style={{
                                                padding: '6px 14px',
                                                color: '#1f2937',
                                                border: '1px solid rgba(15,23,42,0.18)',
                                                borderRadius: '6px',
                                                cursor: 'pointer',
                                                fontSize: '13px',
                                                fontWeight: '600',
                                            }}
                                        >
                                            Update
                                        </button>
                                    </td>
                                    <td style={{ padding: '10px 12px' }}>
                                        <button
                                            type="button"
                                            onClick={() => handleSponsorImpersonate(driver.driver_id)}
                                            style={{
                                                padding: '6px 12px',
                                                backgroundColor: '#667eea',
                                                color: 'white',
                                                border: 'none',
                                                borderRadius: '6px',
                                                fontSize: '13px',
                                                cursor: 'pointer',
                                                fontWeight: '600',
                                            }}
                                        >
                                            View as Driver
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    </div>
                    </>
                ) : drivers && drivers.length === 0 ? (
                    <p style={{ color: '#dbe6ff' }}>No drivers are associated with your sponsor account yet.</p>
                ) : (
                    <p style={{ color: '#dbe6ff' }}>Loading drivers…</p>
                )}

                <div style={{ paddingTop: '25px', textAlign: 'center' }}>
                    <button
                        type="button"
                        className="admin-cream-btn"
                        onClick={() => navigate('/sponsor-page')}
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
            </div>
        </>
    );
}
