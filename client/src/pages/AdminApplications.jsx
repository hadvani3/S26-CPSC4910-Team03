import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Nav from '../components/Nav';

const MOCK_APPLICATIONS = [
    {
        application_id: 1,
        user_id: 304033,
        sponsor_id: 1,
        first_name: 'James',
        last_name: 'Carter',
        email_address: 'jcarter@email.com',
        phone_number: '555-123-4567',
        license_number: 'CDL-TX-88821',
        street_address: '142 Oakwood Dr',
        city: 'Austin',
        state: 'TX',
        zip_code: '78701',
        reason: 'Looking for a sponsor to support my long-haul driving career.',
        application_status: 'PENDING',
        notes: null,
        created_at: '2026-03-20T14:22:00',
        sponsor_name: 'Sponsor A'
    },
    {
        application_id: 2,
        user_id: 304035,
        sponsor_id: 1,
        first_name: 'Maria',
        last_name: 'Gonzalez',
        email_address: 'mgonzalez@email.com',
        phone_number: '555-987-6543',
        license_number: 'CDL-FL-44102',
        street_address: '89 Citrus Blvd',
        city: 'Orlando',
        state: 'FL',
        zip_code: '32801',
        reason: 'Interested in joining the incentive program to improve my performance.',
        application_status: 'PENDING',
        notes: null,
        created_at: '2026-03-22T09:10:00',
        sponsor_name: 'Sponsor A'
    },
    {
        application_id: 3,
        user_id: 304037,
        sponsor_id: 2,
        first_name: 'Derek',
        last_name: 'Pullman',
        email_address: 'dpullman@email.com',
        phone_number: '555-456-7890',
        license_number: 'CDL-OH-33019',
        street_address: '301 Lakeview Ave',
        city: 'Columbus',
        state: 'OH',
        zip_code: '43215',
        reason: 'Want to earn rewards for my safe driving record.',
        application_status: 'PENDING',
        notes: null,
        created_at: '2026-03-25T16:45:00',
        sponsor_name: 'Sponsor B'
    }
];

const REVIEWED_MOCK = [
    {
        application_id: 4,
        first_name: 'Sarah',
        last_name: 'Blake',
        email_address: 'sblake@email.com',
        sponsor_name: 'Sponsor A',
        application_status: 'APPROVED',
        notes: 'Strong driving record.',
        reviewed_at: '2026-03-18T10:00:00'
    },
    {
        application_id: 5,
        first_name: 'Tom',
        last_name: 'Hicks',
        email_address: 'thicks@email.com',
        sponsor_name: 'Sponsor B',
        application_status: 'REJECTED',
        notes: 'Incomplete CDL information.',
        reviewed_at: '2026-03-19T14:30:00'
    }
];

