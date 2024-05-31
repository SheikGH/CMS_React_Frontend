import './App.css';
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import axios from 'axios';
import { ToastContainer } from 'react-toastify';
import Login from './pages/Home/Login';
import Home from './pages/Home/Home';
import Customer from './pages/Customer/Customer';
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';

const Protected = () => <h3>Protected</h3>;

const App = () => {
  const [token, setToken] = useState(localStorage.getItem('token') || '');

  const handleLogout = () => {
    setToken('');
    localStorage.removeItem('token');
  };

  useEffect(() => {
    const checkToken = async () => {
      if (token) {
        try {
          await axios.get('https://localhost:7067/api/customers', {
            headers: { Authorization: token }
          });
        } catch (error) {
          handleLogout();
        }
      }
    };
    checkToken();
  }, [token]);

  return (

    <div className="App">
      <Router>
        <ToastContainer theme='dark' position='top-center' />
        <Header />
        <Routes>
          {/* <Route path="/" element={<Login setToken={setToken} />} />  */}
          <Route path="/" element={<Login setToken={setToken} />} />
          <Route path="/customer" element={<PrivateRoute token={token}><Customer /></PrivateRoute>} />
          {/* <Route path="/protected" element={<PrivateRoute token={token}><Protected /></PrivateRoute>} /> */}
        </Routes>
        {token && <button className='btn btn-primary' onClick={handleLogout}>Logout</button>}
        
        <Footer />
      </Router>
    </div>
  );
};

const PrivateRoute = ({ token, children }) => {
  return token ? children : <Navigate to="/" />;
};
export default App;