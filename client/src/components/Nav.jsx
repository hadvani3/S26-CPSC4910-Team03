import { Link } from 'react-router-dom';
import { useContext } from "react";
import { AuthContext } from "./AuthContext.jsx";

export default function Nav() {
    const { token, logout } = useContext(AuthContext)

    return (
            <ul className="nav-list">
                {!token && <li>< Link to="/">Login</Link></li>}
                {token && <li><Link to="/" onClick={logout}>Logout</Link></li>}
                <li><Link to="/about">About</Link></li>
                <li><Link to="/home">Home</Link></li>
                <li><Link to="/search">Search Products</Link></li>
            </ul>
    );
}
