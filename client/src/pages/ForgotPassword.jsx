import { useState } from 'react'
import {Link} from 'react-router-dom'
import Nav from '../components/Nav'

export default function ForgotPassword() {
    const [email, setEmail] = useState("");
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const res = await fetch("http://localhost:3000/forgot-password", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ email }),
            });

            const data = await res.json();

            if (res.ok) {
                setMessage("Password reset email sent!");
            } else {
                setMessage(data.error || "Failed to send password reset email!");
            }
        } catch (err) {
            console.error(err);
            setMessage("Server error");
        } finally {
            setLoading(false);
        }
   
    }
    return (
        <>
            <Nav />
            <div className="container">
                <h1>Forgot Password</h1>
                <p style={{ textAlign: 'center', color: '#495057', marginBottom: '20px' }}>
                    Please enter the email address associated with this account to receive a password reset link.
                </p>
                <form onSubmit={handleSubmit}>
                    <label>
                        Email:
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            placeholder="email@example.com"
                        />
                    </label>
                    <div className="container">
                        <button type="submit" disabled={loading}>
                            {loading ? "Sending..." : "Send Reset Link"}
                        </button>
                    </div>
                </form>
                {message && <div className="message">{message}</div>}
                <p>
                    Remember your password? <Link to="/">Back to Login Page</Link>
                </p>
            </div>
        </>
    );
}