import React, { useState } from 'react';
import api from '../../api';

const Login = ({ setToken }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState("");
  const handleSubmit = async (e) => {
    e.preventDefault();

    setMessage('Loading...')
    if (email === 'sheik@gmail.com' && password === 'test@123') {
      setTimeout(() => {
        try {
          const response = axios.post('http://localhost:5000/login', { username, password });
          setToken(response.data.token);
          localStorage.setItem('token', response.data.token);
        } catch (error) {
          console.error('Error logging in', error);
        }
        setMessage('Login Successfully !!')
      }, 3000);
    } else {
      setTimeout(() => {
        setMessage('Invalid Credential !!')
      }, 3000);
    }
  };
  return (
    <div class="container">
      <div class="row justify-content-center mt-5">
        <div class="col-lg-4 col-md-6 col-sm-6">
          <div class="card shadow">
            <div class="card-title text-center border-bottom">
              <h2 class="p-3">Login</h2>
            </div>
            <div class="card-body"></div>
            <form onSubmit={handleSubmit}>
              <h2>Login</h2>
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <button type="submit">Login</button>
              <p> {message} </p>
            </form>
          </div>
        </div>
      </div>
    </div>
  
  );
};

export default Login;
