import React, { useContext } from 'react';
import { NewsContext } from '../context/NewsContext';

const FilterBar = () => {
  const { filters, setFilters } = useContext(NewsContext);

  const handleCategoryChange = (e) => {
    setFilters({ ...filters, category: e.target.value });
  };

  const handlePredictionChange = (e) => {
    setFilters({ ...filters, prediction: e.target.value });
  };

  const handleSearchChange = (e) => {
    setFilters({ ...filters, search: e.target.value });
  };

  return (
    <div className="filter-bar">
      <div className="filter-group">
        <select value={filters.category} onChange={handleCategoryChange} className="filter-select">
          <option value="all">All Categories</option>
          <option value="general">General</option>
          <option value="war">War</option>
          <option value="politics">Politics</option>
          <option value="technology">Technology</option>
          <option value="health">Health</option>
        </select>
        
        <select value={filters.prediction} onChange={handlePredictionChange} className="filter-select">
          <option value="all">Any Authenticity</option>
          <option value="Real">Real Only ✅</option>
          <option value="Fake">Fake Only ❌</option>
          <option value="Uncertain">Uncertain Only ⚠️</option>
        </select>
      </div>

      <div className="search-group">
        <input 
          type="text" 
          placeholder="Search news..." 
          value={filters.search} 
          onChange={handleSearchChange} 
          className="search-input"
        />
      </div>
    </div>
  );
};

export default FilterBar;
