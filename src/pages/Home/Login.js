import React, { useState } from 'react';
import axios from 'axios';
import { Toaster } from '@blueprintjs/core';
import { Navigate } from 'react-router-dom';

const AppToaster = Toaster.create({
  position: "top"
});
const Login = ({ setToken }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [pageRedirect, setPageRedirect] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('Login1', username, password);
    try {
      const response = await axios.post('https://localhost:7067/api/auth/login', { "username": username, "password": password });
      setToken(response.data.token);
      console.log('Login', response, response.data.token);
      localStorage.setItem('token', response.data.token);
      AppToaster.show({
        message: "Login sucessfully",
        intent: "success",
        timeout: 3000
      });
    } catch (error) {
      console.error('Error logging in', error);
    }
    setPageRedirect(true);
  };

  return (
    <div className="modal-body">
    <form onSubmit={handleSubmit}>
      <div className="form-group">
        <label for="username" style={{float:'left'}} className="form-label">Username:</label>
        <input type="text" id="username" className="form-control" value={username} onChange={(e) => setUsername(e.target.value)} />
      </div>
      <div className="form-group">
        <label style={{float:'left'}}>Password:</label>
        <input type="password" className="form-control" value={password} onChange={(e) => setPassword(e.target.value)} />
      </div>
      <button type="submit" className="btn btn-primary">Login</button>
      {pageRedirect && <Navigate to="/customer" />}
    </form>
    </div>
  );
};

export default Login;