import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Nav from '../components/Nav';

export default function AdminCreateSponsor() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        company_name: '',
        point_value_usd: '0.01'
    });
    const [errors, setErrors] = useState({});
    const [submitting, setSubmitting] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }
    };

    const validateForm = () => {
        const newErrors = {};

        if (!formData.company_name.trim()) {
            newErrors.company_name = 'Company name is required';
        }

        if (!formData.point_value_usd) {
            newErrors.point_value_usd = 'Point value is required';
        } else if (isNaN(formData.point_value_usd) || Number(formData.point_value_usd) <= 0) {
            newErrors.point_value_usd = 'Point value must be a positive number';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;
        setSubmitting(true);

        try {
            const res = await fetch('/api/admin/sponsors', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    company_name: formData.company_name.trim(),
                    point_value_usd: Number(formData.point_value_usd)
                })
            });

            const data = await res.json();

            if (res.ok) {
                alert(`Organization "${formData.company_name}" created successfully!`);
                navigate('/admin-page');
            } else {
                alert(data.error || 'Failed to create organization');
            }
        } catch (err) {
            console.error(err);
            alert('Server error');
        } finally {
            setSubmitting(false);
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
                        Create Sponsor Organization
                    </h1>
                    <p style={{ margin: '0', fontSize: '1.1em', opacity: '0.95' }}>
                        Add a new sponsor company to the system
                    </p>
                </div>

                <div style={{
                    backgroundColor: 'white',
                    padding: '30px',
                    borderRadius: '10px',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                    maxWidth: '500px',
                    margin: '0 auto'
                }}>
                    <form onSubmit={handleSubmit}>

                        <div style={{ marginBottom: '20px' }}>
                            <label style={{
                                display: 'block', marginBottom: '8px',
                                fontWeight: '600', color: '#333'
                            }}>
                                Company Name *
                            </label>
                            <input
                                type="text"
                                name="company_name"
                                value={formData.company_name}
                                onChange={handleChange}
                                placeholder="e.g. Trucking Co A"
                                style={{
                                    width: '100%', padding: '12px',
                                    border: errors.company_name ? '2px solid #dc3545' : '1px solid #ddd',
                                    borderRadius: '6px', fontSize: '16px',
                                    boxSizing: 'border-box'
                                }}
                            />
                            {errors.company_name && (
                                <div style={{ color: '#dc3545', fontSize: '14px', marginTop: '5px' }}>
                                    {errors.company_name}
                                </div>
                            )}
                        </div>

                        <div style={{ marginBottom: '20px' }}>
                            <label style={{
                                display: 'block', marginBottom: '8px',
                                fontWeight: '600', color: '#333'
                            }}>
                                Point Value (USD per point) *
                            </label>
                            <input
                                type="number"
                                name="point_value_usd"
                                value={formData.point_value_usd}
                                onChange={handleChange}
                                step="0.001"
                                min="0.001"
                                placeholder="0.01"
                                style={{
                                    width: '100%', padding: '12px',
                                    border: errors.point_value_usd ? '2px solid #dc3545' : '1px solid #ddd',
                                    borderRadius: '6px', fontSize: '16px',
                                    boxSizing: 'border-box'
                                }}
                            />
                            {errors.point_value_usd && (
                                <div style={{ color: '#dc3545', fontSize: '14px', marginTop: '5px' }}>
                                    {errors.point_value_usd}
                                </div>
                            )}
                            <div style={{ fontSize: '13px', color: '#888', marginTop: '5px' }}>
                                Default is $0.01 per point
                            </div>
                        </div>

                        <div style={{ display: 'flex', gap: '10px', marginTop: '30px' }}>
                            <button
                                type="submit"
                                disabled={submitting}
                                style={{
                                    flex: 1, padding: '14px',
                                    backgroundColor: submitting ? '#999' : '#4caf50',
                                    color: 'white', border: 'none', borderRadius: '6px',
                                    fontSize: '16px', fontWeight: '600',
                                    cursor: submitting ? 'not-allowed' : 'pointer'
                                }}
                            >
                                {submitting ? 'Creating...' : 'Create Organization'}
                            </button>
                            <button
                                type="button"
                                onClick={() => navigate('/admin-page')}
                                disabled={submitting}
                                style={{
                                    flex: 1, padding: '14px',
                                    backgroundColor: '#6c757d',
                                    color: 'white', border: 'none', borderRadius: '6px',
                                    fontSize: '16px', fontWeight: '600',
                                    cursor: submitting ? 'not-allowed' : 'pointer'
                                }}
                            >
                                Cancel
                            </button>
                        </div>
                    </form>
                </div>

                <div style={{
                    backgroundColor: '#e3f2fd',
                    padding: '20px',
                    borderRadius: '10px',
                    maxWidth: '500px',
                    margin: '30px auto 0'
                }}>
                    <h3 style={{ marginTop: 0, color: '#1976d2', fontSize: '1.1em' }}>
                        Notes
                    </h3>
                    <ul style={{ margin: '10px 0 0 20px', color: '#555', lineHeight: '1.6' }}>
                        <li>Company name must be unique in the system</li>
                        <li>Default point value is $0.01 per point</li>
                        <li>Organization will be active immediately</li>
                        <li>Sponsor users can be added after creation</li>
                    </ul>
                </div>
            </div>
        </>
    );
}