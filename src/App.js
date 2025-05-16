import './App.css';
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import axios from 'axios';
import { ToastContainer } from 'react-toastify';
import Login from './pages/Home/Login';
import Register from './pages/Home/Register';
import Customer from './pages/Customer/Customer';
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';

const App = () => {
  const [token, setToken] = useState(localStorage.getItem('token') || '');
  const [username, setUserName] = useState(localStorage.getItem('username') || '');

  const handleLogout = () => {
    setToken('');
    setUserName('');
    localStorage.removeItem('token');
    localStorage.removeItem('username');
  };

  useEffect(() => {
    const checkToken = async () => {
      if (token) {
        try {
          await axios.get(process.env.REACT_APP_API_URL + '/customers', {
            headers: { Authorization: token }
          });
        } catch (error) {
          // handleLogout();
        }
      }
    };
    checkToken();
  }, [token]);

  return (

    <div className="App">
      <Router>
        <ToastContainer theme='dark' position='top-center' />
        <Header token={token} setToken={setToken} username={username} setUserName={setUserName} />
        <div id="page-wrapper">
          <div class="container-fluid">
            <div class="panel panel-default">
              <div class="panel-body">
                <Routes>
                  <Route path="/" element={<Login setToken={setToken} setUserName = {setUserName}/>} />
                  <Route path="/register" element={<Register />} />
                  <Route path="/customer" element={<PrivateRoute token={token}><Customer /></PrivateRoute>} />
                </Routes>
              </div>
            </div>
          </div>
        </div>
        <Footer />
      </Router >
    </div>
  );
};

const PrivateRoute = ({ token, children }) => {
  return token ? children : <Navigate to="/" />;
};
export default App;