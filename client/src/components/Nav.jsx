import { Link } from 'react-router-dom';
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "./AuthContext.jsx";
import ImpersonationBanner from "./ImpersonationBanner.jsx";

export default function Nav() {
    const { token, role, logout } = useContext(AuthContext);
    const r = String(role ?? "").trim().toLowerCase();
    const [driverPoints, setDriverPoints] = useState(null);
    const [driverPointsErr, setDriverPointsErr] = useState(false);
    /*
    useEffect(() => {
        if (!token || r !== "driver") {
            setDriverPoints(null);
            setDriverPointsErr(false);
            return;
        }

        let cancelled = false;
        setDriverPoints(null);
        setDriverPointsErr(false);
        /*
        fetch("/api/me/points", {
            headers: { Authorization: `Bearer ${token}` },
        })
            .then(async (res) => {
                const data = await res.json().catch(() => ({}));
                if (!res.ok) {
                    throw new Error(data.error || "Failed to load points");
                }
                const n = typeof data.points === "number" ? data.points : Number(data.points);
                return Number.isFinite(n) ? n : 0;
            })
            .then((pts) => {
                if (!cancelled) setDriverPoints(pts);
            })
            .catch(() => {
                if (!cancelled) {
                    setDriverPointsErr(true);
                    setDriverPoints(null);
                }
            });

        return () => {
            cancelled = true;
        };
    }, [token, r]);*/

    const roleHomePath = r === "driver"
        ? "/driver-page"
        : r === "sponsor"
            ? "/sponsor-page"
            : r === "admin"
                ? "/admin-page"
                : "/home";

    return (
        <>
        <ImpersonationBanner /> 
        <ul className="nav-list">
            <li><Link to={roleHomePath}>Home</Link></li>
            <li><Link to="/home">Our Program</Link></li>
            {token && r === "driver" && <li><Link to="/apply">Apply</Link></li>}
            {token && r === "admin" && <li><Link to="/admin/applications">Applications</Link></li>}
            {token && r === "sponsor" && <li><Link to="/sponsor/applications">Applications</Link></li>}
            {token && r === "sponsor" && <li><Link to="/sponsor/manage-drivers">Manage Drivers</Link></li>}
            <li><Link to="/search">Search Products</Link></li>
            {token && r === "driver" && <li><Link to="/cart">Cart</Link></li>}
            {token && r === "driver" && <li><Link to="/purchaseHistory">Purchase History</Link></li>}
            <li><Link to="/about">About</Link></li>
            <li className="nav-spacer" aria-hidden="true" />
            {!token && <li><Link to="/">Login</Link></li>}
            {/*token && r === "driver" && (
                <li className="nav-driver-points" aria-live="polite">
                    <span className="nav-points-badge" title="Your current point balance">
                        {driverPointsErr
                            ? "Points: —"
                            : driverPoints === null
                              ? "Points: …"
                              : `Points: ${driverPoints.toLocaleString()}`}
                    </span>
                </li>
            )*/}
            {token && <li><Link to="/account">Account</Link></li>}
            {token && <li><Link to="/notifications">Notifications</Link></li>}
            {token && <li><Link to="/" onClick={logout}>Logout</Link></li>}
        </ul>
        </>
    );
}
