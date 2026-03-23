import axios from 'axios';

export const client = axios.create({
  baseURL: '/',  // proxied via vite to http://localhost:8000
  headers: { 'Content-Type': 'application/json' },
});

client.interceptors.request.use((config) => {
  const token = localStorage.getItem('tf_token');
  if (token) config.headers['Authorization'] = `Bearer ${token}`;
  return config;
});

client.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem('tf_token');
      localStorage.removeItem('tf_user');
      window.location.reload();
    }
    return Promise.reject(err);
  }
);
