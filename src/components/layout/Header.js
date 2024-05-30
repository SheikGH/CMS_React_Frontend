import React from 'react';
import { Link } from "react-router-dom";

const Header = (props) => {
  const { token, setToken , username, setUserName} = props;
  
  const handleLogout = () => {
    setToken('');
    setUserName('');
    localStorage.removeItem('token');
    localStorage.removeItem('username');
  };

  return (
    <nav className="navbar row">
      <div className="col-12 col-md-6 mt-2 mt-md-0 navbar-brand">
        <Link to="/"><h1 style={{ color: 'lightgreen' }}>Customer Management System</h1></Link>
      </div>
      <div className="col-12 col-md-3 mt-4 mt-md-0 text-center">
        <span className="ml-1" id="cart_count" style={{ padding: '10px' }}>Welcome: {username}</span>&nbsp;<span id="cart" className="ml-3">{token && <button className='btn btn-primary' onClick={handleLogout}>Logout</button>}</span>
      </div>
    </nav>
  )
};
export default Header