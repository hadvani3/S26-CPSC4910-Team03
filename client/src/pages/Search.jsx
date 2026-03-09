import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom'
import Nav from '../components/Nav';

const SearchResults = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  
  const navigate = useNavigate();
  const location = useLocation();

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

  return (
    <>
    <Nav />
    <div className="Searchcontainer" style={{width: '1000px'}}>
      <form onSubmit = {handleNewSearch} style={{display: 'flex', alignItems: 'center', gap: '10px'}}>
        <input type="text" value = {searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder='Enter a Product' style={{width: '75%', flex:1, padding: '10px'}}>
        </input>
        <button style={{width: '75px', height:'50px', backgroundColor: 'darkblue', color: 'white'}} type="submit">
          Search
        </button>
      </form>
      <h2>Results for "{new URLSearchParams(location.search).get('q')}"</h2>

      {loading && <p>Loading...</p>}

      {!loading && products.length === 0 && <p>No products found.</p>}

        {products.map((item) => (
          <div key={item.listing_id} className="container">
            <img src={item.image} alt={item.title} style={{ width: '200px'}} />
            <h4>{item.title}</h4>
            <p style={{
              color: "green"
            }}> <b>Points: {item.price}</b></p>
          </div>
        ))}
      </div>
    </>
  );
};

export default SearchResults;