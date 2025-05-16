import React from 'react';
import axios from 'axios';
import './Home.css';
import { Toaster } from '@blueprintjs/core';
import { Link, useNavigate } from 'react-router-dom';

import { useForm } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';

// Toaster setup
const AppToaster = Toaster.create({ position: "top" });

// Yup validation schema
const schema = yup.object().shape({
  email: yup
    .string()
    .email('Invalid email format')
    .required('Email is required'),
  password: yup
    .string()
    .min(4, 'Password must be at least 4 characters long')
    .required('Password is required'),
});

const Login = ({ setToken, setUserName }) => {
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
    getValues,
  } = useForm({
    resolver: yupResolver(schema),
  });

  const onSubmit = async () => {
    const { email, password } = getValues();
    const apiUrl = process.env.REACT_APP_API_URL;

    try {
      const response = await axios.post(`${apiUrl}/auth/login`, {
        username: email,
        password,
      });

      const token = response.data.token;
      setToken(token);
      localStorage.setItem('token', token);
      localStorage.setItem('username', email);
      setUserName(email);
      AppToaster.show({
        message: "Login successfully",
        intent: "success",
        timeout: 3000,
      });

      navigate("/customer");
    } catch (error) {
      console.error('Error logging in:', error);

      let message = "Login failed. Please check your credentials.";
      if (error.response?.data?.message) {
        message = error.response.data.message;
      }

      window.alert(message);
      AppToaster.show({
        message,
        intent: "danger",
        timeout: 3000,
      });
    }
  };

  return (
    <div className="container">
      <div className="row">
        <div className="modal-body">
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="form-group">
              <h1>Login Page</h1>
            </div>

            <div className="form-group">
              <label className="form-label">Email:</label>
              <input
                type="email"
                placeholder="Email"
                {...register('email')}
                className="form-control"
              />
              {errors.email && <p className="text-danger">{errors.email.message}</p>}
            </div>

            <div className="form-group">
              <label className="form-label">Password:</label>
              <input
                type="password"
                placeholder="Password"
                {...register('password')}
                className="form-control"
              />
              {errors.password && <p className="text-danger">{errors.password.message}</p>}
            </div>
            <div style={{ textAlign: 'center' }}>
              <Link to="/register" className="btn btn-danger">Register</Link>&nbsp;
              <button type="submit" className="btn btn-primary">Login</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
