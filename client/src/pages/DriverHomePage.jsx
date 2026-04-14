import { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'
import { AuthContext } from "../components/AuthContext.jsx";
import Nav from '../components/Nav';

export default function DriverHomePage() {

    const [data, setData] = useState(null);
    const [SponsorData, setSponsorData] = useState(null);
    const [error, setError] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');

    const navigate = useNavigate();
    const { token, role } = useContext(AuthContext);

    // check token
    useEffect(() => {
        if (!token) {
            navigate("/");
        }
    }, [token, navigate]);

    useEffect(() => {
    if (token) {
        fetch('/api/driver-home', {
            method: 'GET', // Matches your sponsor logic
            headers: { 
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        })
                .then(res => {
                    if (!res.ok) throw new Error("Failed to fetch");
                    return res.json();
                })
                .then(data => {
                    setData(data);
                    setSponsorData(data)
                })
                .catch(err => {
                    console.error('Error fetching driver data:', err);
                    setError(err.message);
                });
        }
    }, [token]);


    //search for products from the homepage
    const searchCatalogue = (e) => {
        e.preventDefault();
        navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
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
                    Welcome back! 
                </h1>
                <div style={{
                    background: 'rgba(255, 255, 255, 0.16)',
                    border: '1px solid rgba(255, 255, 255, 0.22)',
                    backdropFilter: 'blur(8px)',
                    padding: '25px',
                    borderRadius: '10px',
                    marginBottom: '30px'
                }}>
                    <h2 style={{ color: '#f4f8ff', marginBottom: '20px' }}>
                        Sponsors
                    </h2>
                   <div style={{
                    display: 'flex',
                    flexDirection: 'column', 
                    gap: '10px'            
                }}>
                    {SponsorData && SponsorData.length > 0 ? (
                        SponsorData.map((item, index) => (
                            <div key={index} style={{ 
                                padding: '15px 25px',
                                background: 'rgba(255, 255, 255, 0.18)',
                                borderRadius: '8px',
                                color: '#f4f8ff',
                                border: '1px solid rgba(255,255,255,0.18)',
                                display: 'grid',
                                gridTemplateColumns: '1fr 1fr 1fr', 
                                alignItems: 'center',
                                textAlign: 'left'
                            }}>
                                <span style={{ 
                                    fontWeight: '500', 
                                    fontSize: '1.1em'
                                }}>
                                    {item.company_name}
                                </span>

                                <span style={{ 
                                    fontWeight: 'bold', 
                                    background: 'rgba(209, 205, 205, 0.3)', 
                                    padding: '5px 15px', 
                                    borderRadius: '20px',
                                    color: '#f4efe1',
                                    width: 'fit-content',
                                    justifySelf: 'start' 
                                }}>
                                    {item.points} pts
                                </span>
                            <button 
                            type="submit"
                            onClick={() => navigate(`/sponsor/${item.sponsor_id}/catalog`)}
                            style={{
                                padding: '12px 30px',
                                fontSize: '14px',
                                fontWeight: '700',
                                border: '1px solid rgba(15, 23, 42, 0.18)',
                                backgroundColor: '#f4efe1',
                                color: '#1f2937',
                                borderRadius: '10px',
                                cursor: 'pointer',
                                transition: 'background-color 0.2s',
                                justifySelf: 'end'
                            }}>
                            View Catalog
                            </button>
                            </div>
                        ))
                    ) : (
                        <p style={{ color: 'white', opacity: 0.7 }}>No active sponsor affiliations.</p>
                    )}
                </div>
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
                    marginBottom: '15px',
                    color: '#f4f8ff',
                    fontSize: '1.3em'
                }}>
                     Search Product Catalog
                </h2>
                <form onSubmit={searchCatalogue} style={{ 
                    display: 'flex', 
                    gap: '10px',
                    alignItems: 'stretch'
                }}>
                    <input 
                        type="text" 
                        value={searchQuery} 
                        onChange={(e) => setSearchQuery(e.target.value)} 
                        placeholder="Search for rewards..."
                        style={{
                            flex: '1',
                            padding: '12px 15px',
                            fontSize: '16px',
                            border: '1px solid rgba(255,255,255,0.35)',
                            borderRadius: '8px',
                            outline: 'none',
                            background: 'rgba(255,255,255,0.92)',
                            color: '#1f2937',
                            transition: 'border-color 0.2s'
                        }}
                    />
                    <button 
                        type="submit"
                        style={{
                            padding: '12px 30px',
                            fontSize: '16px',
                            fontWeight: '700',
                            border: '1px solid rgba(15, 23, 42, 0.18)',
                            backgroundColor: '#f4efe1',
                            color: '#1f2937',
                            borderRadius: '10px',
                            cursor: 'pointer',
                            transition: 'background-color 0.2s'
                        }}
                    >
                        Search
                    </button>
                </form>
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
                        marginBottom: '15px'
                    }}>
                        Sponsor Applications
                    </h2>
                    <ul style={{
                        listStyle: 'none',
                        padding: '0',
                        margin: '0'
                    }}>
                        <li style={{ 
                            padding: '10px',
                            background: 'rgba(255, 255, 255, 0.18)',
                            borderRadius: '6px',
                            marginBottom: '8px',
                            color: '#f4f8ff',
                            border: '1px solid rgba(255,255,255,0.18)'
                        }}>Sponsor A</li>
                        <li style={{ 
                            padding: '10px',
                            background: 'rgba(255, 255, 255, 0.18)',
                            borderRadius: '6px',
                            marginBottom: '8px',
                            color: '#f4f8ff',
                            border: '1px solid rgba(255,255,255,0.18)'
                        }}>Sponsor B</li>
                        <li style={{ 
                            padding: '10px',
                            background: 'rgba(255, 255, 255, 0.18)',
                            borderRadius: '6px',
                            marginBottom: '8px',
                            color: '#f4f8ff',
                            border: '1px solid rgba(255,255,255,0.18)'
                        }}>Sponsor C</li>
                    </ul>
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
                        marginBottom: '15px'
                    }}>
                        Top Drivers
                    </h2>
                    <ol style={{
                        margin: '0',
                        padding: '0 0 0 25px',
                        color: '#f4f8ff'
                    }}>
                        <li style={{ padding: '8px 0' }}>Thomas Jefferson - 1,250 pts</li>
                        <li style={{ padding: '8px 0' }}>George Washington - 1,100 pts</li>
                        <li style={{ padding: '8px 0' }}>John Adams - 950 pts</li>
                        <li style={{ padding: '8px 0' }}>Abraham Lincoln - 800 pts</li>
                        <li style={{ padding: '8px 0' }}>Alexander Hamilton - 750 pts</li>
                    </ol>
                </div>
            </div>

            <div style={{
                background: 'rgba(255, 255, 255, 0.16)',
                border: '1px solid rgba(255, 255, 255, 0.24)',
                backdropFilter: 'blur(8px)',
                padding: '35px',
                borderRadius: '10px',
                textAlign: 'center',
                color: 'white',
                boxShadow: '0 10px 24px rgba(0,0,0,0.2)'
            }}>
                <h2 style={{ 
                    margin: '0 0 15px 0',
                    fontSize: '1.5em'
                }}>
                    Ready to Start Earning Points?
                </h2>
                <p style={{ 
                    margin: '0 0 20px 0',
                    fontSize: '1.1em',
                    opacity: '0.95'
                }}>
                    Apply to a sponsor organization to begin your journey!
                </p>
                <button 
                    type="button"
                    onClick={() => navigate('/apply')}
                    style={{
                        padding: '16px 40px',
                        fontSize: '18px',
                        fontWeight: '700',
                        border: '1px solid rgba(15, 23, 42, 0.18)',
                        backgroundColor: '#f4efe1',
                        color: '#1f2937',
                        borderRadius: '10px',
                        cursor: 'pointer',
                        transition: 'all 0.2s',
                        boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
                        minWidth: '240px',
                        whiteSpace: 'nowrap',
                        display: 'inline-block'
                    }}
                >
                     Apply to Sponsor
                </button>
            </div>
        </div>
        </>
    );

    /*return (
        <>
        <Nav />
        <form class="search-container" onSubmit={searchCatalogue}>
            <input type="text" value = {searchQuery} onChange = {(e) => setSearchQuery(e.target.value)} class="search-bar" placeholder="Search..."></input>
            <button class="search-button" type="submit">Search</button>
        </form>
        <div class = "home-test">
            <ul>
                <li>Welcome back!: </li>
                <li>Total pts: </li>
                <li>Points Earned this month: </li>
            </ul>
        </div>
        <div class = "wrap">
            <div class = "home-test">
                <h1>Sponsors Applied To</h1>
                <ul>
                    <li>Sponsor_a</li>
                    <li>Sponsor_b</li>
                    <li>Sponsor_c</li>
                    <li>Sponsor_d</li>
                    <li>Sponsor_e</li>
                    <li>Sponsor_f</li>
                </ul>
            </div>

            <div class = "home-test">
                <h1>Top Drivers</h1>
                <ol>
                    <li>Driver_1</li>
                    <li>Driver_2</li>
                    <li>Driver_3</li>
                    <li>Driver_4</li>
                    <li>Driver_5</li>
                    <li>Driver_6</li>
                </ol>
            </div>
        </div>
        <div class = "home-test">
            <h1>Apply To A Sponsor</h1>
            <button type = "button">Click Here</button>
        </div>
        
        </>
    );*/
}
