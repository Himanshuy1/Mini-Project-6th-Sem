import React from 'react';
import FakeBadge from './FakeBadge';
import { format } from 'date-fns';

const NewsCard = ({ article }) => {
  const { title, description, source, imageUrl, url, publishedAt, prediction, confidenceScore, reason } = article;

  const formattedDate = publishedAt ? format(new Date(publishedAt), 'MMM dd, yyyy HH:mm') : '';

  return (
    <div className="news-card">
      <div className="news-card-image-wrapper">
        <img 
          src={imageUrl || 'https://images.unsplash.com/photo-1585829365295-ab7cd400c167?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80'} 
          alt={title} 
          className="news-card-image"
          onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1585829365295-ab7cd400c167?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80'; }}
        />
        <div className="news-card-badge-container">
          <FakeBadge prediction={prediction} confidenceScore={confidenceScore} reason={reason} />
        </div>
      </div>
      
      <div className="news-card-content">
        <h3 className="news-card-title">{title}</h3>
        <p className="news-card-desc">{description?.substring(0, 120)}...</p>
        
        <div className="news-card-footer">
          <div className="news-card-meta">
            <span className="source-label">{source}</span>
            <span className="date-label">{formattedDate}</span>
          </div>
          <a href={url} target="_blank" rel="noopener noreferrer" className="read-more-btn">
            Read More
          </a>
        </div>
      </div>
    </div>
  );
};

export default NewsCard;
