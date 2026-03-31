import {Link} from 'react-router-dom';
import React, {useState, useEffect, useContext} from 'react';
import { useNavigate } from 'react-router-dom';
import Nav from '../components/Nav';
import {AuthContext} from "../components/AuthContext.jsx";


export default function SponsorHomePage() {
    const navigate = useNavigate();
    const { token, role } = useContext(AuthContext);
    const [stats, setStats] = useState({
        totalDrivers: 0,
        activeDrivers: 0,
        pendingApplications: 0,
        totalPointsAwarded: 0
    });
    const [data, setData] = useState(null);
    const [error, setError] = useState(null);
    const [sponsorID, setID] = useState(null);
    const [drivers, setDrivers] = useState(null);
    const [pointsChanges, setPointsChanges] = useState({});
    const [pointsReason, setPointsReason] = useState("");

    useEffect(() => {
        setStats({
            totalDrivers: 10,
            activeDrivers: 8,
            pendingApplications: 2,
            totalPointsAwarded: 1000
        });
    }, [navigate]);

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
            } catch (err) {
                console.error(err);
                setError("Server error");
            }
        }

        if (token) {
            fetchAccount();
        }

        async function fetchSponsor() {
            try {
                const res = await fetch("https://team03.cpsc4911.com/GetSponsor", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        key: token,
                    }),
                });

                const result = await res.json();

                if (res.ok) {
                    setID(result.sponsor_id);
                } else {
                    setError("Failed to fetch sponsor ID");
                }
            } catch (err) {
                console.error(err);
                setError("Server error");
            }
        }

        if (role === "sponsor") {
            fetchSponsor()
        }
        console.log(sponsorID)

        async function fetchSponsorDrivers() {
            try {
                const res = await fetch("https://team03.cpsc4911.com/GetSponsorDrivers", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        sponsorID: sponsorID,
                    }),
                });

                const result = await res.json();

                if (res.ok) {
                    setDrivers(result);
                } else {
                    setError("Failed to fetch sponsor drivers");
                }
            } catch (err) {
                console.error(err);
                setError("Server error");
            }
        }

        if (sponsorID) {
            fetchSponsorDrivers()
            console.log("Fetching drivers")
        }
        console.log(drivers)
    }, [token, role]);

    useEffect(() => {
        async function fetchSponsorDrivers() {
            try {
                const res = await fetch("https://team03.cpsc4911.com/GetSponsorDrivers", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        sponsorID: sponsorID,
                    }),
                });

                const result = await res.json();

                if (res.ok) {
                    setDrivers(result);
                } else {
                    setError("Failed to fetch sponsor drivers");
                }
            } catch (err) {
                console.error(err);
                setError("Server error");
            }
        }

        if (sponsorID && drivers === null) {
            fetchSponsorDrivers()
            console.log("Fetching drivers")
        }
        console.log(drivers)
    }, [sponsorID, drivers])

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        sessionStorage.clear();
        navigate("/");
    };

    const handleChangePoints = async (driver_id) => {
        const change = pointsChanges[driver_id];

        if (!change) return alert("Enter a value");
        if (!pointsReason) return alert("Enter a reason");

        try {
            const res = await fetch("https://team03.cpsc4911.com/ChangePoints", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    driver_id,
                    change,
                    sponsor_id: sponsorID,
                    reason: pointsReason,
                }),
            });

            const result = await res.json();

            if (res.ok && result.success) {
                setDrivers((prev) =>
                    prev.map((d) =>
                        d.driver_id === driver_id
                            ? { ...d, points: d.points + change }
                            : d
                    )
                );
                setPointsChanges((prev) => ({ ...prev, [driver_id]: "" }));
            } else {
                alert("Failed to update points");
            }
        } catch (err) {
            console.error(err);
            alert("Server error");
        }
    };


    return (
        <>
            <Nav />
            <div className="container">
                <div style={{
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    padding: '40px 30px',
                    borderRadius: '12px',
                    color: 'white',
                    textAlign: 'center',
                    marginBottom: '30px',
                    boxShadow: '0 4px 15px rgba(0,0,0,0.2)'
                }}>
                    <h1 style={{ 
                        margin: '0 0 10px 0', 
                        fontSize: '2em',
                        fontWeight: '600'
                    }}>
                        Sponsor Dashboard
                    </h1>
                    <p style={{ 
                        margin: '0',
                        fontSize: '1.1em',
                        opacity: '0.95'
                    }}>
                        Driver & Application Management
                    </p>
                </div>

                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                    gap: '20px',
                    marginBottom: '30px'
                }}>
                    <div style={{
                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                        padding: '25px',
                        borderRadius: '10px',
                        color: 'white',
                        boxShadow: '0 4px 12px rgba(102, 126, 234, 0.3)'
                    }}>
                        <div style={{ fontSize: '3em', fontWeight: 'bold', margin: '0' }}>
                            {stats.totalDrivers}
                        </div>
                        <div style={{ fontSize: '1.1em', marginTop: '8px', opacity: '0.9' }}>
                            Total Drivers
                        </div>
                    </div>
                    <div style={{
                        background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
                        padding: '25px',
                        borderRadius: '10px',
                        color: 'white',
                        boxShadow: '0 4px 12px rgba(79, 172, 254, 0.3)'
                    }}>
                        <div style={{ fontSize: '3em', fontWeight: 'bold', margin: '0' }}>
                            {stats.activeDrivers}
                        </div>
                        <div style={{ fontSize: '1.1em', marginTop: '8px', opacity: '0.9' }}>
                            Active Drivers
                        </div>
                    </div>

                    <div style={{
                        background: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
                        padding: '25px',
                        borderRadius: '10px',
                        color: 'white',
                        boxShadow: '0 4px 12px rgba(67, 233, 123, 0.3)'
                    }}>
                        <div style={{ fontSize: '3em', fontWeight: 'bold', margin: '0' }}>
                            {stats.pendingApplications}
                        </div>
                        <div style={{ fontSize: '1.1em', marginTop: '8px', opacity: '0.9' }}>
                            Pending Applications
                        </div>
                    </div>

                    <div style={{
                        background: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
                        padding: '25px',
                        borderRadius: '10px',
                        color: 'white',
                        boxShadow: '0 4px 12px rgba(250, 112, 154, 0.3)'
                    }}>
                        <div style={{ fontSize: '3em', fontWeight: 'bold', margin: '0' }}>
                            {stats.totalPointsAwarded.toLocaleString()}
                        </div>
                        <div style={{ fontSize: '1.1em', marginTop: '8px', opacity: '0.9' }}>
                            Points Awarded
                        </div>
                    </div>
                </div>

                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                    gap: '20px',
                    marginBottom: '30px'
                }}>
                    <div style={{
                        backgroundColor: '#e3f2fd',
                        padding: '25px',
                        borderRadius: '10px',
                        boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                    }}>
                        <h2 style={{ 
                            marginTop: '0',
                            color: '#1976d2',
                            fontSize: '1.3em',
                            marginBottom: '20px'
                        }}>
                            Driver Management
                        </h2>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                            <button style={{
                                padding: '12px 20px',
                                backgroundColor: '#2196f3',
                                color: 'white',
                                border: 'none',
                                borderRadius: '6px',
                                cursor: 'pointer',
                                fontSize: '15px',
                                fontWeight: '500',
                                transition: 'background-color 0.2s'
                            }}>
                                View All Drivers
                            </button>
                            <button style={{
                                padding: '12px 20px',
                                backgroundColor: '#4caf50',
                                color: 'white',
                                border: 'none',
                                borderRadius: '6px',
                                cursor: 'pointer',
                                fontSize: '15px',
                                fontWeight: '500',
                                transition: 'background-color 0.2s'
                            }}>
                                Award Points
                            </button>
                            <button style={{
                                padding: '12px 20px',
                                backgroundColor: '#ff9800',
                                color: 'white',
                                border: 'none',
                                borderRadius: '6px',
                                cursor: 'pointer',
                                fontSize: '15px',
                                fontWeight: '500',
                                transition: 'background-color 0.2s'
                            }}>
                                Deduct Points
                            </button>
                        </div>
                    </div>

                    <div style={{
                        backgroundColor: '#e8f5e9',
                        padding: '25px',
                        borderRadius: '10px',
                        boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                    }}>
                        <h2 style={{ 
                            marginTop: '0',
                            color: '#388e3c',
                            fontSize: '1.3em',
                            marginBottom: '20px'
                        }}>
                            Application Management
                        </h2>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                            <button type="button"
                                onClick={() => navigate('/sponsor/applications')}
                                style={{
                                padding: '12px 20px',
                                backgroundColor: '#4caf50',
                                color: 'white',
                                border: 'none',
                                borderRadius: '6px',
                                cursor: 'pointer',
                                fontSize: '15px',
                                fontWeight: '500',
                                transition: 'background-color 0.2s'
                            }}>
                                Review Applications
                            </button>
                            <button style={{
                                padding: '12px 20px',
                                backgroundColor: '#66bb6a',
                                color: 'white',
                                border: 'none',
                                borderRadius: '6px',
                                cursor: 'pointer',
                                fontSize: '15px',
                                fontWeight: '500',
                                transition: 'background-color 0.2s'
                            }}>
                                Approved Drivers
                            </button>
                            <button style={{
                                padding: '12px 20px',
                                backgroundColor: '#81c784',
                                color: 'white',
                                border: 'none',
                                borderRadius: '6px',
                                cursor: 'pointer',
                                fontSize: '15px',
                                fontWeight: '500',
                                transition: 'background-color 0.2s'
                            }}>
                                Rejected Applications
                            </button>
                        </div>
                    </div>
                </div>

                <div style={{
                    backgroundColor: '#fff',
                    padding: '25px',
                    borderRadius: '10px',
                    border: '1px solid #e0e0e0',
                    marginBottom: '30px'
                }}>
                    <h2 style={{ 
                        marginTop: '0',
                        color: '#34495e',
                        fontSize: '1.3em',
                        marginBottom: '20px'
                    }}>
                        Recent Activity
                    </h2>
                    <div style={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '12px'
                    }}>
                        <div style={{
                            padding: '15px',
                            backgroundColor: '#f8f9fa',
                            borderRadius: '6px',
                            borderLeft: '4px solid #4caf50'
                        }}>
                            <strong>New application:</strong> Mike Jones
                            <div style={{ fontSize: '0.9em', color: '#666', marginTop: '5px' }}>
                                2 hours ago
                            </div>
                        </div>
                        <div style={{
                            padding: '15px',
                            backgroundColor: '#f8f9fa',
                            borderRadius: '6px',
                            borderLeft: '4px solid #2196f3'
                        }}>
                            <strong>Points awarded:</strong> 100 pts to Maxx Crosby
                            <div style={{ fontSize: '0.9em', color: '#666', marginTop: '5px' }}>
                                5 hours ago
                            </div>
                        </div>
                        <div style={{
                            padding: '15px',
                            backgroundColor: '#f8f9fa',
                            borderRadius: '6px',
                            borderLeft: '4px solid #ff9800'
                        }}>
                            <strong>Driver approved:</strong> Edward Kenway
                            <div style={{ fontSize: '0.9em', color: '#666', marginTop: '5px' }}>
                                1 day ago
                            </div>
                        </div>
                    </div>
                </div>

                <div style={{
                    backgroundColor: '#fff3e0',
                    padding: '25px',
                    borderRadius: '10px',
                    marginBottom: '30px',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.05)'
                }}>
                    <h2 style={{ 
                        marginTop: '0',
                        color: '#e65100',
                        fontSize: '1.3em',
                        marginBottom: '20px'
                    }}>
                        Quick Actions
                    </h2>
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
                        gap: '15px'
                    }}>
                        <button style={{
                            padding: '15px 20px',
                            backgroundColor: '#ff9800',
                            color: 'white',
                            border: 'none',
                            borderRadius: '6px',
                            cursor: 'pointer',
                            fontSize: '15px',
                            fontWeight: '500'
                        }}>
                            View Analytics
                        </button>
                        <button style={{
                            padding: '15px 20px',
                            backgroundColor: '#9c27b0',
                            color: 'white',
                            border: 'none',
                            borderRadius: '6px',
                            cursor: 'pointer',
                            fontSize: '15px',
                            fontWeight: '500'
                        }}>
                            Generate Reports
                        </button>
                        <button style={{
                            padding: '15px 20px',
                            backgroundColor: '#00bcd4',
                            color: 'white',
                            border: 'none',
                            borderRadius: '6px',
                            cursor: 'pointer',
                            fontSize: '15px',
                            fontWeight: '500'
                        }}>
                            Manage Catalog
                        </button>
                        <button style={{
                            padding: '15px 20px',
                            backgroundColor: '#607d8b',
                            color: 'white',
                            border: 'none',
                            borderRadius: '6px',
                            cursor: 'pointer',
                            fontSize: '15px',
                            fontWeight: '500'
                        }}>
                            Export Data
                        </button>
                    </div>
                </div>

                {drivers && drivers.length > 0 && (
                    <>
                        <h2>Your Drivers</h2>
                        <table border="1" cellPadding="8">
                            <thead>
                            <tr>
                                <th>First Name</th>
                                <th>Last Name</th>
                                <th>Phone</th>
                                <th>Points</th>
                                <th>Points Change Value</th>
                                <th>Update Points</th>
                            </tr>
                            </thead>
                            <tbody>
                            {drivers.length > 0 && drivers.map((driver, index) => (
                                <tr key={index}>
                                    <td>{driver.firstname}</td>
                                    <td>{driver.lastname}</td>
                                    <td>{driver.phone}</td>
                                    <td>{driver.points}</td>
                                    <td><input
                                        type="number"
                                        value={pointsChanges[driver.driver_id] || ""}
                                        onChange={(e) =>
                                            setPointsChanges({
                                                ...pointsChanges,
                                                [driver.driver_id]: Number(e.target.value),
                                            })
                                        }
                                    /></td>
                                    <td>
                                        <button
                                            onClick={() => handleChangePoints(driver.driver_id)}
                                        >
                                            Update
                                        </button>
                                    </td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                        <input
                            type="text"
                            value={pointsReason}
                            onChange={(e) => setPointsReason(e.target.value)}
                        />
                    </>
                )}
                <div style={{
                    paddingTop: '25px',
                    borderTop: '2px solid #e0e0e0',
                    textAlign: 'center'
                }}>
                    <button
                        onClick={handleLogout}
                        style={{
                            padding: '12px 30px',
                            backgroundColor: '#dc3545',
                            color: 'white',
                            border: 'none',
                            borderRadius: '8px',
                            cursor: 'pointer',
                            fontSize: '16px',
                            fontWeight: '600',
                            transition: 'background-color 0.2s'
                        }}
                        onMouseOver={(e) => e.target.style.backgroundColor = '#c82333'}
                        onMouseOut={(e) => e.target.style.backgroundColor = '#dc3545'}
                    >
                        Logout
                    </button>
                </div>
            </div>
        </>
    );

    /*return (
        <>
        <Nav />
        <div class = "home-test">
            <ul>
                <li>Welcome back!: </li>
            </ul>
        </div>
        <div class = "wrap">
            <div class = "home-test">
                <h1>Drivers Associated With</h1>
                <ul>
                    <li>Driver_1</li>
                    <li>Driver_2</li>
                    <li>Driver_3</li>
                    <li>Driver_4</li>
                    <li>Driver_5</li>
                    <li>Driver_6</li>
                </ul>
            </div>

            <div class = "home-test">
                <h1>Applications</h1>
                <ol>
                    <li>Application_a</li>
                    <li>Application_b</li>
                    <li>Application_c</li>
                    <li>Application_d</li>
                    <li>Application_e</li>
                    <li>Application_f</li>
                </ol>
            </div>
        </div>
        <div class = "home-test">
            <h1>Approve Driver Applications</h1>
            <button type = "button">Click Here</button>
        </div>
        </>
    );*/
}