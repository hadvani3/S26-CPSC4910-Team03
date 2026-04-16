import React, { useState, useEffect, useContext } from 'react';
import { useLocation, useNavigate } from 'react-router-dom'
import Nav from '../components/Nav';
import { AuthContext } from "../components/AuthContext.jsx";

const SponsorProduct = () => {
	const navigate = useNavigate();
	const location = useLocation();
	const [loading, setLoading] = useState(false);
	const [searchQuery, setSearchQuery] = useState('');
	const [product, setProduct] = useState([]);
    const { token, role, authReady } = useContext(AuthContext);
    const [sponsorID, setSponsorID] = useState(null);
    const [isVerified, setIsVerified] = useState(false);

    //verify the auth token
    useEffect(() => {
        async function verifyUser() {
            if (!authReady) return;
            if (!token) {
                navigate("/"); 
                return;
            }

            try {
                const res = await fetch("https://team03.cpsc4911.com/GetSponsor", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ key: token }),
                });

                const result = await res.json();

                if (res.ok) {
                    setSponsorID(result.sponsor_id);
                    setIsVerified(true);
                } else {
                    navigate("/");
                }
            } catch (err) {
                console.error("Verification error:", err);
            }
        }
        verifyUser();
    }, [authReady, token, navigate]);

	//get the queries passed we want to retrieve produc with
  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const product_id = queryParams.get('q');

    if (product_id) {
      fetchResults(product_id);
    }
  }, [location.search]);

  const handleAddToCatalog = async () => {
        if (!isVerified || !sponsorID) {
            alert("Identity not verified. Please log in again.");
            return;
        }

        try {
            const res = await fetch("/api/add-to-catalog", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    sponsor_id: sponsorID,
                    listing_id: product[0]?.listing_id
                }),
            });

            if (res.ok) {
                alert("Successfully added to your catalog!");
            } else {
                alert("Failed to add product.");
            }
        } catch (err) {
            console.error(err);
            alert("Server error while adding product.");
        }
    };

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
            <br/>
            <br/>
            <button 
                        onClick={handleAddToCatalog}
                        disabled={!isVerified}
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
                        Add to Catalog
             </button>
            <p style={{font: 'ariel', color: 'white'}}> {product[0]?.description}</p>
            <p style={{font: 'ariel', color: 'white'}}>Materials: {product[0]?.materials[0]}</p>
          </div>
        </div>
      </div>
    </>
  );
};

export default SponsorProduct;