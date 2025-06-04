import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  },
);

const apiDefaultUpload = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  headers: {
    'Content-Type': 'multipart/form-data',
  },
});

apiDefaultUpload.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, Promise.reject);

apiDefaultUpload.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  },
);

const apiTempUpload = axios.create({
  baseURL: import.meta.env.VITE_UPLOAD_API_BASE_URL,
  headers: {
    'Content-Type': 'multipart/form-data',
  },
});

apiTempUpload.interceptors.request.use(
  (config) => config,
  (error) => Promise.reject(error),
);

apiTempUpload.interceptors.response.use(
  (response) => response.data,
  (error) => Promise.reject(error.response?.data || error.message),
);

export { api, apiDefaultUpload, apiTempUpload };
