import { Link } from 'react-router-dom';
import Nav from '../components/Nav';

export default function Login() {
  return (
    <>
      <Nav />
      <div className="container">
        <h1>Login</h1>
        <form action="/login" method="POST">
          <label>
            Email:
            <input type="email" name="email" required />
          </label>
          <br />
          <label>
            Password:
            <input type="password" name="password" minLength={10} maxLength={20} required />
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
