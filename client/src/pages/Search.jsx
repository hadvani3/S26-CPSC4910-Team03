import React, { useState, useEffect, useContext } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom'
import Nav from '../components/Nav';
import { AuthContext } from "../components/AuthContext.jsx";

const SearchResults = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  
  const navigate = useNavigate();
  const location = useLocation();
  const { token, role, authReady } = useContext(AuthContext);

  //check the token (wait for sessionStorage hydration so refresh does not bounce to login)
  useEffect(() => {
    if (!authReady) return;
    if (!token) {
      navigate("/"); 
    }
  }, [authReady, token, navigate]);

  //get the queries passed we want to search with
  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const searchTerm = queryParams.get('q');

    if (searchTerm) {
      fetchResults(searchTerm);
    }
  }, [location.search]);

  //recieve the data from the backend with these queries
  const fetchResults = async (query) => {
    setLoading(true);
    try {
      const response = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
      const data = await response.json();
      setProducts(data);
    } catch (error) {
      console.error("Search failed:", error);
    } finally {
      setLoading(false);
    }
  };

  //used to search again from the same page
  const handleNewSearch = (e) => {
    e.preventDefault();
    navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
  };

  //send to the specific type of product page
  const getProductPath = (id) => {
    return role === 'sponsor' 
      ? `/sponsor_product?id=${id}` 
      : `/product?id=${id}`;
  };


  return (
    <>
    <Nav />
    <div className="Searchcontainer" style={{width: '1000px'}}>
      <form onSubmit = {handleNewSearch} style={{display: 'flex', alignItems: 'center', gap: '10px'}}>
        <input type="text" value = {searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder='Enter a Product' style={{width: '75%', flex:1, padding: '10px'}}>
        </input>
        <button style={{width: '75px', height:'50px', backgroundColor: 'white', color: 'black'}} type="submit">
          Search
        </button>
      </form>
      </div>
      <h2 style={{ color: 'white', textAlign: 'center' }}>Results for "{new URLSearchParams(location.search).get('q')}":</h2>

      {loading && <p>Loading...</p>}
      <div style ={{display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px', padding: '20px', maxWidth: '1400px', width: '100%', margin: '0 auto'}}>
      {!loading && products.length === 0 && <p style={{ color: 'white', textAlign: 'center' }}>No products found.</p>}

        {products.map((item) => (
          <div key={item.listing_id} className="container" style={{padding: '25px', borderRadius: '12px', border: '1px solid #333', display: 'flex', flexDirection: 'column',
      transition: 'transform 0.2s', minHeight: '400px'}}>
          <Link to={getProductPath(item.listing_id)} style={{ textDecoration: 'none' }}>
            <img src={item.image} alt={item.title} style={{ display: 'block', width: '100%', marginBottom: '10px', height: '400px', objectFit: 'contain',  }} />
            <h4 style={{ color: 'white', textAlign: 'center', fontSize: '0.9rem', height: '3em', overflow: 'hidden' }}>{item.title}</h4>
            <p style={{
              color: "white",
              textAlign: "center"
            }}> <b>Points: {item.price}</b></p>
            </Link>
          </div>
        ))}
      </div>
    </>
  );
};

export default SearchResults;