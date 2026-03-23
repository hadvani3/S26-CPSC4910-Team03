import {Link} from 'react-router-dom';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Nav from '../components/Nav';

export default function AdminHomePage() {

    const navigate = useNavigate();
    const [stats, setStats] = useState({
        totalUsers: 0,
        totalDrivers: 0,
        totalSponsors: 0,
        pendingApplications: 0
    });

    useEffect(() => {
        setStats({
            totalUsers: 45,
            totalDrivers: 28,
            totalSponsors: 12,
            pendingApplications: 5
        });
    }, []);

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        sessionStorage.clear();
        navigate("/");
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
                        Admin Dashboard 
                    </h1>
                    <p style={{ 
                        margin: '0',
                        fontSize: '1.1em',
                        opacity: '0.95'
                    }}>
                        System Management & Overview
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
                            {stats.totalUsers}
                        </div>
                        <div style={{ fontSize: '1.1em', marginTop: '8px', opacity: '0.9' }}>
                            Total Users
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
                            {stats.totalDrivers}
                        </div>
                        <div style={{ fontSize: '1.1em', marginTop: '8px', opacity: '0.9' }}>
                            Drivers
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
                            {stats.totalSponsors}
                        </div>
                        <div style={{ fontSize: '1.1em', marginTop: '8px', opacity: '0.9' }}>
                            Sponsors
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
                            {stats.pendingApplications}
                        </div>
                        <div style={{ fontSize: '1.1em', marginTop: '8px', opacity: '0.9' }}>
                            Pending Driver Applications
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
                                Add New Driver
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
                                Manage Applications
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
                             Sponsor Management
                        </h2>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
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
                                View All Sponsors
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
                                Add New Sponsor
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
                                View Reports
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
                            <strong>New driver registered:</strong> John Doe
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
                            <strong>Application approved:</strong> Jane Smith
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
                            <strong>New sponsor joined:</strong> ABC Transport Co.
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
                         System Actions
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
                             System Settings
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
                             Backup Data
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
    )



    


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
                <h1>Drivers In The System</h1>
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
                <h1>Sponsors In The System</h1>
                <ul>
                    <li>Sponsor_a</li>
                    <li>Sponsor_b</li>
                    <li>Sponsor_c</li>
                    <li>Sponsor_d</li>
                    <li>Sponsor_e</li>
                    <li>Sponsor_f</li>
                </ul>
            </div>
        </div>
        <div class = "wrap">
            <div class = "home-test">
                <h1>Create Driver Users</h1>
                <button type = "button">Click Here</button>
            </div>
            <div class = "home-test">
                <h1>Delete Driver Users</h1>
                <button type = "button">Click Here</button>
            </div>
        </div>
        <div class = "wrap">
            <div class = "home-test">
                <h1>Create Sponsor Users</h1>
                <button type = "button">Click Here</button>
            </div>
            <div class = "home-test">
                <h1>Delete Sponsor Users</h1>
                <button type = "button">Click Here</button>
            </div>
        </div>
        </>
    );*/
}