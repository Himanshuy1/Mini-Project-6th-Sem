import React from 'react';

const Analytics = () => {
  return (
    <div className="analytics-container">
      <h1>Dashboard Analytics</h1>
      <p>This is a placeholder for the Analytics section.</p>
      <div className="stats-panel">
        <div className="stat-card">
          <h3>Total Analyzed</h3>
          <p className="stat-value">543</p>
        </div>
        <div className="stat-card">
          <h3>Fake Discovered</h3>
          <p className="stat-value text-red">89</p>
        </div>
        <div className="stat-card">
          <h3>Genuine Sources</h3>
          <p className="stat-value text-green">410</p>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
