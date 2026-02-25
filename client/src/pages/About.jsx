import { useEffect, useState } from 'react';
import Nav from '../components/Nav';

export default function About() {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/about')
      .then((res) => {
        if (!res.ok) throw new Error('Failed to load');
        return res.json();
      })
      .then(setData)
      .catch(setError)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <><Nav /><div className="container"><p>Loading...</p></div></>;
  if (error) return <><Nav /><div className="container"><p>Error: {error.message}</p></div></>;
  if (!data) return null;

  return (
    <>
      <Nav />
      <div className="container">
        <h1>About Us</h1>
        <div className="item">
          <span className="label">Product:</span> {data.product_name}
        </div>
        <div className="item">
          <span className="label">Version:</span> {data.version_number}
        </div>
        <div className="item">
          <span className="label">Team:</span> {data.team_number}
        </div>
        <div className="item">
          <span className="label">Release Date:</span> {data.release_date}
        </div>
        <div className="item">
          <span className="label">Product Description:</span><br />
          {data.product_desc}
        </div>
        <div className="item">
          <span className="label">Sponsor User Features:</span><br />
          <p>{data.sponsor_desc}</p>
        </div>
      </div>
    </>
  );
}
