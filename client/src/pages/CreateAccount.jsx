import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Nav from '../components/Nav';

export default function CreateAccount() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const role_type = "driver";
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setMessage("Passwords do not match");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("https://team03.cpsc4911.com/create_account", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          password,
          role_type,
          first_name: firstName,
          last_name: lastName
        }),
      });

      const data = await res.json();

      if (res.ok) {
        setMessage("Account created successfully!");
        navigate("/");
      } else {
        setMessage(data.error || "Failed to create account");
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
        <div className="admin-dashboard">
            <div style={{
                background: 'rgba(255, 255, 255, 0.16)',
                border: '1px solid rgba(255, 255, 255, 0.24)',
                backdropFilter: 'blur(8px)',
                padding: '32px',
                borderRadius: '12px',
                color: 'white',
                boxShadow: '0 10px 24px rgba(0,0,0,0.2)',
                maxWidth: '500px',
                margin: '0 auto',
            }}>
                <h1 style={{ margin: '0 0 24px 0', fontSize: '1.8em', fontWeight: '600', color: 'white', textAlign: 'center' }}>
                    Create Driver Account
                </h1>
                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    <div>
                        <label style={{ color: '#f4f8ff', fontSize: '14px', fontWeight: '600', display: 'block', marginBottom: '6px' }}>First Name</label>
                        <input type="text" value={firstName} onChange={(e) => setFirstName(e.target.value)} required
                            style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid rgba(15,23,42,0.18)', fontSize: '14px', boxSizing: 'border-box' }} />
                    </div>
                    <div>
                        <label style={{ color: '#f4f8ff', fontSize: '14px', fontWeight: '600', display: 'block', marginBottom: '6px' }}>Last Name</label>
                        <input type="text" value={lastName} onChange={(e) => setLastName(e.target.value)} required
                            style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid rgba(15,23,42,0.18)', fontSize: '14px', boxSizing: 'border-box' }} />
                    </div>
                    <div>
                        <label style={{ color: '#f4f8ff', fontSize: '14px', fontWeight: '600', display: 'block', marginBottom: '6px' }}>Email</label>
                        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required
                            style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid rgba(15,23,42,0.18)', fontSize: '14px', boxSizing: 'border-box' }} />
                    </div>
                    <div>
                        <label style={{ color: '#f4f8ff', fontSize: '14px', fontWeight: '600', display: 'block', marginBottom: '6px' }}>Password</label>
                        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} minLength={10} maxLength={20} required
                            style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid rgba(15,23,42,0.18)', fontSize: '14px', boxSizing: 'border-box' }} />
                    </div>
                    <div>
                        <label style={{ color: '#f4f8ff', fontSize: '14px', fontWeight: '600', display: 'block', marginBottom: '6px' }}>Confirm Password</label>
                        <input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} minLength={10} maxLength={20} required
                            style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid rgba(15,23,42,0.18)', fontSize: '14px', boxSizing: 'border-box' }} />
                    </div>
                    {message && (
                        <p style={{ color: message.includes('successfully') ? '#86efac' : '#fca5a5', margin: 0, fontSize: '14px' }}>
                            {message}
                        </p>
                    )}
                    <button type="submit" style={{
                        width: '100%', padding: '12px', backgroundColor: '#667eea', color: 'white',
                        border: 'none', borderRadius: '8px', fontSize: '15px', fontWeight: '700', cursor: 'pointer', marginTop: '8px',
                    }}>
                        {loading ? 'Creating...' : 'Register'}
                    </button>
                </form>
            </div>
        </div>
    </>
);
}