import React from 'react';
import { useParams, Link } from 'react-router-dom';

const NewsDetails = () => {
  const { id } = useParams();

  return (
    <div className="news-details-container">
      <h2>Article View</h2>
      <p>Viewing article UUID: {id}</p>
      <Link to="/" className="btn-secondary">← Back to Dashboard</Link>
    </div>
  );
};

export default NewsDetails;
