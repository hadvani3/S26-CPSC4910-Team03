import {useState, useEffect, useContext} from 'react';
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
    const [pointsValue, setPointsValue] = useState(null)
    const [pointsValueUpdate, setPointsValueUpdate] = useState("")
    const [recentActivities, setRecentActivities] = useState([]);
    const [company_name, setCompanyName] = useState('');

    useEffect(() => {
        if (token) {
            fetch('/api/sponsor/stats', {
                headers: { 'Authorization': `Bearer ${token}` }
            })

            .then(res => res.json())
            .then(data => setStats({
                totalDrivers: data.totalDrivers,
                activeDrivers: data.activeDrivers,
                pendingApplications: data.pendingApplications,
                totalPointsAwarded: data.totalPointsAwarded
            }))
            .catch(err => console.error('Error fetching sponsor stats from the database!', err))
        }
    }, [token])

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
                    setCompanyName(result.company_name)
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
    }, [token, role]);

    useEffect(() => {
        async function fetchSponsorPointsValue() {
            try {
                const res = await fetch("https://team03.cpsc4911.com/getPointsValue", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        sponsor_id: sponsorID,
                    }),
                });

                const result = await res.json();

                if (res.ok) {
                    setPointsValue(result.point_value_usd);
                } else {
                    setError("Failed to fetch sponsor points value");
                }
            } catch (err) {
                console.error(err);
                setError("Server error");
            }
        }

        if (sponsorID) {
            fetchSponsorPointsValue()
        }
    }, [sponsorID])

    useEffect(() => {
        if (token) {
            fetch('/api/sponsor/audit-log?type=all',{
                headers : {'Authorization': `Bearer ${token}`}

            })
            .then(res => res.json())
            .then(data => setRecentActivities(data.slice(0,5)))
            .catch(err => console.error('Error fetching recent activities', err));
        }
    }, [token])

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        sessionStorage.clear();
        navigate("/");
    };

    const handleChangePointsValue = async () => {
        try {
            const res = await fetch("https://team03.cpsc4911.com/changePointsValue", {
                method: "POST",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify({
                    sponsor_id: sponsorID,
                    value: pointsValueUpdate,
                    company_name: company_name,
                }),
            });

            if (res.ok) {
                console.log("Updated points value.")
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
            <div className="admin-dashboard">
                <div style={{
                    background: 'rgba(255, 255, 255, 0.16)',
                    border: '1px solid rgba(255, 255, 255, 0.24)',
                    backdropFilter: 'blur(8px)',
                    padding: '40px 30px',
                    borderRadius: '12px',
                    color: 'white',
                    textAlign: 'center',
                    marginBottom: '30px',
                    boxShadow: '0 10px 24px rgba(0,0,0,0.2)'
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
                        background: 'rgba(255, 255, 255, 0.16)',
                        border: '1px solid rgba(255, 255, 255, 0.24)',
                        backdropFilter: 'blur(8px)',
                        padding: '25px',
                        borderRadius: '10px',
                        color: 'white',
                        boxShadow: '0 8px 18px rgba(0,0,0,0.18)'
                    }}>
                        <div style={{fontSize: '3em', fontWeight: 'bold', margin: '0'}}>
                            {stats.totalDrivers}
                        </div>
                        <div style={{fontSize: '1.1em', marginTop: '8px', opacity: '0.9'}}>
                            Total Drivers
                        </div>
                    </div>
                    <div style={{
                        background: 'rgba(255, 255, 255, 0.16)',
                        border: '1px solid rgba(255, 255, 255, 0.24)',
                        backdropFilter: 'blur(8px)',
                        padding: '25px',
                        borderRadius: '10px',
                        color: 'white',
                        boxShadow: '0 8px 18px rgba(0,0,0,0.18)'
                    }}>
                        <div style={{fontSize: '3em', fontWeight: 'bold', margin: '0'}}>
                            {stats.activeDrivers}
                        </div>
                        <div style={{fontSize: '1.1em', marginTop: '8px', opacity: '0.9'}}>
                            Active Drivers
                        </div>
                    </div>

                    <div style={{
                        background: 'rgba(255, 255, 255, 0.16)',
                        border: '1px solid rgba(255, 255, 255, 0.24)',
                        backdropFilter: 'blur(8px)',
                        padding: '25px',
                        borderRadius: '10px',
                        color: 'white',
                        boxShadow: '0 8px 18px rgba(0,0,0,0.18)'
                    }}>
                        <div style={{fontSize: '3em', fontWeight: 'bold', margin: '0'}}>
                            {stats.pendingApplications}
                        </div>
                        <div style={{fontSize: '1.1em', marginTop: '8px', opacity: '0.9'}}>
                            Pending Applications
                        </div>
                    </div>

                    <div style={{
                        background: 'rgba(255, 255, 255, 0.16)',
                        border: '1px solid rgba(255, 255, 255, 0.24)',
                        backdropFilter: 'blur(8px)',
                        padding: '25px',
                        borderRadius: '10px',
                        color: 'white',
                        boxShadow: '0 8px 18px rgba(0,0,0,0.18)'
                    }}>
                        <div style={{fontSize: '3em', fontWeight: 'bold', margin: '0'}}>
                            {stats.totalPointsAwarded.toLocaleString()}
                        </div>
                        <div style={{fontSize: '1.1em', marginTop: '8px', opacity: '0.9'}}>
                            Points Awarded
                        </div>
                    </div>
                    <div style={{
                        background: 'rgba(255, 255, 255, 0.16)',
                        border: '1px solid rgba(255, 255, 255, 0.24)',
                        backdropFilter: 'blur(8px)',
                        padding: '25px',
                        borderRadius: '10px',
                        color: 'white',
                        boxShadow: '0 8px 18px rgba(0,0,0,0.18)'
                    }}>
                        <div style={{fontSize: '3em', fontWeight: 'bold', margin: '0'}}>
                            {pointsValue}
                        </div>
                        <div style={{fontSize: '1.1em', marginTop: '8px', opacity: '0.9'}}>
                            Points Value in USD
                        </div>
                        <input
                            type="number"
                            value={pointsValueUpdate}
                            onChange={(e) => setPointsValueUpdate(e.target.value)}
                        />
                        <button
                            onClick={() => handleChangePointsValue()}
                        >
                            Update
                        </button>
                    </div>

                </div>

                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                    gap: '20px',
                    marginBottom: '30px'
                }}>
                    <div style={{
                        background: 'rgba(255, 255, 255, 0.16)',
                        border: '1px solid rgba(255, 255, 255, 0.22)',
                        backdropFilter: 'blur(8px)',
                        padding: '25px',
                        borderRadius: '10px',
                        boxShadow: '0 8px 18px rgba(0,0,0,0.18)'
                    }}>
                        <h2 style={{
                            marginTop: '0',
                            color: '#f4f8ff',
                            fontSize: '1.3em',
                            marginBottom: '20px'
                        }}>
                            Driver Management
                        </h2>
                        <button
                            type="button"
                            onClick={() => navigate('/sponsor/manage-drivers')}
                            className="admin-cream-btn"
                            style={{
                                width: '100%',
                                padding: '12px 20px',
                                color: '#1f2937',
                                border: '1px solid rgba(15, 23, 42, 0.18)',
                                borderRadius: '10px',
                                cursor: 'pointer',
                                fontSize: '15px',
                                fontWeight: '700',
                                transition: 'background-color 0.2s',
                            }}
                        >
                            Manage Drivers
                        </button>
                    </div>

                    <div style={{
                        background: 'rgba(255, 255, 255, 0.16)',
                        border: '1px solid rgba(255, 255, 255, 0.22)',
                        backdropFilter: 'blur(8px)',
                        padding: '25px',
                        borderRadius: '10px',
                        boxShadow: '0 8px 18px rgba(0,0,0,0.18)'
                    }}>
                        <h2 style={{ 
                            marginTop: '0',
                            color: '#f4f8ff',
                            fontSize: '1.3em',
                            marginBottom: '20px'
                        }}>
                            Application Management
                        </h2>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                            <button type="button"
                                onClick={() => navigate('/sponsor/applications')}
                                className="admin-cream-btn"
                                style={{
                                padding: '12px 20px',
                                color: '#1f2937',
                                border: '1px solid rgba(15, 23, 42, 0.18)',
                                borderRadius: '10px',
                                cursor: 'pointer',
                                fontSize: '15px',
                                fontWeight: '700',
                                transition: 'background-color 0.2s'
                            }}>
                                Review Applications
                            </button>
                            <button className="admin-cream-btn" style={{
                                padding: '12px 20px',
                                color: '#1f2937',
                                border: '1px solid rgba(15, 23, 42, 0.18)',
                                borderRadius: '10px',
                                cursor: 'pointer',
                                fontSize: '15px',
                                fontWeight: '700',
                                transition: 'background-color 0.2s'
                            }}>
                                Approved Drivers
                            </button>
                            <button className="admin-cream-btn" style={{
                                padding: '12px 20px',
                                color: '#1f2937',
                                border: '1px solid rgba(15, 23, 42, 0.18)',
                                borderRadius: '10px',
                                cursor: 'pointer',
                                fontSize: '15px',
                                fontWeight: '700',
                                transition: 'background-color 0.2s'
                            }}>
                                Rejected Applications
                            </button>
                        </div>
                    </div>
                </div>

                <div style={{
                    background: 'rgba(255, 255, 255, 0.16)',
                    padding: '25px',
                    borderRadius: '10px',
                    border: '1px solid rgba(255, 255, 255, 0.22)',
                    backdropFilter: 'blur(8px)',
                    marginBottom: '30px'
                }}>
                    <h2 style={{ 
                        marginTop: '0',
                        color: '#f4f8ff',
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
                       {recentActivities.length === 0 ? (
                            <div style={{ color: '#dbe6ff' }}>No recent activity.</div>
                        ) : (
                            recentActivities.map((item, index) => (
                                <div key={index} style={{
                                    padding: '15px',
                                    background: 'rgba(255, 255, 255, 0.18)',
                                    borderRadius: '6px',
                                    borderLeft: '4px solid #f4efe1',
                                    color: '#f4f8ff'
                                }}>
                                    <strong>{item.type === 'application' ? 'Application' : 'Points change'}:</strong> {item.label}
                                    <div style={{ fontSize: '0.9em', color: '#dbe6ff', marginTop: '5px' }}>
                                        {new Date(item.timestamp).toLocaleString()}
                                    </div>
                                </div>
                            ))
                        )}
                        </div>
                    </div>

                <div style={{
                    background: 'rgba(255, 255, 255, 0.16)',
                    border: '1px solid rgba(255, 255, 255, 0.22)',
                    backdropFilter: 'blur(8px)',
                    padding: '25px',
                    borderRadius: '10px',
                    marginBottom: '30px',
                    boxShadow: '0 8px 18px rgba(0,0,0,0.18)'
                }}>
                    <h2 style={{ 
                        marginTop: '0',
                        color: '#f4f8ff',
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
                        <button
                            type= "button"
                            onClick= {() => navigate(`/sponsor/audit-log`)}
                            className = "admin-cream-btn"
                            style={{
                            padding: '15px 20px',
                            color: '#1f2937',
                            border: '1px solid rgba(15, 23, 42, 0.18)',
                            borderRadius: '10px',
                            cursor: 'pointer',
                            fontSize: '15px',
                            fontWeight: '700'
                        }}>
                            View Audit Logs
                            </button>   
                            <button
                            type = "button"
                            onClick ={() => navigate(`/sponsor/bulk-upload`)}
                            className = "admin-cream-btn"
                            style ={{
                                padding: '15px 20px',
                                color: '#1f2937',
                                border: '1px solid rgba(15, 23, 42, 0.18)',
                                borderRadius: '10px',
                                cursor: 'pointer',
                                fontSize: '15px',
                                fontWeight: '700'
                            }}  
                            >
                            Bulk Upload
                            </button>
                            <button 
                            onClick ={() => navigate(`/sponsor/points-report`)}
                            className="admin-cream-btn" style={{
                                padding: '15px 20px',
                                color: '#1f2937',
                                border: '1px solid rgba(15, 23, 42, 0.18)',
                                borderRadius: '10px',
                                cursor: 'pointer',
                                fontSize: '15px',
                                fontWeight: '700'
                        }}>
                            Generate Reports
                        </button>
                        <button
                            onClick={() => navigate(`/sponsor/${encodeURIComponent(sponsorID)}/catalog`)} 
                            style={{
                            padding: '15px 20px',
                            color: '#1f2937',
                            border: '1px solid rgba(15, 23, 42, 0.18)',
                            borderRadius: '10px',
                            cursor: 'pointer',
                            fontSize: '15px',
                            fontWeight: '700'
                        }}>
                            Manage Catalog
                        </button>
                    </div>
                </div>

                <div style={{
                    paddingTop: '25px',
                    borderTop: '2px solid #e0e0e0',
                    textAlign: 'center'
                }}>
                    <button
                        onClick={handleLogout}
                        className="admin-cream-btn"
                        style={{
                            padding: '12px 30px',
                            color: '#1f2937',
                            border: '1px solid rgba(15, 23, 42, 0.18)',
                            borderRadius: '10px',
                            cursor: 'pointer',
                            fontSize: '16px',
                            fontWeight: '700',
                            transition: 'background-color 0.2s'
                        }}
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