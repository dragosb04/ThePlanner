import React from 'react';
import './BottomNav.css';
import { FaHome, FaSearch, FaPlusCircle, FaList, FaCog } from 'react-icons/fa';
import { Link, useLocation } from 'react-router-dom';

function BottomNav() {
  const location = useLocation();
  const currentPath = location.pathname;

  return (
    <div className="bottom-nav">
      <div className={`nav-icon ${currentPath === '/' ? 'active' : ''}`}>
        <Link to="/"><FaHome /></Link>
      </div>
      <div className={`nav-icon ${currentPath === '/search' ? 'active' : ''}`}>
        <Link to="/search"><FaSearch /></Link>
      </div>
      <div className="nav-icon central">
        <FaPlusCircle />
      </div>
      <div className={`nav-icon ${currentPath === '/list' ? 'active' : ''}`}>
        <Link to="/list"><FaList /></Link>
      </div>
      <div className={`nav-icon ${currentPath === '/settings' ? 'active' : ''}`}>
        <Link to="/settings"><FaCog /></Link>
      </div>
    </div>
  );
}

export default BottomNav;
