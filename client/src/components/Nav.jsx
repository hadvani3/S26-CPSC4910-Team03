import { Link } from 'react-router-dom';
import { useContext } from "react";
import { AuthContext } from "./AuthContext.jsx";

export default function Nav() {
    const { token, role, logout } = useContext(AuthContext)
    const roleHomePath = role === "driver"
        ? "/driver-page"
        : role === "sponsor"
            ? "/sponsor-page"
            : role === "admin"
                ? "/admin-page"
                : "/home";

    return (
            <ul className="nav-list">
                {!token && <li>< Link to="/">Login</Link></li>}
                {token && <li><Link to="/" onClick={logout}>Logout</Link></li>}
                {token && role === "driver" && <li><Link to="/apply">Apply</Link></li>}
                <li><Link to="/about">About</Link></li>
                <li><Link to={roleHomePath}>Home</Link></li>
                <li><Link to="/home">Our Program</Link></li>
                <li><Link to="/search">Search Products</Link></li>
            </ul>
    );
}
