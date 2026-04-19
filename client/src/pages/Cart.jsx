import React, { useState, useEffect, useContext } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom'
import Nav from '../components/Nav';
import {AuthContext} from "../components/AuthContext.jsx";

const Cart = () =>{
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isOverBudget, setIsOverBudget] = useState(false);
  const [data, setData] = useState(null);
  const [SponsorData, setSponsorData] = useState(null);
  const [error, setError] = useState(null);
  const [sData, setSData] = useState(null);
  const [sponsorList, setSponsorList] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();
  const { token, authReady } = useContext(AuthContext);

//calulate the total number of points spent from each sponsor
      
    const sponsorTotals = products.reduce((acc, item, index) => {
        const sponsor = sponsorList && sponsorList[index];
        if (sponsor) {
            const companyName = sponsor.company_name;
            const sponsorId = sponsor.sponsor_id;
            const pointValue = sponsor.point_value_usd;
            const itemPoints = (Number(item.price) / 100) * pointValue;

            if (!acc[companyName]) {
                
                acc[companyName] = {
                    total: 0, 
                    sponsor_id: sponsorId
                };
            }
            acc[companyName].total += itemPoints;
        }
        return acc;
    }, {});
    
 //checking the token (wait for sessionStorage hydration so refresh does not bounce to login)
  useEffect(() => {
    if (!authReady) return;
    if (!token) {
      navigate("/");
    }
  }, [authReady, token, navigate]);


  useEffect(() => {
    if (token) {
      fetchResults();
      fetchSponsors(token);
      fetchSponsorDetails(token);
    }
  }, [token]);

  useEffect(() => {
    if (!SponsorData || products.length === 0) {
    setIsOverBudget(false);
    return;
  }

  let overBudget = false;
  for (const [name, total] of Object.entries(sponsorTotals)) {
    const sponsor = SponsorData.find(s => s.company_name === name);
    if (sponsor && total > sponsor.points) {
      overBudget = true;
      break;
    }
  }
  setIsOverBudget(overBudget);
}, [sponsorTotals, SponsorData, products]);

  const emptyCart = async () => {
    try {
        const res = await fetch("/api/emptyCart", {
          method: "GET",
          headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': "application/json" },
        });
      } catch (err) {
        console.error(err);
        alert("Server error while emptying cart.");
      }
    };

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
  
  const fetchSponsors = async (token) => {
    if (token) {
        fetch('/api/driver-home', {
            method: 'GET', 
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
    }
    
    const fetchSponsorDetails = async (token) => {
        if (token) {
        fetch('/api/sponsorCart', {
            method: 'GET', 
            headers: { 
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        })
                .then(res => {
                    if (!res.ok) throw new Error("Failed to fetch");
                    return res.json();
                })
                .then(sData => {
                    setSData(sData);
                    setSponsorList(sData)
                })
                .catch(err => {
                    console.error('Error fetching driver data:', err);
                    setError(err.message);
                });
        }
    }



    const handleRemoveFromCart = (index) => async () => {
        console.log("Removing item at index:", index);
        if (!token) {
            alert("Identity not verified. Please log in again.");
            return;
        }
        try {
            const res = await fetch("/api/removeFromCart", {
                method: "POST",
                headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': "application/json" },
                body: JSON.stringify({
                    index: index
                }),
                
            });
            navigate(0);
        } catch (err) {
            console.error(err);
            alert("Server error while removing product.");
        }
    };

   

    //function for the purchase button
    const handlePurchase = async () => {
        if (!token) {
            alert("Identity not verified. Please log in again.");
            return;
        }

        //make a list of purchases per sponsor
        const purchaseQueue = Object.values(sponsorTotals);
        console.log("Current sponsorTotals object:", sponsorTotals);
        console.log("Purchase Queue being sent:", purchaseQueue);

        //actually make the backend calls
        try{
            for (const purchase of purchaseQueue) {
                const res = await fetch("/api/purchase", {
                    method: "POST",
                    headers: { 
                        "Content-Type": "application/json", 
                        'Authorization': `Bearer ${token}` 
                    },
                    body: JSON.stringify({
                        total: purchase.total,
                        sponsor_id: purchase.sponsor_id
                    }),
                });

                if (!res.ok) {
                    const errorData = await res.json();
                    throw new Error(errorData.error || `Purchase failed for sponsor ID: ${purchase.sponsor_id}`);
                }
            }
            //empty the cart and reload page
            alert("Purchase successful!");
            await emptyCart();
            navigate('/driver-page')
        } catch (err) {
            console.error(err);
            alert("There was an error with your purchase.");
        }
    };



   return (
    <>
    <Nav />
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
                                    {item.points } pts
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
    <div className="Searchcontainer" style={{width: '1000px'}}>
      {loading && <p>Loading...</p>}

      {!loading && products.length === 0 && <p style={{ color: 'white' }}>No products found.</p>}
        <h1>Your Cart:</h1>
        {products.map((item, index) => (
          <div key={`${item.listing_id}-${index}`} className="container" style={{position: 'relative', padding: '20px'}}>
            <button 
                        onClick={handleRemoveFromCart(index)}
                        style={{
                            position: 'absolute',
                            top: '10px',
                            right: '10px',
                            margin: '0 auto',
                            fontSize: '16px',
                            fontWeight: '600',
                            border: 'none',
                            backgroundColor: '#9b150b',
                            color: 'white',
                            borderRadius: '8px',
                            cursor: 'pointer',
                            transition: 'background-color 0.2s'
                        }}
                    >
                        Remove
            </button>
          <a href={`/product?id=${item.listing_id}&sponsor_id=${sponsorList && sponsorList[index] ? sponsorList[index].sponsor_id : ''}`}>
            <img src={item.image} alt={item.title} style={{ width: '200px'}} />
            <h4 style={{ color: 'white' }}>{item.title}</h4>

            <p style={{
              color: "white"
            }}> <b>Points: {
                sponsorList && sponsorList[index] 
                    ? ((Number(item.price) / 100) * sponsorList[index].point_value_usd).toFixed(2) 
                    : "Calculating..."
                }</b>
                <br />
                <b>Catalog: {
                sponsorList && sponsorList[index] 
                    ? (sponsorList[index].company_name)
                    : ""
                }</b>
                </p>
            </a>
          </div>
        ))}
        <p style={{ font: 'ariel', fontSize: '30px', fontWeight: 'bold', color: '#059C0E', lineHeight: '5px', textAlign: 'center'}}>Total: </p>
            {Object.entries(sponsorTotals).map(([name, entry]) => (
            <p key={name} style={{ color: '#059C0E', fontSize: '30px', lineHeight: '1px', fontWeight: 'bold', textAlign: 'center' }}>
                {name}: {entry.total.toFixed(2)} pts
            </p>
            ))}
            <br/>
        <button 
                        onClick = {handlePurchase}
                        disabled={isOverBudget || products.length === 0}
                        style={{
                            alignItem: 'center',
                            justifyContent: 'center',
                            margin: '0 auto',
                            fontSize: '16px',
                            fontWeight: '600',
                            border: 'none',
                            backgroundColor: (isOverBudget || products.length === 0)? 'grey' :'#667eea',
                            color: 'white',
                            borderRadius: '8px',
                            cursor: (isOverBudget || products.length === 0)? 'not-allowed' : 'pointer',
                            transition: 'background-color 0.2s'
                        }}
                    >
                        {isOverBudget ? "Insufficient Points" : "Purchase"}
             </button>
      </div>
    </>
  );
};
export default Cart;