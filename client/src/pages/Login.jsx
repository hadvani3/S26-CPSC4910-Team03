import { Link } from 'react-router-dom';
import { useState } from "react";
import Nav from '../components/Nav';

export default function Login() {
  const [name, setName] = useState("")
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch("http://localhost:3000/", {
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
        // login success
        setMessage("Login successful!");

        // store token if returned
        if (data.accessToken) {
          localStorage.setItem("token", data.accessToken);
        }
      } else {
        // error from backend
        setMessage(data.error || "Login failed");
      }
    } catch (err) {
      console.error(err);
      setMessage("Server error");
    }

  }

  return (
    <>
      <Nav />
      <div className="container">
        <h1>Login</h1>
        <form onSubmit={handleSubmit}>
          <label>
            Email:
            <input
                type="email"
                name="email"
                placeholder="Email"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required />
          </label>
          <br />
          <label>
            Password:
            <input
                type="password"
                name="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                minLength={10} maxLength={20}
                required />
          </label>
          <div className="container">
            <button style={{ width: '150px', height: '50px' }} type="submit">
              Login
            </button>
          </div>
        </form>
        <p style={{ textAlign: 'center' }}>
          Don&apos;t have an account? <Link to="/create_account">Create Account</Link>
        </p>
      </div>
    </>
  );
}
