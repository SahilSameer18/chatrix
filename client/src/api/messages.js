import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3000';

const api = axios.create({
  baseURL: API_BASE,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Fetch chat history
export const fetchChatHistory = async () => {
  const response = await api.get('/api/messages');
  return response.data;
};

// Login user
export const loginUser = async (username) => {
  const response = await api.post('/api/auth/login', { username });
  return response.data;
};

// Logout user
export const logoutUser = async (username) => {
  const response = await api.post('/api/auth/logout', { username });
  return response.data;
};

export default api;
