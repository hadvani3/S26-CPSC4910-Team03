import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom'
import Nav from '../components/Nav';

const Cart = () =>{
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();
  const location = useLocation();

  //get the queries passed we want to search with
  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const user_id = queryParams.get('user_id');

    if (user_id) {
      fetchResults(user_id);
    }
  }, [location.search]);


  //recieve the data from the backend with these queries
  const fetchResults = async (query) => {
    setLoading(true);
    try {
      const response = await fetch(`/api/cart?user_id=${encodeURIComponent(query)}`);
      const data = await response.json();
      setProducts(data);
    } catch (error) {
      console.error("Search failed:", error);
    } finally {
      setLoading(false);
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
        <p style={{ font: 'ariel', fontSize: '30px', fontWeight: 'bold', color: '#059C0E', textAlign: 'center'}}>Total: {pointTotal}</p>
        <button 
                        type="submit"
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