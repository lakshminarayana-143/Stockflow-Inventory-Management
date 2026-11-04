import axios from 'axios';

const api = axios.create({
  baseURL: 'https://stockflow-inventory-management-1zx4.onrender.com/api/v1',
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

// Request interceptor: attach token from localStorage if available
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('stockflow_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor: handle 401 Unauthorized globally
api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    const customError = {
      message:
        error.response?.data?.message ||
        error.message ||
        'An unexpected error occurred.',
      errors: error.response?.data?.errors || [],
      statusCode: error.response?.status || 500,
    };
    return Promise.reject(customError);
  }
);

export default api;

