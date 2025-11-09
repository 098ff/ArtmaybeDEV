import axios from 'axios';

const API_URL = 'http://localhost:5003/api/auth/';

// Login user
const login = async (userData) => {
  const response = await axios.post(API_URL + 'login', userData);

  if (response.data) {
    const user = {
      token: response.data.token,
      role: response.data.role || response.data.user?.role,
      raw: response.data
    };
    localStorage.setItem('user', JSON.stringify(user));
    return user; 
  }

  return null;
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
