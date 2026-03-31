import React, { useState, useEffect, useContext } from 'react';
import { useLocation, useNavigate } from 'react-router-dom'
import Nav from '../components/Nav';
import {AuthContext} from "../components/AuthContext.jsx";


const Product = () => {
	const navigate = useNavigate();
	const location = useLocation();
	const [loading, setLoading] = useState(false);
	const [searchQuery, setSearchQuery] = useState('');
  const { token, role } = useContext(AuthContext);
	const [product, setProduct] = useState([]);

	//get the queries passed we want to retrieve produc with
  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const product_id = queryParams.get('q');

    if (product_id) {
      fetchResults(product_id);
    }
  }, [location.search]);

	//recieve the data from the backend with these queries
  const fetchResults = async (query) => {
    setLoading(true);
    try {
      const response = await fetch(`/api/product?q=${encodeURIComponent(query)}`);
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
            <input type="number" id="quantity" name="quantity" step="1" min="1"/>
            <br/>
            <br/>
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
                        Add to Cart
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