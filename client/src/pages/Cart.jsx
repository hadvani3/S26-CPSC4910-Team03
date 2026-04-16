import React, { useState, useEffect, useContext } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom'
import Nav from '../components/Nav';
import {AuthContext} from "../components/AuthContext.jsx";

const Cart = () =>{
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();
  const { token, authReady } = useContext(AuthContext);

 //checking the token (wait for localStorage hydration so refresh does not bounce to login)
  useEffect(() => {
    if (!authReady) return;
    if (!token) {
      navigate("/");
    }
  }, [authReady, token, navigate]);


  useEffect(() => {
    if (token) {
      fetchResults();
    }
  }, [token]);

  const fetchResults = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/cart`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ key: token }),
      });
      
      if (!response.ok) throw new Error("Failed to fetch cart");
      
      const data = await response.json();
      setProducts(data);
    } catch (error) {
      console.error("Cart fetch failed:", error);
    } finally {
      setLoading(false);
    }
  };
  
  const handlePurchase = async () => {
        if (!token) {
            alert("Identity not verified. Please log in again.");
            return;
        }

        try {
            const res = await fetch("/api/purchase", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    key: token,
                    total: pointTotal
                }),
            });

            if (res.ok) {
                alert("Purchased!");
            } else {
                alert("You do not have enough points");
            }
        } catch (err) {
            console.error(err);
            alert("Server error while adding product.");
        }
    };

  const pointTotal = products.reduce((sum, item) => sum + Number(item.price || 0), 0);
   return (
    <>
    <Nav />
    <div className="Searchcontainer" style={{width: '1000px'}}>
      {loading && <p>Loading...</p>}

      {!loading && products.length === 0 && <p style={{ color: 'white' }}>No products found.</p>}
        <h1>Your Cart:</h1>
        {products.map((item, index) => (
          <div key={`${item.listing_id}-${index}`} className="container">
          <a href= {`/product?q=${item.listing_id}`}>
            <img src={item.image} alt={item.title} style={{ width: '200px'}} />
            <h4 style={{ color: 'white' }}>{item.title}</h4>
            <p style={{
              color: "white"
            }}> <b>Points: {item.price}</b></p>
            </a>
          </div>
        ))}
        <p style={{ font: 'ariel', fontSize: '30px', fontWeight: 'bold', color: '#059C0E', textAlign: 'center'}}>Total: {pointTotal}</p>
        <button 
                        onClick = {handlePurchase}
                        style={{
                            alignItem: 'center',
                            justifyContent: 'center',
                            margin: '0 auto',
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
                        Purchase
             </button>
      </div>
    </>
  );
};
export default Cart;