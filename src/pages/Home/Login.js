import React, { useState } from 'react';
import axios from 'axios';
import './Home.css'
import { Toaster } from '@blueprintjs/core';
import { Link, useNavigate } from 'react-router-dom';

import { useForm } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';


// Define the validation schema using Yup
const schema = yup.object().shape({
  email: yup
    .string()
    .email('Invalid email format')
    .required('Email is required'),
  password: yup
    .string()
    .min(4, 'Password must be at least 8 characters long')
    .required('Password is required'),
});

const AppToaster = Toaster.create({
  position: "top"
});

const Login = ({ setToken }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  // Use the useForm hook
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: yupResolver(schema),
  });


  const onSubmit = async (e) => {
    //e.preventDefault();
    const apiUrl = process.env.REACT_APP_API_URL;

    try {
      //console.log('onSubmit:',apiUrl,process.env);
      const response = await axios.post(apiUrl + '/auth/login', { "username": username, "password": password });
      setToken(response.data.token);
      //console.log('Login', response, response.data.token, username);
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('username', username);

      AppToaster.show({
        message: "Login sucessfully",
        intent: "success",
        timeout: 3000
      });
    } catch (error) {
      console.error('Error logging in', error);
    }
    navigate("/customer");
  };

  return (
    <div className="container">
      <div class="row">
        <div className="modal-body">
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="form-group">
              <h1>Login Page</h1>
            </div>
            <div className="form-group">
              <label className="form-label">Email:</label>
              <input type="email" placeholder='Email' {...register('email')} className="form-control" value={username} 
              onChange={(e) => setUsername(e.target.value)} />
              {errors.email && <p>{errors.email.message}</p>}
            </div>
            <div className="form-group">
              <label className="form-label">Password:</label>
              <input type="password" placeholder='Password' {...register('password')} className="form-control" value={password} 
              onChange={(e) => setPassword(e.target.value)} />
              {errors.password && <p>{errors.password.message}</p>}
            </div>
            <Link to="/register" className="btn btn-danger">Register</Link>&nbsp;
            <button type="submit" className="btn btn-primary">Login</button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;