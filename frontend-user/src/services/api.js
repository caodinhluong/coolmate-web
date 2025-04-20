import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3001', // Địa chỉ API của bạn
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

export default api;