import { Link } from 'react-router-dom';
import Nav from '../components/Nav';

export default function CreateAccount() {
  return (
    <>
      <Nav />
      <div className="container">
        <h1>Create Account</h1>
        <form action="/create_account" method="POST">
          <label>
            Email:
            <input type="email" name="email" required />
          </label>
          <br />
          <label>
            Password:
            <input type="password" name="password" minLength={10} maxLength={20} required />
          </label>
          <label>
            Confirm Password:
            <input type="password" name="Cpassword" minLength={10} maxLength={20} required />
          </label>
          <br />
          <label>How will you use the site:</label>
          <select name="role" id="role">
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
