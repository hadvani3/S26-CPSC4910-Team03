import React, { useState, useEffect, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Nav from '../components/Nav';
import { AuthContext } from "../components/AuthContext.jsx";

const PurchaseHistory = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();
    const { token } = useContext(AuthContext);

    // check token
    useEffect(() => {
        if (!token) {
            navigate("/");
        }
    }, [token, navigate]);

    useEffect(() => {
        if (token) {
            fetchResults();
        }
    }, [token]);

    const fetchResults = async () => {
        setLoading(true);
        try {
            const response = await fetch(`/api/purchase-history`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ key: token }),
            });

            if (!response.ok) throw new Error("Failed to fetch purchase history");

            const data = await response.json();
            setOrders(data);
        } catch (error) {
            console.error("Purchase history fetch failed:", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <Nav />
            <div  style={{ width: '100%', maxWidth: '1000px', margin: '0 auto', padding: '20px' }}>
                <h1 style={{ color: 'white', textAlign: 'center', marginBottom: '30px' }}>Your Purchase History</h1>

                {loading && <p style={{ color: 'white', textAlign: 'center' }}>Loading your history...</p>}

                {!loading && orders.length === 0 && (
                    <p style={{ color: 'white', textAlign: 'center' }}>No purchases found in your account.</p>
                )}

                <div className="Searchcontainer" style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
                    {!loading && orders.map((order) => (
                        <div  key={order.purchase_id} style={{
                            padding: '25px',
                            borderRadius: '15px',
                            border: '1px solid #ffffff',
                            color: 'white'
                            
                        }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #ffffff', paddingBottom: '15px', marginBottom: '15px' }}>
                                <div>
                                    <p style={{ fontSize: '0.8rem', color: '#888', margin: 0 }}>ORDER ID</p>
                                    <h4 style={{ margin: 0 }}>#{order.purchase_id}</h4>
                                </div>
                                <div>
                                    <p style={{ fontSize: '0.8rem', color: '#888', margin: 0 }}>DATE</p>
                                    <h4 style={{ margin: 0 }}>{new Date(order.purchased_at).toLocaleDateString()}</h4>
                                </div>
                                <div style={{ textAlign: 'right' }}>
                                    <p style={{ fontSize: '0.8rem', color: '#888', margin: 0 }}>TOTAL SPENT</p>
                                    <h4 style={{ margin: 0, color: '#2ecc71' }}>{order.cost} Points</h4>
                                </div>
                            </div>

                            <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                                {order.productDetails && order.productDetails.map((product, index) => (
                                    <Link to={`/product?q=${product.listing_id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                                    <div className="ProductContainer" key={`${order.purchase_id}-${index}`} style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '20px',
                                        padding: '10px',
                                        borderRadius: '8px',
                                        backgroundColor: 'rgba(255, 255, 255, 0.14)',
                                        backdropFilter: 'blur(10px)',
                                        webkitBackdropFilter: 'blur(10px)'
                                    }}>
                                    
                                        <img 
                                            src={product.image} 
                                            alt={product.title} 
                                            style={{ width: '80px', height: '80px', objectFit: 'contain', borderRadius: '5px', backgroundColor: '#fff' }} 
                                        />
                                        
                                        <div style={{ flex: 1 }}>
                                            <h4 style={{ margin: '0 0 5px 0', fontSize: '1rem' }}>{product.title}</h4>
                                            <p style={{ margin: 0, color: '#aaa', fontSize: '0.9rem' }}>Price: {product.price} Points</p>
                                        </div>
                                   
                                    </div>
                                 </Link>
                                ))}
                                
                                {(!order.productDetails || order.productDetails.length === 0) && (
                                    <p style={{ color: '#888', fontStyle: 'italic' }}>Items no longer available for display.</p>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </>
    );
};

export default PurchaseHistory;