import React, { useState, useEffect } from 'react';
import { Link } from "react-router-dom";

const Header = () => {
  const [token, setToken] = useState(localStorage.getItem('token') || '');
  const handleLogout = () => {
    setToken('');
    localStorage.removeItem('token');
  };

  return (
    <nav className="navbar row">
      <div className="col-12 col-md-6 mt-2 mt-md-0 navbar-brand">
        <Link to="/"><h1 style={{ color: 'lightgreen' }}>Customer management System</h1></Link>
      </div>
      <div className="col-12 col-md-3 mt-4 mt-md-0 text-center">
        <Link to='/'>
          <span id="cart" className="ml-3">{token && <button className='btn btn-btn-primary' onClick={handleLogout}>Logout</button>}</span>
          <span className="ml-1" id="cart_count">Welcome</span>
        </Link>
      </div>
      
    </nav>
  )
};
export default Header