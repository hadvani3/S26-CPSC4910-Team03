import {Link} from 'react-router-dom';
import Nav from '../components/Nav';

export default function Home() {
    return (
        <>
            <Nav />
             <div className="admin-dashboard">
                <div style={{
                    textAlign: 'center',
                    padding: '50px 20px',
                    background: 'rgba(255, 255, 255, 0.16)',
                    border: '1px solid rgba(255, 255, 255, 0.24)',
                    backdropFilter: 'blur(8px)',
                    color: 'white',
                    borderRadius: '10px',
                    marginBottom: '40px',
                    boxShadow: '0 10px 24px rgba(0,0,0,0.2)'
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
                        background: 'rgba(255, 255, 255, 0.16)',
                        border: '1px solid rgba(255, 255, 255, 0.22)',
                        backdropFilter: 'blur(8px)',
                        borderRadius: '10px',
                        boxShadow: '0 8px 18px rgba(0,0,0,0.18)',
                        transition: 'transform 0.2s'
                    }}>
                        <h2 style={{ color: '#f4f8ff', marginTop: '0', fontSize: '1.5em' }}>
                             For Drivers
                        </h2>
                        <ul style={{ 
                            textAlign: 'left', 
                            lineHeight: '2',
                            paddingLeft: '20px',
                            color: '#f4f8ff'
                        }}>
                            <li>Earn points for safe driving</li>
                            <li>Redeem rewards from catalog</li>
                            <li>Track your performance</li>
                            <li>View point history</li>
                        </ul>
                    </div>

                    <div style={{
                        padding: '30px',
                        background: 'rgba(255, 255, 255, 0.16)',
                        border: '1px solid rgba(255, 255, 255, 0.22)',
                        backdropFilter: 'blur(8px)',
                        borderRadius: '10px',
                        boxShadow: '0 8px 18px rgba(0,0,0,0.18)',
                        transition: 'transform 0.2s'
                    }}>
                        <h2 style={{ color: '#f4f8ff', marginTop: '0', fontSize: '1.5em' }}>
                            For Sponsors
                        </h2>
                        <ul style={{ 
                            textAlign: 'left', 
                            lineHeight: '2',
                            paddingLeft: '20px',
                            color: '#f4f8ff'
                        }}>
                            <li>Manage your drivers</li>
                            <li>Award & track points</li>
                            <li>Custom product catalog</li>
                            <li>Performance reports</li>
                        </ul>
                    </div>
                </div>

                <div style={{
                    background: 'rgba(255, 255, 255, 0.16)',
                    border: '1px solid rgba(255, 255, 255, 0.22)',
                    backdropFilter: 'blur(8px)',
                    padding: '40px 30px',
                    borderRadius: '10px',
                    marginBottom: '40px',
                    boxShadow: '0 8px 18px rgba(0,0,0,0.18)'
                }}>
                    <h2 style={{ textAlign: 'center', color: '#f4f8ff', fontSize: '2em', marginTop: '0' }}>
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
                                backgroundColor: '#f4efe1',
                                color: '#1f2937',
                                borderRadius: '50%',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontSize: '28px',
                                fontWeight: 'bold',
                                margin: '0 auto 15px'
                            }}>1</div>
                            <h3 style={{ fontSize: '18px', margin: '10px 0', color: '#f4f8ff' }}>
                                Sign Up
                            </h3>
                            <p style={{ fontSize: '14px', color: '#dbe6ff', lineHeight: '1.6' }}>
                                Create your driver account and apply to join a sponsor
                            </p>
                        </div>

                        <div style={{ textAlign: 'center', maxWidth: '220px' }}>
                            <div style={{
                                width: '70px',
                                height: '70px',
                                backgroundColor: '#f4efe1',
                                color: '#1f2937',
                                borderRadius: '50%',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontSize: '28px',
                                fontWeight: 'bold',
                                margin: '0 auto 15px'
                            }}>2</div>
                            <h3 style={{ fontSize: '18px', margin: '10px 0', color: '#f4f8ff' }}>
                                Drive Safe
                            </h3>
                            <p style={{ fontSize: '14px', color: '#dbe6ff', lineHeight: '1.6' }}>
                                Earn points for good driving behavior and performance
                            </p>
                        </div>

                        <div style={{ textAlign: 'center', maxWidth: '220px' }}>
                            <div style={{
                                width: '70px',
                                height: '70px',
                                backgroundColor: '#f4efe1',
                                color: '#1f2937',
                                borderRadius: '50%',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontSize: '28px',
                                fontWeight: 'bold',
                                margin: '0 auto 15px'
                            }}>3</div>
                            <h3 style={{ fontSize: '18px', margin: '10px 0', color: '#f4f8ff' }}>
                                Redeem Rewards
                            </h3>
                            <p style={{ fontSize: '14px', color: '#dbe6ff', lineHeight: '1.6' }}>
                                Use your points to purchase items from the catalog
                            </p>
                        </div>
                    </div>
                </div>

                <div style={{
                    padding: '30px',
                    background: 'rgba(255, 255, 255, 0.16)',
                    borderRadius: '10px',
                    border: '1px solid rgba(255, 255, 255, 0.22)',
                    backdropFilter: 'blur(8px)',
                    marginBottom: '40px',
                    boxShadow: '0 8px 18px rgba(0,0,0,0.18)'
                }}>
                    <h2 style={{ color: '#f4f8ff', marginTop: '0' }}>About Our Program</h2>
                    <p style={{ lineHeight: '1.8', color: '#f4f8ff', fontSize: '16px' }}>
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
                    background: 'rgba(255, 255, 255, 0.16)',
                    border: '1px solid rgba(255, 255, 255, 0.24)',
                    backdropFilter: 'blur(8px)',
                    color: 'white',
                    borderRadius: '10px',
                    boxShadow: '0 10px 24px rgba(0,0,0,0.2)'
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
                            backgroundColor: '#f4efe1',
                            color: '#1f2937',
                            textDecoration: 'none',
                            borderRadius: '10px',
                            border: '1px solid rgba(15, 23, 42, 0.2)',
                            fontWeight: 'bold',
                            fontSize: '16px',
                            transition: 'background-color 0.2s'
                        }}>
                            Create Account
                        </Link>
                        <Link to="/" style={{
                            padding: '15px 40px',
                            backgroundColor: '#f4efe1',
                            color: '#1f2937',
                            textDecoration: 'none',
                            borderRadius: '10px',
                            border: '1px solid rgba(15, 23, 42, 0.2)',
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