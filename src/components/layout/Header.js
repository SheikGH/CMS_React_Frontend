import React from 'react';
import { Link } from "react-router-dom";

const Header = (props) => {
  const { token, setToken, username, setUserName } = props;

  const handleLogout = () => {
    setToken('');
    setUserName('');
    localStorage.removeItem('token');
    localStorage.removeItem('username');
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light1">
      <div className="container">
        <div className="row w-100 align-items-center">

          {/* Brand Name */}
          <div className="col-12 col-md-6 text-center text-md-start mb-2 mb-md-0">
            <Link to="/" className="navbar-brand">
              <h1 style={{ color: 'lightgreen', margin: 0 }}>Customer Management System</h1>
            </Link>
          </div>

          {/* User Info and Logout */}
          <div className="col-12 col-md-6 text-center text-md-end">
            {token && (
              <>
                <span style={{ color: 'lightgreen', padding: '10px' }}>
                  Welcome: {username}
                </span>
                <button className="btn btn-primary ml-2" onClick={handleLogout}>
                  Logout
                </button>
              </>
            )}
          </div>

        </div>
      </div>
    </nav>
  )
};
export default Header