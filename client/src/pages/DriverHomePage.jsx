import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom'
import Nav from '../components/Nav';


export default function DriverHomePage(){

    const [searchQuery, setSearchQuery] = useState('');

    const navigate = useNavigate();

    //search for products from the homepage
    const searchCatalogue = (e) => {
    e.preventDefault();
    navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
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
                    Welcome back! 
                </h1>
                <div style={{
                    display: 'flex',
                    justifyContent: 'space-around',
                    marginTop: '25px',
                    flexWrap: 'wrap',
                    gap: '20px'
                }}>
                    <div>
                        <p style={{ 
                            fontSize: '3em', 
                            fontWeight: 'bold', 
                            margin: '0',
                            textShadow: '0 2px 4px rgba(0,0,0,0.2)'
                        }}>0</p>
                        <p style={{ margin: '5px 0 0 0', opacity: '0.9' }}>Total Points</p>
                    </div>
                    <div>
                        <p style={{ 
                            fontSize: '3em', 
                            fontWeight: 'bold', 
                            margin: '0',
                            textShadow: '0 2px 4px rgba(0,0,0,0.2)'
                        }}>0</p>
                        <p style={{ margin: '5px 0 0 0', opacity: '0.9' }}>This Month</p>
                    </div>
                </div>
            </div>

            <div style={{
                backgroundColor: '#f8f9fa',
                padding: '25px',
                borderRadius: '10px',
                marginBottom: '30px',
                boxShadow: '0 2px 8px rgba(0,0,0,0.05)'
            }}>
                <h2 style={{ 
                    marginTop: '0', 
                    marginBottom: '15px',
                    color: '#34495e',
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
                            border: '2px solid #ddd',
                            borderRadius: '8px',
                            outline: 'none',
                            transition: 'border-color 0.2s'
                        }}
                    />
                    <button 
                        type="submit"
                        style={{
                            padding: '12px 30px',
                            fontSize: '16px',
                            fontWeight: '600',
                            border: 'none',
                            backgroundColor: '#667eea',
                            color: 'white',
                            borderRadius: '8px',
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
                    backgroundColor: '#e8f5e9',
                    padding: '25px',
                    borderRadius: '10px',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                }}>
                    <h2 style={{ 
                        marginTop: '0',
                        color: '#2e7d32',
                        fontSize: '1.3em',
                        marginBottom: '15px'
                    }}>
                        Sponsors Applied To
                    </h2>
                    <ul style={{
                        listStyle: 'none',
                        padding: '0',
                        margin: '0'
                    }}>
                        <li style={{ 
                            padding: '10px',
                            backgroundColor: 'white',
                            borderRadius: '6px',
                            marginBottom: '8px',
                            color: '#555'
                        }}>Sponsor A</li>
                        <li style={{ 
                            padding: '10px',
                            backgroundColor: 'white',
                            borderRadius: '6px',
                            marginBottom: '8px',
                            color: '#555'
                        }}>Sponsor B</li>
                        <li style={{ 
                            padding: '10px',
                            backgroundColor: 'white',
                            borderRadius: '6px',
                            marginBottom: '8px',
                            color: '#555'
                        }}>Sponsor C</li>
                    </ul>
                </div>

                <div style={{
                    backgroundColor: '#fff3e0',
                    padding: '25px',
                    borderRadius: '10px',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                }}>
                    <h2 style={{ 
                        marginTop: '0',
                        color: '#e65100',
                        fontSize: '1.3em',
                        marginBottom: '15px'
                    }}>
                        Top Drivers
                    </h2>
                    <ol style={{
                        margin: '0',
                        padding: '0 0 0 25px',
                        color: '#555'
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
                backgroundColor: '#4caf50',
                padding: '35px',
                borderRadius: '10px',
                textAlign: 'center',
                color: 'white',
                boxShadow: '0 4px 12px rgba(76, 175, 80, 0.3)'
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
                        fontWeight: '600',
                        border: 'none',
                        backgroundColor: 'white',
                        color: '#4caf50',
                        borderRadius: '8px',
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
