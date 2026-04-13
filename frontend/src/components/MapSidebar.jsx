import React, { useContext } from 'react';
import { NewsContext } from '../context/NewsContext';
import { refreshNews } from '../services/newsService';

const MapSidebar = ({ refreshing, setRefreshing }) => {
  const { filters, setFilters, error } = useContext(NewsContext);

  const handleRefresh = async (category) => {
    setRefreshing(true);
    try {
      await refreshNews(category);
      // Wait a moment for DB to update, then just trigger a re-fetch in context by updating filters or a refetch toggle
      // For simplicity, we just toggle a dummy state or the user will rely on the polling if available.
      setFilters({ ...filters, category: category }); // triggers refetch in hook
    } catch (err) {
      console.error("Failed to refresh news", err);
      alert("Failed to refresh news from source.");
    } finally {
      setRefreshing(false);
    }
  };

  const layers = [
    { id: 'stock', label: '📈 Markets & Stocks', category: 'finance' },
    { id: 'conflicts', label: '⚔️ Global Conflicts', category: 'war' },
    { id: 'weather', label: '🌤️ Weather Anomalies', category: 'climate' },
    { id: 'general', label: '🌐 General News', category: 'general' }
  ];

  return (
    <div className="map-sidebar glass-panel">
      <div className="sidebar-header">
        <h2>World Monitor</h2>
        <p>Live Global Intelligence</p>
      </div>

      <div className="sidebar-section">
        <h3>Active Layers</h3>
        <div className="layer-controls">
          {layers.map(layer => (
            <button 
              key={layer.id}
              className={`layer-btn ${filters.category === layer.category ? 'active' : ''}`}
              onClick={() => handleRefresh(layer.category)}
              disabled={refreshing}
            >
              {layer.label}
              {filters.category === layer.category && <span className="active-dot"></span>}
            </button>
          ))}
        </div>
      </div>

      <div className="sidebar-section">
        <h3>Authenticity Filter</h3>
        <select 
          className="layer-select"
          value={filters.prediction} 
          onChange={(e) => setFilters({ ...filters, prediction: e.target.value })}
        >
          <option value="all">Any Accuracy</option>
          <option value="Real">Verified Real ✅</option>
          <option value="Fake">Detected Fake ❌</option>
          <option value="Uncertain">Uncertain ⚠️</option>
        </select>
      </div>

      {error && <div className="sidebar-error">⚠️ {error}</div>}
      
      {refreshing && (
        <div className="sidebar-loading">
          <div className="spinner-small"></div>
           Scanning for live data...
        </div>
      )}
    </div>
  );
};

export default MapSidebar;
