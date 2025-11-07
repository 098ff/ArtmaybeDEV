import axios from 'axios';

const API_URL = 'http://localhost:5003/api/auth/';

// Login user
const login = async (userData) => {
  const response = await axios.post(API_URL + 'login', userData);

  if (response.data) {
    const stored = {
      token: response.data.token,
      name: response.data.name || response.data.user?.name,
      raw: response.data
    };
    localStorage.setItem('user', JSON.stringify(stored));
  }

  return response.data;
};

// Logout user
const logout = () => {
  localStorage.removeItem('user');
};

const authService = {
  login,
  logout
};

export default authService;