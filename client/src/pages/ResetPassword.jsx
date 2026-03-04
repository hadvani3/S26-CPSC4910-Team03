import {useState} from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import Nav from '../components/Nav';

export default function ResetPassword() {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const token = searchParams.get("token");

    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState('');
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        if (password !== confirmPassword) {
            setMessage("Passwords do not match");
            setLoading(false);
            return;
        }

        try {
            const res = await fetch("/api/reset-password", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ token, password, confirmPassword }),
            });

            const data = await res.json();

            if (res.ok) {
                alert("Password reset successful!");
                navigate("/");
            } else {
                setMessage(data.error || "Failed to reset password");
            }
        } catch (err) {
            console.error(err);
            setMessage("Server error");
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
        <Nav />
        <div className="container">
            <h1> Reset Your Password</h1>

            <p style={{ textAlign: 'center', color: '#495057', marginBottom: '20px' }}>
                Please enter your new password below.
            </p>


            <div style={{
                background : '#f0f0f0',
                padding : '15px',
                borderRadius: '5px',
                marginBottom: '20px',
                fontSize: '14px',
                color: '#666'
            }}>
                <strong>Password Requirements:</strong>
                <ul style= {{marginTop: '10px', paddingLeft: '20px'}}>
                    <li> Your new password must be between 10-20 characters long</li>
                    <li> Password should be a mix of letters and numbers</li>
                </ul>
                
                    
            </div>
            
            {message && (
                    <div style={{
                        background: '#ffe6e6',
                        color: '#d63031',
                        padding: '10px',
                        borderRadius: '5px',
                        marginBottom: '15px',
                        textAlign: 'center'
                    }}>
                        {message}
                    </div>
                )}
            <form onSubmit={handleSubmit}>
                    <label>
                        New Password:
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            minLength={10}
                            maxLength={20}
                            required
                            placeholder="Enter new password"
                        />
                    </label>
                    <label>
                        Confirm Password:
                        <input
                            type="password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            minLength={10}
                            maxLength={20}
                            required
                            placeholder="Confirm new password"
                        />
                    </label>
                    <button type="submit" disabled={loading}>
                        {loading ? "Resetting..." : "Reset Password"}
                    </button>
                </form>
            </div>
        </>
    );      
}   