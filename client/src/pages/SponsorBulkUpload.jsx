import { useState, useRef, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import Nav from '../components/Nav';
import { AuthContext } from '../components/AuthContext.jsx';

export default function SponsorBulkUpload() {
    const navigate = useNavigate();
    const { token } = useContext(AuthContext);
    const fileInputRef = useRef(null);
    const [file, setFile] = useState(null);
    const [uploading, setUploading] = useState(false);
    const [results, setResults] = useState(null);
    const [dragOver, setDragOver] = useState(false);

    const handleFileChange = (e) => {
        const selected = e.target.files[0];
        if (selected) {
            setFile(selected);
            setResults(null);
        }
    };

    const handleDrop = (e) => {
        e.preventDefault();
        setDragOver(false);
        const dropped = e.dataTransfer.files[0];
        if (dropped) {
            setFile(dropped);
            setResults(null);
        }
    };

    const handleUpload = async () => {
        if (!file) return alert('Please select a file first.');
        setUploading(true);

        try {
            const text = await file.text();
            const lines = text.split('\n').map(l => l.trim()).filter(l => l.length > 0);
            const rows = lines.map((line, index) => ({ line: index + 1, content: line }));

            const res = await fetch('/api/sponsor/bulk-upload', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ rows })
            });

            const data = await res.json();
            if (!res.ok) throw new Error(data.error);
            setResults(data);
        } catch (err) {
            console.error(err);
            alert('Upload failed. Please try again.');
        } finally {
            setUploading(false);
        }
    };

    const handleClear = () => {
        setFile(null);
        setResults(null);
        if (fileInputRef.current) fileInputRef.current.value = '';
    };

    return (
        <>
            <Nav />
            <div className="container" style={{ maxWidth: '800px' }}>

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
                        Bulk Upload
                    </h1>
                    <p style={{ margin: 0, opacity: 0.9 }}>
                        Upload a pipe-delimited file to add drivers and sponsor users to your organization
                    </p>
                </div>

                {/* file format reference */}
                <div style={{
                    backgroundColor: 'white',
                    borderRadius: '10px',
                    padding: '20px 24px',
                    marginBottom: '20px',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                }}>
                    <h2 style={{ margin: '0 0 12px 0', fontSize: '1em', fontWeight: '600', color: '#333' }}>
                        File Format
                    </h2>
                    <div style={{
                        fontFamily: 'monospace',
                        fontSize: '13px',
                        backgroundColor: '#f8f9fa',
                        borderRadius: '6px',
                        padding: '12px 16px',
                        color: '#333',
                        lineHeight: '2'
                    }}>
                        <div><span style={{ color: '#4caf50', fontWeight: '600' }}>D</span>|first name|last name|email|points (opt)|reason (opt)</div>
                        <div><span style={{ color: '#ff9800', fontWeight: '600' }}>S</span>|first name|last name|email</div>
                    </div>
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: '1fr 1fr',
                        gap: '10px',
                        marginTop: '12px'
                    }}>
                        {[
                            { type: 'D', label: 'Driver',       color: '#4caf50', bg: '#f0fff0' },
                            { type: 'S', label: 'Sponsor User', color: '#ff9800', bg: '#fff8f0' },
                        ].map(({ type, label, color, bg }) => (
                            <div key={type} style={{
                                background: bg, borderRadius: '6px',
                                padding: '8px 12px', display: 'flex',
                                alignItems: 'center', gap: '8px'
                            }}>
                                <span style={{
                                    fontFamily: 'monospace', fontWeight: '700',
                                    fontSize: '15px', color
                                }}>{type}</span>
                                <span style={{ fontSize: '13px', color: '#555' }}>{label}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* drop zone */}
                <div
                    onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                    onDragLeave={() => setDragOver(false)}
                    onDrop={handleDrop}
                    onClick={() => fileInputRef.current?.click()}
                    style={{
                        border: `2px dashed ${dragOver ? '#667eea' : file ? '#4caf50' : '#ccc'}`,
                        borderRadius: '10px',
                        padding: '40px',
                        textAlign: 'center',
                        cursor: 'pointer',
                        backgroundColor: dragOver ? '#f0f0ff' : file ? '#f0fff4' : 'rgba(255,255,255,0.08)',
                        transition: 'all 0.2s',
                        marginBottom: '16px'
                    }}
                >
                    <input
                        ref={fileInputRef}
                        type="file"
                        accept=".txt,.csv"
                        onChange={handleFileChange}
                        style={{ display: 'none' }}
                    />
                    <div style={{ fontSize: '36px', marginBottom: '10px' }}>
                        {file ? '✓' : '↑'}
                    </div>
                    {file ? (
                        <>
                            <div style={{ fontWeight: '600', color: '#4caf50', fontSize: '15px' }}>
                                {file.name}
                            </div>
                            <div style={{ fontSize: '13px', color: '#888', marginTop: '4px' }}>
                                {(file.size / 1024).toFixed(1)} KB · Click to change
                            </div>
                        </>
                    ) : (
                        <>
                            <div style={{ fontWeight: '600', color: 'white', fontSize: '15px' }}>
                                Drop your file here or click to browse
                            </div>
                            <div style={{ fontSize: '13px', color: 'rgba(255,255,255,0.6)', marginTop: '4px' }}>
                                Accepts .txt files
                            </div>
                        </>
                    )}
                </div>

                {/* action buttons */}
                <div style={{ display: 'flex', gap: '12px', marginBottom: '24px' }}>
                    <button
                        onClick={handleUpload}
                        disabled={!file || uploading}
                        style={{
                            flex: 1, padding: '14px',
                            backgroundColor: !file || uploading ? '#999' : '#667eea',
                            color: 'white', border: 'none', borderRadius: '8px',
                            fontSize: '15px', fontWeight: '600',
                            cursor: !file || uploading ? 'not-allowed' : 'pointer'
                        }}
                    >
                        {uploading ? 'Uploading...' : 'Upload File'}
                    </button>
                    {(file || results) && (
                        <button
                            onClick={handleClear}
                            style={{
                                padding: '14px 24px',
                                backgroundColor: '#6c757d',
                                color: 'white', border: 'none', borderRadius: '8px',
                                fontSize: '15px', fontWeight: '600', cursor: 'pointer'
                            }}
                        >
                            Clear
                        </button>
                    )}
                </div>

                {/* results */}
                {results && (
                    <div>
                        <div style={{
                            display: 'grid',
                            gridTemplateColumns: '1fr 1fr 1fr',
                            gap: '12px',
                            marginBottom: '20px'
                        }}>
                            {[
                                { label: 'Created', value: results.created, bg: '#d4edda', color: '#155724' },
                                { label: 'Updated', value: results.updated, bg: '#d1ecf1', color: '#0c5460' },
                                { label: 'Errors',  value: results.errors.length, bg: results.errors.length > 0 ? '#f8d7da' : '#d4edda', color: results.errors.length > 0 ? '#721c24' : '#155724' },
                            ].map(({ label, value, bg, color }) => (
                                <div key={label} style={{
                                    background: bg, borderRadius: '10px',
                                    padding: '20px', textAlign: 'center'
                                }}>
                                    <div style={{ fontSize: '2.5em', fontWeight: 'bold', color }}>
                                        {value}
                                    </div>
                                    <div style={{ fontSize: '14px', color, opacity: 0.85, marginTop: '4px' }}>
                                        {label}
                                    </div>
                                </div>
                            ))}
                        </div>

                        {results.errors.length > 0 && (
                            <div style={{
                                backgroundColor: 'white',
                                borderRadius: '10px',
                                overflow: 'hidden',
                                boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                            }}>
                                <div style={{
                                    padding: '14px 20px',
                                    backgroundColor: '#f8d7da',
                                    borderBottom: '1px solid #f5c6cb'
                                }}>
                                    <span style={{ fontWeight: '600', color: '#721c24', fontSize: '14px' }}>
                                        {results.errors.length} line{results.errors.length !== 1 ? 's' : ''} skipped
                                    </span>
                                    <span style={{ fontSize: '13px', color: '#856404', marginLeft: '8px' }}>
                                        — processing continued on remaining lines
                                    </span>
                                </div>
                                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                                    <thead>
                                        <tr style={{ backgroundColor: '#f8f9fa', borderBottom: '2px solid #dee2e6' }}>
                                            {['Line', 'Content', 'Reason'].map(h => (
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
                                        {results.errors.map((err, i) => (
                                            <tr key={i} style={{ borderBottom: '1px solid #f0f0f0' }}>
                                                <td style={{
                                                    padding: '12px 16px',
                                                    fontFamily: 'monospace',
                                                    fontSize: '14px',
                                                    color: '#dc3545',
                                                    fontWeight: '600',
                                                    whiteSpace: 'nowrap'
                                                }}>
                                                    Line {err.line}
                                                </td>
                                                <td style={{
                                                    padding: '12px 16px',
                                                    fontFamily: 'monospace',
                                                    fontSize: '13px',
                                                    color: '#555',
                                                    maxWidth: '250px',
                                                    overflow: 'hidden',
                                                    textOverflow: 'ellipsis',
                                                    whiteSpace: 'nowrap'
                                                }}>
                                                    {err.content}
                                                </td>
                                                <td style={{ padding: '12px 16px', fontSize: '13px', color: '#721c24' }}>
                                                    {err.reason}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}

                        {results.errors.length === 0 && (
                            <div style={{
                                backgroundColor: '#d4edda',
                                borderRadius: '10px',
                                padding: '16px 20px',
                                textAlign: 'center',
                                color: '#155724',
                                fontWeight: '600',
                                fontSize: '15px'
                            }}>
                                ✓ All lines processed successfully
                            </div>
                        )}
                    </div>
                )}

                <div style={{ marginTop: '30px', textAlign: 'center' }}>
                    <button
                        onClick={() => navigate('/sponsor-page')}
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