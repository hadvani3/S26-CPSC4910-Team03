import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import Nav from '../components/Nav';

export default function AdminCreateUser() {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        confirmPassword: '',
        role_type: searchParams.get('role') || 'driver'
    });
    const [errors, setErrors] = useState({});
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        // Check admin authentication
        /*const userData = localStorage.getItem("user");
        if (!userData || userData === "undefined" || userData === "null") {
            navigate("/");
            return;
        }

        try {
            const parsedUser = JSON.parse(userData);
            if (parsedUser.role_type !== "admin") {
                navigate("/");
                return;
            }
        } catch (err) {
            console.error("Error parsing user data:", err);
            navigate("/");
            return;
        } */
    }, [navigate]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        // Clear error for this field when user types
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }
    };

    const validateForm = () => {
        const newErrors = {};

        if (!formData.email.trim()) {
            newErrors.email = 'Email is required';
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            newErrors.email = 'Please enter a valid email';
        }

        if (!formData.password) {
            newErrors.password = 'Password is required';
        } else if (formData.password.length < 8) {
            newErrors.password = 'Password must be at least 8 characters';
        }

        if (formData.password !== formData.confirmPassword) {
            newErrors.confirmPassword = 'Passwords do not match';
        }

        if (!formData.role_type) {
            newErrors.role_type = 'Please select a role';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        setSubmitting(true);

        try {
            const res = await fetch('/api/admin/users', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    email: formData.email,
                    password: formData.password,
                    role_type: formData.role_type
                })
            });

            const data = await res.json();

            if (res.ok) {
                alert(`User created successfully! User ID: ${data.user_id}`);
                navigate('/admin/users');
            } else {
                alert(data.error || 'Failed to create user');
            }
        } catch (err) {
            console.error(err);
            alert('Error creating user');
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <>
            <Nav />
            <div className="container">
                {/* Header */}
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
                        Create New User
                    </h1>
                    <p style={{ margin: '0', fontSize: '1.1em', opacity: '0.95' }}>
                        Add a new driver, sponsor, or admin to the system
                    </p>
                </div>

                {/* Form */}
                <div style={{
                    backgroundColor: 'white',
                    padding: '30px',
                    borderRadius: '10px',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                    maxWidth: '500px',
                    margin: '0 auto'
                }}>
                    <form onSubmit={handleSubmit}>
                        {/* Email */}
                        <div style={{ marginBottom: '20px' }}>
                            <label style={{
                                display: 'block',
                                marginBottom: '8px',
                                fontWeight: '600',
                                color: '#333'
                            }}>
                                Email *
                            </label>
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                placeholder="user@example.com"
                                style={{
                                    width: '100%',
                                    padding: '12px',
                                    border: errors.email ? '2px solid #dc3545' : '1px solid #ddd',
                                    borderRadius: '6px',
                                    fontSize: '16px'
                                }}
                            />
                            {errors.email && (
                                <div style={{ color: '#dc3545', fontSize: '14px', marginTop: '5px' }}>
                                    {errors.email}
                                </div>
                            )}
                        </div>

                        {/* Role */}
                        <div style={{ marginBottom: '20px' }}>
                            <label style={{
                                display: 'block',
                                marginBottom: '8px',
                                fontWeight: '600',
                                color: '#333'
                            }}>
                                Role *
                            </label>
                            <select
                                name="role_type"
                                value={formData.role_type}
                                onChange={handleChange}
                                style={{
                                    width: '100%',
                                    padding: '12px',
                                    border: errors.role_type ? '2px solid #dc3545' : '1px solid #ddd',
                                    borderRadius: '6px',
                                    fontSize: '16px',
                                    backgroundColor: 'white'
                                }}
                            >
                                <option value="driver">Driver</option>
                                <option value="sponsor">Sponsor</option>
                                <option value="admin">Admin</option>
                            </select>
                            {errors.role_type && (
                                <div style={{ color: '#dc3545', fontSize: '14px', marginTop: '5px' }}>
                                    {errors.role_type}
                                </div>
                            )}
                        </div>

                        {/* Password */}
                        <div style={{ marginBottom: '20px' }}>
                            <label style={{
                                display: 'block',
                                marginBottom: '8px',
                                fontWeight: '600',
                                color: '#333'
                            }}>
                                Password *
                            </label>
                            <input
                                type="password"
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                placeholder="Minimum 8 characters"
                                style={{
                                    width: '100%',
                                    padding: '12px',
                                    border: errors.password ? '2px solid #dc3545' : '1px solid #ddd',
                                    borderRadius: '6px',
                                    fontSize: '16px'
                                }}
                            />
                            {errors.password && (
                                <div style={{ color: '#dc3545', fontSize: '14px', marginTop: '5px' }}>
                                    {errors.password}
                                </div>
                            )}
                        </div>

                        {/* Confirm Password */}
                        <div style={{ marginBottom: '20px' }}>
                            <label style={{
                                display: 'block',
                                marginBottom: '8px',
                                fontWeight: '600',
                                color: '#333'
                            }}>
                                Confirm Password *
                            </label>
                            <input
                                type="password"
                                name="confirmPassword"
                                value={formData.confirmPassword}
                                onChange={handleChange}
                                placeholder="Re-enter password"
                                style={{
                                    width: '100%',
                                    padding: '12px',
                                    border: errors.confirmPassword ? '2px solid #dc3545' : '1px solid #ddd',
                                    borderRadius: '6px',
                                    fontSize: '16px'
                                }}
                            />
                            {errors.confirmPassword && (
                                <div style={{ color: '#dc3545', fontSize: '14px', marginTop: '5px' }}>
                                    {errors.confirmPassword}
                                </div>
                            )}
                        </div>

                        {/* Buttons */}
                        <div style={{ display: 'flex', gap: '10px', marginTop: '30px' }}>
                            <button
                                type="submit"
                                disabled={submitting}
                                style={{
                                    flex: 1,
                                    padding: '14px',
                                    backgroundColor: submitting ? '#999' : '#4caf50',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '6px',
                                    fontSize: '16px',
                                    fontWeight: '600',
                                    cursor: submitting ? 'not-allowed' : 'pointer'
                                }}
                            >
                                {submitting ? 'Creating...' : 'Create User'}
                            </button>
                            <button
                                type="button"
                                onClick={() => navigate('/admin-page')}
                                disabled={submitting}
                                style={{
                                    flex: 1,
                                    padding: '14px',
                                    backgroundColor: '#6c757d',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '6px',
                                    fontSize: '16px',
                                    fontWeight: '600',
                                    cursor: submitting ? 'not-allowed' : 'pointer'
                                }}
                            >
                                Cancel
                            </button>
                        </div>
                    </form>
                </div>

                {/* Info Box */}
                <div style={{
                    backgroundColor: '#e3f2fd',
                    padding: '20px',
                    borderRadius: '10px',
                    marginTop: '30px',
                    maxWidth: '500px',
                    margin: '30px auto 0'
                }}>
                    <h3 style={{ marginTop: 0, color: '#1976d2', fontSize: '1.1em' }}>
                        ℹ️ Account Creation Tips
                    </h3>
                    <ul style={{ margin: '10px 0 0 20px', color: '#555', lineHeight: '1.6' }}>
                        <li>Password must be at least 8 characters</li>
                        <li>Email must be unique in the system</li>
                        <li>New accounts are automatically activated</li>
                        <li>Users can login immediately after creation</li>
                    </ul>
                </div>
            </div>
        </>
    );
}