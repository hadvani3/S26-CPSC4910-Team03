import { Link } from 'react-router-dom';
import { useContext } from "react";
import { AuthContext } from "./AuthContext.jsx";

export default function Nav() {
    const { token, role, logout } = useContext(AuthContext);
    const r = String(role ?? "").trim().toLowerCase();
    const roleHomePath = r === "driver"
        ? "/driver-page"
        : r === "sponsor"
            ? "/sponsor-page"
            : r === "admin"
                ? "/admin-page"
                : "/home";

    return (
        <ul className="nav-list">
            <li><Link to={roleHomePath}>Home</Link></li>
            <li><Link to="/home">Our Program</Link></li>
            {token && r === "driver" && <li><Link to="/apply">Apply</Link></li>}
            {token && r === "admin" && <li><Link to="/admin/applications">Applications</Link></li>}
            {token && r === "sponsor" && <li><Link to="/sponsor/applications">Applications</Link></li>}
            <li><Link to="/search">Search Products</Link></li>
            {token && r === "driver" && <li><Link to="/cart">Cart</Link></li>}
            <li><Link to="/about">About</Link></li>
            <li className="nav-spacer" aria-hidden="true" />
            {!token && <li><Link to="/">Login</Link></li>}
            {token && <li><Link to="/account">Account</Link></li>}
            {token && <li><Link to="/" onClick={logout}>Logout</Link></li>}
        </ul>
    );
}
