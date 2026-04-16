import React, { useState, useEffect, useContext } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom'
import Nav from '../components/Nav';
import { useParams } from 'react-router-dom';
import { AuthContext } from "../components/AuthContext.jsx";

const Catalog = () =>{
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const { sponsor_id } = useParams(); 
  const { token, role, authReady } = useContext(AuthContext);
  
    //check the token (wait for sessionStorage hydration so refresh does not bounce to login)
    useEffect(() => {
      if (!authReady) return;
      if (!token) {
        navigate("/"); 
      }
    }, [authReady, token, navigate]);

  useEffect(() => {
    if (sponsor_id) {
      fetchResults(sponsor_id);
    }
  }, [sponsor_id]); // Re-run if the ID in the URL changes

  const fetchResults = async (id) => {
    setLoading(true);
    try {
      // Hits your Express route: app.get('/api/:sponsor_id/catalog', ...)
      const response = await fetch(`/api/${id}/catalog`);
      const data = await response.json();
      setProducts(data);
    } catch (error) {
      console.error("Fetch failed:", error);
    } finally {
      setLoading(false);
    }
  };
  
 
  //send to the specific type of product page
  const getProductPath = (id) => {
    return role === 'sponsor' 
      ? `/sponsor_product?id=${id}&sponsor_id=${sponsor_id}` 
      : `/product?id=${id}&sponsor_id=${sponsor_id}`;
  };

   return (
    <>
      <Nav />
        {loading && <p>Loading...</p>}
        {!loading && products.length === 0 && <p style={{ color: 'white' }}>No products found.</p>}
        <h1>Catalog:</h1>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px', padding: '20px', maxWidth: '1400px', width: '100%', margin: '0 auto' }}>
          {products.map((item) => (
            <div key={item.listing_id} className="container" style={{ padding: '25px', borderRadius: '12px', border: '1px solid #333', display: 'flex', flexDirection: 'column', transition: 'transform 0.2s', minHeight: '400px' }}>
              <Link to={getProductPath(item.listing_id)} style={{ textDecoration: 'none' }}>
                <img src={item.image} alt={item.title} style={{ display: 'block', width: '100%', marginBottom: '10px', height: '400px', objectFit: 'contain' }} />
                <h4 style={{ color: 'white', textAlign: 'center', fontSize: '0.9rem', height: '3em', overflow: 'hidden' }}>{item.title}</h4>
                <p style={{ color: "white", textAlign: "center" }}> <b>Points: {item.price}</b></p>
              </Link>
            </div>
          ))}
        </div>
    </>
  );
};
export default Catalog;