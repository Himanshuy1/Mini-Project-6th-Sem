import React, { createContext, useState } from 'react';

export const NewsContext = createContext();

export const NewsProvider = ({ children }) => {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    category: 'all',
    prediction: 'all',
    search: ''
  });

  return (
    <NewsContext.Provider value={{
      news, setNews,
      loading, setLoading,
      error, setError,
      filters, setFilters
    }}>
      {children}
    </NewsContext.Provider>
  );
};
