import {Link} from 'react-router-dom';
import Nav from '../components/Nav';

export default function Home() {
    return (
        <>
            <Nav />
             <div className="container">
                <div style={{
                    textAlign: 'center',
                    padding: '50px 20px',
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    color: 'white',
                    borderRadius: '10px',
                    marginBottom: '40px'
                }}>
                    <h1 style={{ fontSize: '2.5em', margin: '0 0 15px 0' }}>
                        Good Driver Incentive Program
                    </h1>
                    <p style={{ fontSize: '1.3em', margin: '0', opacity: '0.95' }}>
                        Rewarding safe driving, one point at a time!
                    </p>
                </div>

                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                    gap: '25px',
                    marginBottom: '40px'
                }}>
                    <div style={{
                        padding: '30px',
                        backgroundColor: '#e3f2fd',
                        borderRadius: '10px',
                        boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
                        transition: 'transform 0.2s'
                    }}>
                        <h2 style={{ color: '#1976d2', marginTop: '0', fontSize: '1.5em' }}>
                             For Drivers
                        </h2>
                        <ul style={{ 
                            textAlign: 'left', 
                            lineHeight: '2',
                            paddingLeft: '20px',
                            color: '#333'
                        }}>
                            <li>Earn points for safe driving</li>
                            <li>Redeem rewards from catalog</li>
                            <li>Track your performance</li>
                            <li>View point history</li>
                        </ul>
                    </div>

                    <div style={{
                        padding: '30px',
                        backgroundColor: '#e8f5e9',
                        borderRadius: '10px',
                        boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
                        transition: 'transform 0.2s'
                    }}>
                        <h2 style={{ color: '#388e3c', marginTop: '0', fontSize: '1.5em' }}>
                            For Sponsors
                        </h2>
                        <ul style={{ 
                            textAlign: 'left', 
                            lineHeight: '2',
                            paddingLeft: '20px',
                            color: '#333'
                        }}>
                            <li>Manage your drivers</li>
                            <li>Award & track points</li>
                            <li>Custom product catalog</li>
                            <li>Performance reports</li>
                        </ul>
                    </div>
                </div>

                <div style={{
                    backgroundColor: '#f5f5f5',
                    padding: '40px 30px',
                    borderRadius: '10px',
                    marginBottom: '40px'
                }}>
                    <h2 style={{ textAlign: 'center', color: '#34495e', fontSize: '2em', marginTop: '0' }}>
                        How It Works
                    </h2>
                    <div style={{
                        display: 'flex',
                        justifyContent: 'space-around',
                        flexWrap: 'wrap',
                        gap: '30px',
                        marginTop: '30px'
                    }}>
                        <div style={{ textAlign: 'center', maxWidth: '220px' }}>
                            <div style={{
                                width: '70px',
                                height: '70px',
                                backgroundColor: '#4caf50',
                                color: 'white',
                                borderRadius: '50%',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontSize: '28px',
                                fontWeight: 'bold',
                                margin: '0 auto 15px'
                            }}>1</div>
                            <h3 style={{ fontSize: '18px', margin: '10px 0', color: '#34495e' }}>
                                Sign Up
                            </h3>
                            <p style={{ fontSize: '14px', color: '#666', lineHeight: '1.6' }}>
                                Create your driver account and apply to join a sponsor
                            </p>
                        </div>

                        <div style={{ textAlign: 'center', maxWidth: '220px' }}>
                            <div style={{
                                width: '70px',
                                height: '70px',
                                backgroundColor: '#2196f3',
                                color: 'white',
                                borderRadius: '50%',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontSize: '28px',
                                fontWeight: 'bold',
                                margin: '0 auto 15px'
                            }}>2</div>
                            <h3 style={{ fontSize: '18px', margin: '10px 0', color: '#34495e' }}>
                                Drive Safe
                            </h3>
                            <p style={{ fontSize: '14px', color: '#666', lineHeight: '1.6' }}>
                                Earn points for good driving behavior and performance
                            </p>
                        </div>

                        <div style={{ textAlign: 'center', maxWidth: '220px' }}>
                            <div style={{
                                width: '70px',
                                height: '70px',
                                backgroundColor: '#ff9800',
                                color: 'white',
                                borderRadius: '50%',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontSize: '28px',
                                fontWeight: 'bold',
                                margin: '0 auto 15px'
                            }}>3</div>
                            <h3 style={{ fontSize: '18px', margin: '10px 0', color: '#34495e' }}>
                                Redeem Rewards
                            </h3>
                            <p style={{ fontSize: '14px', color: '#666', lineHeight: '1.6' }}>
                                Use your points to purchase items from the catalog
                            </p>
                        </div>
                    </div>
                </div>

                <div style={{
                    padding: '30px',
                    backgroundColor: '#fff',
                    borderRadius: '10px',
                    border: '1px solid #e0e0e0',
                    marginBottom: '40px'
                }}>
                    <h2 style={{ color: '#34495e', marginTop: '0' }}>About Our Program</h2>
                    <p style={{ lineHeight: '1.8', color: '#555', fontSize: '16px' }}>
                        The Good Driver Incentive Program rewards good driving habits and 
                        performance in the form of points. Points can be used to 
                        purchase rewards that are listed within the product catalog. Sponsor 
                        companies manage their drivers, award points for good performance
                        and maintain custom catalogs of incentive products.
                    </p>
                </div>

                <div style={{
                    textAlign: 'center',
                    padding: '50px 20px',
                    backgroundColor: '#34495e',
                    color: 'white',
                    borderRadius: '10px'
                }}>
                    <h2 style={{ margin: '0 0 25px 0', fontSize: '2em' }}>
                        Ready to Start?
                    </h2>
                    <div style={{ 
                        display: 'flex', 
                        gap: '20px', 
                        justifyContent: 'center', 
                        flexWrap: 'wrap' 
                    }}>
                        <Link to="/create_account" style={{
                            padding: '15px 40px',
                            backgroundColor: '#4caf50',
                            color: 'white',
                            textDecoration: 'none',
                            borderRadius: '5px',
                            fontWeight: 'bold',
                            fontSize: '16px',
                            transition: 'background-color 0.2s'
                        }}>
                            Create Account
                        </Link>
                        <Link to="/" style={{
                            padding: '15px 40px',
                            backgroundColor: 'transparent',
                            color: 'white',
                            textDecoration: 'none',
                            borderRadius: '5px',
                            border: '2px solid white',
                            fontWeight: 'bold',
                            fontSize: '16px',
                            transition: 'background-color 0.2s'
                        }}>
                            Sign In
                        </Link>
                    </div>
                </div>
            </div>
        </>
    );
}