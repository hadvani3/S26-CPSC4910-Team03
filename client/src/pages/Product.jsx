import React, { useState, useEffect, useContext } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom'
import Nav from '../components/Nav';
import {AuthContext} from "../components/AuthContext.jsx";


const Product = () => {
	const navigate = useNavigate();
	const location = useLocation();
	const [loading, setLoading] = useState(false);
	const [searchQuery, setSearchQuery] = useState('');
  const { token, authReady } = useContext(AuthContext);
	const [product, setProduct] = useState([]);
  const [quantity, setQuantity] = useState(1);
  const [SponsorID, setSponsorId] = useState(null);
  const [isEligible, setIsEligible] = useState(false);
  const [data, setData] = useState(null);
  const [sponsorData, setSponsorData] = useState(null);
  const [isChecking, setIsChecking] = useState(true);
  //check the token (wait for sessionStorage hydration so refresh does not bounce to login)
    useEffect(() => {
      if (!authReady) return;
      if (!token) {
        navigate("/"); 
      }
    }, [authReady, token, navigate]);



	//get the queries passed we want to retrieve produc with
  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const p_id = queryParams.get('id');
    const s_id = queryParams.get('sponsor_id');
    setSponsorId(s_id);

    console.log(p_id);
    if (p_id) {
        fetchResults(p_id, s_id);
    }
    
    if (token) {
        fetchSponsors(token);
    }
}, [location.search, token]);

  //check if it is in the sponsor catalog
useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const s_id_from_url = queryParams.get('sponsor_id');
    
    const querySponsorId = Number(s_id_from_url) || 0;

    if (sponsorData) {
        const hasAccess = sponsorData.some(s => Number(s.sponsor_id) === querySponsorId);
        
        setIsEligible(hasAccess);
        setIsChecking(false);
    } 
    else {
        setIsChecking(true);
    }
}, [sponsorData, location.search]);


  //get the list of sponsors that the user is in 
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

	//recieve the data from the backend with these queries
  const fetchResults = async (product_query, s_id) => { 
    setLoading(true);
    try {
        console.log(s_id);
        let url = `/api/product?id=${encodeURIComponent(product_query)}`;
        
        if (s_id && s_id !== "null" && s_id !== "undefined") {
            url += `&sponsor_id=${encodeURIComponent(s_id)}`;
        }
        
        const response = await fetch(url);
        if (!response.ok) throw new Error("Failed to fetch product");
        
        const data = await response.json();
        setProduct(data);
    } catch (error) {
        console.error("No product found:", error);
    } finally {
        setLoading(false);
    }
};

  //used to search again from the same page
  const handleNewSearch = (e) => {
    e.preventDefault();
    navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
  };
   
  const handleAddToCart = async () => {
        if (!token) {
            alert("Identity not verified. Please log in again.");
            return;
        }

        try {
            const res = await fetch("/api/addToCart", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    key: token,
                    product_id: product[0]?.listing_id,
                    sponsor_id: SponsorID,
                    count: quantity
                }),
            });

            if (res.ok) {
                alert("Successfully added to your cart!");
            } else {
                alert("Failed to add product.");
            }
        } catch (err) {
            console.error(err);
            alert("Server error while adding product.");
        }
    };

return (
    <>
      <Nav />
      <div className="Searchcontainer" style={{ width: '1000px', margin: '0 auto' }}>
        <form onSubmit={handleNewSearch} style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Enter a Product"
            style={{ width: '75%', flex: 1, padding: '10px' }}
          />
          <button 
            style={{ width: '75px', height: '50px', backgroundColor: 'white', color: 'black' }} 
            type="submit"
          >
            Search
          </button>
        </form>
      </div>

      <div className="Productcontainer" style={{ width: '1600px', margin: '20px auto' }}>
     
        
        <div style={{ display: 'flex', gap: '20px', alignItems: 'flex-start' }}>
          <div className="image-wrapper">
            <img 
              src={product[0]?.image} 
              alt={product[0]?.title} 
              style={{ width: '800px', borderRadius: '8px' }} 
            />
          </div>

          
          <div className="content-wrapper">
            <h2>{product[0]?.title}</h2>
            <p style={{ font: 'ariel', fontSize: '30px', fontWeight: 'bold', color: '#059C0E'}}>Points: {product[0]?.price}</p>
            <label for="quantity" style={{ font: 'ariel', fontSize: '20px', color: 'white'}}>Quantity: </label>
            <input type="number" id="quantity" name="quantity" step="1" min="1" onChange={(e) => setQuantity(parseInt(e.target.value))}/>
            <br/>
            <br/>
            <button 
                        onClick={handleAddToCart}
                        disabled = {isChecking || !isEligible}
                        style={{
                            padding: '12px 30px',
                            fontSize: isEligible? '16px' : '12px',
                            fontWeight: '600',
                            border: 'none',
                            backgroundColor: isChecking ? 'gray' : (isEligible ?'#667eea' : 'gray'),
                            color: 'white',
                            borderRadius: '8px',
                            cursor: 'pointer',
                            transition: 'background-color 0.2s',
                            cursor: isEligible? 'pointer' : 'not-allowed'
                        }}
                    >
                        {isChecking ? "Checking availability..." : (isEligible ? "Add to Cart" : "Not in sponsor catalog")
    }
             </button>
            <p style={{font: 'ariel', color: 'white'}}> {product[0]?.description}</p>
            <p style={{font: 'ariel', color: 'white'}}>Materials: {product[0]?.materials[0]}</p>
          </div>
        </div>
      </div>
    </>
  );
};

export default Product;