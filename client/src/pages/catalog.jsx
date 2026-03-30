import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom'
import Nav from '../components/Nav';
import { useParams } from 'react-router-dom';

const Catalog = () =>{
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const { sponsor_id } = useParams(); 

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
  

   return (
    <>
    <Nav />
    <div className="Searchcontainer" style={{width: '1000px'}}>
      {loading && <p>Loading...</p>}

      {!loading && products.length === 0 && <p style={{ color: 'white' }}>No products found.</p>}
        <h1>Catalog:</h1>
        {products.map((item) => (
          <div key={item.listing_id} className="container">
          <a href= {`/product?q=${item.listing_id}`}>
            <img src={item.image} alt={item.title} style={{ width: '200px'}} />
            <h4 style={{ color: 'white' }}>{item.title}</h4>
            <p style={{
              color: "white"
            }}> <b>Points: {item.price}</b></p>
            </a>
          </div>
        ))}
      </div>
    </>
  );
};
export default Catalog;