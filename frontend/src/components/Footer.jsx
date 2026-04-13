import React from 'react';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-content">
        <p>GlobalNews AI &copy; {new Date().getFullYear()} - Mini Project 6th Sem</p>
        <p className="footer-subtext">Powered by AI Fake News Detection</p>
      </div>
    </footer>
  );
};

export default Footer;
