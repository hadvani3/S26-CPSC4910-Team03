import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Nav from '../components/Nav';

export default function CreateAccount() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role_type, setRole] = useState("driver");
  const [loading, setLoading] = useState(false); 
  const [message, setMessage] = useState(""); 
      
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("http://localhost:3000/create_account", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password, role_type }),
      });

      const data = await res.json();

      if (res.ok) {
        setMessage("Account Created");
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
        <h1>Create Account</h1>
        <form onSubmit={handleSubmit}>
          <label>
            Email:
            <input type="email" name="email" value={email} onChange={(e) => setEmail(e.target.value)}required />
          </label>
          <br />
          <label>
            Password:
            <input type="password" name="password" value={password} onChange={(e) => setPassword(e.target.value)} minLength={10} maxLength={20} required/>
          </label>
          <label>
            Confirm Password:
            <input type="password" name="Cpassword" minLength={10} maxLength={20} required />
          </label>
          <br />
          <label>How will you use the site:</label>
          <select name="role" id="role" value={role_type} onChange={(e) => setRole(e.target.value)}>
            <option value="driver">Driver</option>
            <option value="sponsor">Sponsor</option>
            <option value="admin">Admin</option>
          </select>
          <div className="container">
            <button style={{ width: '150px', height: '50px' }} type="submit">
              Register
            </button>
          </div>
        </form>
      </div>
    </>
  );
}