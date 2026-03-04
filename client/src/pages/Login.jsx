import { Link, useNavigate } from 'react-router-dom';
import { useState } from "react";
import Nav from '../components/Nav';

export default function Login() {
  const [name, setName] = useState("")
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch("100.51.75.41:3000/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: name,
          password: password,
        }),
      });

      const data = await res.json()

      if (res.ok) {
        if (data.accessToken) {
          localStorage.setItem("token", data.accessToken);
          alert("Login Successful");
        }
        navigate('/home');
      } else {
        // error from backend
        alert(data.error || "Login failed");
      }
    } catch (err) {
      console.error(err);
      alert("Server error");
    }

  }

  return (
    <>
      <Nav/>
      <div className="container">
        <h1>Login</h1>
        <form onSubmit={handleSubmit}>
          <label>
            Email:
            <input
                type="email"
                name="email"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required/>
          </label>
          <br/>
          <label>
            Password:
            <input
                type="password"
                name="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                minLength={10} maxLength={20}
                required/>
          </label>
          <div className="container">
            <button style={{ width: '150px', height: '50px' }} type="submit">
              Login
            </button>
          </div>
        </form>
        <div style={{ textAlign: 'center', marginTop: '10px', fontSize: '14px' }}>
        <Link to="/forgot-password">Forgot Password?</Link>
        </div>
        <p style={{ textAlign: 'center' }}>
          Don&apos;t have an account? <Link to="/create_account">Create Account</Link>
        </p>
      </div>
    </>
  );
}