export default function AdminApplications() {
    const navigate = useNavigate();
    const [applications, setApplications] = useState(MOCK_APPLICATIONS);
    const [reviewed, setReviewed] = useState(REVIEWED_MOCK);
    const [expandedId, setExpandedId] = useState(null);
    const [notes, setNotes] = useState({});
    const [submitting, setSubmitting] = useState(null);
    const [activeTab, setActiveTab] = useState('pending');

    const toggleExpand = (id) => {
        setExpandedId(prev => prev === id ? null : id);
    };

    const handleNotesChange = (id, value) => {
        setNotes(prev => ({ ...prev, [id]: value }));
    };

    const handleDecision = async (application, decision) => {
        if (!window.confirm(
            decision === 'APPROVED'
                ? `Approve ${application.first_name} ${application.last_name}'s application?`
                : `Reject ${application.first_name} ${application.last_name}'s application?`
        )) return;

        setSubmitting(application.application_id);
        try {
            // TODO: swap mock below for real fetch once teammate finishes backend
            // const endpoint = decision === 'APPROVED' ? 'approve' : 'reject';
            // const res = await fetch(`/api/admin/applications/${application.application_id}/${endpoint}`, {
            //     method: 'POST',
            //     headers: { 'Content-Type': 'application/json' },
            //     body: JSON.stringify({ notes: notes[application.application_id] || '' })
            // });
            // if (!res.ok) throw new Error('Failed');

            const updated = {
                ...application,
                application_status: decision,
                notes: notes[application.application_id] || null,
                reviewed_at: new Date().toISOString()
            };
            setApplications(prev => prev.filter(a => a.application_id !== application.application_id));
            setReviewed(prev => [updated, ...prev]);
            setExpandedId(null);
        } catch (err) {
            console.error(err);
            alert('Server error');
        } finally {
            setSubmitting(null);
        }
    };

    const statusColors = (status) => {
        if (status === 'APPROVED') return { background: '#d4edda', color: '#155724' };
        if (status === 'REJECTED') return { background: '#f8d7da', color: '#721c24' };
        return { background: '#fff3cd', color: '#856404' };
    };

    return (
        <>
            <Nav />
            <div className="container" style={{ maxWidth: '900px' }}>

                {/* header */}
                <div style={{
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    padding: '40px 30px',
                    borderRadius: '12px',
                    color: 'white',
                    textAlign: 'center',
                    marginBottom: '30px',
                    boxShadow: '0 4px 15px rgba(0,0,0,0.2)'
                }}>
                    <h1 style={{ margin: '0 0 8px 0', fontSize: '2em', fontWeight: '600' }}>
                        Driver Applications
                    </h1>
                    <p style={{ margin: 0, opacity: 0.9 }}>
                        Review and manage driver sponsorship requests
                    </p>
                    <div style={{ display: 'flex', justifyContent: 'center', gap: '40px', marginTop: '20px' }}>
                        <div>
                            <div style={{ fontSize: '2.2em', fontWeight: 'bold' }}>{applications.length}</div>
                            <div style={{ opacity: 0.85, fontSize: '0.9em' }}>Pending</div>
                        </div>
                        <div>
                            <div style={{ fontSize: '2.2em', fontWeight: 'bold' }}>
                                {reviewed.filter(r => r.application_status === 'APPROVED').length}
                            </div>
                            <div style={{ opacity: 0.85, fontSize: '0.9em' }}>Approved</div>
                        </div>
                        <div>
                            <div style={{ fontSize: '2.2em', fontWeight: 'bold' }}>
                                {reviewed.filter(r => r.application_status === 'REJECTED').length}
                            </div>
                            <div style={{ opacity: 0.85, fontSize: '0.9em' }}>Rejected</div>
                        </div>
                    </div>
                </div>

                {/* tabs */}
                <div style={{ display: 'flex', gap: '4px', marginBottom: '20px' }}>
                    {['pending', 'reviewed'].map(tab => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            style={{
                                padding: '10px 24px',
                                border: 'none',
                                borderRadius: '6px',
                                fontSize: '14px',
                                fontWeight: '600',
                                cursor: 'pointer',
                                background: activeTab === tab ? 'white' : 'rgba(255,255,255,0.15)',
                                color: activeTab === tab ? '#667eea' : 'white'
                            }}
                        >
                            {tab === 'pending'
                                ? `Pending (${applications.length})`
                                : `Reviewed (${reviewed.length})`}
                        </button>
                    ))}
                </div>

                {/* pending tab */}
                {activeTab === 'pending' && (
                    <div>
                        {applications.length === 0 ? (
                            <div style={{
                                background: 'white', borderRadius: '10px',
                                padding: '50px', textAlign: 'center', color: '#999'
                            }}>
                                No pending applications
                            </div>
                        ) : applications.map(app => (
                            <div key={app.application_id} style={{
                                background: 'white', borderRadius: '10px',
                                marginBottom: '12px', overflow: 'hidden',
                                boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                            }}>
                                {/* collapsed row */}
                                <div
                                    onClick={() => toggleExpand(app.application_id)}
                                    style={{
                                        padding: '16px 20px',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'space-between',
                                        cursor: 'pointer',
                                        background: expandedId === app.application_id ? '#fafafa' : 'white'
                                    }}
                                >
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                                        <div style={{
                                            width: '42px', height: '42px', borderRadius: '50%',
                                            background: 'linear-gradient(135deg, #667eea, #764ba2)',
                                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                                            color: 'white', fontWeight: '600', fontSize: '15px', flexShrink: 0
                                        }}>
                                            {app.first_name?.[0]}{app.last_name?.[0]}
                                        </div>
                                        <div>
                                            <div style={{ fontWeight: '600', color: '#333', fontSize: '15px' }}>
                                                {app.first_name} {app.last_name}
                                            </div>
                                            <div style={{ fontSize: '13px', color: '#888', marginTop: '2px' }}>
                                                {app.email_address} · {app.sponsor_name}
                                            </div>
                                        </div>
                                    </div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                        <span style={{ fontSize: '12px', color: '#aaa' }}>
                                            {new Date(app.created_at).toLocaleDateString()}
                                        </span>
                                        <span style={{
                                            ...statusColors('PENDING'),
                                            padding: '3px 10px', borderRadius: '99px',
                                            fontSize: '12px', fontWeight: '600'
                                        }}>
                                            PENDING
                                        </span>
                                        <span style={{ fontSize: '18px', color: '#bbb' }}>
                                            {expandedId === app.application_id ? '▴' : '▾'}
                                        </span>
                                    </div>
                                </div>

                                {/* expanded detail */}
                                {expandedId === app.application_id && (
                                    <div style={{ borderTop: '1px solid #f0f0f0', padding: '20px' }}>
                                        <div style={{
                                            display: 'grid', gridTemplateColumns: '1fr 1fr',
                                            gap: '10px', marginBottom: '14px'
                                        }}>
                                            {[
                                                ['Phone', app.phone_number],
                                                ['CDL Number', app.license_number],
                                                ['Address', `${app.street_address}, ${app.city}, ${app.state} ${app.zip_code}`],
                                                ['Applying to', app.sponsor_name],
                                                ['Date of Birth', app.birth_date || '—'],
                                                ['Applied On', new Date(app.created_at).toLocaleString()]
                                            ].map(([label, value]) => (
                                                <div key={label} style={{
                                                    background: '#f8f9fa', borderRadius: '6px', padding: '10px 14px'
                                                }}>
                                                    <div style={{
                                                        fontSize: '11px', color: '#999', fontWeight: '600',
                                                        textTransform: 'uppercase', marginBottom: '3px'
                                                    }}>
                                                        {label}
                                                    </div>
                                                    <div style={{ fontSize: '14px', color: '#333' }}>{value || '—'}</div>
                                                </div>
                                            ))}
                                        </div>

                                        {app.reason && (
                                            <div style={{
                                                background: '#f8f9fa', borderRadius: '6px',
                                                padding: '12px 14px', marginBottom: '14px'
                                            }}>
                                                <div style={{
                                                    fontSize: '11px', color: '#999', fontWeight: '600',
                                                    textTransform: 'uppercase', marginBottom: '4px'
                                                }}>
                                                    Reason for applying
                                                </div>
                                                <div style={{ fontSize: '14px', color: '#333', lineHeight: '1.5' }}>
                                                    {app.reason}
                                                </div>
                                            </div>
                                        )}

                                        <div style={{ marginBottom: '14px' }}>
                                            <label style={{
                                                display: 'block', fontSize: '13px',
                                                fontWeight: '600', color: '#555', marginBottom: '6px'
                                            }}>
                                                Review notes (optional)
                                            </label>
                                            <textarea
                                                rows={2}
                                                placeholder="Add a note for this decision..."
                                                value={notes[app.application_id] || ''}
                                                onChange={(e) => handleNotesChange(app.application_id, e.target.value)}
                                                style={{
                                                    width: '100%', padding: '10px 12px',
                                                    border: '1px solid #ddd', borderRadius: '6px',
                                                    fontSize: '14px', resize: 'vertical',
                                                    boxSizing: 'border-box', fontFamily: 'inherit'
                                                }}
                                            />
                                        </div>

                                        <div style={{ display: 'flex', gap: '10px' }}>
                                            <button
                                                onClick={() => handleDecision(app, 'APPROVED')}
                                                disabled={submitting === app.application_id}
                                                style={{
                                                    flex: 1, padding: '12px',
                                                    background: submitting === app.application_id ? '#ccc' : '#4caf50',
                                                    color: 'white', border: 'none', borderRadius: '6px',
                                                    fontSize: '15px', fontWeight: '600',
                                                    cursor: submitting === app.application_id ? 'not-allowed' : 'pointer'
                                                }}
                                            >
                                                {submitting === app.application_id ? 'Processing...' : '✓ Approve'}
                                            </button>
                                            <button
                                                onClick={() => handleDecision(app, 'REJECTED')}
                                                disabled={submitting === app.application_id}
                                                style={{
                                                    flex: 1, padding: '12px',
                                                    background: submitting === app.application_id ? '#ccc' : '#dc3545',
                                                    color: 'white', border: 'none', borderRadius: '6px',
                                                    fontSize: '15px', fontWeight: '600',
                                                    cursor: submitting === app.application_id ? 'not-allowed' : 'pointer'
                                                }}
                                            >
                                                ✕ Reject
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                )}

                {/* reviewed tab */}
                {activeTab === 'reviewed' && (
                    <div style={{
                        background: 'white', borderRadius: '10px',
                        overflow: 'hidden', boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                    }}>
                        {reviewed.length === 0 ? (
                            <div style={{ padding: '50px', textAlign: 'center', color: '#999' }}>
                                No reviewed applications yet
                            </div>
                        ) : (
                            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                                <thead>
                                    <tr style={{ background: '#f8f9fa', borderBottom: '2px solid #dee2e6' }}>
                                        {['Driver', 'Sponsor', 'Decision', 'Notes', 'Reviewed On'].map(h => (
                                            <th key={h} style={{
                                                padding: '12px 16px', textAlign: 'left',
                                                fontWeight: '600', fontSize: '13px', color: '#555'
                                            }}>
                                                {h}
                                            </th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody>
                                    {reviewed.map(app => (
                                        <tr key={app.application_id} style={{ borderBottom: '1px solid #f0f0f0' }}>
                                            <td style={{ padding: '12px 16px' }}>
                                                <div style={{ fontWeight: '500', fontSize: '14px' }}>
                                                    {app.first_name} {app.last_name}
                                                </div>
                                                <div style={{ fontSize: '12px', color: '#999' }}>
                                                    {app.email_address}
                                                </div>
                                            </td>
                                            <td style={{ padding: '12px 16px', fontSize: '14px', color: '#555' }}>
                                                {app.sponsor_name}
                                            </td>
                                            <td style={{ padding: '12px 16px' }}>
                                                <span style={{
                                                    ...statusColors(app.application_status),
                                                    padding: '3px 10px', borderRadius: '99px',
                                                    fontSize: '12px', fontWeight: '600'
                                                }}>
                                                    {app.application_status}
                                                </span>
                                            </td>
                                            <td style={{ padding: '12px 16px', fontSize: '13px', color: '#666' }}>
                                                {app.notes || '—'}
                                            </td>
                                            <td style={{ padding: '12px 16px', fontSize: '13px', color: '#999' }}>
                                                {app.reviewed_at
                                                    ? new Date(app.reviewed_at).toLocaleDateString()
                                                    : '—'}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        )}
                    </div>
                )}

                <div style={{ marginTop: '30px', textAlign: 'center' }}>
                    <button
                        onClick={() => navigate('/admin-page')}
                        style={{
                            padding: '12px 30px', background: '#6c757d',
                            color: 'white', border: 'none', borderRadius: '8px',
                            fontSize: '15px', fontWeight: '600', cursor: 'pointer'
                        }}
                    >
                        ← Back to Dashboard
                    </button>
                </div>
            </div>
        </>
    );
}