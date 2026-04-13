import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo">
          <span className="logo-icon">🌍</span>
          GlobalNews AI
        </Link>
        <ul className="nav-menu">
          <li className="nav-item">
            <Link to="/" className="nav-links">Dashboard</Link>
          </li>
          <li className="nav-item">
            <Link to="/analytics" className="nav-links">Analytics</Link>
          </li>
          <li className="nav-item">
            <Link to="/verify" className="nav-links">Verify News</Link>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
