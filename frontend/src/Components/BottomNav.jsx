import React from 'react';
import './BottomNav.css';
import { FaHome, FaSearch, FaPlusCircle, FaList, FaCog } from 'react-icons/fa';

function BottomNav() {
  return (
    <div className="bottom-nav">
      <div className="nav-icon active"><FaHome /></div>
      <div className="nav-icon"><FaSearch /></div>
      <div className="nav-icon central"><FaPlusCircle /></div>
      <div className="nav-icon"><FaList /></div>
      <div className="nav-icon"><FaCog /></div>
    </div>
  );
}

export default BottomNav;