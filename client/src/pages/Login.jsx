import { Link, useNavigate } from 'react-router-dom';
import { useState } from "react";
import { useContext } from "react";
import { AuthContext } from "../components/AuthContext.jsx";
import Nav from '../components/Nav';
import { FaEye, FaEyeSlash } from 'react-icons/fa';

export default function Login() {
  const [name, setName] = useState("")
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false); // State for the eye toggle
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch("https://team03.cpsc4911.com/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: name,
          password: password,
        }),
      });

      //console.log(await res.json())
      const data = await res.json()
      console.log(data)

      if (res.ok) {
        if (data.accessToken) {
          login(data.accessToken, data.role);
          console.log(sessionStorage.getItem("token"));
          console.log(sessionStorage.getItem("role"));
        }

        if (data.role === 'driver'){
          navigate('/driver-page');
        }
        else if(data.role === 'sponsor'){
          navigate('/sponsor-page');
        }
        else if(data.role === 'admin'){
          navigate('/admin-page');
        }
        else{
          navigate('/home')
        }
      }
    } catch (err) {
      console.error(err);
      alert("Server error");
    }

  }

  return (
    <div className="login-wrapper">
      {/* Decorative background blobs */}
      <div className="login-blob blob-1"></div>
      <div className="login-blob blob-2"></div>

      <div className="glass-container">
        <div style={{ textAlign: 'center', marginBottom: '10px' }}>
          <h1 className="glass-subtitle">Truckers United</h1>
          <h1 className="glass-title">Login</h1>
        </div>
        
        <form onSubmit={handleSubmit} className="glass-form">
          <div className="glass-input-group">
            <label>Email</label>
            <input
              type="email"
              name="email"
              className="glass-input"
              placeholder="username@gmail.com"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div className="glass-input-group">
            <label>Password</label>
            <div className="glass-input-wrapper">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                className="glass-input"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                minLength={10} 
                maxLength={20}
                required
              />
              {/* The clickable eye icon */}
              <div 
                className="password-toggle" 
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </div>
            </div>
          </div>

          <div style={{ textAlign: 'left', marginTop: '-5px' }}>
            <Link to="/forgot-password" className="glass-link">Forgot Password?</Link>
          </div>

          <button className="glass-btn" type="submit">
            Sign in
          </button>
        </form>

        <p style={{ textAlign: 'center', marginTop: '15px', fontSize: '13px', color: 'white' }}>
          Don&apos;t have an account? <Link to="/create_account" className="glass-link" style={{ fontWeight: 'bold' }}>Register for free</Link>
        </p>
      </div>
    </div>
  );


/*
  return (
    <>
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
  );*/
}
