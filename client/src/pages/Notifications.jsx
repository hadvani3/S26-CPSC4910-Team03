import { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import Nav from '../components/Nav';
import { AuthContext } from '../components/AuthContext.jsx';

export default function Notifications() {
    const { token, role } = useContext(AuthContext);
    const [data, setData] = useState(null);
    const [error, setError] = useState(null);
    const [notifications, setNotifications] = useState(null);

    useEffect(() => {
        async function fetchAccount() {
            try {
                const res = await fetch("https://team03.cpsc4911.com/AccountInfo", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        key: token,
                        role: role,
                    }),
                });

                const result = await res.json();

                if (res.ok) {
                    setData(result);
                } else {
                    setError("Failed to fetch account info");

                }
            } catch {
                setError("Server error");
            }
        }

        if (token) {
            fetchAccount();
        }
    }, [token, role]);

    useEffect( () => {
        console.log(data)
        async function fetchNotifications() {
            try {
                const res = await fetch("https://team03.cpsc4911.com/DisplayNotifications", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        user_id: data.user_id,
                    }),
                });
                const result = await res.json();
                console.log(result)
                if (res.ok) {
                    setNotifications(result)
                } else {
                    setError('Failed to fetch notifications');
                }
            }
            catch (err) {
                console.error(err);
                //setError('Server error');
            }
        }

        fetchNotifications();
        }, [data]);

    return (
        <>
            <Nav />
            <div className="admin-dashboard">
                <div
                    style={{
                        background: 'rgba(255, 255, 255, 0.16)',
                        border: '1px solid rgba(255, 255, 255, 0.24)',
                        backdropFilter: 'blur(8px)',
                        padding: '40px 30px',
                        borderRadius: '12px',
                        color: 'white',
                        textAlign: 'center',
                        marginBottom: '30px',
                        boxShadow: '0 10px 24px rgba(0,0,0,0.2)',
                    }}
                >
                    <h1 style={{ margin: '0 0 10px 0', fontSize: '2em', fontWeight: '600' }}>Manage drivers</h1>
                    <p style={{ margin: '0', fontSize: '1.1em', opacity: '0.95' }}>
                        View Notiffications
                    </p>
                </div>

                {error && (
                    <p style={{ color: '#fecaca', marginBottom: '16px' }} role="alert">
                        {error}
                    </p>
                )}

                {notifications && notifications.length > 0 ? (
                    <>
                        <h2 style={{ color: '#f4f8ff' }}>Your drivers</h2>
                        <table border="1" cellPadding="8" style={{ color: 'white', marginBottom: '16px' }}>
                            <thead>
                            <tr>
                                <th>Message</th>
                                <th>Date</th>
                            </tr>
                            </thead>
                            <tbody>
                            {notifications.map((driver, index) => (
                                <tr key={index}>
                                    <td>{driver.message}</td>
                                    <td>{driver.sent_at}</td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    </>
                ) : notifications && notifications.length === 0 ? (
                    <p style={{ color: '#dbe6ff' }}>No notifications are associated with your account.</p>
                ) : (
                    <p style={{ color: '#dbe6ff' }}>Loading…</p>
                )}
            </div>
        </>
    );
}