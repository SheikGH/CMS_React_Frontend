import axios from 'axios';
import { Navigate } from 'react-router-dom';

const axiosInstance = axios.create({
  baseURL: process.env.REACT_APP_API_URL, // your API base URL
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request Interceptor
axiosInstance.interceptors.request.use(
  (config) => {
    // Modify request config before sending request
    const token = localStorage.getItem('token');
    if (token) {
      //config.headers.Authorization = `Bearer ${token}`;
      config.headers.Authorization = `${token}`;
    }
    return config;
  },
  (error) => {
    // Handle request error
    return Promise.reject(error);
  }
);

// Response Interceptor
axiosInstance.interceptors.response.use(
  (response) => {
    // Modify response data
    return response;
  },
  (error) => {
    // Handle response error
    if (error.response.status === 401) {
      // handle unauthorized access (e.g., redirect to login)
      <Navigate to="/" />
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
