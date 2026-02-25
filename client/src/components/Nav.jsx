import { Link } from 'react-router-dom';

export default function Nav() {
  return (
    <ul className="nav-list">
      <li><Link to="/">Login</Link></li>
      <li><Link to="/about">About</Link></li>
      <li><Link to="/home">Home</Link></li>
    </ul>
  );
}
